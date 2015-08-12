<?php
	session_start();
	require_once('../php/header.php');
	require_once('../php/footer.php');
	$body =  <<<__HTML
	<body>
		<input id="auto-c" class="controls" type="text" placeholder="Enter a location">
		<div id="map-canvas"> <h1>Please enable javascript <h1></div>
		<div class="form">
			<input id="save" type='button' value="Save Places">
		</div>
	</body>
__HTML;
	echo head(".", "Map");
	echo $body;
	echo foot(".");  

?>
