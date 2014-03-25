<!DOCTYPE html>
<html>
<link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
<script src="http://code.jquery.com/jquery-latest.js"></script>
<script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>
<body>  
	<h1>Recover Password</h1>
<?php 
	if (isset($errorMsg)) {
		echo "<p>" . $errorMsg . "</p>";
	}

	echo form_open('account/recoverPassword');
	echo form_label('Email'); 
	echo form_error('email');
	echo form_input('email',set_value('email'),"required");
	echo form_submit('submit', 'Recover Password');
	echo form_close();
?>	
</body>

</html>

