// if (!Array.prototype.last){
//     Array.prototype.last = function(){
//         return this[this.length - 1];
//     };
// };

$(function(){

	var nextPlayerColor = $('#next-player');
	var nextColor;

	function updateMatchStateDB(matchState){
		var data = {matchStatus: JSON.stringify(matchState)};
		var urlUMS = baseURL+"board/updateMatchState";
		$.post(urlUMS, {matchState: JSON.stringify(matchState)}, function(data) {
			return data["matchState"];
		});
	}

	function updateBoardSlots(){
		var color;
		var div;
		for (var i = 0; i < 7; i++) {
			for(var j = 0; j < 6; j++){
				color = matchState["board"][i][j];
				div = $($('aside')[i]).find('div:nth-child('+(j+1)+')');
				div.removeClass().addClass(matchState["board"][i][j]);
				if(color == 'none'){
					div.removeClass();
				}
				else {
					div.addClass('chip');

				}
			}
		}
	}

	function getMatchState(){
		$.getJSON(baseURL+"board/getMatchState", function (data,text,jqXHR){
			matchState = data;
			nextColor = matchState["status"];
			nextPlayerColor.removeClass().addClass(matchState["status"]);
			var yourColor;
			if(matchState["host"] == user){
				yourColor = "blue";
			}
			else {
				yourColor = "red";
			}
			// console.log("match host: "+matchState["host"]);
			// console.log("match invitee: "+matchState["invitee"]);
			// console.log("You are "+user+"with color "+yourColor);
			// console.log("Plays next: "+matchState["status"]);
			if(user == matchState["host"] && matchState["status"] == "blue"){
				$('#game').removeClass().addClass('your-turn');
			}
			else if(user == matchState["invitee"] && matchState["status"] == "red"){
				$('#game').removeClass().addClass('your-turn');
			}
			else {
				$('#game').removeClass().addClass('their-turn');
			}
			updateBoardSlots();
		});
	}


	if(status == 'waiting') {
		var matchState = {};
		var board_array = new Array(7);
		for (var i = 0; i < 7; i++) {
			board_array[i] = new Array(6);
		}
		for (var i = 0; i < 7; i++) {
			for(var j = 0; j < 6; j++){
				board_array[i][j] = "none"
			}
		}
		matchState["board"] = board_array;
		matchState["host"] = user;
		matchState["invitee"] = otherUser;
		matchState["hostcolor"] = "blue";
		matchState["inviteecolor"] = "red";
		matchState["status"] = "waiting"; //blue red
	}
	else{
		getMatchState();
	}

	$('.their-turn').on('click', 'div', function(){alert("Not your turn")});

	$('body').everyTime(2000,function(){
		if (status == 'waiting') {
			$.getJSON(baseURL+'arcade/checkInvitation',function(data, text, jqZHR){
				if (data && data.status=='rejected') {
					alert("Sorry, your invitation to play was declined!");
					window.location.href = baseURL+'arcade/index';
				}
				if (data && data.status=='accepted') {
					matchState['status'] = "blue";
					updateMatchStateDB(matchState);
					$('#game').removeClass().addClass('your-turn');
					status = 'playing';
					$('#status').html('Playing ' + otherUser);
				}	
			});
		}
		else {
			if($('#game').hasClass('their-turn')){
				getMatchState();
			}
		}
		$.getJSON(baseURL+"board/getMsg", function (data,text,jqXHR){
			if (data && data.status=='success') {
				var conversation = $('[name=conversation]').val();
				var msg = data.message;
				if (msg){
					conversation += "\n" + otherUser + ": " + msg;
					$('[name=conversation]').val(conversation);
				}
			}
		});
	});

	$('form').submit(function(){
		var arguments = $(this).serialize();
		var url = baseURL+"board/postMsg";
		$.post(url,arguments, function (data,textStatus,jqXHR){
			var conversation = $('[name=conversation]').val();
			var msg = $('[name=msg]').val();
			$('[name=conversation]').val(conversation + "\n" + user + ": " + msg);
		});
		return false;
	});	

	function placeChip($this){
		var parent = $this.parent();
		var x_0 = $('aside').index(parent);
		var y_0 = parent.find('div').index($this);
		var place_tmp = $(parent.find('div:not(.chip)'));
		if(place_tmp.length == 0){
			return false;
		}
		else {
			var place = $(place_tmp[place_tmp.length-1]);
			var index = $(matchState["board"][x_0]).index(place);
			matchState["board"][x_0][place_tmp.length-1] = nextColor;
			place.addClass(nextColor).addClass("chip");
			$('#game').removeClass().addClass('their-turn');
			return true;
		}
		return true;
	}

	function changePlayer(color){
		matchState["status"] = color;
		nextPlayerColor.removeClass().addClass(color+"-next");
	}

	function onClickDiv(){
		//Take event off to prevent multiple clicks
		$('#game-container').off('click', '.your-turn div', onClickDiv);
		if(placeChip($(this))){
			if(nextColor === "blue"){
				nextColor = "red";
			}
			else {
				nextColor = "blue";
			}
			changePlayer(nextColor);
			matchState = updateMatchStateDB(matchState);
		}
		$('#game-container').on('click', '.your-turn div', onClickDiv);
	}

	$('#game-container').on('click', '.your-turn div', onClickDiv);


	$('#get-match-state').on('click', function(){
		console.log("Getting match state");
		$.getJSON(baseURL+"board/getMatchState", function (data,text,jqXHR){
			$('#php-receive').text(JSON.stringify(data));
		});
	});

});