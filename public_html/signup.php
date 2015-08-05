<?php
	require_once('../php/header.php');
	require_once('../php/footer.php');
	require_once('../php/db_util.php');
	session_start();
	if($_SESSION["set"]) {
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
					include("group_signup.php");
					$body = group($_POST["uName"]);
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
			$body .= <<<__HTML
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
		$f = $_POST["fName"];
		$l = $_POST["lName"];
		$u = $_POST["uName"];
		$p = $_POST["pass"];
		$e = $_POST["email"];
		$id = null;
		$g = null;
		$sg = null;
		if(getOne("SELECT * FROM user WHERE username='$u'", 'username') != "No Results") {
			$out = "That user name is already taken <br>";
		}
		if(getOne("SELECT * FROM user WHERE email='$e'", 'email') != "No Results") {
			$out .=  "That email is already taken <br>";
		}
		if($out == "") {
			//require_once('../php/db_util.php');
			$conn = login();
			$in = $conn->prepare('INSERT INTO user VALUES(?, ?, ?, ?, ?, ?, ?, ?)');
			$in->bind_param("sssssiii", $f, $l, $u, $p, $e, $g, $id, $sg);
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
?>
