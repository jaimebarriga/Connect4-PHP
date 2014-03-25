<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
<link rel="stylesheet" href="<?= base_url() ?>/css/style.css">
<script src="http://code.jquery.com/jquery-latest.js"></script>
<script src="<?= base_url() ?>/js/jquery.timers.js"></script>
<script>
$(function(){

	var otherUser = "<?= $otherUser->login ?>";
	var user = "<?= $user->login ?>";
	var status = "<?= $status ?>";

	$('body').everyTime(2000,function(){
		if (status == 'waiting') {
			$.getJSON('<?= base_url() ?>arcade/checkInvitation',function(data, text, jqZHR){
				if (data && data.status=='rejected') {
					alert("Sorry, your invitation to play was declined!");
					window.location.href = '<?= base_url() ?>arcade/index';
				}
				if (data && data.status=='accepted') {
					status = 'playing';
					$('#status').html('Playing ' + otherUser);
				}	
			});
		}
		var url = "<?= base_url() ?>board/getMsg";
		$.getJSON(url, function (data,text,jqXHR){
			if (data && data.status=='success') {
				var conversation = $('[name=conversation]').val();
				var msg = data.message;
				if (msg.length > 0)
					conversation += "\n" + otherUser + ": " + msg;
					$('[name=conversation]').val(conversation);
			}
		});
	});

	$('form').submit(function(){
		var arguments = $(this).serialize();
		var url = "<?= base_url() ?>board/postMsg";
		$.post(url,arguments, function (data,textStatus,jqXHR){
			var conversation = $('[name=conversation]').val();
			var msg = $('[name=msg]').val();
			$('[name=conversation]').val(conversation + "\n" + user + ": " + msg);
		});
		return false;
	});	

});


</script>
<script src="<?= base_url() ?>/js/arcade/board.js"></script>
<script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
</head> 
<body>  
<div id="global-container-game">
<h1>Game Area</h1>

	<div class="row">
		<div class="col-sm-8 game-container">
			<div class="game">
				<aside>
					<div></div><div></div><div></div><div></div><div></div><div></div>
				</aside>
				<aside>
					<div></div><div></div><div></div><div></div><div></div><div></div>
				</aside>
				<aside>
					<div></div><div></div><div></div><div></div><div></div><div></div>
				</aside>
				<aside>
					<div></div><div></div><div></div><div></div><div></div><div></div>
				</aside>
				<aside>
					<div></div><div></div><div></div><div></div><div></div><div></div>
				</aside>
				<aside>
					<div></div><div></div><div></div><div></div><div></div><div></div>
				</aside>
				<aside>
					<div></div><div></div><div></div><div></div><div></div><div></div>
				</aside>	
				<div class="clearfix"></div>
			</div>
		</div>
		<div class="game-info col-sm-4">
			<div>
			Hello <?= $user->fullName() ?>  <?= anchor('account/logout','(Logout)') ?>  
			</div>

			<div id='status'> 
			<?php 
				if ($status == "playing")
					echo "Playing " . $otherUser->login;
				else
					echo "Wating on " . $otherUser->login;
			?>
			</div>

			<?php 
				echo form_textarea('conversation');
				
				echo form_open();
				echo form_input('msg');
				echo form_submit('Send','Send');
				echo form_close();
				
			?>

			<div id="next-player" class="blue-next"></div>
		</div>
	</div>

</div>
	
	
	
	
</body>

</html>

