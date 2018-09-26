var canvas = document.getElementById("paperjs-canvas");
var canvas_width = parseInt( canvas.width * 0.9);
var canvas_height = parseInt( canvas.height * 0.75);
window.canvas_width = canvas_width;
window.canvas_height = canvas_height;
var client_line = parseInt(canvas_width/8);
var server_line = parseInt(canvas_width*7/8);
var tcp_packet_displayed = false;


function clear_Canvas(){
    var blankSpace = new Path.Rectangle( new Point(0,0), 
    new Point(parseInt(canvas_width), parseInt(canvas_height)));
    blankSpace.fillColor = 'white';
};

window.clear_Canvas = clear_Canvas;

function draw_simulation(){
    if(http_indicator){
        var i = 0;
        for(i = 0; i < http_array.length; i++){
            draw_http_request(http_array[i]);
        }
    }
};

window.draw_simulation = draw_simulation;

function draw_http_request(http_request){
    var request_line = new Path.Line(new Point(client_line, http_request.c_timestamp),
    new Point(server_line, http_request.s_timestamp));
    request_line.strokeColor = http_request.color;
    request_line.strokeWidth = 15;
    request_line.onMouseDown = function(event){
        var packet_explained = new PointText(event.point);
        packet_explained.content ="Mensaje HTTP:\n"+
        ""+http_request.requestT+" "+http_request.urlObject+" HTTP /1.1 \n"+
        "Date :"+http_request.date+"\n"+
        "From : "+http_request.from+"\n"+
        "To : "+http_request.host+"\n"+
        "User-Agent : "+http_request.user_agent+
        "\nCuerpo del Mensaje : \n"+http_request.body;
        packet_explained.fontSize = 26;
        packet_explained.fillColor = 'black';
        packet_explained.onMouseLeave = function(event){
            this.visible = false;
        };
    };
};

window.draw_http_request = draw_http_request;

//alert("Not Working");

function draw_lines(tcp_array,sizeProportion){
    var lineHeight = packet_delay * sizeProportion;
    var total = 0;
    while(total <= canvas_height){
        var line = new Path.Line(
            new Point(client_line, parseInt(total)),
            new Point(server_line, parseInt(total))
        );
        line.strokeWidth = 5;
        line.strokeColor = 'grey';
        line.dashArray = [30,16];
        total += lineHeight;
    }
}


function draw_server_client(){  
    var clientLine = new Path.Line(new Point(parseInt(canvas_width/8),parseInt(0)),
    new Point(parseInt(canvas_width/8),canvas_height));
    clientLine.strokeColor = 'black';
    clientLine.strokeWidth = 20;

    var serverLine = new Path.Line(new Point(parseInt(canvas_width*7/8),parseInt(0)),
    new Point(parseInt(canvas_width*7/8),canvas_height));
    serverLine.strokeColor = 'blue';
    serverLine.strokeWidth = 20;

};

window.draw_server_client = draw_server_client;


