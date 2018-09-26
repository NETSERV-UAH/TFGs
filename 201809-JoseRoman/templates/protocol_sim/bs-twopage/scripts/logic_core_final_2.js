var packet_delay;
var routers_between;
var networkMTU;

//Array Global variables

//HTTP
var http_array = [];
var httpIpServer;
var httpIpClient;
var httpnumObjects;
var httpObject;
var httpmessage;
var httptypeOfRequest;
var httpObjectSize;
var http_indicator = false;

//TCP
var tcp_array = [];
var tcp_snapshot = [];
var tcpsizeOfRequest ;
var tcpsizeOfObject ;
var tcpIpServer ;
var tcpIpClient ;
var tcpPortServer ;
var tcpPortClient ;
var tcpServerInitialSequenceNumber ;
var tcpClientInitialSequenceNumber ;
var tcpServerTimeout ;
var tcpClientTimeout ;
var tcpHeaderStaticSize;
var tcpSlowStart;
var tcpSimplified ;
var tcpPersistent ;
var tcpSizeOfWindow ;
var tcpServerWindow ;
var tcpClientWindow;
var tcpAlfa ;
var tcpBeta ;

//UDP
var udp_array = [];
var udpsizeOfRequest;
var udpsizeOfObject;
var udpipserver;
var udpipclient
var udpportClient;
var udpportServer;

//IP

var ip_array = [];
var ipTTL;


function checkTimeServer(tcp_packet_timestamp,time){
    if(time < tcp_packet_timestamp){
        return false;
    }else{
        return true;
    }
};

function checkTimeClient(tcp_packet_timestamp,time){
    if(time < tcp_packet_timestamp){
        return false;
    }else{
        return true;
    }
};


function checkIP(ipAddress){
    var addressSplited = ipAddress.split("\.");
    if(addressSplited.length != 4){
        return false;
    }else{
        var i = 0;
        for(i = 0; i < addressSplited.length; i++){
            var ipByte = parseInt(addressSplited[i]);
            if(ipByte < 0 || ipByte > 255){
                return false;
            }
        }
    }
    return true;
};

function checkPort(port){
    var portCheck = parseInt(port);
    if(portCheck < 0 || portCheck > 65535){
        return false;
    }else{
        return true;
    }
};

function getColor(){
    return  "rgb("+Math.random()*255+","+Math.random()*255+","+
    Math.random()*255+")";
};

function simulateUdpChecksum(){
    var checksum = "0x";
    var hexadecimal = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
    var counter = 0;
    for(counter = 0; counter < 4 ; counter ++){
        checksum = checksum+hexadecimal[Math.floor(Math.random() * hexadecimal.length)];
    };
    return checksum;
};

function gValue(object){
    return document.getElementById(object).value;
};

function sValue(object,value){
    document.getElementById(object).value = value;
};

function isTimeout(timeouts_array){
    for(var x = 0 in timeouts_array){
        if(timeouts_array[x] == 0){
            return true;
        }
    }
    return false;
}

function decreaseAllTimeouts(timeouts_array){
    for(var i = 0 in timeouts_array){
        if(timeouts_array[i] > 0){
            timeouts_array[i]--;
        }
    }
}

function extratInTimeLapseServer(expectedSeqs,ackToSend, received, actualTime){
    var newExpected = [];
    var newAckToSend = [];
    for(var i = 0 in expectedSeqs){
        if(expectedSeqs[i] < received.seq){
            newExpected.push(expectedSeqs[i])
            newAckToSend.push(ackToSend[i])
        }else if(expectedSeqs[i] == received.seq && checkTimeServer(received.s_timestamp, actualTime)){
            newExpected.push(expectedSeqs[i])
            newAckToSend.push(ackToSend[i])
        }
    }
    var result = [];
    result.push(newExpected);
    result.push(newAckToSend);
    return result;
}

function returnExpectedServer(temporalSeqs,expectedSeqs,ackToSend){
    var newExpected = temporalSeqs[0];
    var newAckToSend = temporalSeqs[1];
    for(seq in expectedSeqs){
        if(!newExpected.includes(seq)){
            newExpected.push(seq);
        }
    }
    for(ack in ackToSend){
        if(!newAckToSend.includes(ack)){
            newAckToSend.push(ack);
        }
    }
    expectedSeqs = newExpected;
    ackToSend = newAckToSend;
}


function updateExpectedSeqs(expectedSeqs,ackToSend, dOffset, name){
    var i = 0;
    console.log(name+" : Expected Sequences and correspondent acks");
    console.log(expectedSeqs);
    console.log(ackToSend);
    expectedSeqs.sort(function(a,b) {return (a > b) ? 1 : ((b > a) ? -1 : 0);});
    ackToSend.sort(function(a,b) {return (a > b) ? 1 : ((b > a) ? -1 : 0);});
    while(expectedSeqs.length >= 1 && ((expectedSeqs[i+1] - expectedSeqs[i]) <= dOffset)){
        console.log(name+" : Detected two correlated packets :"+expectedSeqs[i]+" - "+expectedSeqs[i+1]);
        console.log(name+" : Correlated ACKs :"+ackToSend[i]+" - "+ackToSend[i+1]);
        expectedSeqs.splice(0,1);
        ackToSend.splice(0,1);
    }
    console.log(expectedSeqs);
    console.log(ackToSend);
}

function deletedAckPacket(waiting,timeouts,ack_number){
    console.log(waiting);
    console.log("Deleting minor to "+ack_number);
    var i = 0;
    while( i < waiting.length ){
        if(waiting[i].seq < ack_number){
            console.log("Deleting packet :");
            console.log(waiting[i]);
            waiting.splice(i,1);
            timeouts.splice(i,1);
        }else{
            i++;
        }
    }
    console.log(waiting);
}

function deleteExpectedAck(expectedAck, ack){
    var pos =  expectedAck.indexOf(ack);
    if(pos > -1){
        expectedAck.splice(pos,1);
    }
}

function deleteMinorAcks(received, expected){
    received.sort(function(a,b) {return (a.seq > b.seq) ? 1 : ((b.seq > a.seq) ? -1 : 0);});
    var counter = 0;
    while( counter < received.length && received[counter].seq < expected ){
        received.splice(0,1);
        counter++;
    }
}

function getCorrelatedPacket(waiting, packet){
    for(var x = 0 in waiting){
        if(packet.ack == waiting[x].seq){
            return x;
        }
    }
    return -1;
}

function removeACKtoSend(ackToSend,ack){
    for(var i = 0 in ackToSend){
        if(ackToSend[i] == ack){
            ackToSend.splice(i,1);
        }
    }
}



function TcpPacket(c_timestamp, s_timestamp,sourcePort,destinationPort
    ,seq,ack,dOffset, flags, window,color,lost){
        this.c_timestamp = c_timestamp;
        this.s_timestamp = s_timestamp;
        this.sourcePort = sourcePort;
        this.destinationPort = destinationPort;
        this.seq = seq;
        this.ack = ack;
        this.dOffset = dOffset;
        this.flags = flags;
        this.window = window;
        this.color = color;
        this.lost = lost;
    };
    
    function markTimestampClient(packet,actualT,futureT,window,ack){
        var pClone = packet;
        pClone.c_timestamp = actualT;
        pClone.s_timestamp = futureT;
        pClone.ack = ack;
        pClone.window = window;
        return pClone;
    };
    
    function markTimestampServer(packet,actualT,futureT,window,ack){
        var pClone = packet;
        pClone.s_timestamp = actualT;
        pClone.c_timestamp = futureT;
        pClone.ack = ack;
        pClone.window = window;
        return pClone;
    };


 


function parseHttp(nObjects){
    clear_Canvas();
    draw_server_client();
    var http_request_array = [];
    var i = 0;
    var canvas = document.getElementById("paperjs-canvas");
    var lineColor = "rgb("+Math.random()*255+","+Math.random()*255+","+
            Math.random()*255+")";
    var d = new Date();
    var n = new Date();
    //var width = canvas.width;
    var height = canvas_height;
        http_request_array.push(
            {
                c_timestamp : parseInt((height/(nObjects*2))*(1*i)),
                s_timestamp : parseInt((height/(nObjects*2))*(1+1*i)),
                requestT : httptypeOfRequest,
                urlObject : httpObject+"/"+i+".html",
                date : d,
                host : "Server("+httpIpClient+")",
                from : "Client("+httpIpServer+")",
                body : httpmessage,
                user_agent : navigator.userAgent,
                color : lineColor
            }
        );
        if(httptypeOfRequest == 'POST'){
            nObjects = 1;
        }
        for (i = 0; i < nObjects; i++){
            var lineColor = "rgb("+Math.random()*255+","+Math.random()*255+","+
            Math.random()*255+")";
            var d = new Date();
            var n = new Date();
            if(httptypeOfRequest == 'GET'){
                http_request_array.push(
                    {
                        c_timestamp : parseInt((height/(nObjects*2))*(1*i) + 2*(height/(nObjects*2))),
                        s_timestamp : parseInt((height/(nObjects*2))*(1+1*i)),
                        requestT : "200 OK",
                        urlObject : httpObject+"/"+i+".html",
                        date : n,
                        host : "Client("+httpIpServer+")",
                        from : "Server("+httpIpClient+")",
                        body : "<html><head><title>Hola</title>\n</head><body><p>"+i+".html</p></body>\n</html>",
                        user_agent :"Server Apache",
                        color : lineColor
                    }
                );
            }else{
                http_request_array.push(
                    {
                        c_timestamp : parseInt((height/(nObjects*2))*(1*i) + 2*(height/(nObjects*2))),
                        s_timestamp : parseInt((height/(nObjects*2))*(1+1*i)),
                        requestT : "204 No Content",
                        urlObject : "",
                        date : n,
                        host : "Client("+httpIpServer+")",
                        from : "Server("+httpIpClient+")",
                        body : "",
                        user_agent : "Server Apache",
                        color : lineColor
                    }
                )
            };
    };
    http_array = http_request_array.slice();
    http_indicator = true;
};

//Non persistent Mode will open and close connections for each object

function traduceTCPtoHTTP(){
    clear_Canvas();
    if(tcp_array.length == 0){
        alert("Error : No se puede traducir de TCP a HTTP porque no se ha \n realizado la simulación TCP.")
    }else{
            packet_delay =gValue("packet_delay");
            routers_between =gValue("routers_between");
            networkMTU =gValue("networkMTU");
            sValue("tcpipserver",httpIpServer);
            sValue("tcpipclient",httpIpClient);
            sValue("tcpportServer", 80);
            tcpPortServer =gValue("tcpportServer");
            sValue("tcpportClient", Math.floor(Math.random()*65535) +1025);
            tcpPortClient =gValue("tcpportClient");
            sValue("tcpServerInitialSequenceNumber", Math.floor(Math.random()*100 + 1));
            sValue("tcpClientInitialSequenceNumber", Math.floor(Math.random()*100 + 1));
            sValue("tcpPersistent" , true);
            var sRequest = httpmessage+httpObject;
            sValue("tcpsizeOfRequest" ,parseInt(sRequest.length));
            sValue("tcpsizeOfObject" ,parseInt(httpnumObjects*httpObjectSize));
            sValue("tcpClientWindow" ,3);
            sValue("tcpServerWindow" ,3);
            tcpServerWindow =gValue("tcpServerWindow");
            tcpClientWindow =gValue("tcpClientWindow");
            sValue("tcpServerTimeout",parseInt(20));
            sValue("tcpClientTimeout",parseInt(20));
            tcpServerTimeout =gValue("tcpServerTimeout");
            tcpClientTimeout =gValue("tcpClientTimeout");
            sValue("ipDestination",httpIpServer);
            sValue("ipSource",httpIpClient);
            sValue("ipTTL",64);
            sValue("idProtocol","TCP");
            parseHttp(httpnumObjects);
    };
};


