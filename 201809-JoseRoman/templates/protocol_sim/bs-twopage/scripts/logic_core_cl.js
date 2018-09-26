var packet_delay;
var routers_between;
var networkMTU;

//Array Global variables

//HTTP
var http_array = [];
var http_indicator = false;
var httpIpServer;
var httpIpClient;
var httpnumObjects;
var httpObject;
var httpmessage;
var httptypeOfRequest;
var httpObjectSize;

//TCP
var tcp_array = [];
var tcpsizeOfRequest ;
var tcpsizeOfObject ;
var tcpSizeOfWindow ;
var tcpIpServer ;
var tcpIpClient ;
var tcpPortServer ;
var tcpPortClient ;
var tcpServerInitialSequenceNumber ;
var tcpClientInitialSequenceNumber ;
var tcpServerWindow ;
var tcpClientWindow;
var tcpAlfa ;
var tcpBeta ;
var tcpServerTimeout ;
var tcpClientTimeout ;
var tcpHeaderStaticSize;
var tcpSlowStart;
var tcpSimplified ;
var tcpPersistent ;

function checkTimeServer(tcp_packet_timestamp,time){
    if(tcp_packet_timestamp > time){
        return false;
    }else{
        return true;
    }
};

function checkTimeClient(tcp_packet_timestamp,time){
    if(tcp_packet_timestamp > time){
        return false;
    }else{
        return true;
    }
};


