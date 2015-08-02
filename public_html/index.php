<?php
	require_once('../php/header.php');
	require_once('../php/footer.php');
	require_once('../php/db_login.php');
	
	login();
	echo head(".", "Map");
	echo <<<__HTML
	<body>
		<div id="map-canvas"> </div>
	</body>
__HTML;
	echo foot(".");  

?>