function traduceHTTPtoTCP(){
    clear_Canvas();
    if(http_array.length == 0){
        alert("Error : Solo se puede traducir de la capa de aplicación a la\n"+
    "de transporte si se ha hecho una simulación HTTP");
    }else{
        tcpsizeOfRequest =gValue("tcpsizeOfRequest");
        tcpsizeOfObject =gValue("tcpsizeOfObject");
        tcpIpServer =gValue("tcpipserver");
        tcpIpClient =gValue("tcpipclient");
        tcpPortServer =gValue("tcpportServer");
        tcpPortClient =gValue("tcpportClient");
        tcpServerInitialSequenceNumber =gValue("tcpServerInitialSequenceNumber");
        tcpClientInitialSequenceNumber =gValue("tcpClientInitialSequenceNumber");
        tcpServerWindow =gValue("tcpServerWindow");
        tcpClientWindow =gValue("tcpClientWindow");
        //tcpAlfa =gValue("tcpAlfa");
        //tcpBeta =gValue("tcpBeta");
        tcpServerTimeout =gValue("tcpServerTimeout");
        tcpClientTimeout =gValue("tcpClientTimeout");
        tcpSlowStart =gValue("tcpSlowStart");
        tcpSimplified =gValue("tcpSimplified");
        tcpPersistent =gValue("tcpPersistent");
        packet_delay =gValue("packet_delay");
        routers_between =gValue("routers_between");
        networkMTU =gValue("networkMTU");

        if(parseInt(tcpsizeOfObject)<= 0){
            alert("Error : El tamaño del objeto es menor o igual que cero")
        }else if(!checkIP(tcpIpServer)){
            alert("Error : IP del servidor incorrecta");
        }else if(!checkIP(tcpIpClient)){
            alert("Error : IP del cliente incorrecta");
        }else if(!checkPort(tcpPortServer)){
            alert("Error : Puerto del servidor incorrecto");
        }else if(!checkPort(tcpPortClient) && tcpPortClient < 1024){
            alert("Error : Puerto del cliente incorrecto");
        }else if(tcpsizeOfObject <= 0){
            alert("Error : Tamaño del objeto menor o igual que cero");
        }else if(tcpSizeOfWindow < 0){
            alert("Error : Tamaño de la ventana menor que cero");
        }else if(packet_delay == null || routers_between == null || networkMTU == null){
            alert("Error : Se tiene que especificar el retardo entre paquetes"+
            ",el número de routers y \n la MTU de la red.");
        }else{
            parseTcp();
        };
    };
};

function traduceTCP_UDP_IP(){
    clear_Canvas();
    ip_array = [];
    var ipTTL =gValue("ipTTL");
    if(tcp_array.length == 0 && udp_array.length == 0){
        alert("Error : No se ha realizado ninguna simulación de la capa de transporte (UDP o TCP)");
    }else if(tcp_array.length > 0){
        var i = 0;
        for(i = 0; i< tcp_array.length; i++){
            var ipSource;
            var ipDestination;
            if(tcp_array[i].s_timestamp > tcp_array[i].c_timestamp){
                ipDestination = tcpIpServer;
                ipSource = tcpIpClient;
            }else{
                ipDestination = tcpIpClient;
                ipSource = tcpIpServer;
            };
            var ip_packet = ({
                c_timestamp : tcp_array[i].c_timestamp,
                s_timestamp : tcp_array[i].s_timestamp,
                ipSource : ipSource,
                ipDestination : ipDestination,
                TTL : parseInt(ipTTL - routers_between),
                protocol : "TCP",
                headerChecksum : simulateUdpChecksum(),
                headerLength : "5 (20 bytes)",
                totalLength : parseInt(tcp_array[i].dOffset + 20) 
            });
            ip_array.push(ip_packet);
        };
        draw_ip_communication(ip_array);
    }else if(udp_array.length > 0){
        var i = 0;
        for(i = 0; i< udp_array.length; i++){
            var ipSource;
            var ipDestination;
            if(udp_array[i].s_timestamp > udp_array[i].c_timestamp){
                ipDestination = udpipserver;
                ipSource = udpipclient;
            }else{
                ipDestination = udpipclient;
                ipSource = udpipserver;
            };
            var ip_packet = ({
                c_timestamp : udp_array[i].c_timestamp,
                s_timestamp : udp_array[i].s_timestamp,
                ipSource : ipSource,
                ipDestination : ipDestination,
                TTL : parseInt(ipTTL - routers_between),
                protocol : "UDP",
                headerChecksum : simulateUdpChecksum(),
                headerLength : "5 (20 bytes)",
                totalLength : parseInt(udp_array[i].dOffset + 8) 
            });
            ip_array.push(ip_packet);
        };
        draw_ip_communication(ip_array);
    };
};

function objectToTcpArray(sPort,dPort,initSeq,hDTT,dOffset){
    var dataTransmited = 0;
    var actualDataSeq = parseInt(initSeq) + parseInt(1);
    var tcp_packets = [];
    while(dataTransmited < hDTT){
        var dOffsetP = 0;
        if(dOffset <= (hDTT - dataTransmited)){
            dOffsetP = dOffset;
        }else{
            dOffsetP = parseInt(hDTT - dataTransmited);
        }
        var tcp_packet = new TcpPacket(null,null,sPort,dPort,actualDataSeq,
        null,dOffsetP,[0,1,0,0,0,0],null,getColor(),false);
        actualDataSeq = actualDataSeq + parseInt(dOffsetP);
        dataTransmited += parseInt(dOffsetP);
        tcp_packets.push(tcp_packet);
        console.log(tcp_packet);
        console.log(actualDataSeq);
        console.log(dataTransmited);
    }
    return tcp_packets;
};

function parseTcp(){
    clear_Canvas();
    var iCSequence = parseInt(tcpClientInitialSequenceNumber);
    var iSSequence = parseInt(tcpServerInitialSequenceNumber);
    var nMTU = parseInt(networkMTU);
    var rTT = parseInt(tcpsizeOfRequest);
    var oTT = parseInt(tcpsizeOfObject);
    var tU = parseInt(packet_delay);
    var sTO = parseInt(tcpServerTimeout);
    var cTO = parseInt(tcpClientTimeout);

    var addedHeaders = 40;
    var dataPerPacket = parseInt(nMTU - addedHeaders);

    var global = ({
        iCSequence : iCSequence,
        iSSequence : iSSequence,
        nMTU : nMTU,
        rTT : rTT,
        oTT : oTT,
        tU : tU,
        sTO : sTO,
        cTO : cTO,
        actualTime : 0
    });

    var server = ({
        actualSequence : iSSequence,
        actualACK : 0,
        exceptedACK : [],
        expectedSeq : [],
        ackToSend : [],
        dOffset : dataPerPacket,
        dTT : oTT,
        sPort : tcpPortServer,
        actualWindow : tcpServerWindow,
        window : tcpServerWindow,
        max_window_size : tcpServerWindow,
        slow_start_threshold : parseInt(tcpServerWindow/2),
        toSend : objectToTcpArray(tcpPortServer,tcpPortClient,
        iSSequence,oTT,dataPerPacket),
        waitingForAck : [],
        received : [],
        timeouts : [],
        receivingData : false,
        transmitingData : false,
        state : "LISTEN"
    });

    var client = ({
        actualSequence : iCSequence,
        actualACK : 0,
        exceptedACK : [],
        expectedSeq : [],
        ackToSend : [],
        dOffset : dataPerPacket,
        dTT : rTT,
        sPort : tcpPortClient,
        actualWindow : tcpClientWindow,
        window : tcpClientWindow,
        max_window_size : tcpClientWindow,
        slow_start_threshold : parseInt(tcpClientWindow/2),
        toSend : objectToTcpArray(tcpPortClient,tcpPortServer,
        iCSequence,rTT,dataPerPacket),
        waitingForAck : [],
        received : [],
        timeouts : [],
        receivingData : false,
        transmitingData : false,
        state : "CLOSED"
    });

    //while(server.state != "CLOSED"){
        //tcpClientReaction(client,server,global);
        //tcpServerReaction(server,client,global);
        //global.actualTime += timeUnit;
        //console.log(client.toSend);
        //console.log(server.toSend);
    //};
    //Establishment and conclusion
    /*
    client.state = "ESTABLISHED";
    tcpClientReaction(client,server,global);
    tcpIAServer(server,client,global);
    global.actualTime += tU;
    tcpClientReaction(client,server,global);
    tcpIAServer(server,client,global);
    global.actualTime += tU;
    tcpClientReaction(client,server,global);
    tcpIAServer(server,client,global);
    global.actualTime += tU;
    tcpClientReaction(client,server,global);
    tcpIAServer(server,client,global);
    global.actualTime += tU;
    tcpClientReaction(client,server,global);
    tcpIAServer(server,client,global);
    */
    while(server.state != "CLOSED"){
        var snapshot = [];
        tcpServerReaction(server,client,global);
        tcpClientReaction(client,server,global);
        snapshot.push(JSON.stringify(client));
        snapshot.push(JSON.stringify(server));
        snapshot.push(JSON.stringify(global));
        tcp_snapshot.push(snapshot);
        global.actualTime += global.tU;
   }
   console.log(tcp_snapshot);
   draw_server_client();
   draw_tcp_communication(tcp_array);
};

