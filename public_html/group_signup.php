<?php
session_start();
require_once('../php/header.php');
require_once('../php/footer.php');
require_once('../php/db_util.php');
if(isset($_POST["type"])) {
	$uname = $_SESSION["temp_uname"];
	if($_POST["type"] == 'old'){
		$body = change();
	}
	else{
		if(isset($_POST["name"]) 
		&& $_POST["name"] != "") {
			$pass = true;
			if(isset($_POST["pass"])
			|| isset($_POST["passconf"])) {
				if(escaped($_POST["pass"]) != escaped($_POST["passconf"])){
					$pass = false;
					$body = "Passwords do not Match" . group($uname);
				}
			}
			if($pass) {
				$gname = escaped($_POST["name"]);
				$result = getOne("SELECT * FROM userGroup WHERE name='$gname'", "name");
				if($result == "No Results" || $result == ""){
					$out = gprep();
					if($out == 1) {
						$body = "<h1> Group created </h1>" . change();
					}
					else {
						$body = $out . group($uname);
					}
				}
				else {
					$body = "Group name already taken" . group($uname);
				}
			}
		}
		else {
			$body = "Not all fields set" . group($uname);
		}
	}
}
else {
	if(isset($_SESSION['ID'])) {
		require_once("../php/db_util.php");
		$id = $_SESSION['ID'];
		$_SESSION['temp_uname'] = getOne("SELECT * FROM user WHERE ID='$id'","username");
		$body = group();
	}
	else {
	$body = "<h1> Please log in or sign up </h1>";
	}
}
if($_SESSION["signup"] != "YES") {
	echo head(".", "Sign Up");
	echo $body;
	echo foot(".");
}

function group() {
	session_start();
		return <<<__HTML
		<h1> Join a Group: </h1>
				<div class="form">
					<form method="post" action="group_signup.php">
						<input type="hidden" name="type" value="old"><br>
						Group Name: <br><input type = "text" name="name"><br>
						Password(Can be left blank):  <br><input type = "password" name="pass"><br>
						<input type="submit" value="Join Group!">
					</form>
				</div>
		<h1> Or Create a new one below: </h1>
				<div class="form">
					<form method="post" action="group_signup.php">
						<input type="hidden" name="type" value="new"><br>
						Group Name: <br><input type = "text" name="name"><br>
						Password(Can be left blank):  <br><input type = "password" name="pass"><br>
						Password Confirm(Can be left blank):  <br><input type = "password" name="passconf"><br>
						<input type="submit" value="Create Group">
					</form>
				</div>
__HTML;
}
function gprep() {
	$n = escaped($_POST["name"]);
	$p = password_hash(escaped($_POST["pass"]), PASSWORD_DEFAULT);
	$id = null;
	require_once('../php/db_util.php');
	$conn = login();
	$in = $conn->prepare('INSERT INTO userGroup VALUES(?, ?, ?)');
	$in->bind_param("ssi", $n, $p, $id);
	$in->execute();
	$out = $in->affected_rows;
	$in->close();
	$conn->close();
	if($out == 0) {
		$out = "Group could not be created";
	}
	return $out; 
}
function change(){
	$gName = escaped($_POST["name"]);
	require_once("../php/db_util.php"); 
	if(isset($_SESSION["ID"])){
		$uID = $_SESSION["ID"];
	}
	else {
		$uname = $_SESSION["temp_uname"];
		$uID = getOne("SELECT * FROM user WHERE username='$uname'","ID");
	}
	$gPass = escaped($_POST["pass"]);
	$groupID = getOne("SELECT * FROM userGroup WHERE name='$gName'", "ID");
	if($groupID != "No Results") {
		//echo password_hash($gPass, PASSWORD_DEFAULT) . "\n" . getOne("SELECT * FROM userGroup WHERE ID='$groupID'", "pass");
		if(password_verify($gPass, getOne("SELECT * FROM userGroup WHERE ID='$groupID'", "pass"))) {
			$conn = login();
			$result = $conn->query("UPDATE user SET group_key='$groupID' WHERE ID='$uID'");
			if($result) {
				$out = <<<__HTML
					<h2> Joined $gName </h2>
__HTML;
				}
			else {
				$out= <<<__HTML
					<h1> Error joining $gName </h1>
__HTML;
			}
			$conn->close();
		}
		else {
			$out = "group Name or Password is Incorrect";
			$out .= group($uname);
		}
	}
	else {
			$out = "Group Name or Password is Incorrect";
			$out .= group($uname);
	}
	return $out;
}
function escaped($str) {
		$conn = login();
		$str = $conn->real_escape_string($str);
		return htmlspecialchars($str);
	} 
?>
