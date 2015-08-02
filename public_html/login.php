<?php
	require_once('../php/header.php');
	if($_COOKIE["set"]) {
		echo "set", head(".", "Login");
	}
	else {
		if(setcookie("set", true, 0, '/')) {
			
			echo head(".", "Login");
		}	
		else {
			echo "error";
		}
	}
	echo foot(".");
?>