function recalculateSimulation(){
    var markedPacket;
    var positionOfPacket;
    for(var i = 0 in tcp_array){
        if(tcp_array[i].lost){
            markedPacket = tcp_array[i];
            positionOfPacket = i;
        }
    }
    console.log("Simulator : Packet Lost :");
    console.log(markedPacket);
    console.log("Simulator : Restarting the enviroment");
    console.log("Simulator : Searching the Snapshot");

    if(markedPacket.c_timestamp > markedPacket.s_timestamp){
        console.log("Simulator : Packet from Server to Client lost");
        console.log("Simulator : Searching for the saved-state");
        var momentOfLost = -1;
        var found = false;
        while(momentOfLost < tcp_snapshot.length && !found){
            momentOfLost++;
            if(JSON.parse(tcp_snapshot[momentOfLost][0]).received.length > 0){
                found = JSON.parse(tcp_snapshot[momentOfLost][0]).received[0].c_timestamp == markedPacket.c_timestamp && 
                JSON.parse(tcp_snapshot[momentOfLost][0]).received[0].s_timestamp == markedPacket.s_timestamp;
            }
        }
        var client = JSON.parse(tcp_snapshot[momentOfLost][0]);
        var server = JSON.parse(tcp_snapshot[momentOfLost][1]);
        var global = JSON.parse(tcp_snapshot[momentOfLost][2]);
        var packetToDelete = client.received.indexOf(markedPacket);
        client.received.splice(packetToDelete,1);
        tcp_snapshot.splice(momentOfLost,tcp_snapshot.length);
        var positionToDelete = parseInt(positionOfPacket) + 1;
        var packetsToDelete = tcp_array.length - positionToDelete;
        console.log("Position of package to delete: " + positionToDelete);
        console.log("Length of Array: "+parseInt(tcp_array.length));
        console.log("Packets to delete : "+packetsToDelete);
        tcp_array.splice(positionToDelete,packetsToDelete);
        console.log("Simulator : Resuming state of the simulation");
        console.log("Simulator : Client ");
        console.log(client);
        console.log("Simulator : Server ");
        console.log(server);
        console.log("Simulator : Restarting simulator");
        global.actualTime += global.tU;
        while(server.state != "CLOSED"){
            var snapshot = [];
            tcpServerReaction(server,client,global);
            tcpClientReaction(client,server,global);
            snapshot.push(JSON.stringify(client));
            snapshot.push(JSON.stringify(server));
            snapshot.push(JSON.stringify(global));
            tcp_snapshot.push(snapshot);
            global.actualTime += global.tU;
       }
       console.log(tcp_snapshot);
       draw_server_client();
       draw_tcp_communication(tcp_array);
    }else{
        console.log("Simulator : Packet from Client to Server lost");
        console.log("Simulator : Searching for the saved-state");
        var momentOfLost = -1;
        var found = false;
        while(momentOfLost < tcp_snapshot.length && !found){
            momentOfLost++;
            if(JSON.parse(tcp_snapshot[momentOfLost][1]).received.length > 0){
                found = JSON.parse(tcp_snapshot[momentOfLost][1]).received[0].c_timestamp == markedPacket.c_timestamp && 
                JSON.parse(tcp_snapshot[momentOfLost][1]).received[0].s_timestamp == markedPacket.s_timestamp;
            }
        }
        var client = JSON.parse(tcp_snapshot[momentOfLost][0]);
        var server = JSON.parse(tcp_snapshot[momentOfLost][1]);
        var global = JSON.parse(tcp_snapshot[momentOfLost][2]);
        var packetToDelete = server.received.indexOf(markedPacket);
        server.received.splice(packetToDelete,1);
        //client.expectedAck.splice(0,1);
        //removeACKtoSend(server.ackToSend,markedPacket.seq);
        tcp_snapshot.splice(momentOfLost,tcp_snapshot.length);
        var positionToDelete = parseInt(positionOfPacket) + 1;
        var packetsToDelete = tcp_array.length - positionToDelete;
        console.log("Position of package to delete: " + positionToDelete);
        console.log("Length of Array: "+parseInt(tcp_array.length));
        console.log("Packets to delete : "+packetsToDelete);
        tcp_array.splice(positionToDelete,packetsToDelete);
        console.log("Simulator : Resuming state of the simulation");
        console.log("Simulator : Client ");
        console.log(client);
        console.log("Simulator : Server ");
        console.log(server);
        console.log("Simulator : Restarting simulator");
        console.log(tcp_array);
        global.actualTime += global.tU;
        while(server.state != "CLOSED"){
            var snapshot = [];
            tcpServerReaction(server,client,global);
            tcpClientReaction(client,server,global);
            snapshot.push(JSON.stringify(client));
            snapshot.push(JSON.stringify(server));
            snapshot.push(JSON.stringify(global));
            tcp_snapshot.push(snapshot);
            global.actualTime += global.tU;
       }
       tcp_array = tcp_array.filter(function(elem, index, self){return index === self.indexOf(elem);});
       tcp_array.sort(function(a,b) {return (((a.c_timestamp + a.s_timestamp) > (b.c_timestamp + b.s_timestamp))) ? 1 : (((b.c_timestamp + b.s_timestamp) > (a.c_timestamp + a.s_timestamp)) ? -1 : 0);});
       console.log(tcp_array);
       //tcp_array = tcp_array.filter(function(elem, index, self){return index === self.indexOf(elem);});
       draw_tcp_communication(tcp_array);
    }

}

/*
function recalculateSimulation(){
    //console.log(tcp_snapshot);
    var pLostPacket;
    var pLostPosition;
    for(var lostPacket = 0 in tcp_array ){
        if(tcp_array[lostPacket].lost){
            pLostPacket = tcp_array[lostPacket];
            pLostPosition = lostPacket;
        }
    }
    console.log("Simulator : Lost packet ");
    console.log(pLostPacket);
    console.log("Simulator : Restarting enviroment");
    if(pLostPacket.c_timestamp > pLostPacket.s_timestamp){  
        var position = 0;
        var currentTime = 0;
        while(position < tcp_snapshot.length ){
            if(JSON.parse(tcp_snapshot[position][0]).received.length > 0 && 
            pLostPacket.c_timestamp == JSON.parse(tcp_snapshot[position][0]).received[0].c_timestamp){
                currentTime = position;
            }
            position++;
        }
        var client = JSON.parse(tcp_snapshot[currentTime][0]);
        var server = JSON.parse(tcp_snapshot[currentTime][1]);
        var global = JSON.parse(tcp_snapshot[currentTime][2]);
        client.received.splice(0,1);
        tcp_array.splice(pLostPosition,tcp_array.length - pLostPosition);
        console.log("Simulator : Enviroment resume");
        console.log("Simulator : Client");
        console.log(client);
        console.log("Simulator : Server");
        console.log(server);
        tcp_array.push(pLostPacket);
        while(server.state != "CLOSED"){
            tcpServerReaction(server,client,global);
            tcpClientReaction(client,server,global);
            var snapshot = [];
            snapshot.push(JSON.stringify(client));
            snapshot.push(JSON.stringify(server));
            snapshot.push(JSON.stringify(global));
            global.actualTime += global.tU;
            tcp_snapshot.push(snapshot);
        }
        //console.log(tcp_snapshot);
        clear_Canvas()
        draw_server_client();
        draw_tcp_communication(tcp_array);
    }else{
        var position = 0;
        var currentTime = 0;
        while(position < tcp_snapshot.length){
            if(JSON.parse(tcp_snapshot[position][1]).received.length > 0 && 
            pLostPacket.s_timestamp == JSON.parse(tcp_snapshot[position][1]).received[0].s_timestamp){
                currentTime = position;
            }
            position++;
        }
        var client = JSON.parse(tcp_snapshot[currentTime][0]);
        var server = JSON.parse(tcp_snapshot[currentTime][1]);
        var global = JSON.parse(tcp_snapshot[currentTime][2]);

        server.received.splice(0,1);
        tcp_array.splice(pLostPosition,tcp_array.length - pLostPosition);
        console.log("Simulator : Enviroment resume");
        console.log("Simulator : Client");
        console.log(client);
        console.log("Simulator : Server");
        console.log(server);
        tcp_array.push(pLostPacket);
        while(server.state != "CLOSED"){
            tcpServerReaction(server,client,global);
            tcpClientReaction(client,server,global);
            var snapshot = [];
            snapshot.push(JSON.stringify(client));
            snapshot.push(JSON.stringify(server));
            snapshot.push(JSON.stringify(global));
            global.actualTime += global.tU;
            tcp_snapshot.push(snapshot);
        }
        //console.log(tcp_snapshot);
        clear_Canvas()
        draw_server_client();
        draw_tcp_communication(tcp_array);

    }

}
*/

function tcpIAServerCommunication(host,remote,global){
    if(host.received.length > 0 && checkTimeServer(host.received[0].s_timestamp,global.actualTime)
    ){
        remote.received.push(new TcpPacket(
            global.actualTime + global.tU,
            global.actualTime,
            host.sPort,
            remote.sPort,
            200,
            host.received[0].seq,
            0,
            [0,1,0,0,0,0],
            host.window,
            host.received[0].color,
            false    
        ));
        host.received.splice(0,1);
        console.log("Server IA : Seinding Dummy packet");
    }
}


//Establishment and cclosing connection tested
function tcpIAServer(host,remote,global){
    if(host.received[0].flags.toString() == [0,0,0,0,1,0].toString()){
        console.log("IA Server : Sending SYN");
        remote.received.push(new TcpPacket(
            global.actualTime + global.tU,
            global.actualTime,
            host.sPort,
            remote.sPort,
            5,
            5,
            0,
            [0,1,0,0,1,0],
            host.window,
            null, 
            false
        ));
    }else if(host.received[0].flags.toString() == [0,0,0,0,0,1].toString()){
        remote.received.push(new TcpPacket(
            global.actualTime + global.tU,
            global.actualTime,
            host.sPort,
            remote.sPort,
            5,
            5,
            0,
            [0,1,0,0,0,0],
            host.window,
            null,
            false
        ));
        console.log("IA Server : 11st packet sended");
        remote.received.push(new TcpPacket(
            global.actualTime + global.tU + global.tU,
            global.actualTime + global.tU,
            host.sPort,
            remote.sPort,
            5,
            5,
            0,
            [0,0,0,0,0,1],
            host.window,
            null,
            false
        ));
        console.log("IA Server : second packet");
    }
     
}