function draw_tcp_line(tcp_packet, sizeProportion){
    var tcp_packet_line = new Path.Line(
        new Point(client_line, parseInt(tcp_packet.c_timestamp * sizeProportion)),
        new Point(server_line, parseInt(tcp_packet.s_timestamp * sizeProportion))
    );
    if(tcp_packet.lost){
        tcp_packet_line.strokeColor = 'red';
    }else{
        tcp_packet_line.strokeColor = tcp_packet.color;
    }
    tcp_packet_line.strokeWidth = 12;
    if(tcp_packet.flags.toString() != [0,0,0,0,0,1].toString() && 
    tcp_packet.flags.toString() != [0,1,0,0,1,0].toString() && 
    tcp_packet.flags.toString() != [0,0,0,0,1,0].toString()){
        tcp_packet_line.onDoubleClick = function(event){
            if(this.strokeColor == tcp_packet.color){
                this.strokeColor = 'red';
                tcp_packet.lost = true;
                //console.log(tcp_array);
                recalculateSimulation();
            }else{
                this.strokeColor = tcp_packet.color;
                tcp_packet.lost = false;
            }
        };
    }
    
    var packet_explained;

    tcp_packet_line.onMouseMove = function(event){
        var lostPacket;
        if(tcp_packet.lost){
            lostPacket = "PAQUETE PERDIDO";
        }else{
            lostPacket = "";
        }
        if(!tcp_packet_displayed){
            tcp_packet_displayed = true;
            packet_explained = new PointText(event.point);
            packet_explained.content ="Paquete TCP "+lostPacket+":\n"+
            "Puerto Origen : "+tcp_packet.sourcePort+"\n"+
            "Puerto Destino : "+tcp_packet.destinationPort+"\n"+
            "Número de secuencia : "+tcp_packet.seq+"\n"+
            "Acknowledgement : "+tcp_packet.ack+"\n"+
            "Data Offset : "+tcp_packet.dOffset+"\n"+
            "Flags : "+flagsVerbose(tcp_packet.flags)+"\n"+
            "Window : "+tcp_packet.window+"\n";
            packet_explained.fontSize = 15;
            packet_explained.fillColor = 'black';
            document.getElementById("packet_info").innerHTML=packet_explained.content;
        };
    }

    tcp_packet_line.onMouseLeave = function(event){
        packet_explained.visible = false;
        tcp_packet_displayed = false;
    }
        
    var y_offset;
    if(tcp_packet.s_timestamp > tcp_packet.c_timestamp){
        y_offset = tcp_packet.s_timestamp;
    }else{
        y_offset = tcp_packet.c_timestamp;
    }
    /*
    var ackAndSeq = new PointText(
        new Point(parseInt((server_line)/2),
        (parseInt(y_offset)-20)        
        )
    );
    ackAndSeq.content = "ACK : "+tcp_packet.ack+" SEQ : "+tcp_packet.seq;
    ackAndSeq.fontSize = 12; 
    */
};

window.draw_tcp_line = draw_tcp_line;

function draw_ip_line(ip_packet, sizeProportion){
    var ip_packet_line = new Path.Line(
        new Point(client_line, parseInt(ip_packet.c_timestamp * sizeProportion)),
        new Point(server_line, parseInt(ip_packet.s_timestamp * sizeProportion))
    );
    ip_packet_line.strokeColor = "rgb("+Math.random()*255+","+Math.random()*255+","+
    Math.random()*255+")";
    ip_packet_line.strokeWidth = 15;
    
    ip_packet_line.onClick = function(event){
        var packet_explained = new PointText(event.point);
        packet_explained.content ="Paquete IP:\n"+
        "Dirección Origen : "+ip_packet.ipSource+"\n"+
        "Dirección Destino : "+ip_packet.ipDestination+"\n"+
        "TTL : "+ip_packet.TTL+"\n"+
        "Protocolo Superior : "+ip_packet.protocol+"\n"+
        "Checksum : "+ip_packet.headerChecksum+"\n"+
        "Tamaño de la cabecera: "+ip_packet.headerLength+"\n"+
        "Longitud total : "+ip_packet.totalLength+"\n";
        packet_explained.fontSize = 15;
        packet_explained.fillColor = 'black';
        packet_explained.onMouseLeave = function(event){
            this.visible = false;
            };
        };
};

window.draw_ip_line = draw_ip_line;

function draw_ip_communication(ip_communication_array){
    clear_Canvas();
    draw_server_client();
    var proportion = ((canvas_height*7/8) / (ip_communication_array[ip_communication_array.length-1].c_timestamp));
    draw_lines(ip_communication_array,proportion);
    var i = 0;
    for(i = 0; i < ip_communication_array.length; i++){
        draw_ip_line(ip_communication_array[i], proportion);
        console.log("Painting "+
        "Packet "+ i +" c_position : "+parseInt(ip_communication_array[i].c_timestamp*proportion)
        +" s_position : "+parseInt(ip_communication_array[i].s_timestamp*proportion));
    };
};

window.draw_ip_communication = draw_ip_communication;

function draw_tcp_communication(tcp_communication_array){
    clear_Canvas();
    draw_server_client();
    var proportion = (canvas_height / (tcp_communication_array[tcp_communication_array.length-1].s_timestamp));
    draw_lines(tcp_communication_array,proportion);
    console.log(proportion)
    var i = 0;
    for(i = 0; i < tcp_communication_array.length; i++){
        draw_tcp_line(tcp_communication_array[i], proportion);
        console.log("Painting "+
    "Packet "+ i +" c_position : "+parseInt(tcp_communication_array[i].c_timestamp*proportion)
+" s_position : "+parseInt(tcp_communication_array[i].s_timestamp*proportion))
    };
    
};

