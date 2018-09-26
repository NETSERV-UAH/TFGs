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
    var width = canvas.width;
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
            packet_delay = document.getElementById("packet_delay").value;
            routers_between = document.getElementById("routers_between").value;
            networkMTU = document.getElementById("networkMTU").value;
            document.getElementById("tcpipserver").value = httpIpServer;
            document.getElementById("tcpipclient").value = httpIpClient;
            document.getElementById("tcpportServer").value = 80;
            tcpPortServer = document.getElementById("tcpportServer").value;
            document.getElementById("tcpportClient").value = Math.floor(Math.random()*65535) +1025;
            tcpPortClient = document.getElementById("tcpportClient").value;
            document.getElementById("tcpServerInitialSequenceNumber").value = Math.floor(Math.random()*100 + 1);
            document.getElementById("tcpClientInitialSequenceNumber").value = Math.floor(Math.random()*100 + 1);
            document.getElementById("tcpPersistent").value = true;
            var sRequest = httpmessage+httpObject;
            document.getElementById("tcpsizeOfRequest").value = parseInt(sRequest.length);
            document.getElementById("tcpsizeOfObject").value = parseInt(httpnumObjects*httpObjectSize);
            document.getElementById("tcpClientWindow").value = 3;
            document.getElementById("tcpServerWindow").value = 3;
            tcpServerWindow = document.getElementById("tcpServerWindow").value;
            tcpClientWindow = document.getElementById("tcpClientWindow").value;
            document.getElementById("tcpServerTimeout").value = parseInt(20);
            document.getElementById("tcpClientTimeout").value = parseInt(20);
            tcpServerTimeout = document.getElementById("tcpServerTimeout").value;
            tcpClientTimeout = document.getElementById("tcpClientTimeout").value;
            document.getElementById("ipDestination").value = httpIpServer;
            document.getElementById("ipSource").value = httpIpClient;
            document.getElementById("ipTTL").value = 64;
            document.getElementById("idProtocol").value = "TCP";
            parseHttp(httpnumObjects);
    };
};


function traduceHTTPtoTCP(){
    clear_Canvas();
    if(http_array.length == 0){
        alert("Error : No se puede traducir a capa de transporte porque \n no se ha realizado la simulación de la capa de aplicación.")
    }else{
        tcpsizeOfRequest = document.getElementById("tcpsizeOfRequest").value;
        tcpsizeOfObject = document.getElementById("tcpsizeOfObject").value;
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
        }else if(tcpsizeOfObject <= 0){
            alert("Error : Tamaño del objeto menor o igual que cero");
        }else if(tcpSizeOfWindow < 0){
            alert("Error : Tamaño de la ventana menor que cero");
        }else if(packet_delay == null || routers_between == null || networkMTU == null){
            alert("Error : Se tiene que especificar el retardo entre paquetes"+
            ",el número de routers y \n la MTU de la red.");
        }else{
            /*document.getElementById("httpnObjects").value = 1;
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
            */
            parseTcp();
        };
    };
};

function traduceTCP_UDP_IP(){
    var ipTTL = document.getElementById("ipTTL").value;
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
                totalLength : parseInt(networkMTU - 20) 
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
                totalLength : parseInt(networkMTU - 20) 
            });
            ip_array.push(ip_packet);
        };
        draw_ip_communication(ip_array);
    };
};

function parseTcp(){
    clear_Canvas();
    var initialCSequence = tcpClientInitialSequenceNumber;
    var initialSSequence = tcpServerInitialSequenceNumber;
    var nMTU = networkMTU;
    var requestToTransmit = tcpsizeOfRequest;
    var dataToTransmit = tcpsizeOfObject;
    var nROuters = routers_between;
    var timeUnit = parseInt(packet_delay);
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
        timeUnit : parseInt(packet_delay),
        actualTime : 0,
        sTimeout : tcpServerTimeout,
        cTimeout : tcpClientTimeout,
        isLowStart : tcpSlowStart
   }); 

    //New test of implementation
    var server = ({
        actualSequence : initialSSequence,
        actualACK : 0,
        actualDataOffset : dataPerPacket,
        dataToTransfer : parseInt(dataToTransmit),
        sourcePort : tcpPortServer,
        waitingForACK : [],
        received : [],
        timeouts : [],
        connected : false,
        started : false,
        transmiting : false,
        state : "LISTEN"
    });

    //New test of implementation
    var client = ({
        actualSequence : initialCSequence,
        actualACK : 0,
        actualDataOffset : dataPerPacket,
        dataToTransfer : parseInt(requestToTransmit),
        sourcePort : tcpPortClient,
        waitingForACK : [],
        received : [],
        timeouts : [],
        connected : false,
        started : false,
        state : "CLOSED"
    });

    while(server.state != "CLOSED"){
        tcpClientReaction(client,server,true, globalParameters);
        tcpServerReaction(server,client,globalParameters);
        globalParameters.actualTime += timeUnit;
        console.log("States : Client "+client.state+" Server "+server.state);
    };
    console.log(tcp_array);
    draw_server_client();
    draw_tcp_communication(tcp_array);
};

