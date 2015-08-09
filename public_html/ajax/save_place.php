<?php
require_once("../../php/db_util.php");

$id = $_POST['id'];
$num = $_POST['number'];
$lat = $_POST['lat'];
$lng =$_POST['lng'];
$title = $_POST['title'];
$add = $_POST['address'];
$group = $_POST['group'];
$subgroup = $_POST['subgroup'];
$visited = $_POST['visited'];
$groupID = getOne("SELECT ID FROM userGroup WHERE name='$group'", "ID");
if($groupID == "No Results") {
	//$groupID = -1;
}
$out = array();
if($id <= 0) {
	$out = prepCreate($groupID);
}
else {
	$conn = login();
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
		$out["status"] = "error";
	}
	else {
		$out["status"] = "saved";
		$out["ID"] = "$id";
	}
	$conn->close();
}
header("Content-Type: application/json", true);
echo json_encode($out);
function prepCreate($groupID) {
	$out = array();
	$num = $_POST['number'];
	$lat = $_POST['lat'];
	$lng =$_POST['lng'];
	$title = $_POST['title'];
	$add = $_POST['address'];
	$subgroup = null;
	$visited = 0;
	$id = null;
	//require_once('../php/db_util.php');
	$conn = login();
	$in = $conn->prepare('INSERT INTO place VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)');
	$in->bind_param("ssddiiiii", $title, $add, $lat, $lng, $groupID, $subgroup, $num, $visited, $id);
	$in->execute();
	$rows = $in->affected_rows;
	$in->close();
	$conn->close();
	$out["rows"] = $rows;
	if($rows <= 0) {
		$out["status"] = "Error";
		if($groupID == "No Results") {
			$out["error"] = "Please Sign in or Login to save";
		}
	}
	else {
		$out["status"] = "Saved";
		$out["ID"] = getOne("SELECT ID FROM place WHERE name='$title' AND address='$add' AND group_key='$groupID' AND position='$num'", "ID");
	}
	return $out; 
}
?>