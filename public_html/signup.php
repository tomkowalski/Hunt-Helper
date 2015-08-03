<?php
	require_once('../php/header.php');
	require_once('../php/footer.php');
	require_once('../php/db_login.php');
	session_start();
	$conn = login();
	echo head(".", "Sign Up");
	if($_SESSION["set"]) {
		echo "already signed in";
		$conn->close();
	}
	else {
		session_start();
		if(isset($_POST["set"])) {
			if(isset($_POST["fName"])
			&& isset($_POST["lName"])
			&& isset($_POST["uName"])
			&& isset($_POST["gName"])
			&& isset($_POST["pass"])
			//&& isset($_POST["passConf"])
			&& isset($_POST["email"])
			//&& isset($_POST["emailConf"])
			/*&& isset($_POST["gPass"])*/) {
				$groupN = $_POST["gName"];
				$groupQ = "SELECT ID FROM userGroup WHERE name='$groupN'"; 
				$result = $conn->query($groupQ);
				if($result->num_rows > 0){
					$row = $result->fetch_assoc();
					$g = $row['ID'];
					$in = $conn->prepare('INSERT INTO user VALUES(?, ?, ?, ?, ?, ?, ?, ?)');
					$in->bind_param("sssssiii", $f, $l, $u, $p, $e, $g, $id, $sg);
					$f = $_POST["fName"];
					$l = $_POST["lName"];
					$u = $_POST["uName"];
					$p = $_POST["pass"];
					$e = $_POST["email"];
					$id = null;
					$sg = null;
					$in->execute();
					if($in->affected_rows > 1){
						echo("<h1> USER MADE </h1>  $rows");
					}
					$in.close();
					$conn.close();
					$result.close();
					}
				}
				else {
					$_SESSION["error"] = "Not all Fields set";
				}
			}
			else {
			$error = $_SESSION["error"];
			echo <<<__HTML
			$error
			<form method="post" action="signup.php">
				<input type="hidden" name="set" value="yes"><br>
				First Name: <input type = "text" name="fName"><br>
				Last Name: <input type = "text" name="lName"><br>
				User Name: <input type = "text" name="uName"><br>
				Password: <input type = "password" name="pass"><br>
				Email: <input type = "email" name="email"><br>
				Group: <input type = "text" name="gName"><br>
				<input type="submit" value="Sign up!">
			</form>
__HTML;
			}
		}
	echo foot(".");
	//Password Confirm: <input type = "password" name="passConf"> <br>
	//Email Confirm: <input type = "email" name="emailConf"><br>
	//Group Password: <input type = "password" name="gPass"><br>
		

?>
