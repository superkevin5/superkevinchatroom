var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);

server.listen(process.env.PORT || 3001);
console.log('Server Running...');

var users = [];
app.use("/scripts", express.static(__dirname + '/public/js/bower_components'));


app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
	console.log('Socket Connected...');

	// Send Message
	socket.on('send message', function(data){
		io.sockets.emit('new message', {msg: data,user:socket.username});
	});


	socket.on('userlogin',function(data){
		socket.username = data;
		users.push(data);
		console.log(data);
		io.sockets.emit('numberOfusers', users);
	});


	socket.on('disconnect',function(data){


		if(!socket.username){
			return;
		}
		console.log('Socket '+socket.username + ' Connected...');
		users.splice(users.indexOf(socket.username), 1);		
	});


});