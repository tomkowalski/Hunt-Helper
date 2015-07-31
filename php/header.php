<?php
	function head($path, $page) {
		$out = <<<__HTML
			<!DOCTYPE html>
			<html>
				<head>
					<link href='http://fonts.googleapis.com/css?family=Arimo:400,700,700italic,400italic|Droid+Sans:400,700' rel='stylesheet' type='text/css'>
					<link rel="stylesheet" type="text/css" href="$path/css/main.css">
					<script type="text/javascript" src="$path/js/test.js"></script>
					<title>Husky Hunt Helper</title>
				</head>
__HTML;
		$out .= nav($path, $page);
		return $out;
	}
	function nav($path, $page) {
		$out = "";
		if($_COOKIE["set"]) {
			$out = <<<__HTML
			<nav> 
					<img src="$path/assets/logo(small).png">
					<ul>
						<li><a href="$path/index.php"> Map </a></li>
						<li> Group </li>
						<li> Location </li>
						<li> My Route </l1>
						<li> My Account </li>
					</ul>
				</nav>
__HTML;
		}
		else {
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