function tcpClientReaction(host,remote,global){
    switch(host.state){
        case "CLOSED":
            var tcp_packet_sended = new TcpPacket(
                global.actualTime,
                parseInt(global.actualTime + global.tU),
                host.sPort,
                remote.sPort,
                host.actualSequence,
                0,
                0,
                [0,0,0,0,1,0],
                host.window,
                getColor(),
                false
            );
            remote.received.push(tcp_packet_sended);
            tcp_array.push(tcp_packet_sended);
            host.actualSequence++;
            host.state = "SYN_SENT";
            console.log("Client : SYN Packet sended");
            console.log("Client : State Changed to SYN_SENT");
        break;
        case "SYN_SENT":
            if(host.received.length > 0 && checkTimeClient(host.received[0].c_timestamp,global.actualTime) 
            && host.received[0].flags.toString() == [0,1,0,0,1,0].toString()){
                var tcp_packet_sended = new TcpPacket(
                    global.actualTime,
                    global.actualTime + global.tU,
                    host.sPort,
                    remote.sPort,
                    host.actualSequence,
                    host.received[0].seq,
                    0,
                    [0,1,0,0,0,0],
                    host.window,
                    getColor(),
                    false
                );
                remote.received.push(tcp_packet_sended);
                tcp_array.push(tcp_packet_sended);
                host.actualACK= parseInt(host.received[0].seq + 1);
                host.received.splice(0,1);
                host.state = "ESTABLISHED";
                host.transmitingData = true;
                console.log("Client : SYN ACK Received Connection Established");
            };
        break;
        case "ESTABLISHED":
            if(host.transmitingData){
                decreaseAllTimeouts(host.timeouts)
                if(host.toSend.length == 0 && host.received.length == 0 && host.waitingForAck.length == 0){
                    console.log("Client : Change of state to receiving data")
                    host.transmitingData = false;
                    host.receivingData = true;
                }else if(host.actualWindow > 0 && host.toSend.length > 0){
                    var tcp_packet_sended = markTimestampClient(host.toSend[0],
                        global.actualTime,global.actualTime + global.tU, host.actualWindow,host.actualACK);
                        remote.received.push(tcp_packet_sended);
                        host.waitingForAck.push(tcp_packet_sended);
                        host.timeouts.push(tcpClientTimeout);
                        host.exceptedACK.push(parseInt(host.toSend[0].seq + host.toSend[0].dOffset));
                        host.actualSequence = parseInt(host.toSend[0].seq + host.toSend[0].dOffset);
                        host.toSend.splice(0,1);
                        tcp_array.push(tcp_packet_sended);
                        console.log("Client : Sending packet of data");
                        console.log(tcp_packet_sended);
                        host.actualWindow--;
                }else if (host.received.length > 0 && checkTimeClient(host.received[0].c_timestamp,global.actualTime)){
                    //var packet_position = parseInt(getCorrelatedPacket(host.waitingForAck,received_p) +1);
                    //console.log(packet_position);
                    //host.waitingForAck.splice(0, packet_position);
                    //host.timeouts.splice(0, packet_position);
                    if(host.exceptedACK.includes(host.received[0].ack)){
                        console.log("Client : Ack received :"+host.received[0].ack);
                        deletedAckPacket(host.waitingForAck, host.timeouts,host.received[0].ack);
                        deleteExpectedAck(host.exceptedACK,host.received[0].ack);
                        console.log(host.waitingForAck);
                        console.log(host.timeouts);
                        if(host.window < host.slow_start_threshold){
                            console.log("Client : Slow start, window increment");
                            host.window = host.window * 2;
                            host.actualWindow = parseInt(host.window-host.waitingForAck.length);
                        }else if(host.window >= host.slow_start_threshold){
                            console.log("Client : Avoiding congestion, window increment");
                            host.window = parseInt(host.window) + parseInt(1);
                            host.actualWindow = parseInt(host.window) - parseInt(host.waitingForAck.length);
                        }
                        if(host.toSend.length > 0 && host.actualWindow > 0){
                            console.log("Client : Sending package after window increase");
                            var tcp_packet_sended = markTimestampClient(host.toSend[0],
                                global.actualTime,global.actualTime + global.tU, host.actualWindow,host.actualACK);
                                remote.received.push(tcp_packet_sended);
                                host.waitingForAck.push(tcp_packet_sended);
                                host.timeouts.push(tcpClientTimeout);
                                host.exceptedACK.push(host.toSend[0].seq + host.toSend[0].dOffset);
                                host.actualSequence = host.toSend[0].seq + host.toSend[0].dOffset;
                                host.actualACK = host.received[0].seq;
                                host.toSend.splice(0,1);
                                tcp_array.push(tcp_packet_sended);
                                console.log("Client : Sending packet of data");
                                console.log(tcp_packet_sended);
                                host.actualWindow--;
                        }
                    }else{
                        console.log("Client : Received ACK "+host.received[0].ack+" .")
                    }
                    host.received.splice(0,1);
                }else{
                    if(isTimeout(host.timeouts)){
                        var indexOfTimeout = host.timeouts.indexOf(0);
                        console.log(host.timeouts);
                        var originalPacket = JSON.stringify(host.waitingForAck[indexOfTimeout]);
                        var timeout_packet = JSON.parse(originalPacket);
                        timeout_packet = markTimestampClient(timeout_packet,
                            global.actualTime,global.actualTime + global.tU, host.actualWindow,host.actualACK);
                            remote.received.push(timeout_packet);
                            host.waitingForAck.splice(indexOfTimeout,1)
                            host.timeouts.splice(indexOfTimeout,1);
                            host.waitingForAck.push(timeout_packet);
                            host.timeouts.push(tcpClientTimeout);
                            //host.exceptedACK = host.waitingForAck[indexOfTimeout].seq;
                            //host.actualSequence = host.waitingForAck[indexOfTimeout].seq;
                            host.actualACK = host.waitingForAck[indexOfTimeout].ack;
                            host.actualWindow = 1;
                            host.window = 1;
                            //host.toSend.splice(0,1);
                            tcp_array[tcp_array.length] = timeout_packet;
                            //tcp_array.push(tcp_packet_sended);
                            console.log("Client : Retransmiting packet of data");
                            console.log(timeout_packet);
                            host.actualWindow--;
                    }
                }
                /*
                if(host.toSend.length > 0 && host.received.length == 0 && host.waitingForAck.length == 0){
                    var tcp_packet_sended = markTimestampClient(host.toSend[0],
                    global.actualTime,global.actualTime + global.tU, host.window,host.actualACK);
                    remote.received.push(tcp_packet_sended);
                    host.waitingForAck.push(tcp_packet_sended);
                    host.timeouts.push(parseInt(tcpClientTimeout));
                    host.exceptedACK = host.toSend[0].seq;
                    host.actualSequence = host.toSend[0].seq;
                    host.toSend.splice(0,1);
                    tcp_array.push(tcp_packet_sended);
                    console.log("Client : Sending first packet of data");
                }else if(host.toSend.length > 0 && host.received.length > 0 &&
                checkTimeClient(host.received[0].c_timestamp,global.actualTime)){
                    if(host.received[0].ack < host.exceptedACK){
                        var replay = 0;
                        while(replay < host.waitingForAck.length &&
                        host.waitingForAck[replay].seq < host.exceptedACK){
                            replay++;
                        };
                        host.waitingForAck.splice(0,replay);
                        host.timeouts.splice(0,replay);
                        var tcp_packet_sended = markTimestampClient(host.waitingForAck[0],global.actualTime,
                            global.actualTime + global.tU,host.window,host.waitingForAck[0].ack);
                        remote.received.push(tcp_packet_sended);
                        host.timeouts[0] = parseInt(tcpClientTimeout);
                        tcp_array.push(tcp_packet_sended);
                    }else{
                        var tcp_packet_sended = markTimestampClient(host.toSend[0],
                            global.actualTime,global.actualTime + global.tU, host.window,host.actualACK);
                            remote.received.push(tcp_packet_sended);
                            host.waitingForAck.push(tcp_packet_sended);
                            host.timeouts.push(tcpClientTimeout);
                            host.exceptedACK = host.toSend[0].seq;
                            host.actualSequence = host.toSend[0].seq;
                            host.actualACK = host.received[0].seq;
                            host.toSend.splice(0,1);
                            host.received.splice(0,1);
                            tcp_array.push(tcp_packet_sended);
                            console.log("Client : Sending packet of data");
                    }
                }else if(host.received.length == 0 && host.waitingForAck.length > 0){
                    var counter = 0;
                    while(counter < host.timeouts.length && 
                    host.timeouts[counter] > 0){
                        host.timeouts[counter]--;
                        console.log(host.timeouts[counter]);
                        counter++;
                    }
                    if(counter == host.timeouts.length){
                        console.log("Client : Decreased all the coutners");
                    }else{
                        var tcp_packet_sended =  markTimestampClient(host.waitingForAck[counter],global.actualTime,
                            global.actualTime + global.tU,host.window,host.waitingForAck[counter].ack);
                        remote.received.push(tcp_packet_sended);
                        host.timeouts[counter] = tcpClientTimeout;
                        tcp_array.push(tcp_packet_sended);
                        console.log("Client : Retransmiting data");
                    }
                }
                else if(host.toSend.length == 0 && host.received.length > 0 
                && host.received[0].ack == host.exceptedACK && host.waitingForAck[0].seq == host.received[0].ack &&
                checkTimeClient(host.received[0].c_timestamp,global.actualTime)){
                    host.transmitingData = false;
                    host.receivingData = true;
                    host.received.splice(0,1);
                    host.waitingForAck.splice(0,1);
                    console.log("Client : All data sended, waiting for incoming data");
                }
                */
            }else if(host.receivingData){
                if(host.received.length > 0 && checkTimeClient(host.received[0].c_timestamp,global.actualTime)
                    /*&& remote.toSend.length > 0*/){
                    if(host.received.length > 0 && checkTimeClient(host.received[0].c_timestamp,global.actualTime)){
                        if(!host.expectedSeq.includes(host.received[0].seq)){
                            host.expectedSeq.push(host.received[0].seq);
                            console.log("Client : Pushing "+host.received[0].seq+" into received sequences");
                            host.ackToSend.push(parseInt(host.received[0].seq + host.received[0].dOffset));
                            console.log("Client : Sequence Numbers Received");
                            console.log(host.expectedSeq);
                        }
                        updateExpectedSeqs(host.expectedSeq,host.ackToSend,host.dOffset,"Client");
                        var tcp_packet_sended = new TcpPacket(global.actualTime, global.actualTime + global.tU, 
                        host.sPort,remote.sPort,host.actualSequence,host.ackToSend[0],0,
                        [0,1,0,0,0,0],host.actualWindow,host.received[0].color,false);
                        tcp_array.push(tcp_packet_sended);
                        remote.received.push(tcp_packet_sended);
                        host.actualACK = host.expectedSeq[0];
                        host.received.splice(0,1);
                        console.log("Client : Packet of Data received, sending ACK");
                        console.log("Client : ACK sended for :"+host.expectedSeq[0]+" Value :"+host.ackToSend[0]);
                    }
                }else if(host.received.length == 0 && remote.toSend.length == 0 && remote.waitingForAck.length == 0 ){
                    host.receivingData = false;
                    host.transmitingData = false;
                    host.actualACK = host.ackToSend[0];
                    console.log("Client : All data received");
                }
            }else{
                var closingPacket = new TcpPacket(global.actualTime, global.actualTime + global.tU,
                host.sPort, remote.sPort,host.actualSequence + 1, host.actualACK,0,
                [0,0,0,0,0,1],host.actualWindow,getColor(),false);
                remote.received.push(closingPacket);
                tcp_array.push(closingPacket);
                host.state = "FIN_WAIT_1";
                console.log("Client : Sending FIN Request");
                console.log("Client : State Changed to FIN_WAIT_1");
            };
        break;
        case "FIN_WAIT_1":
            if(host.received.length > 0 && checkTimeClient(host.received[0].c_timestamp,global.actualTime)){
                if(host.received[0].flags.toString() == [0,1,0,0,0,0].toString()){
                    host.state = "FIN_WAIT_2";
                    host.received.splice(0,1);
                    console.log("Client : Received ACK from Server");
                    console.log("Client : Changing state to FIN_WAIT_2");
                }else{
                    //host.received.splice(0,1);
                }
            };
        break;
        case "FIN_WAIT_2":
            console.log("Client : FIN_WAIT_2 state, waiting for Server FIN Packet");
            if(host.received.length > 0 && checkTimeClient(host.received[0].c_timestamp,global.actualTime)){
                if(host.received[0].flags.toString() == [0,0,0,0,0,1].toString()){
                    var tcp_packet_sended = new TcpPacket(global.actualTime, global.actualTime + global.tU,
                    host.sPort,remote.sPort,host.actualSequence,host.actualACK,0,[0,1,0,0,0,0],
                    host.window,host.received[0].color,false);
                    remote.received.push(tcp_packet_sended);
                    tcp_array.push(tcp_packet_sended);
                    host.state = "TIME_WAIT";
                    host.received.splice(0,1);
                    console.log("Client : FIN of Server received, sending ACK and closing connection");
                }else{
                    console.log("Client : Unspected packet received, discarding packet");
                    host.received.splice(0,1);
                }
            }
        break;
        case "TIME_WAIT":
            host.state = "CLOSED";
            console.log("Client : App closed, closing connection");
        break;
    };//COde the closing connection reactions
};

