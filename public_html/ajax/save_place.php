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
$groupID = getOne("SELECT ID from userGroup WHERE name='$group'",'ID');
$out = "";
$result = getOne("SELECT ID FROM place WHERE id='$id'", 'ID');
if($result == "No Results") {
	$out = prepCreate($groupID);
}
else {
	$conn = login();
	$result = $conn->query("UPDATE place SET 
		name='$title'
		address='$add'
		lat='$lat'
		lng='$lng'
		group_key='$groupID' 
		sub_group='$subgroup'
		position='$num'
		visited='$visited'
		WHERE ID='$id'");
	if(!$result) {
		$out = "error";
	}
	else {
		$out = "saved";
	}
	$conn->close();
}
header("Content-Type: application/json", true);
echo json_encode($out);
function prepCreate($groupID) {
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
	$out = $in->affected_rows;
	$in->close();
	$conn->close();
	if($out == 0) {
		$out = "Error";
	}
	else {
		$out = "Saved";
	}
	return $out; 
}
?>