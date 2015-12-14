<?php
require_once("../../php/db_util.php");
$out = array();
$i = 0;
session_start();
//If user is signed in get info
if(isset($_SESSION['ID']) && $_SESSION['ID'] > 0){
	$id= $_SESSION['ID'];
	$conn = login();
	$lat = escape($_POST["lat"]);
	$lng = escape($_POST["lng"]);
	$zoom = escape($_POST["zoom"]);
	$result = $conn->query("UPDATE user SET
		lat='$lat',
		lng='$lng',
		zoom='$zoom' 
		WHERE ID='$id'
		");
}
else {
	$out["status"] = "Error";
	$out["error"] = "Please Sign in or Login to save";
}
//To stop future null pointer problems
if(!isset($_POST["array"])) {
	$_POST["array"] = [];
}
//Update database based on array of markers.
foreach($_POST["array"] as $marker) {
	//If marker is already in array
	if(!isset($marker['id'])) {
		$id = -1;
	}
	else {
		$id = escape($marker['id']);	
	}
	if(isset($_SESSION['ID'])){
		$uid= $_SESSION['ID'];
	}
	$num = escape($marker['number']);
	$lat = escape($marker['lat']);
	$lng =escape($marker['lng']);
	$title = escape($marker['title']);
	$add = escape($marker['address']);
	$subgroup = escape($marker['subgroup']);
	$visited = escape($marker['visited']);
	$del = escape($marker['del']);
	$groupID = getOne("SELECT * FROM user WHERE ID='$uid'", "group_key");
	if($groupID == "No Results") {
		//$groupID = -1;
	}
	$tempOut = array();
	$tempOut["group"] = $groupID;
	//Add new marker.
	if($id <= 0) {
		if($del == "true") {
			$tempOut["status"] = "saved and deleted";
			$tempOut["del"] = "yes";
		}
		else {
			$tempOut = prepCreate($groupID, $marker);
		}
	}
	else {
		$conn = login();
		if($del == "true") { //Delete marker from database
			$result = $conn->query("DELETE FROM place WHERE ID='$id'");
			if(!$result) {
				$tempOut["status"] = "error";
			}
			else {
				$tempOut["status"] = "saved";
				$tempOut["ID"] = $id;
				$tempOut["del"] = "yes";
			}
		}
		else { //Update marker in database
			$result = $conn->query("UPDATE place SET 
				name='$title',
				address='$add',
				lat='$lat',
				lng='$lng',
				group_key='$groupID', 
				sub_group='$subgroup',
				position='$num',
				visited='$visited'
				WHERE ID='$id'");
			if(!$result) {
				$tempOut["status"] = "error";
			}
			else {
				$tempOut["status"] = "saved as update";
				$tempOut["ID"] = $id;
			}
		}
		$conn->close();
	}
	$out[$i] = $tempOut;
	$i += 1;
}
header("Content-Type: application/json", true);
echo json_encode($out);

//adds $marker to the database with a group id number of $groupID
function prepCreate($groupID, $marker) {
	$tempOut = array();
	$num = htmlspecialchars_decode($marker['number']);
	$lat = htmlspecialchars_decode($marker['lat']);
	$lng = htmlspecialchars_decode($marker['lng']);
	$title = htmlspecialchars_decode($marker['title']);
	$add = htmlspecialchars_decode($marker['address']);
	$subgroup = htmlspecialchars_decode($marker['subgroup']);
	$visited = htmlspecialchars_decode($marker['visited']);
	$id = null;
	//require_once('../php/db_util.php');
	$conn = login();
	$in = $conn->prepare('INSERT INTO place VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)');
	$in->bind_param("ssddisiii", $title, $add, $lat, $lng, $groupID, $subgroup, $num, $visited, $id);
	$in->execute();
	$rows = $in->affected_rows;
	$in->close();
	$conn->close();
	$tempOut["rows"] = $rows;
	if($rows <= 0) {
		$tempOut["status"] = "Error";
		if(!($groupID > 0)) {
			$tempOut["error"] = "Please Sign in or Login to save";
		}
	}
	else {
		$tempOut["status"] = "Saved as new";
		$tempOut["ID"] = getOne("SELECT ID FROM place WHERE name='$title' AND address='$add' AND group_key='$groupID' AND position='$num'", "ID");
	}
	return $tempOut; 
}
//escape characters of $str
function escape($str) {
	$conn = login();
	$str = $conn->real_escape_string($str);
	return htmlspecialchars_decode($str);
}
?>