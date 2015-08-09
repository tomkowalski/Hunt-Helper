<?php 
	function login() {
		require('secret.php');
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
	function getOne($query, $key) {
		$conn = login();
		$result = $conn->query($query);
		if($result) {
			$row = $result->fetch_assoc();
			$out = $row[$key];
		}
		else {
			$out = "No Results";
		}
		$conn->close();
		$result->close();
		return $out;
	}
	
?>