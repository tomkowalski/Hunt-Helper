<?php
	session_start();	
	require_once('../php/header.php');
	require_once('../php/footer.php');
	require('../php/db_util.php');
	if($_SESSION["set"]) {			
		if(isset($_POST['set'])) {
			session_unset();
			session_destroy();
			include("index.php");
		}
		else {
			echo head(".", "Login");
			echo <<<__HTML
			<h1> Log Out? </h1>
			<div class="form">
			<form method="post" action="login.php">
				<input type="hidden" name="set" value="false">
				<input type="Submit" value="Log Out">
			</form>
			</div>
			<h1> Change Group </h1>
			<div class="form">
			<form method="post" action="group_signup.php">
				<input type="hidden" name="change" value="true">
				<input type="Submit" value="Change Group">
			</form>
			</div>
__HTML;
		echo foot(".");
		}
	}
	else {
		if(isset($_POST['uName'])
		&& isset($_POST['pWord'])) {
			$name = $_POST['uName'];
			$pass = $_POST['pWord'];
			$result = getOne("SELECT ID FROM user 
				WHERE username='$name' AND pass='$pass'", 'ID');
			if($result != "No Results") {
				$_SESSION['ID'] = $result;
				$_SESSION['set'] = true;
			}
			include("index.php");
		}
		else {
			echo head(".", "Login");
			echo <<<__HTML
			<h1> Login in: </h1>
			<div class="form">
			<form method="post" action="login.php">
				User Name: <br><input type="text" name="uName"> <br>
				Password:  <br><input type="password" name="pWord">
						   <br><input type="submit" value="Log In">
			</form>
			<a href="signup.php"> or Sign Up </a>
			</div>
__HTML;
		echo foot(".");
		}
	}

?>