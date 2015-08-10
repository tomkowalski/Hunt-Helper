<?php
	session_start();	
	require_once('../php/header.php');
	require_once('../php/footer.php');
	require('../php/db_util.php');
	if(isset($_SESSION["ID"])) {			
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
			$name = escape($_POST['uName']);
			$pass = escape($_POST['pWord']);
			$result = getOne("SELECT ID FROM user 
				WHERE username='$name'", 'ID');
			if($result != "No Results") {
				$id = $result;
				$result = getOne("SELECT pass FROM user 
				WHERE ID='$id'", 'pass');
				if(password_verify($pass ,$result)) {
					$_SESSION['ID'] = $id;
				}
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
	function escape($str) {
		$conn = login();
		$str = $conn->real_escape_string($str);
		return htmlspecialchars($str);
	} 

?>