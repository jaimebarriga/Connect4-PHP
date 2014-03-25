// if (!Array.prototype.last){
//     Array.prototype.last = function(){
//         return this[this.length - 1];
//     };
// };

$(function(){
	
	var board_array = new Array(7);
	for (var i = 0; i < 7; i++) {
		board_array[i] = new Array(6);
	}
	for (var i = 0; i < 7; i++) {
		for(var j = 0; j < 6; j++){
			board_array[i][j] = i+" "+j;
		}
	}

	
	var nextColor = "blue";
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
			var index = $(board_array[x_0]).index(place);
			board_array[x_0][place_tmp.length-1] = nextColor;
			place.addClass(nextColor).addClass("chip");
			// var string = "";
			// for (var i = 0; i < 6; i++) {
			// 	for(var j = 0; j < 7; j++){
			// 		string += board_array[j][i]+" , ";
			// 	}
			// 	string += "\n";
			// }
			// console.log(string);
			return true;
		}
		return true;
	}

	var nextPlayerColor = $('#next-player');
	function changePlayer(color){
		nextPlayerColor.removeClass().addClass(color+"-next");
	}

	function onClickDiv(){
		//Take event off to prevent multiple clicks
		$('aside div').off('click');
		$this = $(this);
		var success = placeChip($this);
		if(success){
			if(nextColor === "blue"){
				nextColor = "red";
			}
			else {
				nextColor = "blue";
			}
			changePlayer(nextColor);
		}
		$('aside div').on('click', onClickDiv);
	}

	$('aside div').on('click', onClickDiv);

});