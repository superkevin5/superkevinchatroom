var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

server.listen(process.env.PORT || 3001);
console.log('Server Running...');


var history = [];
var historyMessage = [];

var users = [];
app.use("/scripts", express.static(__dirname + '/public/js/bower_components'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});


app.get('/history', function(req, res){
	res.json(history);
});

io.sockets.on('connection', function(socket){
	console.log('Socket Connected...');

	// Send Message
	socket.on('send message', function(data){
		historyMessage.push(socket.username + ': '  +data);
		io.sockets.emit('new message', {msg: data,user:socket.username});
	});


	socket.on('userlogin',function(data){
		socket.username = data;
		users.push(data);
		history.push({username:data, time: new Date()});
		console.log(data);
		io.sockets.emit('numberOfusers', users);
		io.sockets.emit('totalnumber', history.length);
		io.sockets.emit('historyMessage', historyMessage);
	});


	socket.on('disconnect',function(data){

		if(!socket.username){
			return;
		}
		console.log('Socket '+socket.username + ' Connected...');
		users.splice(users.indexOf(socket.username), 1);		
	});


});