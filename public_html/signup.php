<?php
	require_once('../php/header.php');
	require_once('../php/footer.php');
	require_once('../php/db_util.php');
	session_start();
	$body = null;
	if(isset($_SESSION["ID"])) {
		$body .= "already signed in";
	}
	else {
		if(isset($_POST["set"])) {
			if(isset($_POST["fName"])
			&& isset($_POST["lName"])
			&& isset($_POST["uName"])
			//&& isset($_POST["gName"])
			&& isset($_POST["pass"])
			//&& isset($_POST["passConf"])
			&& isset($_POST["email"])
			//&& isset($_POST["emailConf"])
			/*&& isset($_POST["gPass"])*/) {
				$rows = prep();
				if($rows == 1) {	
					$_SESSION["signup"] = "YES";
					$_SESSION["temp_uname"] = escape($_POST["uName"]);
					include("group_signup.php");
					$body = group();
					$_SESSION["signup"] = null;
				}
				else {
					$_SESSION["error"] = $rows;
				}
			}
			else {
				$_SESSION["error"] = "Not all Fields set";
			}
		}
		$error = $_SESSION["error"];
		if($body == null) {
			$body = <<<__HTML
			$error
			<h1> Sign up below: </h1>
			<div class="form">
				<form method="post" action="signup.php">
					<input type="hidden" name="set" value="yes"><br>
					First Name: <br><input type = "text" name="fName"><br>
					Last Name:  <br><input type = "text" name="lName"><br>
					User Name:  <br><input type = "text" name="uName"><br>
					Password:   <br><input type = "password" name="pass"><br>
					Email:      <br><input type = "email" name="email"><br>
					<input type="submit" value="Sign up!">
				</form>
			</div>
__HTML;
		$_SESSION["error"] = null;
		}
	}
	echo head(".", "Sign Up");
	echo $body;
	echo foot(".");
	//Password Confirm: <input type = "password" name="passConf"> <br>
	//Email Confirm: <input type = "email" name="emailConf"><br>
	//Group Password: <input type = "password" name="gPass"><br>
	function prep() {
		$f = escape($_POST["fName"]);
		$l = escape($_POST["lName"]);
		$u = escape($_POST["uName"]);
		$p = escape($_POST["pass"]);
		$e = escape($_POST["email"]);
		$id = null;
		$g = null;
		$sg = null;
		$lat = 38.3941;
		$lng = -97.0167;
		$zoom = 4;
		$out = "";
		$result = getOne("SELECT * FROM user WHERE username='$u'", 'username');
		if($result != "No Results" && $result != "") {
			$out = "That user name is already taken <br>";
		}
		$result = getOne("SELECT * FROM user WHERE email='$e'", 'email');
		if($result != "No Results" && $result != "") {
			$out .=  "That email is already taken <br>";
		}
		$hash = password_hash($p, PASSWORD_DEFAULT);
		if(!$hash) {
			$out .= "Error try again";
		}
		if($out == "") {
			//require_once('../php/db_util.php');
			$conn = login();
			$in = $conn->prepare('INSERT INTO user VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
			$in->bind_param("sssssiiiddi", $f, $l, $u, $hash, $e, $g, $sg, $lat, $lng, $zoom, $id);
			$in->execute();
			$out = $in->affected_rows;
			$in->close();
			$conn->close();
			if($out == 0) {
				$out = "User could not be added";
			}
		}
		return $out; 
	}
	function escape($str) {
		$conn = login();
		$str = $conn->real_escape_string($str);
		return htmlspecialchars($str);
	} 
?>