function tcpServerReaction(host,remote,global){
    switch(host.state){
        case "LISTEN":
        if(host.received.length > 0 && checkTimeServer(host.received[0].s_timestamp,global.actualTime)
        && host.received[0].flags.toString() == [0,0,0,0,1,0].toString()){
            var tcp_packet_sended = new TcpPacket(
                global.actualTime + global.tU,
                global.actualTime, 
                host.sPort, 
                remote.sPort,
                host.actualSequence,
                host.actualACK + 1,
                0,
                [0,1,0,0,1,0],
                host.window,
                host.received[0].color,
                false
            );
            remote.received.push(tcp_packet_sended);
            tcp_array.push(tcp_packet_sended);
            host.received.splice(0,1);
            host.actualSequence++;
            host.state = "SYN_RECEIVED";
            console.log("Server : SYN Received, sending SYN+ACK");
        };
        break;
        case "SYN_RECEIVED":
        if(host.received.length > 0 && checkTimeServer(host.received[0].s_timestamp,global.actualTime)
        && host.received[0].flags.toString() == [0,1,0,0,0,0].toString()){
            //host.expectedSeq.push(host.received[0].seq + host.received[0].dOffset);
            //console.log("Expected seq :"+host.expectedSeq);
            host.received.splice(0,1);
            host.state = "ESTABLISHED";
            host.receivingData = true;
            console.log("Server : ACK from Client received. Connection established");
        }
        break;
        case "ESTABLISHED":
        if(host.receivingData){
            if(host.received.length > 0 && checkTimeServer(host.received[0].s_timestamp,global.actualTime)
                /*&& remote.toSend.length > 0*/){
                if(host.received.length > 0 && checkTimeServer(host.received[0].s_timestamp,global.actualTime) && !host.received[0].lost){
                    if(!host.expectedSeq.includes(host.received[0].seq)){
                        host.expectedSeq.push(host.received[0].seq);
                        console.log("Pushing "+host.received[0].seq+" into received sequences");
                        host.ackToSend.push(parseInt(host.received[0].seq + host.received[0].dOffset));
                        console.log("Server : Sequence Numbers Received");
                        console.log(host.expectedSeq);
                    }
                    updateExpectedSeqs(host.expectedSeq,host.ackToSend,host.dOffset,"Server");
                    var tcp_packet_sended = new TcpPacket(global.actualTime + global.tU, global.actualTime,
                    host.sPort,remote.sPort,host.actualSequence,host.ackToSend[0],0,
                    [0,1,0,0,0,0],host.actualWindow,host.received[0].color,false);
                    remote.received.push(tcp_packet_sended);
                    console.log("Server : Packet sended");
                    console.log(tcp_packet_sended);
                    host.actualACK = host.expectedSeq[0];
                    
                    tcp_array.push(tcp_packet_sended);
                    console.log("Server : Packet of Data received, sending ACK");
                    console.log("Server : ACK sended for :"+host.expectedSeq[0]+" Value :"+host.ackToSend[0]);
                }
                host.received.splice(0,1);
                    /*
                host.received.sort(function(a,b) {return (a.seq > b.seq) ? 1 : ((b.seq > a.seq) ? -1 : 0);});
                deleteMinorAcks(host.received,host.expectedSeq);
                if(host.received.length > 0 && host.received[0].seq == host.expectedSeq){
                    host.expectedSeq = parseInt(host.received[0].seq + host.received[0].dOffset);
                    var tcp_packet_sended = new TcpPacket(global.actualTime + global.tU, global.actualTime,
                    host.sPort,remote.sPort,host.actualSequence,host.received[0].seq,0,
                    [0,1,0,0,0,0],host.window,host.received[0].color,false);
                    remote.received.push(tcp_packet_sended);
                    host.actualACK = host.received[0].seq;
                    host.received.splice(0,1);
                    tcp_array.push(tcp_packet_sended);
                    console.log("Server : Packet of Data received, sending ACK");
                    console.log("Server : Expected Seq :"+host.expectedSeq);
                }else if(host.received.length > 0 && host.received[0].seq < host.expectedSeq){
                    host.received.splice(0,1);
                    var tcp_packet_sended = new TcpPacket(global.actualTime + global.tU, global.actualTime,
                        host.sPort,remote.sPort,host.actualSequence,host.actualACK,0,
                        [0,1,0,0,0,0],host.window,getColor(),false);
                        remote.received.push(tcp_packet_sended);
                }
                */
            }else if(host.received.length == 0 && remote.toSend.length == 0 && remote.waitingForAck.length == 0 && remote.receivingData){
                host.receivingData = false;
                host.transmitingData = true;
                host.actualACK = host.ackToSend[0];
                console.log("Server : Full request received, starting to transmit data");
            }
        }else if(host.transmitingData){
            decreaseAllTimeouts(host.timeouts)
                if(host.toSend.length == 0 && host.received.length == 0 && host.waitingForAck.length == 0){
                    console.log("Server : Change of state to close data")
                    host.transmitingData = false;
                    host.receivingData = false;
                }else if(host.actualWindow > 0 && host.toSend.length > 0){
                    var tcp_packet_sended = markTimestampServer(host.toSend[0],
                        global.actualTime,global.actualTime + global.tU, host.actualWindow,host.actualACK);
                        console.log(tcp_packet_sended);
                        remote.received.push(tcp_packet_sended);
                        host.waitingForAck.push(tcp_packet_sended);
                        host.timeouts.push(tcpClientTimeout);
                        host.exceptedACK.push(parseInt(host.toSend[0].seq + host.toSend[0].dOffset));
                        host.actualSequence = parseInt(host.toSend[0].seq + host.toSend[0].dOffset);
                        host.toSend.splice(0,1);
                        tcp_array.push(tcp_packet_sended);
                        console.log("Server : Sending packet of data");
                        host.actualWindow--;
                }else if (host.received.length > 0 && checkTimeServer(host.received[0].s_timestamp,global.actualTime)){
                    //var packet_position = parseInt(getCorrelatedPacket(host.waitingForAck,received_p) +1);
                    //console.log(packet_position);
                    //host.waitingForAck.splice(0, packet_position);
                    //host.timeouts.splice(0, packet_position);
                    if(host.exceptedACK.includes(host.received[0].ack)){
                        console.log("Server : Ack received :"+host.received[0].ack);
                        deletedAckPacket(host.waitingForAck, host.timeouts,host.received[0].ack);
                        deleteExpectedAck(host.exceptedACK,host.received[0].ack);
                        console.log(host.waitingForAck);
                        console.log(host.timeouts);
                        if(host.window < host.slow_start_threshold){
                            console.log("Server : Slow start, window increment");
                            host.window = host.window * 2;
                            host.actualWindow = parseInt(host.window-host.waitingForAck.length);
                        }else if(host.window >= host.slow_start_threshold){
                            console.log("Server : Avoiding congestion, window increment");
                            host.window = parseInt(host.window) + 1;
                            host.actualWindow = parseInt(host.window) - parseInt(host.waitingForAck.length);
                        }
                        if(host.toSend.length > 0 && host.actualWindow > 0){
                            console.log("Server : Sending package after window increase");
                            var tcp_packet_sended = markTimestampServer(host.toSend[0],
                                global.actualTime,global.actualTime + global.tU, host.actualWindow,host.actualACK);
                                console.log(tcp_packet_sended);
                                remote.received.push(tcp_packet_sended);
                                host.waitingForAck.push(tcp_packet_sended);
                                host.timeouts.push(tcpClientTimeout);
                                host.exceptedACK.push(host.toSend[0].seq + host.toSend[0].dOffset);
                                host.actualSequence = host.toSend[0].seq + host.toSend[0].dOffset;
                                host.actualACK = host.received[0].seq;
                                host.toSend.splice(0,1);
                                tcp_array.push(tcp_packet_sended);
                                console.log("Server : Sending packet of data");
                                host.actualWindow--;
                        }
                    }else{
                        console.log("Server : Received ACK "+host.received[0].ack+" .")
                    }
                    host.received.splice(0,1);
                }else{
                    if(isTimeout(host.timeouts)){
                        var indexOfTimeout = host.timeouts.indexOf(0);
                        console.log(host.timeouts);
                        var originalPacket = JSON.stringify(host.waitingForAck[indexOfTimeout]);
                        var timeout_packet = JSON.parse(originalPacket);
                        timeout_packet = markTimestampServer(timeout_packet,
                            global.actualTime,global.actualTime + global.tU, host.actualWindow,host.actualACK);
                            remote.received.push(timeout_packet);
                            host.waitingForAck.splice(indexOfTimeout,1)
                            host.timeouts.splice(indexOfTimeout,1);
                            host.waitingForAck.push(timeout_packet);
                            host.timeouts.push(tcpServerTimeout);
                            //host.exceptedACK = host.waitingForAck[indexOfTimeout].seq;
                            //host.actualSequence = host.waitingForAck[indexOfTimeout].seq;
                            host.actualACK = host.waitingForAck[indexOfTimeout].ack;
                            host.actualWindow = 1;
                            host.window = 1;
                            //host.toSend.splice(0,1);
                            tcp_array[tcp_array.length] = timeout_packet;
                            //tcp_array.push(tcp_packet_sended);
                            console.log("Server : Retransmiting packet of data");
                            console.log(timeout_packet);
                            host.actualWindow--;
                    }
                }
            /*
            if(host.toSend.length > 0 && host.received.length == 0 && host.waitingForAck.length == 0){
                var tcp_packet_sended = markTimestampServer(host.toSend[0],
                global.actualTime,global.actualTime + global.tU, host.window,host.actualACK);
                remote.received.push(tcp_packet_sended);
                host.waitingForAck.push(tcp_packet_sended);
                host.timeouts.push(parseInt(tcpServerTimeout));
                host.exceptedACK = host.toSend[0].seq;
                host.actualSequence = host.toSend[0].seq;
                host.toSend.splice(0,1);
                tcp_array.push(tcp_packet_sended);
                console.log("Server : Sending first packet of data");
            }else if(host.toSend.length > 0 && host.received.length > 0 &&
            checkTimeServer(host.received[0].s_timestamp,global.actualTime)){
                if(host.received[0].ack < host.exceptedACK){
                    var replay = 0;
                    while(replay < host.waitingForAck.length &&
                    host.waitingForAck[replay].seq < host.exceptedACK){
                        replay++;
                    };
                    host.waitingForAck.splice(0,replay);
                    host.timeouts.splice(0,replay);
                    var tcp_packet_sended = markTimestampServer(host.waitingForAck[0],global.actualTime,
                        global.actualTime + global.tU,host.window,host.waitingForAck[0].ack);
                    remote.received.push(tcp_packet_sended);
                    host.timeouts.push(parseInt(tcpServerTimeout));
                    host.received.splice(0,1);
                    tcp_array.push(tcp_packet_sended);
                }else{
                    var tcp_packet_sended = markTimestampServer(host.toSend[0],
                        global.actualTime,global.actualTime + global.tU, host.window,host.actualACK);
                        remote.received.push(tcp_packet_sended);
                        host.waitingForAck.push(tcp_packet_sended);
                        host.timeouts.push(tcpServerTimeout);
                        host.exceptedACK = host.toSend[0].seq;
                        host.actualSequence = host.toSend[0].seq;
                        host.actualACK = host.received[0].seq;
                        host.toSend.splice(0,1);
                        host.received.splice(0,1);
                        host.waitingForAck.splice(0,1);
                        host.timeouts.splice(0,1);
                        tcp_array.push(tcp_packet_sended);
                        console.log("Server : Sending packet of data");
                }
            }else if(host.received.length == 0 && host.waitingForAck.length > 0){
                var counter = 0;
                while(counter < host.timeouts.length && 
                host.timeouts[counter] > 0){
                    host.timeouts[counter]--;
                    console.log(host.timeouts[counter]);
                    counter++;
                }
                if(counter == host.timeouts.length){
                    console.log("Server : Decreased all the counters");
                }else{
                    var tcp_packet_sended = markTimestampServer(host.waitingForAck[counter],global.actualTime,
                    global.actualTime + global.tU,host.window,host.waitingForAck[counter].ack);
                    remote.received.push(tcp_packet_sended);
                    host.waitingForAck[counter] = tcp_packet_sended;
                    host.timeouts[counter] = tcpServerTimeout;
                    tcp_array.push(tcp_packet_sended);
                    console.log("Server : Retransmiting data");
                }
            }
            else if(host.toSend.length == 0 && host.received.length > 0 
            && host.received[0].ack == host.exceptedACK && 
            checkTimeServer(host.received[0].s_timestamp,global.actualTime)){
                host.transmitingData = false;
                host.received.splice(0,1);
                console.log("Server : All data sended, waiting for incoming data");
            }
            */
        }else{
            if(host.received.length > 0 && checkTimeServer(host.received[0].s_timestamp, global.actualTime)
            && host.received[0].flags.toString() == [0,0,0,0,0,1].toString()){
                var tcp_packet_sended = new TcpPacket(
                    global.actualTime + global.tU,
                    global.actualTime,
                    host.sPort,
                    remote.sPort,
                    host.actualSequence,
                    host.received[0].seq,
                    0,
                    [0,1,0,0,0,0],
                    host.window,
                    host.received[0].color,
                    false
                );
                remote.received.push(tcp_packet_sended);
                host.received.splice(0,1);
                host.state = "CLOSE_WAIT";
                tcp_array.push(tcp_packet_sended);
                console.log("Server : FIN Packet received, sending ACK");
            }
        }
        break;
        case "CLOSE_WAIT":
            var tcp_packet_sended = new TcpPacket(
                global.actualTime + global.tU,
                global.actualTime,
                host.sPort,
                remote.sPort,
                host.actualSequence + 1,
                host.actualACK,
                0,
                [0,0,0,0,0,1],
                host.window,
                getColor(),
                false
            );
            remote.received.push(tcp_packet_sended);
            tcp_array.push(tcp_packet_sended);
            console.log("Server : Sending FIN Packet from server, waiting for Client ACK");
            host.state = "LAST_ACK";
        break;
        case "LAST_ACK":
            if(host.received.length > 0 && checkTimeServer(host.received[0].s_timestamp,global.actualTime)
            && host.received[0].flags.toString() == [0,1,0,0,0,0].toString()){
                host.received.splice(0,1);
                console.log("Server : ACK Received, closing connection");
                host.state = "CLOSED";
            }else{
                host.received.splice(0,1);
            }
        break;
        case "CLOSED":
            host.state = "LISTEN";
        break;
    }

}


