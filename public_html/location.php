<?php
session_start();
require_once('../php/header.php');
require_once('../php/footer.php');
require_once('../php/db_util.php');

if(isset($_SESSION["ID"])) {
	$uid = $_SESSION["ID"];
	$groupID = getOne("SELECT * FROM user WHERE ID='$uid'","group_key");
	$conn = login();
	$result = $conn->query("SELECT * FROM  `place` WHERE group_key =  '$groupID' ORDER BY sub_group ASC , position ASC");
	$last_route = null;
	$first = true;
	while($row = $result->fetch_assoc()) {
		if($first) {
				$first = false;
				$body .= "<h2>No Route</h2> <ul>";	
		}
		if($last_route != $row["sub_group"]) {
			$last_route = $row["sub_group"];
			if($first) {
				$first = false;	
			}
			$body .= "</ul><h2>$last_route</h2> <ul>";
		}
		$name = $row["name"];
		$add = $row["address"];
		$body .= "<li>$name : $add</li>";
	}
}
else {
$body = <<<__HTML
	<body>
		<h1>Please log in or sign up to view your groups locations<h1>		
	</body>
__HTML;
}
echo head(".", "Location");
echo $body;
echo foot(".");  
//<h2 style="text-align:left; padding-left:1.5em;"> Locations </h2>
?>