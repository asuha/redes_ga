const serverPort = 8080;

var WebSocketServer = require('websocket').server;

var http = require('http');

var mSocket = new Map();
var socketCount = 1;

//create http server
var server = http.createServer(function(request, response) {});

//starts http server in port 8080
server.listen(serverPort, function() {
  console.log(`Listening on port ${serverPort}`);
});

//Creates Web Socket layer
var wsServer = new WebSocketServer({
  httpServer: server
});

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
  console.log(`Connection from origin ${request.origin}.`);

  var connection = request.accept(null, request.origin);

  console.log('Connection accepted.');

  mSocket.set(socketCount, connection);
  connection.send(JSON.stringify({ id: socketCount++ }));

  //callback called when a message is received
  connection.on('message', function(message) {
    if (!JSON.parse(message.utf8Data)) return;
    console.log(message.utf8Data);
    var oMessage = JSON.parse(message.utf8Data);

    if (oMessage.lat && oMessage.lng) {
      mSocket.forEach((value, key) => {
        //if (key === oMessage.id) return;
        mSocket.get(key).send(JSON.stringify(oMessage));
      });
    }
  });

  //callback called when connection is closed
  connection.on('close', function() {
    //Execute something before closing the web socket
  });
});