function parseUdp(){
    clear_Canvas();
    var addedHeaders = parseInt(8 + 20); //UDP Header plus IP Header
    var requestData = udpsizeOfRequest;
    var objectData = udpsizeOfObject;
    var dataPerDatagram = parseInt(networkMTU) - parseInt(addedHeaders);
    var requestDatagrams = Math.ceil(requestData/dataPerDatagram);
    var actualTime = 0;
    var timeUnit = parseInt(packet_delay);

    var server = ({
        datagrams_received : []
    });
    var dataToTransmit = 0;
    for(dataToTransmit = parseInt(requestData); dataToTransmit > 0; dataToTransmit -= dataPerDatagram){
        var dataInPacket;
        if(dataToTransmit > dataPerDatagram){
            dataInPacket = dataPerDatagram;
        }else{
            dataInPacket = dataToTransmit;
        }
        var udp_datagram = ({
            c_timestamp : actualTime,
            s_timestamp : actualTime + timeUnit,
            sourcePort : udpportClient,
            destinationPort : udpportServer,
            length : dataInPacket,
            checksum : simulateUdpChecksum(),
            lost : false     
        });
        server.datagrams_received.push(udp_datagram);
        udp_array.push(udp_datagram);
        actualTime += timeUnit;
    };

    if(server.datagrams_received.length == requestDatagrams){

        for(dataToTransmit = parseInt(objectData); dataToTransmit > 0; dataToTransmit -= dataPerDatagram){    
            var dataInPacket;
            if(dataToTransmit > dataPerDatagram){
                dataInPacket = dataPerDatagram;
            }else{
                dataInPacket = dataToTransmit;
            }
            var udp_datagram = ({
                c_timestamp : actualTime + timeUnit,
                s_timestamp : actualTime,
                sourcePort : udpportClient,
                destinationPort : udpportServer,
                length : dataInPacket,
                checksum : simulateUdpChecksum(),
                lost : false     
            });
            actualTime = parseInt(actualTime + timeUnit);
            udp_array.push(udp_datagram);
        };
    }
    console.log(udp_array);
    draw_server_client();
    draw_udp_communication(udp_array);
};


function httpsubmit() {
    httpIpServer =gValue("httpipserver");
    httpIpClient =gValue("httpipclient");
    httpnumObjects =gValue("httpnObjects");
    httpObject =gValue("httpRequestedObject");
    httpmessage =gValue("httpRequestMessageBody");
    httptypeOfRequest =gValue("httpRequest");
    httpObjectSize =gValue("httpObjectSize");
    packet_delay =gValue("packet_delay");
    routers_between =gValue("routers_between");
    networkMTU =gValue("networkMTU");
    if(!checkIP(httpIpServer)){
        alert("Error : La IP del servidor "+httpIpServer+" no es correcta.");
    }else if (!checkIP(httpIpClient)){
        alert("Error : La IP del cliente "+httpIpClient+" no es correcta");
    }else if(parseInt(httpnumObjects)<= 0){
        alert("Error : Número de objetos HTTP pedidos es menor o igual a cero")
    }else if(parseInt(httpObjectSize)<=0){
        alert("Error : Tamaño del objeto menor o igual que cero");
    }else if(packet_delay == null || routers_between == null || networkMTU == null){
        alert("Error : Se tiene que especificar el retardo entre paquetes"+
        ",el número de routers y \n la MTU de la red.");
    }else{

        sValue("tcpipserver" ,httpIpServer);
        sValue("tcpipclient",httpIpClient);
        sValue("tcpportServer",80);
        tcpPortServer =gValue("tcpportServer");
        sValue("tcpportClient",Math.floor(Math.random()*64510) +1025);
        tcpPortClient =gValue("tcpportClient");
        sValue("tcpServerInitialSequenceNumber", Math.floor(Math.random()*100 + 1));
        sValue("tcpClientInitialSequenceNumber", Math.floor(Math.random()*100 + 1));
        var sRequest = httpmessage+httpObject;
        sValue("tcpsizeOfRequest" ,parseInt(sRequest.length));
        sValue("tcpsizeOfObject" ,parseInt(httpnumObjects*httpObjectSize));
        sValue("tcpServerTimeout",parseInt(3));
        sValue("tcpClientTimeout",parseInt(3));
        tcpServerTimeout =gValue("tcpServerTimeout");
        tcpClientTimeout =gValue("tcpClientTimeout");
        sValue("ipDestination",httpIpServer);
        sValue("ipSource",httpIpClient);
        sValue("ipTTL",64);
        sValue("idProtocol","TCP");
        sValue("tcpPersistent" ,true);
        tcpServerWindow =gValue("tcpServerWindow");
        tcpClientWindow =gValue("tcpClientWindow");
        sValue("tcpClientWindow",3);
        sValue("tcpServerWindow",3);
        parseHttp(httpnumObjects);
    };
};

function tcpsubmit(){
    tcpsizeOfRequest =gValue("tcpsizeOfRequest");
    tcpsizeOfObject =gValue("tcpsizeOfObject");
    tcpIpServer =gValue("tcpipserver");
    tcpIpClient =gValue("tcpipclient");
    tcpPortServer =gValue("tcpportServer");
    tcpPortClient =gValue("tcpportClient");
    tcpServerInitialSequenceNumber =gValue("tcpServerInitialSequenceNumber");
    tcpClientInitialSequenceNumber =gValue("tcpClientInitialSequenceNumber");
    tcpServerWindow =gValue("tcpServerWindow");
    tcpClientWindow =gValue("tcpClientWindow");
    //tcpAlfa =gValue("tcpAlfa");
    //tcpBeta =gValue("tcpBeta");
    tcpServerTimeout =gValue("tcpServerTimeout");
    tcpClientTimeout =gValue("tcpClientTimeout");
    tcpSlowStart =gValue("tcpSlowStart");
    tcpSimplified =gValue("tcpSimplified");
    tcpPersistent =gValue("tcpPersistent");
    packet_delay =gValue("packet_delay");
    routers_between =gValue("routers_between");
    networkMTU =gValue("networkMTU");
    udp_array = [];
    ip_array = [];
    if(parseInt(tcpsizeOfObject)<= 0){
        alert("Error : El tamaño del objeto es menor o igual que cero")
    }else if(!checkIP(tcpIpServer)){
        alert("Error : IP del servidor incorrecta");
    }else if(!checkIP(tcpIpClient)){
        alert("Error : IP del cliente incorrecta");
    }else if(!checkPort(tcpPortServer) && tcpPortServer > 1024){
        alert("Error : Puerto del servidor incorrecto");
    }else if(!checkPort(tcpPortClient) && tcpPortClient > 1024){
        alert("Error : Puerto del cliente incorrecto o puerto reservado ( < 1024)");
    }else if(tcpsizeOfObject <= 0){
        alert("Error : Tamaño del objeto menor o igual que cero");
    }else if(tcpSizeOfWindow < 0){
        alert("Error : Tamaño de la ventana menor que cero");
    }else if(packet_delay == null || routers_between == null || networkMTU == null){
        alert("Error : Se tiene que especificar el retardo entre paquetes"+
        ",el número de routers y \n la MTU de la red.");
    }else{
        sValue("httpnObjects",1);
        sValue("httpipserver",tcpIpServer);
        sValue("httpipclient",tcpIpClient);
        sValue("httpRequest","GET");
        sValue("httpRequestedObject","\\test\\testPage");
        sValue("httpRequestMessageBody","testId=123&page=Test");
        sValue("httpObjectSize",tcpsizeOfObject);
        sValue("ipDestination",tcpIpServer);
        sValue("ipSource",tcpIpClient);
        sValue("ipTTL",64);
        window.localStorage.httpnObjects = 1;
        window.localStorage.httpipserver = tcpIpServer;
        window.localStorage.httpipclient = tcpIpClient;
        window.localStorage.httpRequest = "GET";
        window.localStorage.ipDestination = tcpIpServer;
        window.localStorage.ipSource = tcpIpClient;
        window.localStorage.ipTTL = 64;
        parseTcp();
    };
};

