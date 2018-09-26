
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
}

function httpsubmit() {
	window.localStorage.httpipserver = document.getElementById("httpipserver").value;
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
	document.getElementById("idProtocol").value = "TCP";
	if(checkIP(window.localStorage.httpipclient)){
		alert("Ip client correct");
	}else{
		alert("Ip Client incorrect")
	}
	//console.log(document.getElementById("httpipserver").value);
	//console.log(document.getElementById("httpipclient").value);
	//console.log(document.getElementById("httpnObjects").value);
	};
	
function tcpsubmit() {
	window.localStorage.tcpsizeOfObject = document.getElementById("tcpsizeOfObject").value;
	window.localStorage.tcpsizeOfWindow = document.getElementById("tcpsizeOfWindow").value;
	window.localStorage.tcpipserver = document.getElementById("tcpipserver").value;
	window.localStorage.tcpipclient = document.getElementById("tcpipclient").value;
	window.localStorage.tcpportServer = document.getElementById("tcpportServer").value;
	window.localStorage.tcpportClient = document.getElementById("tcpportClient").value;
	document.getElementById("udpipclient").value = "TCP seleccionado";
	document.getElementById("udpipserver").value = "TCP seleccionado";
	document.getElementById("udpportServer").value = "TCP seleccionado";
	document.getElementById("udpportClient").value = "TCP seleccionado";
	document.getElementById("httpipserver").value = window.localStorage.tcpipserver;
	document.getElementById("httpipclient").value = window.localStorage.tcpipclient;
	document.getElementById("ipDestination").value = window.localStorage.tcpipserver;
	document.getElementById("ipSource").value = window.localStorage.tcpipclient;
	document.getElementById("idProtocol").value = "TCP";
	//console.log(window.localStorage.tcpsizeOfObject)
};

function udpsubmit() {
	window.localStorage.udpsizeOfObject = document.getElementById("udpsizeOfObject").value;
	window.localStorage.udpipserver = document.getElementById("udpipserver").value;
	window.localStorage.udpipclient = document.getElementById("udpipclient").value;
	window.localStorage.udpportServer = document.getElementById("udpportServer").value;
	window.localStorage.udpportClient = document.getElementById("udpportClient").value;
	document.getElementById("tcpsizeOfObject").value = "UDP seleccionado";
	document.getElementById("tcpipclient").value = "UDP seleccionado";
	document.getElementById("tcpipserver").value = "UDP seleccionado";
	document.getElementById("tcpportServer").value = "UDP seleccionado";
	document.getElementById("tcpportClient").value = "UDP seleccionado";
	document.getElementById("httpipserver").value = "HTTP no funciona sobre UDP";
	document.getElementById("httpipclient").value = "HTTP no funciona sobre UDP";
	document.getElementById("ipDestination").value = window.localStorage.udpipserver;
	document.getElementById("ipSource").value = window.localStorage.udpipclient;
	document.getElementById("idProtocol").value = "UDP";
	//console.log(window.localStorage.udpsizeOfObject);
};

function startSim(){
	console.log("Start Simulation currently in development");
	var ipServer = document.getElementById("ipDestination").value;
	var ipClient = document.getElementById("ipSource").value;
	//var pattrn = new RegExp("/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/");
	if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipServer)) {
		console.log("Pattern recognised");	
	}else {
		console.log("Pattern not Recognised");	
		alert("IP introducida no es correcta");
	};
};

function desc(element){
	switch(element.id) {
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
	//IP
		case "ipDestination":
			element.title="IP de destino";
			break;
		case "ipSource":
			element.title="IP de orgineg";
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
	}
}