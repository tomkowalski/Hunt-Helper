<?php
	function head($path) {
		echo <<<__HTML
			<!DOCTYPE html>
			<html>
				<head>
					<link href='http://fonts.googleapis.com/css?family=Arimo:400,700,700italic,400italic|Droid+Sans:400,700' rel='stylesheet' type='text/css'>
					<link rel="stylesheet" type="text/css" href="$path/css/main.css">
					<script type="text/javascript" src="$path/js/test.js"></script>
					<title>Husky Hunt Helper</title>
				</head>
				<body>
					<h1>
						Husky Hunt Helper
					</h1>
					<p>
						A Scavenger Hunt Helper Website
					</p>
				</body>
			</html>
__HTML;
	}
?>
