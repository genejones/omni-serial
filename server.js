var express = require("express"),
    fs = require('fs');
    
var app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server);

var index = fs.readFileSync("index.html", "utf8");

//CORS middleware taken from http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', config.allowedDomains);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(express.bodyParser());
app.use(allowCrossDomain);

server.listen(80);

app.get("/", function(req, res, next){
    res.send(index);
});

app.post("/serialIn", function (req, res, next) {
    io.sockets.emit("serialIn", req.body);
    res.send({});
});


var send_options = {
    host: '',
    port : 80,
    path: '/sendSerial',
    method: 'POST'
};

io.sockets.on('connection', function (socket) {
  socket.on('sendSerial', function (data) {
    console.log(data);
    req = http.request(send_options, function(res) {
        console.log('STATUS: ' + res.statusCode);
    });
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });
    
    req.write(data);
    req.end();
  });
});