function udpsubmit(){
    udpipserver =gValue("udpipserver");
    udpipclient =gValue("udpipclient");
    udpportServer =gValue("udpportServer");
    udpportClient =gValue("udpportClient");
    udpsizeOfObject =gValue("udpsizeOfObject");
    udpsizeOfRequest =gValue("udpsizeOfRequest");
    packet_delay =gValue("packet_delay");
    routers_between =gValue("routers_between");
    networkMTU =gValue("networkMTU");
    tcp_array = [];
    ip_array = [];
    if(!checkIP(udpipserver)){
        alert("Error : IP del servidor no válida");
    }else if(!checkIP(udpipclient)){
        alert("Error : IP del cliente no es válida");
    }else if(!checkPort(udpportServer) && udpportServer > 1024){
        alert("Error : Puerto del servidor no válido");
    }else if(!checkPort(udpportClient) && udpportClient > 1024){
        alert("Error : Puerto del cliente no válido")
    }else if(udpsizeOfObject <= 0){
        alert("Error : El tamaño del objeto debe ser mayor que 0");
    }else if(udpsizeOfRequest <= 0){
        alert("Error : El tamaño de la petición tiene que ser mayor que cero");
    }else if(packet_delay == null || routers_between == null || networkMTU == null){
        alert("Error : Se tiene que especificar el retardo entre paquetes"+
        ",el número de routers y \n la MTU de la red.");
    }else{
        sValue("ipDestination",udpipserver);
        sValue("ipSource",udpipclient);
        sValue("ipTTL",64);
        sValue("idProtocol","UDP");
        parseUdp();
    };
};
    
function desc(element){
	switch(element.id) {

        case "packet_delay":
            if(element.value != null){
                var pD = parseInt(element.value);
                element.title = "Tiempo desde que se envía el paquete \n"+
                "hasta que lo recibe el servidor";
            };
            break;
        case "networkMTU" :
            var nMTU = parseInt(element.value);
            element.title = "La cantidad máxima de datos que se puede enviar \n"+
            "por la red. Hay que tener en cuenta que los paquetes añaden una \n"+
            "cantidad de datos adicionales debido a las cabeceras de los paquetes.\n"+
            "En este caso sería "+nMTU+" - 20 (Cabecera TCP) - 20 (Cabecera IP) = "+(nMTU - 40);
            break;
        case "routers_between":
        if(element.value != null){
            var rB = parseInt(element.value);
            element.title = "Este parámetro afecta principalmente a la \n"+
            "capa de re. Por cada salto, el TTL es decrementado. \n "+
            "Si el TTL inicial del paquete IP es 64 el TTL \n"+
            "final será : 64 - "+rB+" = "+(64-rB);
            }
            break;
	//HTTP
		case "httpipserver":
			element.title="Ip del servidor al que se quiere acceder";
			break;	
		case "httpipclient":
			element.title="IP del cliente que envia la petición  al servidor";
			break;
		case "httpnObjects":
			element.title="Número de objetos que el servidor enviará al cliente";
			break;
        case "httpObjectSize":
            var hOS = parseInt(element.value);
            var hnO = parseInt(document.getElementById("httpnObjects").value); 
            if(element.value != null){
                element.title = "Este es el tamaño de cada uno de los objetos que va\n"+
                "a enviar el servidor al cliente. La cantidad de datos que se enviará\n"+
                "en el protocolo TCP sería : \n"+
                "Número de objetos "+hnO+" * Tamaño/Objeto "+hOS+" = "+parseInt(hOS * hnO);
            }
            break;
	//TCP		
		case "tcpsizeOfObject":
			element.title="Tamaño de los objetos a enviar a través \n de la comunicación TCP";
			break;
		case "tcpsizeOfWindow":
			element.title="Tamaño de la ventana TCP. \n Determina cuanto tiempo se deja para recibir el ACK";
			break;
		case "tcpipserver":
			element.title="Dirección IP del servidor o destino";
			break;
		case "tcpipclient":
			element.title="Dirección IP del cliente o origen";
			break;
		case "tcpportServer":
			element.title="Puerto del servidor o destino en el \n que recibirá el paquete TCP";
			break;
		case "tcpportClient":
			element.title="Puerto del cliente o origen que envía el \n paquete TCP";
			break;
	//UDP
		case "udpsizeOfObject":
			element.title="Tamaño del objeto a enviar mediante UDP";
			break;
		case "udpipserver":
			element.title="Dirección IP del servidor o destino";
			break;
		case "udpipclient":
			element.title="Dirección IP del cliente o origen";
			break;
		case "udpportServer":
			element.title="Puerto UDP del servidor o destino";
			break;
		case "udpportClient":
			element.title="Puerto UDP del cliente o origen";
            break;
        case "tcpServerWindow":
            element.title="Ventana del servidor que recibe los paquetes\n";
            break;
        case "tcpServerInitialSequenceNumber":
            if(element.value != null){
                var tcpSISN = element.value;
                element.title = "Este es el número de secuencia inicial del servidor\n"+
                "Este número cambiará conforme el servidor envíe datos al\n"+
                "cliente. Por ejemplo, si la Unidad Máxima de Transferencia \n"+
                "es 500(460 con cabeceras), la secuencia de paquetes sería :\n"+
                "Paquete 1 : SEQ "+tcpSISN+" Data Offset 460\n"+
                "Paquete 2 : SEQ "+(parseInt(tcpSISN)+460)+" Data Offset 460\n";
            }
            break;
        case "tcpClientInitialSequenceNumber":
            if(element.value != null){
                var tcpSISN = element.value;
                element.title = "Este es el número de secuencia inicial del cliente\n"+
                "Este número cambiará conforme el cliente envíe datos al\n"+
                "servidor. Por ejemplo, si la Unidad Máxima de Transferencia \n"+
                "es 500(460 con cabeceras), la secuencia de paquetes sería :\n"+
                "Paquete 1 : SEQ "+tcpSISN+" Data Offset 460\n"+
                "Paquete 2 : SEQ "+(parseInt(tcpSISN)+460)+" Data Offset 460\n";
            }
            break;
        case "tcpAlfa":
            element.title="Variable alfa para calcular el RTT estimado \n(Predeterminado : 0.125)" 
            break;
        case "tcpBeta":
            element.title="Variable beta para calcular la derivación del RTT\n(Predeterminado : 0.25)"
            break;
        case "tcpServerTimeout":
            element.title="Timeout constante del servidor (Valores de alfa y beta serán ignorados)";
            break;
        case "tcpClientTimeout":
            element.title="Timeout constante del servidor (Valores de alfa y beta serán ignorados)";
            break;
	//IP
		case "ipDestination":
			element.title="IP de destino";
			break;
		case "ipSource":
			element.title="IP de origen";
			break;
		case "ipversion":
			element.title="Versión del protocolo IP";
			break;
		case "ipTTL":
			element.title="TTL Time To Live \n Determina cuantos saltos puede dar el paquete \n antes de que sea desechado";
			break;
		case "idProtocol":
			element.title="Protocolo de la capa superior";
			break;
	};
};

