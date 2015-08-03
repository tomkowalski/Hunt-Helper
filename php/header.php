<?php
	function head($path, $page) {
		$out = <<<__HTML
			<!DOCTYPE html>
			<html>
				<head>
					<meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    				<meta charset="utf-8">
    				<title>Husky Hunt Helper: $page</title>
					<link href='http://fonts.googleapis.com/css?family=Arimo:400,700,700italic,400italic|Droid+Sans:400,700' rel='stylesheet' type='text/css'>
					<link rel="stylesheet" type="text/css" href="$path/css/main.css">
					<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
__HTML;
		$width = 30;
		if($_SESSION["set"]) {
			$width = 17;
		}
		if($page == "Map")	{
			$out .= <<<__HTML
			<script type="text/javascript" src="$path/js/init_map.js"></script>
__HTML;
		}	
		$out .= "<style>
				nav li {
					width: $width%;
				}
			</style>
			</head>";
		$out .= nav($path, $page);
		return $out;
	}
	function nav($path, $page) {
		$out = "";
		if( $_SESSION["set"]) {
			require_once('../php/db_login.php');
			$conn = login();		
			$userID = $_SESSION["ID"];
			$result = $conn->query("SELECT * FROM user WHERE ID='$userID'");
			$row = $result->fetch_assoc();
			$groupID = $row['groupKey'];
			$name = $row['username'];
			$result = $conn->query("SELECT name FROM userGroup WHERE ID='$groupID'");
			$row = $result->fetch_assoc();
			$group = $row['name'];
			$conn->close();
			$result->close();
			$out = <<<__HTML
			<nav> 
					<img src="$path/assets/logo(small).png">
					<ul>
						<li><a href="$path/index.php"> Map </a></li>
						<li> $group </li>
						<li> Location </li>
						<li> My Route </l1>
						<li><a href="$path/login.php"> my $name </a></li>
					</ul>
				</nav>
__HTML;
		}
		else {
			//$_SESSION["set"] = false;
			$out = <<<__HTML
			<nav> 
					<img src="$path/assets/logo(small).png">
					<ul>
						<li><a href="$path/index.php"> Map </a></li>
						<li> Location </li>
						<li><a href="$path/login.php"> Login</a>
 </l1>
					</ul>
				</nav>
__HTML;
		}
		return $out;
	}
?>
