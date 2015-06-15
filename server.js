var express = require("express");
var path = require("path");
var app = express();

app.use(express.static(path.join(__dirname, "./static")));
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

app.get("/", function(request, response){
	response.render("index");
});

var server = app.listen(8000, function(){
	console.log("listening on port 8000");
});

var board = [];
var user_id = 0;

var io = require("socket.io").listen(server);

io.sockets.on("connection", function(socket){
	// Listen for new user to join
	socket.on("new_user", function(data){
		user_id++;
		var user_data = {id: user_id, 
			user_name: data,
			board: board};
		// Emit entire board to new user only
		socket.emit("load_board", user_data);

		// Push message to board that new user has joined
		board.push("<p class='text-right'><em>" + data + " has joined the Chatter Box.</em></p>");
		// Emit new board to all users
		io.emit("new_post", board);
	});

	socket.on("add_message", function(data){
		board.push("<p><b>" + data.name + "</b>: " + data.message + "</p>");
		io.emit("new_post", board);
	});
});