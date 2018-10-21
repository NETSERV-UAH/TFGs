# Copyright (C) 2011 Nippon Telegraph and Telephone Corporation.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
# implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from ryu.base import app_manager
from ryu.topology import event, switches
from ryu.topology.api import get_link, get_switch
from ryu.topology.switches import Link, Port
from ryu.controller import ofp_event
from ryu.controller.handler import CONFIG_DISPATCHER, MAIN_DISPATCHER, DEAD_DISPATCHER
from ryu.controller.handler import set_ev_cls
from ryu.controller import dpset
from ryu.ofproto import ofproto_v1_3
from ryu.lib.packet import packet
from ryu.lib.packet import ethernet
from ryu.lib.packet import ether_types
from ryu.lib.packet import ipv4
from ryu.lib.packet import in_proto
from ryu.lib.packet import arp
from ryu.lib.packet import icmp
from ryu.lib import mac
from ryu.lib import hub
from threading import Lock
from ryu.utils import binary_str
from random import choice
from struct import *
import time
import json
from ryu.lib import dpid as dpid_lib
from webob import Response
from ryu.app.wsgi import ControllerBase, WSGIApplication, route

simple_switch_instance_name = 'simple_switch_api_app'
url = "/allpathsimpleswitch/tree/{dpid}"

