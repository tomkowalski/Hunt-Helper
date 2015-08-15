<?php
session_start();
require_once('../php/header.php');
require_once('../php/footer.php');
$select = "<select id='route_select' multiple='multiple'> \n" . getRoutes() . "\n </select>";
$body =  <<<__HTML
<body>
	<div id="map-canvas"> <nosript><h1>Please enable javascript <h1></noscript></div>
	$select
</body>
__HTML;
echo head(".", "Map");
echo $body;
echo foot(".");  
function getRoutes(){
	require_once('../php/db_util.php');
	$out = "";
	$unique_routes = array();
	if(isset($_SESSION['ID'])){
		$id = $_SESSION['ID'];
		$groupID = getOne("SELECT * FROM user WHERE ID='$id'", 'group_key');
		$conn = login();
		$routes = $conn->query("SELECT * FROM place WHERE group_key='$groupID' ORDER BY `sub_group` ASC");
		while($row = $routes->fetch_assoc()) {
			$last = array_pop($unique_routes);
			if($row["sub_group"] == $last && $last != null) {
				array_push($unique_routes, $last);
			} 
			elseif($row["sub_group"] != null) {
				if($last != null) {
					array_push($unique_routes, $last);
				}
				array_push($unique_routes, $row["sub_group"]);
			}
		}
		$routes->close();
		$conn->close();
	}
	foreach ($unique_routes as $route) {
		$out .= "<option value='$route''>$route</option>";
	}
	return $out;
}
?>
