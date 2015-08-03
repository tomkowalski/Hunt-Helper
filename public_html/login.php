<?php
	session_start();	
	require_once('../php/header.php');
	require_once('../php/footer.php');
	require_once('../php/db_login.php');
	$conn = login();
	if($_SESSION["set"]) {			
		if(isset($_POST['set'])) {
			session_unset();
			session_destroy();
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
			$name = $_POST['uName'];
			$pass = $_POST['pWord'];
			$result = $conn->query("SELECT ID FROM user 
				WHERE username='$name' AND pass='$pass'");
				if($result->num_rows > 0) {
					$row = $result->fetch_assoc();
					$_SESSION['ID'] = $row['ID'];
					$_SESSION['set'] = true;
				}
			$conn->close();
			$result->close();
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