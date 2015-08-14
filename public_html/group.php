<?php
session_start();
require_once('../php/header.php');
require_once('../php/footer.php');
require_once('../php/db_util.php');
	$body = <<<__HTML
	<body>
	</body>
__HTML;
	echo head(".", "Group");
	echo $body;
	echo foot(".");  

?>