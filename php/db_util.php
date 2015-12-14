<?php 
	function login() {
		require('secret.php'); //Conatins $hn, $un, $pw, $db
		require('db_table_init.php');
		$conn = new mysqli($hn, $un, $pw, $db);
		if($conn->connect_error) {
			die($conn->connect_error);
		}
		else {
			$success = $conn->query($user);
			$success = $success && $conn->query($place);
			$success = $success && $conn->query($userGroup);
			if($success) {		
				return $conn;
			}
			else {
				die($conn->error);
			}
		}
	}
	function getOne($query, $key) { //Allows for retriving a single emlement from $query based on $key.
		$conn = login();
		$result = $conn->query($query);
		if(!$result) {
			$out = "No Results";
		}
		else {
			$row = $result->fetch_assoc();
			$out = $row[$key];	
			$result->close();
		}
		$conn->close();
		return $out;
	}
	
?>