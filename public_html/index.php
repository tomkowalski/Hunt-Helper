<?php
	session_start();
	require_once('../php/header.php');
	require_once('../php/footer.php');
	echo head(".", "Map");
	echo <<<__HTML
	<body>
		<div id="map-canvas"> <h1>Please enable javascript <h1></div>
	</body>
__HTML;
	echo foot(".");  

?>
