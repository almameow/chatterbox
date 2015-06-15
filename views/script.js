//Call this outside of the $(document).ready because we want the alert to show before the page loads
var socket = io.connect();
var user_id = 0;
var user_name = prompt("Your Name:");
username(user_name);

// If user doesn't enter a name, promt again
function username(user_name){
	if( user_name === "" ){ 
		user_name = prompt("Your Name:");
		username(user_name);
	}
	else{
		socket.emit("new_user", user_name);
	}
};


$(document).ready(function(){
	//Load all entries in the board
	socket.on("load_board", function(data){
		$(".board").html(data.board);
		user_name = data.user_name;
		user_id = data.id;
		console.log("User's name is : " + user_name);
		console.log("User's id is : " + user_id);
	})

	//Add new board entry
	$("button").click(function(){
		event.preventDefault();
		socket.emit("add_message", 
			{message: $(".comment").val(),
					name: user_name}
			);
		$(".comment").val("");
	})

	// Update board with new post
	socket.on("new_post", function(data){
		$(".board").html(data);
	})
	
	// FadeIn message to all other users when a new user joins
	socket.on("user_joined", function(data){
		$(".secret").fadeIn(3000, function(){
			var secret_msg = data + " joined the chat room.";
			$(".secret").html(secret_msg);
			$(".secret").fadeOut(2000);
		})
	})
})