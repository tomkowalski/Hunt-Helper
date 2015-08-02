<?php
	if(session_status() == PHP_SESSION_NONE) {
		session_start();
	}	
	require_once('../php/header.php');
	require_once('../php/footer.php');
	if($_SESSION["set"]) {
		if(isset($_POST['set'])) {
			$_SESSION['set']=false;
			include("index.php");
		}
		else {
			echo head(".", "Login");
			echo <<<__HTML
			<form method="post" action="login.php">
				<input type="hidden" name="set" value="false">
				log out? <input type="Submit" value="Log Out">
			</form>
__HTML;
		echo foot(".");
		}
	}
	else {
		if(isset($_POST['uName'])
		&& isset($_POST['pWord'])) {
			$_SESSION['set'] = true;
			include("index.php");
		}
		else {
			echo head(".", "Login");
			echo <<<__HTML
			<form method="post" action="login.php">
				User Name: <input type="text" name="uName"> <br>
				Password: <input type="password" name="pWord">
				<input type="submit" value="Submit">
			</form>
__HTML;
		echo foot(".");
		}
	}

?>