class AllPathSwitch13(app_manager.RyuApp):
    OFP_VERSIONS = [ofproto_v1_3.OFP_VERSION]
    _CONTEXTS = {'wsgi': WSGIApplication}

    def __init__(self, *args, **kwargs):
        super(AllPathSwitch13, self).__init__(*args, **kwargs)
        wsgi = kwargs['wsgi']
        wsgi.register(SimpleSwitchController,
                      {simple_switch_instance_name: self})
        self.topology_api_app = self
        self.mensajes = 0
        self.acept =0
        self.mac_to_port = {}
        self.switches = {}
        self.dp_control = {}
        self.lista_rand = []
        self.lista_path = {}
        self.descubrimiento = 0
        self.delay = 5
        self.threads.append(hub.spawn(self.loop))

    @set_ev_cls(ofp_event.EventOFPStateChange, [MAIN_DISPATCHER, DEAD_DISPATCHER])
    def state_change_handler(self, ev):
        #Si se conecta un switch se registra,
        #si se desconecta se elimina de la lista de registro y de la tabla de caminos
        dp = ev.datapath
        if ev.state == MAIN_DISPATCHER:
            self.switches[dp.id] = dp
            self.dp_control[dp.id] = 0
            self.lista_path[dp.id] = []
            self.lista_rand.append(dp.id)
            self.logger.info("Switch %s aprendido", dp.id)
        elif ev.state == DEAD_DISPATCHER and dp.id != None:
            del self.switches[dp.id]
            del self.dp_control[dp.id]
            del self.lista_path[dp.id]
            try:
                self.lista_rand.remove(dp.id)
            except:
                pass
            self.logger.info("Switch %s eliminado", dp.id)


    @set_ev_cls(ofp_event.EventOFPSwitchFeatures, CONFIG_DISPATCHER)
    def switch_features_handler(self, ev):
        datapath = ev.msg.datapath
        ofproto = datapath.ofproto
        parser = datapath.ofproto_parser

        # install table-miss flow entry
        #
        # We specify NO BUFFER to max_len of the output action due to
        # OVS bug. At this moment, if we specify a lesser number, e.g.,
        # 128, OVS will send Packet-In with invalid buffer_id and
        # truncated packet data. In that case, we cannot output packets
        # correctly.  The bug has been fixed in OVS v2.1.0.
        match = parser.OFPMatch()
        actions = [parser.OFPActionOutput(ofproto.OFPP_CONTROLLER,
                                          ofproto.OFPCML_NO_BUFFER)]
        self.add_flow(datapath, 0, match, actions)


    def loop(self):
        i = 1
        while 1:
            time.sleep( self.delay )
            if len(self.lista_rand) == 0:
                #print "Lista vacia"
                i = 0
    	    for dpid in self.dp_control:
                self.dp_control[dpid] = 0
                if i == 0:
                    self.lista_rand.append(dpid)
            i = 1
            if len(self.lista_rand) != 0:
                dpid = choice(self.lista_rand)
                self.lista_rand.remove(dpid)
                self.dp_control[dpid] = 1
                self.logger.info("Se inicia descubrimiento en switch:%s ", dpid)
                self.descubrimiento = dpid
                self.lista_path[self.descubrimiento] = []
                self.datagram_discover(dpid)
    	    time.sleep( self.delay )


    def datagram_discover(self, dtpid):
        datapath = self.switches[dtpid]
        mac_src = "00:00:00:00:00:00"
        pkt =packet.Packet()
        pkt.add_protocol(ethernet.ethernet(dst="ff:ff:ff:ff:ff:ff", src=mac_src, ethertype=0xaaaa))
        payload_data = pack('l', dtpid)
        pkt.add_protocol(payload_data)
        ofproto = datapath.ofproto
        parser = datapath.ofproto_parser
        pkt.serialize()
        data = pkt.data
        actions = [parser.OFPActionOutput(ofproto.OFPP_FLOOD)]
        out = parser.OFPPacketOut(datapath=datapath, buffer_id=ofproto.OFP_NO_BUFFER, in_port=ofproto.OFPP_CONTROLLER, actions=actions, data=data)
        datapath.send_msg(out)

    def discover_handler(self, dtpid, switch_dst, eth, in_port):
        switch_src = dtpid
        src = eth.src
        self.mensajes = self.mensajes +1
        if self.dp_control[switch_src] == 0:
            self.acept = self.acept +1
            self.lista_path[self.descubrimiento].append([switch_src, switch_dst, in_port])
            self.dp_control[switch_src] = 1
            self.datagram_discover(switch_src)

    def add_flow(self, datapath, priority, match, actions, buffer_id=None):
        ofproto = datapath.ofproto
        parser = datapath.ofproto_parser

        inst = [parser.OFPInstructionActions(ofproto.OFPIT_APPLY_ACTIONS,
                                             actions)]
        if buffer_id:
            mod = parser.OFPFlowMod(datapath=datapath, buffer_id=buffer_id,
                                    priority=priority, match=match,
                                    instructions=inst)
        else:
            mod = parser.OFPFlowMod(datapath=datapath, priority=priority,
                                    match=match, instructions=inst)

        #self.logger.info("installing: %s", mod)
        datapath.send_msg(mod)



    @set_ev_cls(ofp_event.EventOFPPacketIn, MAIN_DISPATCHER)
    def _packet_in_handler(self, ev):
        # If you hit this you might want to increase
        # the "miss_send_length" of your switch
        if ev.msg.msg_len < ev.msg.total_len:
            self.logger.debug("packet truncated: only %s of %s bytes",
                              ev.msg.msg_len, ev.msg.total_len)
        msg = ev.msg
        datapath = msg.datapath
        ofproto = datapath.ofproto
        parser = datapath.ofproto_parser
        in_port = msg.match['in_port']

        pkt = packet.Packet(msg.data)
        eth = pkt.get_protocols(ethernet.ethernet)[0]

        if eth.ethertype == ether_types.ETH_TYPE_LLDP:
            # ignore lldp packet
            return
        dst = eth.dst
        src = eth.src

        dpid = datapath.id
        if eth.ethertype == 0xaaaa:
            #self.logger.info("packetin del sw:%s", dpid)
            list = binary_str(pkt.protocols[-1]).split('\\x')
            switch_dst = int(list[2]+list[1], 16)
            self.discover_handler(dpid, switch_dst, eth, in_port)
            return

        self.mac_to_port.setdefault(dpid, {})

        #self.logger.info("packet in %s %s %s %s", dpid, src, dst, in_port)

        # no BOOTP
        #if eth.ethertype == ether_types.ETH_TYPE_IP and dst == mac.BROADCAST_STR:
            #ip = pkt.get_protocols(ipv4.ipv4)[0]
            #if ip.proto == in_proto.IPPROTO_UDP:
                #self.logger.info("---discarded! (src = %s, dst = %s)", src, dst)
                #return

	# all-path lock
        if src in self.mac_to_port[dpid] and in_port != self.mac_to_port[dpid][src]:
            #self.logger.info("---discarded! (src_mac: %s, port: %s, in_port: %s)", src, self.mac_to_port[dpid][src], in_port)
            return

                 # learn a mac address to avoid FLOOD next time.
        self.mac_to_port[dpid][src] = in_port
	       #self.logger.info("---learnt!")

        if dst in self.mac_to_port[dpid]:
            out_port = self.mac_to_port[dpid][dst]
        else:
            out_port = ofproto.OFPP_FLOOD
	#self.logger.info("out_port: %s", out_port)
        actions = [parser.OFPActionOutput(out_port)]

        # install a flow to avoid packet_in next time
        if out_port != ofproto.OFPP_FLOOD:
            match = parser.OFPMatch(in_port=in_port, eth_dst=dst)
            # verify if we have a valid buffer_id, if yes avoid to send both
            # flow_mod & packet_out
            if msg.buffer_id != ofproto.OFP_NO_BUFFER:
                self.add_flow(datapath, 1, match, actions, msg.buffer_id)
                return
            else:
                self.add_flow(datapath, 1, match, actions)
        data = None
        if msg.buffer_id == ofproto.OFP_NO_BUFFER:
            data = msg.data

        out = parser.OFPPacketOut(datapath=datapath, buffer_id=msg.buffer_id,
                                  in_port=in_port, actions=actions, data=data)
        datapath.send_msg(out)

class SimpleSwitchController(ControllerBase):

    def __init__(self, req, link, data, **config):
        super(SimpleSwitchController, self).__init__(req, link, data, **config)
        self.simple_switch_app = data[simple_switch_instance_name]

    @route('allpathsimpleswitch', url, methods=['GET'],
           requirements={'dpid': dpid_lib.DPID_PATTERN})
    def tree(self, req, **kwargs):
        simple_switch = self.simple_switch_app
        dpid = dpid_lib.str_to_dpid(kwargs['dpid'])
        if dpid not in simple_switch.lista_path:
            return Response(status=404)
        tree = simple_switch.lista_path[dpid]
        body = json.dumps(tree)
        return Response(content_type='application/json', body=body)
