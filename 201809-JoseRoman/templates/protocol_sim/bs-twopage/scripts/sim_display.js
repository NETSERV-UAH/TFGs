var canvas = document.getElementById("paperjs-canvas");
var canvas_width = canvas.width;
var canvas_height = canvas.height;
var clientTop = new Path({
	strokeColor : 'black',
	strokeWidth : 30
});
var serverTop = new Path({
	strokeColor : 'black',
	strokeWidth : 30
});

var iniTest = new Path({
	strokeColor : 'black',
	strokeWidth : 30
});

function Packet_translated(send_timestamp, received_timestamp) {
		this.send_t = send_timestamp;
		this.received_t = received_timestamp;
	};

//clientTop.add(new Point(100,100));
//clientTop.add(new Point(100,300));
/*
var clientStop = parseInt(canvas_height);
var clientBottom = new Point(parseInt(canvas_width/5), parseInt(canvas_height/6));
var serverTop = new Point(parseInt(canvas_width*4/5), parseInt(canvas_height/6));
var serverBottom = new Point(parseInt(canvas_width*4/5), parseInt(canvas_height));
*/
/*
var clientLine = new Path.Line(clientTop, clientBottom);
clientLine.strokeColor = 'black';
clientLine.strokeWidth = 40 ; */

var a = canvas_width/5;
var e = canvas_width*4/5;
var initialHeigh = parseInt(canvas_height/6);
var finalHeigh = parseInt(canvas_height*5/6);
//var offset = 20;
//var packets_client = 10 //Insert Packets Here
//Divide timeline by time or divide timeline by packets



clientTop.onFrame = function (event) {
	if (event.count < canvas_height) {
		clientTop.add(new Point(parseInt(a), parseInt((canvas_height/6)+event.count * 2 )));
	}
};

serverTop.onFrame = function (event) {
	if (event.count < canvas_height) {
		serverTop.add(new Point(parseInt(e), parseInt((canvas_height/6)+event.count * 2)));
	}

};

/*
var p1 = new Packet_translated(0,100);
var p2 = new Packet_translated(100, 200);
var p3 = new Packet_translated(50,300);

var client_send = [
	p1,
	p2,
	p3	
];

var s1 = new Packet_translated(100,253);
var s2 = new Packet_translated(200,300);
var s3 = new Packet_translated(300, 350);

var server_send = [
	s1,
	s2,
	s3
];

console.log(client_send[1].send_t + initialHeigh);
var packet_track = new Path.Line(new Point(a , client_send[0].send_t + initialHeigh), new Point(e, client_send[0].received_t + initialHeigh));
packet_track.strokeColor = 'black';
packet_track.strokeWidth = 12;
var packet_track2 = new Path.Line(new Point(a , client_send[1].send_t + initialHeigh), new Point(e, client_send[1].received_t + initialHeigh));
packet_track2.strokeColor = 'black';
packet_track2.strokeWidth = 12;
var packet_track3 = new Path.Line(new Point(a , client_send[2].send_t + initialHeigh), new Point(e, client_send[2].received_t + initialHeigh));
packet_track3.strokeColor = 'black';
packet_track3.strokeWidth = 12;

var counter;
var server_track_array = [];
for (counter = 0; counter <= server_send.length; counter++) {
	server_track_array.push(new Path.Line(new Point(e , server_send[counter].send_t + initialHeigh), new Point(a, server_send[counter].received_t + initialHeigh)));
	server_track_array[counter].strokeWidth = 12;
	server_track_array[counter].strokeColor = 'black';
	server_track_array[counter].onMouseEnter = function (event) {
		var texto = new PointText (event.point);
		texto.content = "Packet Info: \n JAJAJAJAJAJAJA";
		texto.fillColor = 'red';
		this.onMouseLeave = function () {
			texto.content = '';		
		
		}
	}
};
*/

var client_packets = [];
var server_packets = [];
var client_shipping = [];
var server_shipping = [];