function checkIP(ipAddress){
    var addressSplited = ipAddress.split("\.");
    if(addressSplited.length < 4){
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
 


function parseHttp(nObjects){
    clear_Canvas();
    draw_server_client();
    var http_request_array = [];
    var i = 0;
    var canvas = document.getElementById("paperjs-canvas");
    var width = canvas.width;
    var height = canvas.height;
    for (i = 0; i < nObjects; i++){
        var lineColor = "rgb("+Math.random()*255+","+Math.random()*255+","+
        Math.random()*255+")";
        var d = new Date();
        http_request_array.push(
            {
                c_timestamp : parseInt((height/(nObjects*2))*(1*i)),
                s_timestamp : parseInt((height/(nObjects*2))*(1+1*i)),
                requestT : httptypeOfRequest,
                urlObject : httpObject+"\\"+i+".html",
                date : d,
                host : "Server("+httpIpClient+")",
                from : "Client("+httpIpServer+")",
                body : httpmessage,
                user_agent : navigator.userAgent,
                color : lineColor
            }
        );
        var n = new Date();
        if(httptypeOfRequest == 'GET'){
            http_request_array.push(
                {
                    c_timestamp : parseInt((height/(nObjects*2))*(1*i) + 2*(height/(nObjects*2))),
                    s_timestamp : parseInt((height/(nObjects*2))*(1+1*i)),
                    requestT : "200 OK",
                    urlObject : httpObject+"\\"+i+".html",
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

function parseTcp(){
    var initialCSequence = tcpClientInitialSequenceNumber;
    var initialSSequence = tcpServerInitialSequenceNumber;
    var nMTU = networkMTU;
    var requestToTransmit = tcpsizeOfRequest;
    var dataToTransmit = tcpsizeOfObject;
    var nROuters = routers_between;
    var timeUnit = parseInt((packet_delay)*4000/canvas_height);
    var sTimeout = tcpServerTimeout;
    var cTimeout = tcpClientTimeout;
    var isLowStart = tcpSlowStart;


    //var isAckDelayed = tcpAckDelayed;
    var clientWaitingForACK = [];
    var clientReceived = [];
    var clientTimeouts = [];

    var serverWaitingForACK = [];
    var serverReceived = [];
    var serverTimeouts = [];
    var actualTime = 0;
    var clientWindow = tcpClientWindow;
    var serverWindow = tcpServerWindow;

    var cNextACKExpected = -1;
    var sNextACKExpected = -1;

    /*
    //
    tcp_array.push({
        c_timestamp : 0,
        s_timestamp : timeUnit,
        sourcePort : tcpPortClient,
        destinationPort : tcpPortServer,
        seq : initialCSequence,
        ack : "NULL",
        dOffset : "NULL",
        flags : [0,0,0,0,1,0],
        window : tcpClientWindow,
        color : 'black',
        lost : false
    });
    tcpClientWindow--;

    tcp_array.push({
        c_timestamp : parseInt(timeUnit)*2,
        s_timestamp : parseInt(timeUnit),
        sourcePort : tcpPortServer,
        destinationPort : tcpPortClient,
        seq : initialSSequence,
        ack : parseInt(initialCSequence)+1,
        dOffset : "NULL",
        flags : [0,1,0,0,1,0],
        window : tcpServerWindow,
        color : 'black',
        lost : false
    });

    tcpClientWindow++;
    tcpServerWindow--;
    
    tcp_array.push({
        c_timestamp : parseInt(timeUnit*2),
        s_timestamp : parseInt(timeUnit*3),
        sourcePort : tcpPortServer,
        destinationPort : tcpPortClient,
        seq : parseInt(initialCSequence)+1,
        ack : parseInt(initialSSequence)+1,
        dOffset : "NULL",
        flags : [0,0,0,0,1,0],
        window : null,
        color : 'black',
        lost : false
    });

    tcpClientWindow--;
    tcpServerWindow++;



    var cSeq = parseInt(initialCSequence)+1;
    var sSeq = parseInt(initialSSequence)+1;

    var requestTransmited = 0;
    var dataTransmited = 0;

    if(tcpClientWindow > 0 ){
        requestToTransmit -= dataPerPacket;
        requestTransmited += dataPerPacket;
        tcp_array.push({
            c_timestamp : actualTime,
            s_timestamp : actualTime + timeUnit,
            sourcePort : tcpPortServer,
            destinationPort : tcpPortClient,
            seq : cSeq,
            ack : sSeq,
            dOffset : requestTransmited,
            flags : [0,0,0,0,1,0],
            window : tcpClientWindow,
            color : pColor,
            lost : false
        });
        serverReceived.push({
            c_timestamp : actualTime,
            s_timestamp : actualTime + timeUnit,
            sourcePort : tcpPortServer,
            destinationPort : tcpPortClient,
            seq : cSeq,
            ack : sSeq,
            dOffset : requestTransmited,
            flags : [0,0,0,0,1,0],
            window : tcpClientWindow,
            color : pColor,
            lost : false
        });
        clientWaitingForACK.push({
            c_timestamp : actualTime,
            s_timestamp : actualTime + timeUnit,
            sourcePort : tcpPortServer,
            destinationPort : tcpPortClient,
            seq : cSeq,
            ack : sSeq,
            dOffset : requestTransmited,
            flags : [0,0,0,0,1,0],
            window : tcpClientWindow,
            color : pColor,
            lost : false
        });
        //tcpClientWindow--;
        cSeq += dataPerPacket;
    };

    while(requestToTransmit > 0){
        var pColor = "rgb("+Math.random()*255+","+Math.random()*255+","+
        Math.random()*255+")";
        if(tcpClientWindow > 0 && clientReceived.length > 0  && clientReceived[0].c_timestamp <= actualTime){
            requestToTransmit -= dataPerPacket;
            requestTransmited += dataPerPacket;
            tcp_array.push({
                c_timestamp : actualTime,
                s_timestamp : actualTime + timeUnit,
                sourcePort : tcpPortServer,
                destinationPort : tcpPortClient,
                seq : cSeq,
                ack : sSeq,
                dOffset : requestTransmited,
                flags : [0,0,0,0,1,0],
                window : tcpClientWindow,
                color : pColor,
                lost : false
            });
            serverReceived.push({
                c_timestamp : actualTime,
                s_timestamp : actualTime + timeUnit,
                sourcePort : tcpPortServer,
                destinationPort : tcpPortClient,
                seq : cSeq,
                ack : sSeq,
                dOffset : requestTransmited,
                flags : [0,0,0,0,1,0],
                window : tcpClientWindow,
                color : pColor,
                lost : false
            });
            clientWaitingForACK.push({
                c_timestamp : actualTime,
                s_timestamp : actualTime + timeUnit,
                sourcePort : tcpPortServer,
                destinationPort : tcpPortClient,
                seq : cSeq,
                ack : sSeq,
                dOffset : requestTransmited,
                flags : [0,0,0,0,1,0],
                window : tcpClientWindow,
                color : pColor,
                lost : false
            });
            //tcpClientWindow--;
            cSeq += dataPerPacket;
        };

        if(tcpServerWindow > 0 && serverReceived.length > 0){
            if(serverReceived[0].s_timestamp == actualTime){
                var packet_Received = serverReceived[0];
                clientWaitingForACK.splice(0,1);
                serverReceived.splice(0,1);
                tcp_array.push({
                    c_timestamp : actualTime + timeUnit,
                    s_timestamp : actualTime,
                    sourcePort : tcpPortServer,
                    destinationPort : tcpPortClient,
                    seq : sSeq,
                    ack : packet_Received.seq,
                    dOffset : 0,
                    flags : [0,0,0,0,1,0],
                    window : tcpServerWindow,
                    color : packet_Received.color,
                    lost : false
                });
                serverWaitingForACK.push({
                    c_timestamp : actualTime + timeUnit,
                    s_timestamp : actualTime,
                    sourcePort : tcpPortServer,
                    destinationPort : tcpPortClient,
                    seq : sSeq,
                    ack : packet_Received.seq,
                    dOffset : 0,
                    flags : [0,0,0,0,1,0],
                    window : tcpServerWindow,
                    color : packet_Received.color,
                    lost : false
                });
                clientReceived.push({
                    c_timestamp : actualTime + timeUnit,
                    s_timestamp : actualTime,
                    sourcePort : tcpPortServer,
                    destinationPort : tcpPortClient,
                    seq : sSeq,
                    ack : packet_Received.seq,
                    dOffset : 0,
                    flags : [0,0,0,0,1,0],
                    window : tcpServerWindow,
                    color : packet_Received.color,
                    lost : false
                });
                //tcpServerWindow--;
                //tcpClientWindow++;
            }
        };

        actualTime += timeUnit;

    };
    draw_tcp_communication(tcp_array);
    /*
    while(dataToTransmit > 0){
        if(sNextACKExpected == -1){
            console.log("Servidor : No se espera ningún paquete");
        }else{

        }
    }; 
    */
   console.log(tcp_array);

   var addedHeaders = 40; //Can be changed in the future to soport
   //options in the different protocols
   var dataPerPacket = parseInt(nMTU - addedHeaders);

   var globalParameters = ({
        initialCSequence : tcpClientInitialSequenceNumber,
        initialSSequence : tcpServerInitialSequenceNumber,
        nMTU : networkMTU,
        requestToTransmit : tcpsizeOfRequest,
        dataToTransmit : tcpsizeOfObject,
        nRouters : routers_between,
        timeUnit : parseInt((packet_delay)*4000/canvas_height),
        actualTime : 0,
        sTimeout : tcpServerTimeout,
        cTimeout : tcpClientTimeout,
        isLowStart : tcpSlowStart
   }); 

    //New test of implementation
    var server = ({
        actualSequence : initialSSequence,
        actualACK : 0,
        actualDataOffset : 0,
        dataToTransfer : requestToTransmit,
        sourcePort : tcpPortServer,
        waitingForACK : [],
        received : [],
        timeouts : [],
        connected : false,
        started : false
    });

    //New test of implementation
    var client = ({
        actualSequence : initialCSequence,
        actualACK : 0,
        actualDataOffset : dataPerPacket,
        dataToTransfer : dataToTransmit,
        sourcePort : tcpPortClient,
        waitingForACK : [],
        received : [],
        timeouts : [],
        connected : false,
        started : false
    });

    while(client.dataToTransfer > 0 || server.dataToTransfer > 0){
        tcpReaction(server,client,globalParameters,false,false);
        tcpReaction(client,server,globalParameters,true,true);
        globalParameters.actualTime += timeUnit;
    };
    console.log(tcp_array);

};






function httpsubmit() {
    httpIpServer = document.getElementById("httpipserver").value;
    httpIpClient = document.getElementById("httpipclient").value;
    httpnumObjects = document.getElementById("httpnObjects").value;
    httpObject = document.getElementById("httpRequestedObject").value;
    httpmessage = document.getElementById("httpRequestMessageBody").value;
    httptypeOfRequest = document.getElementById("httpRequest").value;
    httpObjectSize = document.getElementById("httpObjectSize").value;
    if(!checkIP(httpIpServer)){
        alert("Error : La IP del servidor "+httpIpServer+" no es correcta.");
    }else if (!checkIP(httpIpClient)){
        alert("Error : La IP del cliente "+httpIpClient+" no es correcta");
    }else if((parseInt)<= 0){
        alert("Error : Número de objetos HTTP pedidos es menor o igual a cero")
    }else if(parseInt(httpObjectSize)<=0){
        alert("Error : Tamaño del objeto menor o igual que cero");
    }else{
        packet_delay = document.getElementById("packet_delay").value;
        routers_between = document.getElementById("routers_between").value;
        networkMTU = document.getElementById("networkMTU").value;
        document.getElementById("tcpipserver").value = httpIpServer;
        document.getElementById("tcpipclient").value = httpIpClient;
        document.getElementById("tcpportServer").value = 80;
        document.getElementById("tcpportClient").value = Math.floor(Math.random()*65535) +1025;
        document.getElementById("tcpServerInitialSequenceNumber").value = Math.floor(Math.random()*100 + 1);
        document.getElementById("tcpClientInitialSequenceNumber").value = Math.floor(Math.random()*100 + 1);
        document.getElementById("tcpPersistent").value = true;
        document.getElementById("ipDestination").value = httpIpServer;
        document.getElementById("ipSource").value = httpIpClient;
        //document.getElementById("ipversion").value = 0
        document.getElementById("ipTTL").value = 64;
        document.getElementById("idProtocol").value = "TCP";
        /*
        window.localStorage.tcpipserver = document.getElementById("tcpipserver").value;
        window.localStorage.tcpipclient = document.getElementById("tcpipclient").value;
        window.localStorage.tcpPortServer = 80;
        window.localStorage.tcpPortClient = document.getElementById("tcpportClient").value;
        window.localStorage.tcpInitialSequenceNumber = document.getElementById("tcpInitialSequenceNumber").value;
        window.localStorage.tcpPersistent = document.getElementById("tcpPersistent").value;
        window.localStorage.ipDestination = document.getElementById("ipDestination").value;
        window.localStorage.ipSource = document.getElementById("ipSource").value;
        window.localStorage.ipTTL = document.getElementById("ipTTL").value;*/
        parseHttp(httpnumObjects);
    };


	/*window.localStorage.httpipserver = document.getElementById("httpipserver").value;
	window.localStorage.httpipclient = document.getElementById("httpipclient").value;
	window.localStorage.httpnObjects = document.getElementById("httpnObjects").value;
	document.getElementById("tcpsizeOfObject").value = 100 * window.localStorage.httpnObjects;
	document.getElementById("tcpipclient").value = window.localStorage.httpipclient;
	document.getElementById("tcpipserver").value = window.localStorage.httpipserver;
	document.getElementById("tcpportServer").value = 80;
	document.getElementById("tcpportClient").value = 80;
	document.getElementById("udpsizeOfObject").value = 100 * window.localStorage.httpnObjects;
	document.getElementById("udpipclient").value = "HTTP no utiliza UDP";
	document.getElementById("udpipserver").value = "HTTP no utiliza UDP";
	document.getElementById("udpportServer").value = "HTTP no utiliza UDP";
	document.getElementById("udpportClient").value = "HTTP no utiliza UDP";
	document.getElementById("ipDestination").value = window.localStorage.httpipserver;
	document.getElementById("ipSource").value = window.localStorage.httpipclient;
	document.getElementById("idProtocol").value = "TCP";*/
	//console.log(document.getElementById("httpipserver").value);
	//console.log(document.getElementById("httpipclient").value);
	//console.log(document.getElementById("httpnObjects").value);
    };
    
function tcpsubmit(){
    tcpsizeOfRequest = document.getElementById("tcpsizeOfRequest").value;
    tcpsizeOfObject = document.getElementById("tcpsizeOfObject").value;
    tcpSizeOfWindow = document.getElementById("tcpsizeOfWindow").value;
    tcpIpServer = document.getElementById("tcpipserver").value;
    tcpIpClient = document.getElementById("tcpipclient").value;
    tcpPortServer = document.getElementById("tcpportServer").value;
    tcpPortClient = document.getElementById("tcpportClient").value;
    tcpServerInitialSequenceNumber = document.getElementById("tcpServerInitialSequenceNumber").value;
    tcpClientInitialSequenceNumber = document.getElementById("tcpClientInitialSequenceNumber").value;
    tcpServerWindow = document.getElementById("tcpServerWindow").value;
    tcpClientWindow = document.getElementById("tcpClientWindow").value;
    tcpAlfa = document.getElementById("tcpAlfa").value;
    tcpBeta = document.getElementById("tcpBeta").value;
    tcpServerTimeout = document.getElementById("tcpServerTimeout").value;
    tcpClientTimeout = document.getElementById("tcpClientTimeout").value;
    tcpSlowStart = document.getElementById("tcpSlowStart").value;
    tcpSimplified = document.getElementById("tcpSimplified").value;
    tcpPersistent = document.getElementById("tcpPersistent").value;
    packet_delay = document.getElementById("packet_delay").value;
    routers_between = document.getElementById("routers_between").value;
    networkMTU = document.getElementById("networkMTU").value;

    if(parseInt(tcpsizeOfObject)<= 0){
        alert("Error : El tamaño del objeto es menor o igual que cero")
    }else if(!checkIP(tcpIpServer)){
        alert("Error : IP del servidor incorrecta");
    }else if(!checkIP(tcpIpClient)){
        alert("Error : IP del cliente incorrecta");
    }else if(!checkPort(tcpPortServer)){
        alert("Error : Puerto del servidor incorrecto");
    }else if(!checkPort(tcpPortClient)){
        alert("Error : Puerto del cliente incorrecto");
    }/*else if(tcpSequenceNumber < 0){
        alert("Error : Número de secuencia inicial menor que cero");
    }*/else if(tcpsizeOfObject <= 0){
        alert("Error : Tamaño del objeto menor o igual que cero");
    }else if(tcpSizeOfWindow < 0){
        alert("Error : Tamaño de la ventana menor que cero");
    }else if(packet_delay == null || routers_between == null || networkMTU == null){
        alert("Error : Se tiene que especificar el retardo entre paquetes"+
        ",el número de routers y \n la MTU de la red.");
    }else{
        /*
        window.localStorage.tcpSizeOfObject = tcpSizeOfObject;
        window.localStorage.tcpSizeOfWindow = tcpSizeOfWindow;
        window.localStorage.tcpIpServer = tcpIpServer;
        window.localStorage.tcpIpClient = tcpIpClient;
        window.localStorage.tcpPortServer = tcpPortServer;
        window.localStorage.tcpPortClient = tcpPortClient;
        window.localStorage.tcpSequenceNumber = tcpSequenceNumber;
        window.localStorage.tcpPersistentConection = tcpPersistentConection;
        */

        document.getElementById("httpnObjects").value = 1;
        document.getElementById("httpipserver").value = tcpIpServer;
        document.getElementById("httpipclient").value = tcpIpClient;
        document.getElementById("httpRequest").value = "GET";
        document.getElementById("ipDestination").value = tcpIpServer;
        document.getElementById("ipSource").value = tcpIpClient;
        document.getElementById("ipTTL").value = 64;
        window.localStorage.httpnObjects = 1;
        window.localStorage.httpipserver = tcpIpServer;
        window.localStorage.httpipclient = tcpIpClient;
        window.localStorage.httpRequest = "GET";
        window.localStorage.ipDestination = tcpIpServer;
        window.localStorage.ipSource = tcpIpClient;
        window.localStorage.ipTTL = 64;
        //tcp_handshake();
        parseTcp();
    };

};

function udpsubmit(){
    var udpipserver = document.getElementById("udpipserver").value;
    var udpipclient = document.getElementById("udpipclient").value;
    var udpportServer = document.getElementById("udpportServer").value;
    var udpportClient = document.getElementById("udpportClient").value;
    
    if(!checkIP(udpipserver)){
        alert("Error : IP del servidor no válida");
    }else if(!checkIP(udpipclient)){
        alert("Error : IP del cliente no es válida");
    }else if(!checkPort(udpportServer)){
        alert("Error : Puerto del servidor no válido");
    }else if(!checkPort(udpportClient)){
        alert("Error : Puerto del cliente no válido")
    }else{
        packet_delay = document.getElementById("packet_delay").value;
        routers_between = document.getElementById("routers_between").value;
        networkMTU = document.getElementById("networkMTU").value;
        document.getElementById("ipDestination").value = udpipserver;
        document.getElementById("ipSource").value = udpipclient;
        document.getElementById("ipTTL").value = 64;
        document.getElementById("idProtocol").value = "UDP";
    }
};


function desc(element){
	switch(element.id) {

        case "packet_delay":
            element.title="Retraso constante de los paquetes(poner t al final)\n"+
            "Velocidad de transferencia en byte/s (Poner s al final)";
            break;
        case "networkMTU" :
            element.title= "Es la cantidad de datos que se pueden transmitir a \n"+
            "nivel de red. Este dato es necesario para saber cuantos datos se transmiten,\n"+
            "por ejemplo, en TCP, ya que en abstracciones como HTTP no es tan necesario".
            break;
        case "routers_between":
            element.title= "Número de routers entre origen y destino";
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
		case "httpRequest":
			element.title="Diferentes tipos de peticiones que puede \n enviar un cliente al servidor o viceversa";
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
            element.title="Ventana del servidor que recibe los paquetes\n"+
            "Se puede establecer como un máximo de paquetes (p)\n"+
            "Se puede establecer como un máximo de bytes (b)\n"+
            "Se puede establecer como infinito (introducir infinite)";
            break;
        case "tcpServerInitialSequenceNumber":
            element.title="Número de secuencia inicial del servidor";
            break;
        case "tcpClientInitialSequenceNumber":
            element.title="Número de secuencia inicial del cliente";
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



/*
function tcp_handshake(){
    fs_seq = tcpServerInitialSequenceNumber;
    fc_seq = tcpClientInitialSequenceNumber;
    draw_tcp_line({
        c_timestamp : 100,
        s_timestamp : 200,
        sourcePort : tcpPortClient,
        destinationPort : tcpPortServer,
        seq : fc_seq,
        ack : "NULL",
        dOffset : "NULL",
        flags : [0,0,0,0,1,0],
        window : null,
        color : 'black',
        lost : false
    });

    draw_tcp_line({
        c_timestamp : 300,
        s_timestamp : 200,
        sourcePort : tcpPortServer,
        destinationPort : tcpPortClient,
        seq : fs_seq,
        ack : parseInt(fc_seq)+1,
        dOffset : "NULL",
        flags : [0,1,0,0,1,0],
        window : null,
        color : 'black',
        lost : false
    });
    
    draw_tcp_line({
        c_timestamp : 300,
        s_timestamp : 400,
        sourcePort : tcpPortServer,
        destinationPort : tcpPortClient,
        seq : parseInt(fc_seq)+1,
        ack : parseInt(fs_seq)+1,
        dOffset : "NULL",
        flags : [0,0,0,0,1,0],
        window : null,
        color : 'black',
        lost : false
    });
};

function closing_connection(){

}

*/

function tcpReaction(host, remote, globalParameters, startConection, client){
    var cModifier = 0;
    var sModifier = 0;
    var start = startConection;
    if(client == true){
        cModifier = 0;
        sModifier = 1;
    }else {
        cModifier = 1;
        sModifier = 0;
    };

    //TCP Connection Reactions

    if(start == true && !host.started){
        remote.received.push({
            c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
            s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
            sourcePort : host.sourcePort,
            destinationPort : remote.sourcePort,
            seq : host.actualSequence,
            ack : host.actualACK,
            dOffset : 0,
            flags : [0,0,0,0,1,0],
            window : tcpServerWindow,
            color : 'black',
            lost : false
        });
        host.waitingForACK.push({
            c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
            s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
            sourcePort : host.sourcePort,
            destinationPort : remote.sourcePort,
            seq : host.actualSequence,
            ack : host.actualACK,
            dOffset : 0,
            flags : [0,0,0,0,1,0],
            window : tcpServerWindow,
            color : 'black',
            lost : false
        });
        tcp_array.push({
            c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
            s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
            sourcePort : host.sourcePort,
            destinationPort : remote.sourcePort,
            seq : host.actualSequence,
            ack : host.actualACK,
            dOffset : 0,
            flags : [0,0,0,0,1,0],
            window : tcpServerWindow,
            color : 'black',
            lost : false
        });
        host.started = true;
    }else if(!host.connected  && host.received.length > 0 && checkTimeServer(host.received[0].s_timestamp, globalParameters.actualTime) && host.received[0].flags.toString() == [0,0,0,0,1,0].toString() && host.waitingForACK.length == 0){
        remote.received.push({
            c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
            s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
            sourcePort : host.sourcePort,
            destinationPort : remote.sourcePort,
            seq : host.actualSequence,
            ack : parseInt(host.received[0].seq) + 1,
            dOffset : 0,
            flags : [0,1,0,0,1,0],
            window : tcpServerWindow,
            color : host.received[0].color,
            lost : false
        });
        host.waitingForACK.push({
            c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
            s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
            sourcePort : host.sourcePort,
            destinationPort : remote.sourcePort,
            seq : host.actualSequence,
            ack : parseInt(host.received[0].seq) + 1,
            dOffset : 0,
            flags : [0,1,0,0,1,0],
            window : tcpServerWindow,
            color : host.received[0].color,
            lost : false
        });
        tcp_array.push({
            c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
            s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
            sourcePort : host.sourcePort,
            destinationPort : remote.sourcePort,
            seq : host.actualSequence,
            ack : parseInt(host.received[0].seq) + 1,
            dOffset : 0,
            flags : [0,1,0,0,1,0],
            window : tcpServerWindow,
            color : host.received[0].color,
            lost : false
        });
    }else if(!host.connected && host.received.length > 0 && host.received[0].flags.toString() == [0,1,0,0,1,0].toString() 
        && checkTimeClient(host.received[0].c_timestamp,globalParameters.actualTime) && host.waitingForACK[0].flags.toString() == [0,0,0,0,1,0].toString() ){
        host.actualSequence++; 
        remote.received.push({
            c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
            s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
            sourcePort : host.sourcePort,
            destinationPort : remote.sourcePort,
            seq : host.actualSequence,
            ack : parseInt(host.received[0].seq) + 1,
            dOffset : 0,
            flags : [0,1,0,0,0,0],
            window : tcpServerWindow,
            color : host.received[0].color,
            lost : false
        });
        tcp_array.push({
            c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
            s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
            sourcePort : host.sourcePort,
            destinationPort : remote.sourcePort,
            seq : host.actualSequence,
            ack : parseInt(host.received[0].seq) + 1,
            dOffset : 0,
            flags : [0,1,0,0,0,0],
            window : tcpServerWindow,
            color : host.received[0].color,
            lost : false
        });
        console.log("Connected");
        host.actualACK = parseInt(host.received[0].seq) + 1;
        host.waitingForACK.splice(0,2);
        host.received.splice(0,1);
        host.connected = true;
    }else if(!host.connected && host.received.length > 0  && host.waitingForACK.length > 0  && host.waitingForACK[0].flags.toString() == [0,1,0,0,1,0].toString() && checkTimeServer(host.received[0].s_timestamp, globalParameters.actualTime)){
        host.actualSequence++; 
        host.received.splice(0,2);
        host.waitingForACK.splice(0,1);
        host.connected = true;
        console.log("Server connected");
    }else if(host.connected){ 
            if(timeoutExists(host.timeouts)){
                var i = 0;
                while(timeouts[i] > 0){
                    i++
                };
                remote.received.push({
                    c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
                    s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
                    sourcePort : host.sourcePort,
                    destinationPort : remote.sourcePort,
                    seq : host.waitingForACK[i].seq,
                    ack : host.waitingForACK[i].ack,
                    dOffset : 0,
                    flags : [0,1,0,0,0,0],
                    window : tcpServerWindow,
                    color : host.waitingForACK[i].color,
                    lost : false
                });
                tcp_array.received.push({
                    c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
                    s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
                    sourcePort : host.sourcePort,
                    destinationPort : remote.sourcePort,
                    seq : host.waitingForACK[i].seq,
                    ack : host.waitingForACK[i].ack,
                    dOffset : 0,
                    flags : [0,1,0,0,0,0],
                    window : tcpServerWindow,
                    color : host.waitingForACK[i].color,
                    lost : false
                });
                timeouts[i] = tcpClientTimeout;
        }else if(host.received.length > 0  && host.waitingForACK.length > 0 && host.received[host.received.length - 1].ack != host.waitingForACK[0].seq){
            remote.received.push({
                c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
                s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
                sourcePort : host.sourcePort,
                destinationPort : remote.sourcePort,
                seq : host.waitingForACK[0].seq,
                ack : host.waitingForACK[0].ack,
                dOffset : 0,
                flags : [0,1,0,0,0,0],
                window : tcpServerWindow,
                color : host.waitingForACK[0].color,
                lost : false
            });
            tcp_array.push({
                c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
                s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
                sourcePort : host.sourcePort,
                destinationPort : remote.sourcePort,
                seq : host.waitingForACK[0].seq,
                ack : host.waitingForACK[0].ack,
                dOffset : 0,
                flags : [0,1,0,0,0,0],
                window : tcpServerWindow,
                color : host.waitingForACK[0].color,
                lost : false
            });
        }else if(client){
            if(host.dataToTransfer > 0 && host.waitingForACK.length == 0){ //seq y ack y checkear tiempo
                host.actualSequence += host.actualDataOffset;
                host.dataToTransfer -= host.actualDataOffset;
                var lineColor = "rgb("+Math.random()*255+","+Math.random()*255+","+
            Math.random()*255+")";
                remote.received.push({
                    c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
                    s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
                    sourcePort : host.sourcePort,
                    destinationPort : remote.sourcePort,
                    seq : host.actualSequence,
                    ack : host.actualACK,
                    dOffset : host.actualDataOffset,
                    flags : [0,1,0,0,0,0],
                    window : tcpServerWindow,
                    color : lineColor,
                    lost : false
                });
                host.waitingForACK.push({
                    c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
                    s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
                    sourcePort : host.sourcePort,
                    destinationPort : remote.sourcePort,
                    seq : host.actualSequence,
                    ack : host.actualACK,
                    dOffset : host.actualDataOffset,
                    flags : [0,1,0,0,0,0],
                    window : tcpServerWindow,
                    color : lineColor,
                    lost : false
                });
                tcp_array.push({
                    c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
                    s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
                    sourcePort : host.sourcePort,
                    destinationPort : remote.sourcePort,
                    seq : host.actualSequence,
                    ack : host.actualACK,
                    dOffset : host.actualDataOffset,
                    flags : [0,1,0,0,0,0],
                    window : tcpServerWindow,
                    color : lineColor,
                    lost : false
                });
                console.log(host.dataToTransfer);
            }else if(host.dataToTransfer > 0 && host.waitingForACK > 0 && host.received[0].ack == host.waitingForACK[0].seq && checkTimeClient(host.received[0].c_timestamp,globalParameters.actualTime) ){
                host.actualSequence += host.actualDataOffset;
                host.dataToTransfer -= host.actualDataOffset;
                host.actualACK = parseInt(host.received[0].seq);
                host.waitingForACK.splice(0,1);
                host.received.splice(0,1);
                var lineColor = "rgb("+Math.random()*255+","+Math.random()*255+","+
            Math.random()*255+")";
                remote.received.push({
                    c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
                    s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
                    sourcePort : host.sourcePort,
                    destinationPort : remote.sourcePort,
                    seq : host.actualSequence,
                    ack : host.actualACK,
                    dOffset : host.actualDataOffset,
                    flags : [0,1,0,0,0,0],
                    window : tcpServerWindow,
                    color : lineColor,
                    lost : false
                });
                host.waitingForACK.push({
                    c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
                    s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
                    sourcePort : host.sourcePort,
                    destinationPort : remote.sourcePort,
                    seq : host.actualSequence,
                    ack : host.actualACK,
                    dOffset : host.actualDataOffset,
                    flags : [0,1,0,0,0,0],
                    window : tcpServerWindow,
                    color : lineColor,
                    lost : false
                });
                tcp_array.push({
                    c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
                    s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
                    sourcePort : host.sourcePort,
                    destinationPort : remote.sourcePort,
                    seq : host.actualSequence,
                    ack : host.actualACK,
                    dOffset : host.actualDataOffset,
                    flags : [0,1,0,0,0,0],
                    window : tcpServerWindow,
                    color : lineColor,
                    lost : false
                });
            }else if(host.received.length > 0 && host.dataToTransfer <= 0 && checkTimeClient(host.received[0].c_timestamp, globalParameters.actualTime)){
                host.actualACK = parseInt(host.received[0].seq);
                var lineColor = host.received[0].color;
                host.waitingForACK.splice(0,1);
                host.received.splice(0,1);
                remote.received.push({
                    c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
                    s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
                    sourcePort : host.sourcePort,
                    destinationPort : remote.sourcePort,
                    seq : host.actualSequence,
                    ack : host.actualACK,
                    dOffset : host.actualDataOffset,
                    flags : [0,1,0,0,0,0],
                    window : tcpServerWindow,
                    color : lineColor,
                    lost : false
                });
                host.waitingForACK.push({
                    c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
                    s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
                    sourcePort : host.sourcePort,
                    destinationPort : remote.sourcePort,
                    seq : host.actualSequence,
                    ack : host.actualACK,
                    dOffset : host.actualDataOffset,
                    flags : [0,1,0,0,0,0],
                    window : tcpServerWindow,
                    color : lineColor,
                    lost : false
                });
                tcp_array.push({
                    c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
                    s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
                    sourcePort : host.sourcePort,
                    destinationPort : remote.sourcePort,
                    seq : host.actualSequence,
                    ack : host.actualACK,
                    dOffset : host.actualDataOffset,
                    flags : [0,1,0,0,0,0],
                    window : tcpServerWindow,
                    color : lineColor,
                    lost : false
                });
            }else{
                //console.log("Cliente : No hacer nada");
            };
        }else{
            //terminar servidor
            if(host.dataToTransfer > 0  && host.received.length == 0 && remote.dataToTransfer <= 0 && checkTimeServer(host.received[0].s_timestamp,globalParameters.actualTime)){
                host.actualSequence += host.actualDataOffset;
                host.dataToTransfer -= host.actualDataOffset;
                remote.received.push({
                    c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
                    s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
                    sourcePort : host.sourcePort,
                    destinationPort : remote.sourcePort,
                    seq : host.actualSequence,
                    ack : host.actualACK,
                    dOffset : host.actualDataOffset,
                    flags : [0,1,0,0,0,0],
                    window : tcpServerWindow,
                    color : host.waitingForACK[0].color,
                    lost : false
                });
                host.waitingForACK.push({
                    c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
                    s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
                    sourcePort : host.sourcePort,
                    destinationPort : remote.sourcePort,
                    seq : host.actualSequence,
                    ack : host.actualACK,
                    dOffset : host.actualDataOffset,
                    flags : [0,1,0,0,0,0],
                    window : tcpServerWindow,
                    color : host.waitingForACK[0].color,
                    lost : false
                });
                tcp_array.push({
                    c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
                    s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
                    sourcePort : host.sourcePort,
                    destinationPort : remote.sourcePort,
                    seq : host.actualSequence,
                    ack : host.actualACK,
                    dOffset : host.actualDataOffset,
                    flags : [0,1,0,0,0,0],
                    window : tcpServerWindow,
                    color : host.waitingForACK[0].color,
                    lost : false
                });
            }else if(host.dataToTransfer > 0 && remote.dataToTransfer <= 0 && checkTimeServer(host.received[0].s_timestamp,globalParameters.actualTime) ){
                host.actualSequence += host.actualDataOffset;
                host.dataToTransfer -= host.actualDataOffset;
                host.actualACK = parseInt(host.received[0].seq);
                host.waitingForACK.splice(0,1);
                host.received.splice(0,1);
                var lineColor = "rgb("+Math.random()*255+","+Math.random()*255+","+
            Math.random()*255+")";
                remote.received.push({
                    c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
                    s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
                    sourcePort : host.sourcePort,
                    destinationPort : remote.sourcePort,
                    seq : host.actualSequence,
                    ack : host.actualACK,
                    dOffset : host.actualDataOffset,
                    flags : [0,1,0,0,0,0],
                    window : tcpServerWindow,
                    color : lineColor,
                    lost : false
                });
                host.waitingForACK.push({
                    c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
                    s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
                    sourcePort : host.sourcePort,
                    destinationPort : remote.sourcePort,
                    seq : host.actualSequence,
                    ack : host.actualACK,
                    dOffset : host.actualDataOffset,
                    flags : [0,1,0,0,0,0],
                    window : tcpServerWindow,
                    color : lineColor,
                    lost : false
                });
                tcp_array.push({
                    c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
                    s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
                    sourcePort : host.sourcePort,
                    destinationPort : remote.sourcePort,
                    seq : host.actualSequence,
                    ack : host.actualACK,
                    dOffset : host.actualDataOffset,
                    flags : [0,1,0,0,0,0],
                    window : tcpServerWindow,
                    color : lineColor,
                    lost : false
                });
            }else if(host.received.length > 0  && remote.dataToTransfer <= 0 && checkTimeServer(host.received[0].s_timestamp,globalParameters.actualTime)){
                host.actualACK = parseInt(host.received[0].seq);
                var lineColor = host.received[0].color;
                host.waitingForACK.splice(0,1);
                host.received.splice(0,1);
                remote.received.push({
                    c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
                    s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
                    sourcePort : host.sourcePort,
                    destinationPort : remote.sourcePort,
                    seq : host.actualSequence,
                    ack : host.actualACK,
                    dOffset : host.actualDataOffset,
                    flags : [0,1,0,0,0,0],
                    window : tcpServerWindow,
                    color : lineColor,
                    lost : false
                });
                host.waitingForACK.push({
                    c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
                    s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
                    sourcePort : host.sourcePort,
                    destinationPort : remote.sourcePort,
                    seq : host.actualSequence,
                    ack : host.actualACK,
                    dOffset : host.actualDataOffset,
                    flags : [0,1,0,0,0,0],
                    window : tcpServerWindow,
                    color : lineColor,
                    lost : false
                });
                tcp_array.push({
                    c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
                    s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
                    sourcePort : host.sourcePort,
                    destinationPort : remote.sourcePort,
                    seq : host.actualSequence,
                    ack : host.actualACK,
                    dOffset : host.actualDataOffset,
                    flags : [0,1,0,0,0,0],
                    window : tcpServerWindow,
                    color : lineColor,
                    lost : false
                });
            }else if(remote.dataToTransfer > 0 &&  host.received.length > 0 && host.received[0].ack == host.actualSequence && checkTimeClient(host.received[0].s_timestamp,globalParameters.actualTime) ){
                host.actualACK = parseInt(host.received[0].seq);
                var lineColor = host.received[0].color;
                host.waitingForACK.splice(0,1);
                host.received.splice(0,1);
                remote.received.push({
                    c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
                    s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
                    sourcePort : host.sourcePort,
                    destinationPort : remote.sourcePort,
                    seq : host.actualSequence,
                    ack : host.actualACK,
                    dOffset : host.actualDataOffset,
                    flags : [0,1,0,0,0,0],
                    window : tcpServerWindow,
                    color : lineColor,
                    lost : false
                });
                host.waitingForACK.push({
                    c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
                    s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
                    sourcePort : host.sourcePort,
                    destinationPort : remote.sourcePort,
                    seq : host.actualSequence,
                    ack : host.actualACK,
                    dOffset : host.actualDataOffset,
                    flags : [0,1,0,0,0,0],
                    window : tcpServerWindow,
                    color : lineColor,
                    lost : false
                });
                tcp_array.push({
                    c_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * cModifier),
                    s_timestamp : globalParameters.actualTime + (globalParameters.timeUnit * sModifier),
                    sourcePort : host.sourcePort,
                    destinationPort : remote.sourcePort,
                    seq : host.actualSequence,
                    ack : host.actualACK,
                    dOffset : host.actualDataOffset,
                    flags : [0,1,0,0,0,0],
                    window : tcpServerWindow,
                    color : lineColor,
                    lost : false
                });
            }else{
                //console.log("Servidor : No hacer nada");
            };
        };
    };
};



function timeoutExists(timeouts){
    var i = 0;
    for(i = 0; i < timeouts.length; i++){
        if(timeouts[i] == 0){
            return true;
        }
    }
    return false;
};