function parseUdp(){
    clear_Canvas();
    var addedHeaders = parseInt(8 + 20); //UDP Header plus IP Header
    var requestData = udpsizeOfRequest;
    var objectData = udpsizeOfObject;
    var dataPerDatagram = networkMTU - addedHeaders;
    var requestDatagrams = Math.ceil(requestData/dataPerDatagram);
    var actualTime = 0;
    var timeUnit = parseInt(packet_delay);

    var server = ({
        datagrams_received : []
    });
    var dataToTransmit = 0;
    for(dataToTransmit = parseInt(requestData); dataToTransmit > 0; dataToTransmit -= dataPerDatagram){
        var udp_datagram = ({
            c_timestamp : actualTime,
            s_timestamp : actualTime + timeUnit,
            sourcePort : udpportClient,
            destinationPort : udpportServer,
            length : dataPerDatagram,
            checksum : simulateUdpChecksum(),
            lost : false     
        });
        server.datagrams_received.push(udp_datagram);
        udp_array.push(udp_datagram);
        actualTime += timeUnit;
    };

    if(server.datagrams_received.length == requestDatagrams){

        for(dataToTransmit = parseInt(objectData); dataToTransmit > 0; dataToTransmit -= dataPerDatagram){
            var udp_datagram = ({
                c_timestamp : actualTime + timeUnit,
                s_timestamp : actualTime,
                sourcePort : udpportClient,
                destinationPort : udpportServer,
                length : dataPerDatagram,
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
    httpIpServer = document.getElementById("httpipserver").value;
    httpIpClient = document.getElementById("httpipclient").value;
    httpnumObjects = document.getElementById("httpnObjects").value;
    httpObject = document.getElementById("httpRequestedObject").value;
    httpmessage = document.getElementById("httpRequestMessageBody").value;
    httptypeOfRequest = document.getElementById("httpRequest").value;
    httpObjectSize = document.getElementById("httpObjectSize").value;
    packet_delay = document.getElementById("packet_delay").value;
    routers_between = document.getElementById("routers_between").value;
    networkMTU = document.getElementById("networkMTU").value;
    if(!checkIP(httpIpServer)){
        alert("Error : La IP del servidor "+httpIpServer+" no es correcta.");
    }else if (!checkIP(httpIpClient)){
        alert("Error : La IP del cliente "+httpIpClient+" no es correcta");
    }else if((parseInt)<= 0){
        alert("Error : Número de objetos HTTP pedidos es menor o igual a cero")
    }else if(parseInt(httpObjectSize)<=0){
        alert("Error : Tamaño del objeto menor o igual que cero");
    }else if(packet_delay == null || routers_between == null || networkMTU == null){
        alert("Error : Se tiene que especificar el retardo entre paquetes"+
        ",el número de routers y \n la MTU de la red.");
    }else{

        document.getElementById("tcpipserver").value = httpIpServer;
        document.getElementById("tcpipclient").value = httpIpClient;
        document.getElementById("tcpportServer").value = 80;
        tcpPortServer = document.getElementById("tcpportServer").value;
        document.getElementById("tcpportClient").value = Math.floor(Math.random()*65535) +1025;
        tcpPortClient = document.getElementById("tcpportClient").value;
        document.getElementById("tcpServerInitialSequenceNumber").value = Math.floor(Math.random()*100 + 1);
        document.getElementById("tcpClientInitialSequenceNumber").value = Math.floor(Math.random()*100 + 1);
        document.getElementById("tcpPersistent").value = true;
        var sRequest = httpmessage+httpObject;
        document.getElementById("tcpsizeOfRequest").value = parseInt(sRequest.length);
        document.getElementById("tcpsizeOfObject").value = parseInt(httpnumObjects*httpObjectSize);
        document.getElementById("tcpClientWindow").value = 3;
        document.getElementById("tcpServerWindow").value = 3;
        tcpServerWindow = document.getElementById("tcpServerWindow").value;
        tcpClientWindow = document.getElementById("tcpClientWindow").value;
        document.getElementById("tcpServerTimeout").value = parseInt(20);
        document.getElementById("tcpClientTimeout").value = parseInt(20);
        tcpServerTimeout = document.getElementById("tcpServerTimeout").value;
        tcpClientTimeout = document.getElementById("tcpClientTimeout").value;
        document.getElementById("ipDestination").value = httpIpServer;
        document.getElementById("ipSource").value = httpIpClient;
        document.getElementById("ipTTL").value = 64;
        document.getElementById("idProtocol").value = "TCP";
        parseHttp(httpnumObjects);
    };
};

function tcpsubmit(){
    tcpsizeOfRequest = document.getElementById("tcpsizeOfRequest").value;
    tcpsizeOfObject = document.getElementById("tcpsizeOfObject").value;
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
    udp_array = [];
    ip_array = [];
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
    }else if(tcpsizeOfObject <= 0){
        alert("Error : Tamaño del objeto menor o igual que cero");
    }else if(tcpSizeOfWindow < 0){
        alert("Error : Tamaño de la ventana menor que cero");
    }else if(packet_delay == null || routers_between == null || networkMTU == null){
        alert("Error : Se tiene que especificar el retardo entre paquetes"+
        ",el número de routers y \n la MTU de la red.");
    }else{
        document.getElementById("httpnObjects").value = 1;
        document.getElementById("httpipserver").value = tcpIpServer;
        document.getElementById("httpipclient").value = tcpIpClient;
        document.getElementById("httpRequest").value = "GET";
        document.getElementById("httpRequestedObject").value = "\\test\\testPage";
        document.getElementById("httpRequestMessageBody").value = "testId=123&page=Test";
        document.getElementById("httpObjectSize").value = tcpsizeOfObject;
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
        parseTcp();
    };
};

function udpsubmit(){
    udpipserver = document.getElementById("udpipserver").value;
    udpipclient = document.getElementById("udpipclient").value;
    udpportServer = document.getElementById("udpportServer").value;
    udpportClient = document.getElementById("udpportClient").value;
    udpsizeOfObject = document.getElementById("udpsizeOfObject").value;
    udpsizeOfRequest = document.getElementById("udpsizeOfRequest").value;
    packet_delay = document.getElementById("packet_delay").value;
    routers_between = document.getElementById("routers_between").value;
    networkMTU = document.getElementById("networkMTU").value;
    tcp_array = [];
    ip_array = [];
    if(!checkIP(udpipserver)){
        alert("Error : IP del servidor no válida");
    }else if(!checkIP(udpipclient)){
        alert("Error : IP del cliente no es válida");
    }else if(!checkPort(udpportServer)){
        alert("Error : Puerto del servidor no válido");
    }else if(!checkPort(udpportClient)){
        alert("Error : Puerto del cliente no válido")
    }else if(udpsizeOfObject <= 0){
        alert("Error : El tamaño del objeto debe ser mayor que 0");
    }else if(udpsizeOfRequest <= 0){
        alert("Error : El tamaño de la petición tiene que ser mayor que cero");
    }else if(packet_delay == null || routers_between == null || networkMTU == null){
        alert("Error : Se tiene que especificar el retardo entre paquetes"+
        ",el número de routers y \n la MTU de la red.");
    }else{
        document.getElementById("ipDestination").value = udpipserver;
        document.getElementById("ipSource").value = udpipclient;
        document.getElementById("ipTTL").value = 64;
        document.getElementById("idProtocol").value = "UDP";
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
/*
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
        var packet_sended = ({
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
        remote.received.push(packet_sended);
        host.waitingForACK.push(packet_sended);
        tcp_array.push(packet_sended);
        host.started = true;
    }else if(!host.connected  && host.received.length > 0 && checkTimeServer(host.received[0].s_timestamp, globalParameters.actualTime) && host.received[0].flags.toString() == [0,0,0,0,1,0].toString() && host.waitingForACK.length == 0){
        var packet_sended = ({
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
        remote.received.push(packet_sended);
        host.waitingForACK.push(packet_sended);
        tcp_array.push(packet_sended);
    }else if(!host.connected && host.received.length > 0 && host.received[0].flags.toString() == [0,1,0,0,1,0].toString() 
        && checkTimeClient(host.received[0].c_timestamp,globalParameters.actualTime) && host.waitingForACK[0].flags.toString() == [0,0,0,0,1,0].toString() ){
        host.actualSequence++; 
        var packet_sended = ({
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
        remote.received.push(packet_sended);
        tcp_array.push(packet_sended);
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
                var packet_sended = ({
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
                remote.received.push(packet_sended);
                tcp_array.received.push(packet_sended);
                timeouts[i] = tcpClientTimeout;
        }else if(host.received.length > 0  && host.waitingForACK.length > 0 && host.received[host.received.length - 1].ack != host.waitingForACK[0].seq){
            var packet_sended = ({
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
            remote.received.push(packet_sended);
            tcp_array.push(packet_sended);
        }else if(client){
            if(host.dataToTransfer > 0 && host.waitingForACK.length == 0){ //seq y ack y checkear tiempo
                host.actualSequence += host.actualDataOffset;
                host.dataToTransfer -= host.actualDataOffset;
                var lineColor = "rgb("+Math.random()*255+","+Math.random()*255+","+
            Math.random()*255+")";
                var packet_sended = ({
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
                remote.received.push(packet_sended);
                host.waitingForACK.push(packet_sended);
                tcp_array.push(packet_sended);
                console.log(host.dataToTransfer);
            }else if(host.dataToTransfer > 0 && host.waitingForACK > 0 && host.received[0].ack == host.waitingForACK[0].seq && checkTimeClient(host.received[0].c_timestamp,globalParameters.actualTime) ){
                host.actualSequence += host.actualDataOffset;
                host.dataToTransfer -= host.actualDataOffset;
                host.actualACK = parseInt(host.received[0].seq);
                host.waitingForACK.splice(0,1);
                host.received.splice(0,1);
                var lineColor = "rgb("+Math.random()*255+","+Math.random()*255+","+
            Math.random()*255+")";
                var packet_sended = ({
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
                remote.received.push(packet_sended);
                host.waitingForACK.push(packet_sended);
                tcp_array.push(packet_sended);
            }else if(host.received.length > 0 && host.dataToTransfer <= 0 && checkTimeClient(host.received[0].c_timestamp, globalParameters.actualTime)){
                host.actualACK = parseInt(host.received[0].seq);
                var lineColor = host.received[0].color;
                host.waitingForACK.splice(0,1);
                host.received.splice(0,1);
                var packet_sended = ({
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
                remote.received.push(packet_sended);
                host.waitingForACK.push(packet_sended);
                tcp_array.push(packet_sended);
            }else{
                //console.log("Cliente : No hacer nada");
            };
        }else{
            //terminar servidor
            if(host.dataToTransfer > 0  && host.received.length == 0 && remote.dataToTransfer <= 0 && checkTimeServer(host.received[0].s_timestamp,globalParameters.actualTime)){
                host.actualSequence += host.actualDataOffset;
                host.dataToTransfer -= host.actualDataOffset;
                var packet_sended = ({
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
                remote.received.push(packet_sended);
                host.waitingForACK.push(packet_sended);
                tcp_array.push(packet_sended);
            }else if(host.dataToTransfer > 0 && remote.dataToTransfer <= 0 && checkTimeServer(host.received[0].s_timestamp,globalParameters.actualTime) ){
                host.actualSequence += host.actualDataOffset;
                host.dataToTransfer -= host.actualDataOffset;
                host.actualACK = parseInt(host.received[0].seq);
                host.waitingForACK.splice(0,1);
                host.received.splice(0,1);
                var lineColor = "rgb("+Math.random()*255+","+Math.random()*255+","+
            Math.random()*255+")";
                var packet_sended = ({
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
                remote.received.push(packet_sended);
                host.waitingForACK.push(packet_sended);
                tcp_array.push(packet_sended);
            }else if(host.received.length > 0  && remote.dataToTransfer <= 0 && checkTimeServer(host.received[0].s_timestamp,globalParameters.actualTime)){
                host.actualACK = parseInt(host.received[0].seq);
                var lineColor = host.received[0].color;
                host.waitingForACK.splice(0,1);
                host.received.splice(0,1);
                var packet_sended = ({
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
                remote.received.push(packet_sended);
                host.waitingForACK.push(packet_sended);
                tcp_array.push(packet_sended);
            }else if(remote.dataToTransfer > 0 &&  host.received.length > 0 && host.received[0].ack == host.actualSequence && checkTimeClient(host.received[0].s_timestamp,globalParameters.actualTime) ){
                host.actualACK = parseInt(host.received[0].seq);
                var lineColor = host.received[0].color;
                host.waitingForACK.splice(0,1);
                host.received.splice(0,1);
                var packet_sended = ({
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
                remote.received.push(packet_sended);
                host.waitingForACK.push(packet_sended);
                tcp_array.push(packet_sended);
            }else{
                //console.log("Servidor : No hacer nada");
            };
        };
    };
};

*/

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
}

function tcpClientReaction(host,remote,startConnection, globalParameters){
    var actualT = globalParameters.actualTime;
    var futureT = parseInt(globalParameters.actualTime + globalParameters.timeUnit);
    var sPort = host.sourcePort;
    var dPort = remote.sourcePort;
    var seq = host.actualSequence;
    var ack = remote.actualACK;
    var h = host;
    var hRP = host.received;
    var hDTT = host.dataToTransfer;
    var hWFA = host.waitingForACK;
    var r = remote;
    switch(host.state){
        case "CLOSED":
            //Closed STATE Start connection
            var tcp_packet_sended = new TcpPacket(actualT,futureT,sPort,dPort,
            seq,ack,0,[0,0,0,0,1,0],tcpServerWindow,'black',false);
            remote.received.push(tcp_packet_sended);
            tcp_array.push(tcp_packet_sended);
            host.state = "SYN_SENT";
            console.log("Client : SYN packet Sended");
            break;

        case "SYN_SENT":
            //SYN-PACKET SENT, waiting for ACK
            var packet_received = hRP[0];
            if(hRP.length > 0 && checkTimeClient(packet_received.c_timestamp,actualT)
            && packet_received.flags.toString() == [0,0,0,0,1,0].toString()){
                var tcp_packet_sended = new TcpPacket(actualT,futureT,
                sPort,dPort, seq, parseInt(hRP[0].seq)+1,0,[0,1,0,0,1,0],tcpServerWindow,
                hRP[0].color,false);
                remote.received.push(tcp_packet_sended);
                tcp_array.push(tcp_packet_sended);
                hRP.splice(0,1);
                console.log("Client : SYN Received after sending SYN")
                host.state = "SYN_RECEIVED";
                //If SYN Received changed to SYN_RECEIVED STATE
                //Normally just an ACK will be received
                
            }else if(hRP.length > 0 && checkTimeClient(packet_received.c_timestamp,actualT)
            && packet_received.flags.toString() == [0,1,0,0,1,0].toString()){
                host.actualSequence++;
            var tcp_packet_sended = new TcpPacket(actualT, futureT,sPort,dPort,seq,ack,
                0,[0,1,0,0,0,0],tcpServerWindow,hRP[0].color,false);
                remote.received.push(tcp_packet_sended);
                tcp_array.push(tcp_packet_sended);
                hRP.splice(0,1);
                console.log("Client : SYN ACK Received, connection established");
                host.state="ESTABLISHED";
            };
            break;

        case "SYN_RECEIVED":
            //This state is not used in the current version
            var packet_received = hRP[0];
            if(hRPh.length > 0 && checkTimeClient(packet_received.c_timestamp,globalParameters.actualTime)
            && packet_received.flags.toString() == [0,1,0,0,0,0].toString()){
                host.state = "ESTABLISHED";
            };
            host.received.splice(0,1);
            console.log("Client : ACK Received, connection established");
            break;

        case "ESTABLISHED":
            //First packet to send
            //If there is data to transmit, and no packets have been 
            //received and all ACK have been received
            if(hDTT > 0 && hRP.length == 0 && hWFA.length == 0){
                hDTT -= parseInt(host.actualDataOffset);
                var tcp_packet_sended = new TcpPacket(actualT,futureT,sPort,dPort,
                seq,ack,host.actualDataOffset,[0,1,0,0,0,0],tcpServerWindow,getColor(),false);
                remote.received.push(tcp_packet_sended);
                hWFA.push(tcp_packet_sended);
                console.log("Client : Sending first Packet");
                tcp_array.push(tcp_packet_sended);
                seq = parseInt(host.actualDataOffset) + parseInt(seq);
            }else if(
                //Sending data after the first packet
                ((hRP.length > 0) && (hWFA.length > 0)) &&( 
                (hDTT > 0 && hWFA.length == 0) ||
                (hDTT > 0 && hWFA[0].seq == hRP[0].ack) &&
                (checkTimeClient(hRP[0].c_timestamp,actualT)))
             ){
                host.dataToTransfer -= parseInt(host.actualDataOffset);
                seq = parseInt(seq) + parseInt(host.actualDataOffset);
                var tcp_packet_sended = new TcpPacket(actualT,futureT,sPort,dPort,seq,parseInt(hRP[0].seq),
                host.actualDataOffset,[0,1,0,0,0,0],tcpServerWindow,getColor(),false);
                hRP.splice(0,1);
                hWFA.splice(0,1);
                hWFA.push(tcp_packet_sended);
                r.received.push(tcp_packet_sended);
                tcp_array.push(tcp_packet_sended);
                console.log("Client: Packet Sended");
                console.log("The sequence number is "+seq)
             }else if(hDTT <= 0 && r.dataToTransfer > 0 && hRP.length > 0
                && hRP[0].dOffset == 0 && checkTimeClient(hRP[0].c_timestamp,actualT)){
                    //Last ACK from the data sended
                    hRP.splice(0,1);
                    hWFA.splice(0,1);
                    console.log("Client : Last ACK from sending data to server, waiting for data from server"); 

             }else if(hDTT <= 0 && r.dataToTransfer > 0 && hRP.length > 0
             && checkTimeClient(hRP[0].c_timestamp,actualT)){
                 //Sending ACKs for the data received from the server
                var tcp_packet_sended = new TcpPacket(actualT,futureT,sPort,dPort,
                seq,hRP[0].seq,0,[0,1,0,0,0,0],tcpServerWindow,hRP[0].color,false);
                console.log("Client : Acknowledge data received, sending ACK");
                console.log("The sequence number is "+seq);
                r.received.push(tcp_packet_sended);
                tcp_array.push(tcp_packet_sended);
                hRP.splice(0,1);
             }else if(hDTT <= 0 && r.dataToTransfer <= 0 && hRP.length > 0
                && checkTimeClient(hRP[0].c_timestamp,actualT)){
                    //Last Packet from the server
                    var tcp_packet_sended = new TcpPacket(actualT,futureT,sPort,dPort,seq,
                    hRP[0].seq,0,[0,0,0,0,0,1],tcpServerWindow,hRP[0].color,false);
                    console.log("Client : Last packet of data received, closing connection");
                    r.received.push(tcp_packet_sended);
                    tcp_array.push(tcp_packet_sended);
                    hRP.splice(0,1);
                    host.state = "FIN_WAIT_1"
             }
             //Remove below if works above
             else if(r.dataToTransfer <= 0 
                && hDTT <= 0 && 
                hRP.length > 0 && checkTimeClient(hRP[0].c_timestamp,actualT)){
                var tcp_packet_sended = new TcpPacket(actualT,futureT,sPort,dPort,
                seq,host.actualACK,0,[0,0,0,0,0,1],tcpServerWindow,getColor(),false);
                r.received.push(tcp_packet_sended);
                tcp_array.push(tcp_packet_sended);
                hRP.splice(0,1);
                console.log("Client : All data transmited, closing connection");
                host.state = "FIN_WAIT_1"
            }
            break;
        case "FIN_WAIT_1":
            //Reaction during the clousure of the connection
            var packet_received = hRP[0];
            if(hRP.length > 0 && checkTimeClient(packet_received.c_timestamp,actualT)
            && packet_received.flags.toString() == [0,0,0,0,0,1].toString()){
                //Normal path in this version
                var tcp_packet_sended = new TcpPacket(actualT,futureT,sPort,dPort, seq,
                parseInt(hRP[0].seq + 1),0,[0,1,0,0,0,0],tcpServerWindow,hRP[0].color,false);
                r.received.push(tcp_packet_sended);
                tcp_array.push(tcp_packet_sended);
                hRP.splice(0,1);
                host.state="CLOSING";
            }else if(hRP.length > 0 && checkTimeClient(packet_received.c_timestamp,actualT)
            && packet_received.flags.toString() == [0,1,0,0,0,1].toString()){
                var tcp_packet_sended = new TcpPacket(actualT,futureT,sPort,dPort,seq,parseInt(hRP[0].seq + 1),
                0,[0,1,0,0,0,0],tcpServerWindow,hRP[0].color,false)
                r.received.push(tcp_packet_sended);
                tcp_array.push(tcp_packet_sended);
                hRP.splice(0,1);
                host.state="TIME_WAIT";
            }else if(hRP.length > 0 && checkTimeClient(packet_received.c_timestamp,actualT)
            && packet_received.flags.toString() == [0,1,0,0,0,0].toString()){
                host.state="FIN_WAIT_2";
                hRP.splice(0,1);
                console.log("Client : FIN ACK received from server, waiting for FIN")
            };
            
            break;
        case "CLOSING":
            var packet_received = hRP[0];
            if(hRP.length > 0 && checkTimeClient(packet_received.c_timestamp,actualT)
            && packet_received.flags.toString() == [0,1,0,0,0,0].toString()){
                host.state="TIME_WAIT";
                hRP.splice(0,1);
            };
            break;
        case "FIN_WAIT_2" :
        var packet_received = hRP[0];
            if(hRP.length > 0 && checkTimeClient(packet_received.c_timestamp,actualT)
            && packet_received.flags.toString() == [0,0,0,0,0,1].toString()){
                var tcp_packet_sended = new TcpPacket(actualT,futureT,sPort,dPort,seq,
                parseInt(hRP[0].seq + 1), 0, [0,1,0,0,0,0],tcpServerWindow,hRP[0].color,false);
                r.received.push(tcp_packet_sended);
                tcp_array.push(tcp_packet_sended);
                host.state="TIME_WAIT";
                hRP.splice(0,1);
                console.log("Client : FIN from server received, sending ACK")
                };
                break;
        case "TIME_WAIT":
            console.log("Client : Waiting and closing connection")
            host.state = "CLOSED";
            break;
    };
};

function tcpServerReaction(host, remote, globalParameters){
    var actualT = globalParameters.actualTime;
    var futureT = parseInt(globalParameters.actualTime + globalParameters.timeUnit);
    var sPort = host.sourcePort;
    var dPort = remote.sourcePort;
    var seq = host.actualSequence;
    var ack = remote.actualACK;
    var h = host;
    var hRP = host.received;
    var hDTT = host.dataToTransfer;
    var hWFA = host.waitingForACK;
    var r = remote;
    switch(host.state){
        //Usually the server starts in Listen State but in future versions
        //can be used for other scenarios than the ones considered for this 
        //project
        case "CLOSED":
            console.log("Server : Reabriendo App");
            host.state = "LISTEN"
            break;
        case "LISTEN" :
        //Waiting for the SYN Packet from the client
        var packet_received = hRP[0];
            if(hRP.length > 0 && checkTimeServer(packet_received.s_timestamp,actualT)
        && packet_received.flags.toString() == [0,0,0,0,1,0].toString()){
            var tcp_packet_sended = new TcpPacket(futureT,actualT,sPort,dPort,seq,
            parseInt(hRP[0].seq + 1),0,[0,1,0,0,1,0],tcpServerWindow,hRP[0].color,false); 
            r.received.push(tcp_packet_sended);
            tcp_array.push(tcp_packet_sended);
            host.state = "SYN_RECEIVED";
            hRP.splice(0,1);
            console.log("Server : Received SYN");
            };
            break;
        case "SYN_RECEIVED" :
            //SYN Packet Received
            var packet_received = hRP[0];
            if(hRP.length > 0 && checkTimeServer(packet_received.s_timestamp,actualT)
            && packet_received.flags.toString() == [0,1,0,0,0,0].toString()){
                host.state = "ESTABLISHED";
                hRP.splice(0,1);
                console.log("Server : Received ACK from client, connection established");
            };
            break;
        case "ESTABLISHED":
            //COnnection established
            var packet_received = hRP[0];
            if(hRP.length > 0 && checkTimeServer(packet_received.s_timestamp, actualT)
        && packet_received.flags.toString() == [0,0,0,0,0,1].toString()){
            //FIN Packet received
            var tcp_packet_sended = new TcpPacket(futureT,actualT,sPort,dPort,seq,
            parseInt(hRP[0].seq + 1),0,[0,1,0,0,0,0],tcpServerWindow,hRP[0].color,false);
            r.received.push(tcp_packet_sended);
            tcp_array.push(tcp_packet_sended);
            host.state = "CLOSE_WAIT";
            hRP.splice(0,1);
            console.log("Server : FIN received");
            }else if(!host.transmiting && hRP.length > 0 && checkTimeServer(packet_received.s_timestamp,actualT)
            && packet_received.flags.toString() == [0,1,0,0,0,0].toString()){
                var tcp_packet_sended = new TcpPacket(futureT,actualT,sPort,dPort,seq,packet_received.seq,
                0,[0,1,0,0,0,0],tcpServerWindow,hRP[0].color,false);
                console.log("Server :Sending ACK");
                host.actualACK = hRP[0].seq;
                r.received.push(tcp_packet_sended);
                tcp_array.push(tcp_packet_sended);
                hRP.splice(0,1);
                if(r.dataToTransfer <= 0){
                    host.transmiting = true;
                };
            }else if(r.dataToTransfer <= 0 && hDTT > 0){
                //Server sending first packet of data
                if(hDTT > 0 && hRP.length == 0 && hWFA.length == 0){
                    hDTT -= parseInt(host.actualDataOffset);
                    var tcp_packet_sended = new TcpPacket(futureT,actualT,sPort,dPort,seq,host.actualACK,
                    host.actualDataOffset,[0,1,0,0,0,0],tcpServerWindow,getColor(),false);
                    r.received.push(tcp_packet_sended);
                    hWFA.push(tcp_packet_sended);
                    tcp_array.push(tcp_packet_sended);
                    seq = parseInt(host.actualDataOffset) + parseInt(seq);
                    console.log("Server: First Packet of Data Sended");
                }else if(
                    //Server sending data after first packet
                    ((hRP.length > 0) && (hWFA.length > 0)) &&( 
                        (hDTT > 0 && hWFA.length == 0) ||
                        (hDTT > 0 && hWFA[0].seq == hRP[0].ack) &&
                        (checkTimeServer(hRP[0].s_timestamp,actualT)))
                     ){
                        host.actualSequence = parseInt(host.actualSequence + host.actualDataOffset);
                        host.dataToTransfer -= parseInt(host.actualDataOffset);
                        var tcp_packet_sended = new TcpPacket(futureT,actualT,sPort,dPort,seq,
                        parseInt(hRP[0].seq),host.actualDataOffset,[0,1,0,0,0,0],tcpServerWindow,getColor(),
                        false);
                        hRP.splice(0,1);
                        hWFA.splice(0,1);
                        hWFA.push(tcp_packet_sended);
                        r.received.push(tcp_packet_sended);
                        tcp_array.push(tcp_packet_sended);
                        console.log("Server: Packet of Data Sended");
                }else if(hRP.length > 0 && host.dataToTransfer <= 0 && r.dataToTransfer <= 0){
                    //Last ACK from the Client
                    hWFA.splice(0,1);
                    hRP.slice(0,1);
                    console.log("Server : Last ack from data sended received from client");                    
                }
            }
            break;
        case "CLOSE_WAIT":
            var tcp_packet_sended = new TcpPacket(futureT,actualT,sPort,dPort,seq,host.actualACK,
            0,[0,0,0,0,0,1],tcpServerWindow, 'black', false);
            r.received.push(tcp_packet_sended);
            tcp_array.push(tcp_packet_sended);
            host.state = "LAST_ACK";
            console.log("Server : Sending FIN.")
            break;
        case "LAST_ACK":
        var packet_received = hRP[0];
            if(hRP.length > 0 && checkTimeServer(packet_received.s_timestamp,actualT)
        && packet_received.flags.toString() == [0,1,0,0,0,0].toString()){
            host.state = "CLOSED";
            hRP.splice(0,1);
            console.log("Server : ACK received, closing connection");
            };
            break;
    };
};

function autoFill(){
    document.getElementById("packet_delay").value = 300;
    document.getElementById("routers_between").value = 2;
    document.getElementById("networkMTU").value = 500;
    //HTTP Parameters
    document.getElementById("httpipserver").value = "192.168.6.123";
    document.getElementById("httpipclient").value = "192.168.6.26";
    document.getElementById("httpnObjects").value = 3;
    document.getElementById("httpRequestedObject").value = "/object/file.html";
    document.getElementById("httpRequestMessageBody").value = "?object=htmlFile&fragment=yes"; 
    document.getElementById("httpObjectSize").value = 500;
    document.getElementById("httpRequest").value = "GET";
    //TCP Parameters
    document.getElementById("tcpsizeOfRequest").value = 200;
    document.getElementById("tcpsizeOfObject").value = 1500;
    document.getElementById("tcpipserver").value = "192.168.6.123";
    document.getElementById("tcpipclient").value = "192.168.6.26";
    document.getElementById("tcpportServer").value = 80;
    document.getElementById("tcpportClient").value = 2356;
    document.getElementById("tcpServerInitialSequenceNumber").value = 100;
    document.getElementById("tcpClientInitialSequenceNumber").value = 100;
    document.getElementById("tcpServerWindow").value = 3;
    document.getElementById("tcpClientWindow").value = 3;
    document.getElementById("tcpServerTimeout").value = 20;
    document.getElementById("tcpClientTimeout").value = 20;
    //UDP Parameters
    document.getElementById("udpsizeOfRequest").value = 200;
    document.getElementById("udpsizeOfObject").value = 1500;
    document.getElementById("udpipserver").value = "192.168.6.123";
    document.getElementById("udpipclient").value = "192.168.6.26";
    document.getElementById("udpportServer").value = 1560;
    document.getElementById("udpportClient").value = 2653;
    //IP Parameters
    document.getElementById("ipDestination").value = "192.168.6.123";
    document.getElementById("ipSource").value = "192.168.6.26";
    document.getElementById("ipversion").value = "1.1";
    document.getElementById("ipTTL").value =64;
};