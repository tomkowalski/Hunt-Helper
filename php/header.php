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
		if(isset($_SESSION["ID"])) {
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
		if(isset($_SESSION["ID"])) {
			require_once('db_util.php');
			$userID = $_SESSION["ID"];
			$groupID = getOne("SELECT * FROM user WHERE ID='$userID'", 'group_key');
			$name = getOne("SELECT * FROM user WHERE ID='$userID'", 'username');
			$group = getOne("SELECT name FROM userGroup WHERE ID='$groupID'", 'name');
			$out = <<<__HTML
			<nav> 
					<img src="$path/assets/logo(small).png">
					<ul>
						<li><a href="$path/index.php"> Map </a></li>
						<li id='group'> $group </li>
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