function helpDescription(element){
    var helpP = document.getElementById("helpParagraph");
    switch(element.id){
        //Global parameters
        case "parameters" : 
            helpP.innerHTML = "Has pulsado sobre los parámetros generales \n"+
            "Aquí puedes configurar el tiempo que tardan los paquetes en llegar desde el cliente al servidor"+
            "\n y viceversa. También te permite especificar el número de routers que existen entre los dos \n"+
            "equipos, lo cual afectará al TTL de los paquetes IP. Por último, puedes configurar el MTU, el cual "+
            "determina cual será la mayor unidad de transferencia de la red, es decir, cuanto puede llegar a transmitirse"+
            "\n en cada paquete";
            break;
        case "packet_delay" :
            helpP.innerHTML = "Has pulsado sobre el retraso de los paquetes\n"+
            "este parámetro determina cuanto tiempo tarda en viajar un paquete desde el servidor al cliente y viceversa\n"+
            "Este parámetro afecta especialmente a la simulación TCP";
            break;
        case "routers_between" :
            helpP.innerHTML = "Este parámetro determina el número de routers "+
            "que se encuentran entre el cliente y el servidor. Esto afecta principalmente al protocolo IP en el TTL de los"+
            "paquetes.TTL es un parámetro que va decreciendo conforme se va saltando de router en router.";
            break;
        case "networkMTU" :
            helpP.innerHTML = "Esto determina el tamaño máximo del paquete que se "+
            "puede enviar a través de la red. Afecta principalmente a los protocolos TCP, UDP y IP. "+
            "Este parámetro puede simbolizar octetos, bytes, etc...";
            break;
        //Application Layer
        case "aplicationLayer" :
            helpP.innerHTML = "En la capa de aplicación podrás realizar "+
            "simulaciones con protocolos de la capa de aplicación";
            break;
        case "httpProtocol" :
            helpP.innerHTML = "Este es el protocolo HTTP, este protocolo es una abstracción de los protocolos"+
            "de las capas inferiores para transmitir datos, en concreto hipertexto (HTML).En esta sección puedes "+
            "seleccionar los diferentes parámetros que afectan al protocolo HTTP."
            break;
        case "httpipserver" :
            helpP.innerHTML = "Esta es la dirección IP del servidor que enviará los datos al cliente."+
            "Recuerda las direcciones IP tienen formato XXX.XXX.XXX.XXX donde XXX es un número no mayor de"+
            "254";
            break;
        case "httpipclient" :
            helpP.innerHTML = "Esta es la dirección IP del cliente que recibirá los datos del servidor."+
            "Recuerda las direcciones IP tienen formato XXX.XXX.XXX.XXX donde XXX es un número no mayor de"+
            "254";
            break;
        case "httpnObjects" :
            helpP.innerHTML = "Este es el número de objetos que tiene que enviar el servidor al cliente."+
            "las páginas web están conformadas por varios elementos, de modo que cuando tu pides el HTML de una"+
            "página se envían más datos con ella(Javascript , Imagenes)."
            break;
        case "httpRequestedObject" :
            helpP.innerHTML = "Este es el objeto que el cliente quiere recibir del servidor. El cliente accede"+
            "a este dato mediante una URL. Recuerda que las url tienen el formato /folder/folder/object";
            break;
        case "httpRequestMessageBody" :
            helpP.innerHTML = "Los paquetes HTTP pueden llevar un texto adicional junto con el objeto que quieren "+
            " pedir, esto es porque en muchos casos lo que se encuentra en la URL que piden es un servidor ejecutando un"+
            " programa por eso envían una cadena de texto con condiciones sobre lo que quieren. Por ejemplo,"+
            " una cadena que usa Google cuando buscas algo es la siguiente \"search?client=ubuntu&channel=fs&q=paperjs\""
            break;
        case "httpObjectSize" :
            helpP.innerHTML = "Este es el tamaño de los objetos HTTP que enviará el servidor. Para la simulación HTTP este valor no "+
            " es muy relevante, pero determinará la cantidad de datos que se tienen que enviar en las capas inferiores."
            break;
        case "httpRequest" :
            helpP.innerHTML = "Este es el tipo de petición HTTP que el cliente está realizando al servidor. HTTP tiene una serie de peticiones"+
            " que indican el servidor que es lo que quiere el cliente, por ejemplo, GET es para que el servidor te "+
            "envíe información, POST es para enviar información al servidor, DELETE es para eliminar contenido, etc..."+
            " Para reducir la complejidad de la simulación los dos tipos disponibles son POST y GET";
            break;
        //Transport Layer
        case "transportLayer" :
            helpP.innerHTML = "En esta seccion se encuentran los protocolos de la capa de transporte. Los protocolos"+
            " disponibles actualmente en esta sección son TCP y UDP";
            break;
        case "tcpProtocol" :
            helpP.innerHTML = "El protocolo TCP es un protocolo que envía los datos a través de un canal fiable, por otra"+
            " parte su función de retransmisión de los paquetes perdidos permite recuperarse de fallos producidos en la red.";
            break;
        case "tcpsizeOfRequest" :
            helpP.innerHTML = "Este parámetro especifica el tamaño de la petición al servidor. Primero el cliente envía una "+
            "petición al servidor y este le responde con el objeto pedido. Se recomienda que el tamaño de la petición no sea un múltiplo"+
            "muy grande de la MTU (no es necesario que sea un múltiplo) para evitar que el diagrama se llene de líneas y se vuelva"+
            "incomprensible";
            break;
        case "tcpsizeOfObject" :
            helpP.innerHTML = "Este es el tamaño del objeto que el servidor va a enviar al cliente "+
            " después de que el cliente termine de enviar la petición. En una traducción de HTTP a TCP "+
            " el tamaño total del objeto a transmitir es la suma de todos los objetos HTTP que forman el objeto pedido "+
            " por el cliente."
            break;
        case "tcpipserver" :
            helpP.innerHTML = "Esta es la dirección IP del servidor. Recuerda que el formato de las direcciones IP es "+
            "XXX.XXX.XXX.XXX donde XXX es un número menor que 255";
            break;
        case "tcpipclient" :
            helpP.innerHTML = "Esta es la dirección IP del cliente. Recuerda que el formato de las direcciones IP es "+
            "XXX.XXX.XXX.XXX donde XXX es un número menor que 255";
            break;
        case "tcpportServer" :
            helpP.innerHTML = "Este es el puerto TCP del servidor. Normalmente, lo servidores escuchan en el puerto 80 para "+
            "establecer conexiones TCP, por eso está preestablecido como 80, pero puede cambiarse a otro puerto diferente."
            break;
        case "tcpportClient" :
            helpP.innerHTML = "Este es el puerto TCP del cliente. Normalmente, los puertos desde el 0 a 1024 están reservador"+
            "de modo que el resto de aplicaciones que deseen realizar una conexión TCP tienen que establecerla a través de otro "+
            "puerto."
            break;
        case "tcpServerInitialSequenceNumber" :
            helpP.innerHTML = "Este es el número de secuencia inicial para el servidor. Este número de secuencia sirve para diferenciar "+
            "los diferentes paquetes que va enviando. Si se envía datos, el número de secuencia aumenta acorde a la cantidad de datos enviada";
            break;
        case "tcpClientInitialSequenceNumber" :
            helpP.innerHTML = "Este es el número de secuencia inicial para el cliente. Este número de secuencia sirve para diferenciar "+
            "los diferentes paquetes que va enviando. Si se envía datos, el número de secuencia aumenta acorde a la cantidad de datos enviada";
            break;
        case "tcpServerWindow" :
            helpP.innerHTML = "Esta es la ventana del servidor. En TCP la ventana del servidor es la cantidad de datos que se le permite enviar al "+
            "servidor. En este caso, el dato simboliza la cantidad de paquetes que puede enviar el servidor en cada momento."
            break;
        case "tcpClientWindow" :
            helpP.innerHTML = "Esta es la ventana del cliente. En TCP la ventana del cliente es la cantidad de datos que se le permite enviar al "+
            "cliente. En este caso, el dato simboliza la cantidad de paquetes que puede enviar el cliente en cada momento."
            break;
        case "tcpAlfa" :
            helpP.innerHTML = "La variable alfa sirve para estimar el RTT, si se ha seleccionado un valor para la ventana, este valor no es necesario.";
            break;
        case "tcpBeta" :
            helpP.innerHTML = "La variable beta sirve para estimar la derivación del RTT. Si ya se ha estimado un valor para la ventana, este valor no es necesario.";
            break;
        case "tcpServerTimeout" :
            helpP.innerHTML = "Este es el timeout del servidor. Cuando el ACK de un paquete enviado no llega "+
            " y ha transcurrido una determinada cantidad de tiempo (el timeout). El paquete es reenviado.";
            break;
        case "tcpClientTimeout" :
            helpP.innerHTML = "Este es el timeout del cliente. Cuando el ACK de un paquete enviado no llega "+
            " y ha transcurrido una determinada cantidad de tiempo (el timeout). El paquete es reenviado.";
            break;
        //UDP Protocol
        case "udpProtocol" :
            helpP.innerHTML = "Estos son los parámetros para la simulación UDP."+
            "UDP es un protocolo no orientado a conexión , por lo tanto no existen timeouts ni "+
            "retransmisiones. Si no llegan todos los paquetes de petición al servidor, este no "+
            "enviará ningún dato.";
            break;
        case "udpsizeOfRequest" :
            helpP.innerHTML = "Este es el tamaño en bytes de la petición del cliente ."+
            "Para que el servidor reconozca la petición, todos los paquetes tienen que "+
            "llegar al mismo, sino, no enviará el objeto.";
            break;
        case "udpsizeOfObject" :
            helpP.innerHTML = "Este es el tamaño en bytes del objeto enviado por el servidor. "+
            "Si la petición del cliente no llega completa, el servidor no enviará el objeto pedido.";
            break;
        case "udpipserver" :
            helpP.innerHTML = "Esta es la dirección IP del servidor.  Recuerda que el formato de las direcciones IP es "+
            "XXX.XXX.XXX.XXX donde XXX es un número menor que 255";
            break;
        case "udpipclient" : 
            helpP.innerHTML = "Esta es la dirección IP del cliente.  Recuerda que el formato de las direcciones IP es "+
            "XXX.XXX.XXX.XXX donde XXX es un número menor que 255";
            break;
        case "udpportServer" :
            helpP.innerHTML = "Este es el puerto UDP del servidor. No existe un puerto predeterminado "+
            " en el protocolo UDP de modo que cualquier válido fuera de los reservador es válido.";
            break;
        case "udpportClient" :
            helpP.innerHTML = "Este es el puerto UDP del cliente. No existe un puerto predeterminado "+
            " en el protocolo UDP de modo que cualquier válido fuera de los reservador es válido.";
            break;
        //IP Protocol
        case "ipv4Protocol" :
            helpP.innerHTML = "Este es el protocolo IPv4 de la capa de red. Tanto el protocolo TCP como UDP "+
            "tienen una representación en el protocolo IP. En esta sección se muestran los parámetros que "+
            "afectan ha este protocolo."
            break;
        case "ipDestination" :
            helpP.innerHTML = "Esta es la dirección IP de destino, en este caso el servidor.";
            break;
        case "ipSource" :
            helpP.innerHTML = "Esta es la dirección IP de origen, en este caso el cliente."
            break;
        case "ipversion" :
            helpP.innerHTML = "Esta es la versión del protocolo IP. No confundir con IPv4 y IPv6."
            break;
        case "ipTTL" :
            helpP.innerHTML = "Este es el TTL(TimeToLive) de los paquetes IP. Originalmente el TTL se "+
            "pensaba en disminuir por cada segundo que pasaba desde que se enviaba el paquete hasta que se "+
            "recibía. Actualmente el valor decrece por cada salto realizado. Un salto es el paso de un router al "+
            "siguiente. Si el TTL del paquete llega a 0, este es desechado";
            break;
        case "idProtocol" :
            helpP.innerHTML = "Esta es la identificación del protocolo. Todos los paqutes llevan un identificador "+
            " para poder determinar a que protocolo corresponde el paquete";
            break;
    };
};


function autoFill(){
    sValue("packet_delay",300);
    sValue("routers_between",2);
    sValue("networkMTU",500);
    //HTTP Parameters
    sValue("httpipserver","192.168.6.123");
    sValue("httpipclient","192.168.6.26");
    sValue("httpnObjects",3);
    sValue("httpRequestedObject","/object/file.html");
    sValue("httpRequestMessageBody","?object=htmlFile&fragment=yes"); 
    sValue("httpObjectSize",500);
    sValue("httpRequest","GET");
    //TCP Parameters
    sValue("tcpsizeOfRequest", 200);
    sValue("tcpsizeOfObject", 1500);
    sValue("tcpipserver", "192.168.6.123");
    sValue("tcpipclient", "192.168.6.26");
    sValue("tcpportServer", 80);
    sValue("tcpportClient", 2356);
    sValue("tcpServerInitialSequenceNumber", 100);
    sValue("tcpClientInitialSequenceNumber", 100);
    sValue("tcpServerWindow", 3);
    sValue("tcpClientWindow", 3);
    sValue("tcpServerTimeout", 3);
    sValue("tcpClientTimeout", 3);
    //UDP Parameters
    sValue("udpsizeOfRequest", 200);
    sValue("udpsizeOfObject", 1500);
    sValue("udpipserver", "192.168.6.123");
    sValue("udpipclient", "192.168.6.26");
    sValue("udpportServer", 1560);
    sValue("udpportClient", 2653);
    //IP Parameters
    sValue("ipDestination", "192.168.6.123");
    sValue("ipSource", "192.168.6.26");
    sValue("ipversion", "1.1");
    sValue("ipTTL",64);
};