window.draw_tcp_communication = draw_tcp_communication;

function draw_udp_line(udp_packet, sizeProportion){
    var udp_packet_line = new Path.Line(
        new Point(client_line, parseInt(udp_packet.c_timestamp * sizeProportion)),
        new Point(server_line, parseInt(udp_packet.s_timestamp * sizeProportion))
    );
    
    var lineColor = "rgb("+Math.random()*255+","+Math.random()*255+","+
    Math.random()*255+")";
    udp_packet_line.strokeColor = lineColor;
    udp_packet_line.strokeWidth = 15;

    udp_packet_line.onClick = function(event){
        var packet_explained = new PointText(event.point);
        packet_explained.content ="Paquete UDP:\n"+
        "Puerto Origen : "+udp_packet.sourcePort+"\n"+
        "Puerto Destino : "+udp_packet.destinationPort+"\n"+
        "Longitud : "+udp_packet.length+"\n"+
        "Checksum : "+udp_packet.checksum;
        packet_explained.fontSize = 15;
        packet_explained.fillColor = 'black';
        packet_explained.onMouseLeave = function(event){
            this.visible = false;
        };
    };
    /*
    udp_packet_line.onDoubleClick = function(event){
        if(this.strokeColor == lineColor){
            this.strokeColor = 'red';
            udp_packet.lost = true;
        }else{
            this.strokeColor = lineColor;
            udp_packet.lost = false;
        }
    };
    */
};

window.draw_udp_line = draw_udp_line;

function draw_udp_communication(udp_communication_array){
    var proportion = (canvas_height / (udp_communication_array[udp_communication_array.length-1].c_timestamp));
    console.log(proportion);
    draw_lines(udp_communication_array,proportion);
    var i = 0;
    for(i = 0; i < udp_communication_array.length; i++){
        draw_udp_line(udp_communication_array[i], proportion);
        console.log("Painting "+
    "Packet "+ i +" c_position : "+parseInt(udp_communication_array[i].c_timestamp*proportion)
+" s_position : "+parseInt(udp_communication_array[i].s_timestamp*proportion));
    };
};

window.draw_udp_communication = draw_udp_communication;


/*
draw_tcp_line({
    c_timestamp : 100,
    s_timestamp : 300,
    sourcePort : 6232,
    destinationPort : 80,
    seq : 30,
    ack : 255,
    dOffset : 1480,
    flags : [0,1,0,0,1,0],
    window : 200,
    color : 'black',
    lost : false 
});
*/




function flagsVerbose(flags){
    var activatedFlags = "";
    if(flags[0] == 1){
        activatedFlags += " URG";
    }
    if(flags[1] == 1){
        activatedFlags +=" ACK";
    }
    if(flags[2] == 1){
        activatedFlags += " PSH";
    }
    if(flags[3] == 1){
        activatedFlags += " RST";
    }
    if(flags[4] == 1){
        activatedFlags += " SYN";
    }
    if(flags[5] == 1){
        activatedFlags += " FIN";
    }
    return activatedFlags;
};



/*
var packets = [];
var $packets_http = [];
var packets_tcp = [];
var packets_udp = [];
var packets_ip = [];

var simulated_packets_http = [];
var simulated_packets_tcp = [];
var simulated_packets_udp = [];
var simulated_packets_ip = [];
*/
/*
$packets_http.push({c_timestamp : 100, s_timestamp : 120, done : false});
$packets_http.push({c_timestamp : 130, s_timestamp : 200, done : false});
$packets_http.push({c_timestamp : 160, s_timestamp : 300, done : false});
$packets_http.push({c_timestamp : 300, s_timestamp : 200, done : false});
*/


/*
var i = 0;
for(i = 0; i < $packets_http.length; i++){
    var packet = {
        id : i,
        line : new Path.Line(new Point( parseInt(canvas_width/8), $packets_http[i].c_timestamp),new Point( parseInt(canvas_width*7/8), $packets_http[i].s_timestamp)),
        packet_info : $packets_http[i],
        done : false
    };
    packet.line.strokeColor = 'black';
    packet.line.strokeWidth = 10;
    console.log(i);
    console.log(packet.packet_info);
    packet.line.onClick = function(event){
        if(this.strokeColor == 'black'){
            this.strokeColor = 'red';
        }else{
            this.strokeColor = 'black';
        }
    };
};
*/