//
var test_counter;
for (test_counter = 0; test_counter <= 1 ; test_counter++) {
	var random_number = Math.floor(Math.random()*500 + 100);
	client_packets.push(new Packet_translated(Math.floor(Math.random()*500 + 100),random_number));
	server_packets.push(new Packet_translated(random_number , Math.floor(Math.random()*500 + 100)));
	
	client_shipping.push(new Path.Line(new Point(a , client_packets[test_counter].send_t + initialHeigh), new Point(e, client_packets[test_counter].received_t + initialHeigh)));
	client_shipping[test_counter].strokeWidth = 12;
	client_shipping[test_counter].strokeColor = 'black';
	client_shipping[test_counter].onMouseDown = function (event) {
		var texto = new PointText (event.point);
		texto.content = "Packet Info: \n JAJAJAJAJAJAJA";
		texto.fillColor = 'red';
		this.onMouseLeave = function () {
			texto.content = '';		
		};
	};	
	
	
	server_shipping.push(new Path.Line(new Point(e , server_packets[test_counter].send_t + initialHeigh), new Point(a, server_packets[test_counter].received_t + initialHeigh)));
	server_shipping[test_counter].strokeWidth = 12;
	server_shipping[test_counter].strokeColor = 'black';
	server_shipping[test_counter].onMouseDown = function (event) {
		var texto = new PointText (event.point);
		texto.content = "Packet Info: \n JAJAJAJAJAJAJA";
		texto.fillColor = 'red';
		this.onMouseLeave = function () {
			texto.content = '';		
		};
	};

}



console.log(packet_track);


/*var element;
for (element = 1, element <= 3; element++){
	//var packet_track = new Path.Line(new Point(a,parseInt(client_send[i].send_t) + initialHeigh), new Point(e,parseInt(client_send[i].received_t) + initialHeigh));
	//packet_track.strokeColor = 'black';
	console.log(parseInt(client_send[element].send_t));
};*/


/*
iniTest.onFrame = function (event) {
	var x_offset = a;
	var y_offset = 100;
	if (event.count < canvas_width) {
		x_offset = parseInt(x_offset + event.count);
	};
	if (event.count < 300) {
		y_offset = parseInt(y_offset + event.count)
	}
	
	iniTest.add(new Point(x_offset, y_offset ));

}
*/


/*
var clientLine = new Path.Line(serverTop, serverBottom);
clientLine.strokeColor = 'black';
clientLine.strokeWidth = 40 ; 
*/

/*
 for( i = 100; i < canvas_width ; i=i+(canvas_width/5)){
	var myCircle = new Path.Rectangle(new Point(i, 70), 50);
	myCircle.fillColor = 'black';

	myCircle.onFrame = function () {
		this.rotate(3);
	};
};*/


/*
//Data Structures
var sourceDevice = {
	ipAddress : "",
	macAddress : "",
	//HTTP Protocol Variables
	httpRequest : "" ,
	httpObjectRequested : "" ,
	httpVersion : "" ,
	httpHeaders : "" ,
	httpRequestMessageBody : "" ,
	//TCP Protocol Variables
	sourcePort : "" ,
	initialSequenceNumber : "" ,
	tcpWindow : "" ,
	tcpPort: 80 ,
	tcpPersistent : false ,
	//UDP Protocol Variables
	udpPort: "" ,
	//IP Protocol Variables
	ipVersion : "",
	ipTOS : "" ,
	ttl : "" ,
	ipSourceAddress : "",
	//Methods
	
	setIpAddress = function (ipAddress) {
		set this.ipAddress(ipAddress);
	}:
	
	setmacAddress = function (macAddress) {
		set this.macAddress(macAddress);
	};
	
	setHttpRequest = function (httpRequest) {
		set this.httpRequest(httpRequest);
	};
	
	setHttpObjectRequested = function (httpObjectRequested) {
		set this.httpObjectRequested(httpObjectRequested):	
	};
	
	setHttpVersion = function (httpVersion) {
		set this.httpVersion(httpVersion);
	};
	
	setHttpHeaders = function (httpHeaders) {
		set this.httpHeaders(httpHeaders);
	}:
	
	setHttpRequestMessageBody = function (httpRequestMessageBody) {
		set this.httpRequestMessageBody(httpRequestMessageBody);	
	};
	
	setSourcePort = function (sourcePort) {
		set this.sourcePort(sourcePort);
	};
	
	setInitialSequenceNumber = function (initialSequenceNumber) {
		set this.initialSequenceNumber(initialSequenceNumber);	
	}
	
	httpRequestObject = function (server,request, nObjects, sizeOfObjects) {
			//
			var requestPacket = {
				httpMethod : request ,
				httpObjectRequested : this.httpObjectRequested ,
				httpVersion : this.httpVersion ,
				httpHeaders : this.httpRequestHeaders ,
				httpRequestMessageBody : this.httpRequestMessageBody			
			};
			var httpResponse = httpserver.getRequestResponse(requestPacket);
			// http_to_tcp(requestPacket, httpResponse)
			
	};
	
};
*/