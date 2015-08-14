<?php
session_start();
require_once('../php/header.php');
require_once('../php/footer.php');
require_once('../php/db_util.php');
	$body = <<<__HTML
	<body>
		<h2 style="text-align:left; padding-left:1.5em;"> Multiple location input </h2>
		<textarea id="mass_place" name="Text1" placeholder="Enter multiple places one on each line:" ></textarea>
		<input id="mass_save" type="button" value="Add Places" style="margin-left:1em; margin-bottom:1em;">
	</body>
__HTML;
	echo head(".", "Location");
	echo $body;
	echo foot(".");  
//<h2 style="text-align:left; padding-left:1.5em;"> Locations </h2>
?>