<?php
	//$path is to root of public_html directory 
	//$page is the name of the page the header is for. 
	function head($path, $page) {

		$out = <<<__HTML
			<!DOCTYPE html>
			<html>
				<head>
					<meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    				<meta charset="utf-8">
    				<title>Husky Hunt Helper: $page</title>
					<link href='http://fonts.googleapis.com/css?family=Arimo:400,700,700italic,400italic|Droid+Sans:400,700' rel='stylesheet' type='text/css'>
					<link rel="icon" href="http://www.huskyhunthelper.com/favicon.ico" type="image/x-icon"> 
					<link rel="stylesheet" type="text/css" href="$path/css/main.css">
					<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
__HTML;
		$width = 30; //changes width of menu options based on if a user is logged in.
		if(isset($_SESSION["ID"])) {
			$width = 17;
		}
		if($page == "Map")	{ //scripts and css needed for Map page
			$out .= <<<__HTML
			<script type="text/javascript" src="$path/js/init_map.js"></script>
			<link rel="stylesheet" href="$path/css/multiple-select.css"/>
			<script src="$path/js/jquery.multiple.select.js"></script>

__HTML;
		}	
		if($page == "Location") { //Script and css needed for Location page
			$out .= <<<__HTML
		<script type="text/javascript" src="$path/js/save_places.js"></script>
__HTML;
		}
		if($page == "Routes") { //Script and css needed for Route page
			$out .= <<<__HTML
		<link rel="stylesheet" href="$path/css/multiple-select.css"/>
		<link rel="stylesheet" href="$path/css/route.css"/>
		<script src="$path/js/jquery.multiple.select.js"></script>
		<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?libraries=places&js?v=3.21$key=AIzaSyA0lAOq5lLPLFlJ6mxDOIvJK_5y1WBE28Y&signed_in=false"></script>
		<script type="text/javascript" src="$path/js/route.js"></script>
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
	//Creates a navigation bar based on if a user is signed in.
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
						<li><a href="$path/index.php">Map</a></li>
						<li id='group'>$group</li>
						<li><a href='$path/location.php'>Location</a></li>
						<li><a href='$path/route.php'>Routes</a></li>
						<li id='user'><a href="$path/login.php">My $name</a></li>
					</ul>
				</nav>
__HTML;
		}
		else {
			$out = <<<__HTML
			<nav> 
					<img src="$path/assets/logo(small).png">
					<ul>
						<li><a href="$path/index.php">Map</a></li>
						<li><a href='location.php'>Location</a></li>
						<li id='user'><a href="$path/login.php">Login</a>
 </l1>
					</ul>
				</nav>
__HTML;
		}
		return $out;
	}
?>
