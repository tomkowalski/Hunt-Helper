<?php
require_once("../../php/db_util.php");
session_start();
$out = array();
if(isset($_SESSION['ID'])) {
$id= $_SESSION['ID'];
$groupID = getOne("SELECT * from user WHERE ID='$id'",'group_key');
$out["location"]["lat"] = getOne("SELECT * from user WHERE ID='$id'",'lat');
	$out["location"]["lng"] = getOne("SELECT * from user WHERE ID='$id'",'lng');
	$out["location"]["zoom"] = getOne("SELECT * from user WHERE ID='$id'",'zoom');
}
if(!isset($out["location"]["lat"]) || $out["location"]["lat"] == "No Results") {
	$out["location"]["lat"] = 38.3941;
	$out["location"]["lng"] = -97.0167;
	$out["location"]["zoom"] = 4;
}
$conn = login();
if(!isset($groupID)) {
	$groupID = -1;
}
$result = $conn->query("SELECT * FROM place WHERE group_key='$groupID'");
if(!$result) {
	$out["status"][0] = "error";
}
else {
	$out["status"][0] = "success";
	$out["arr"] = [];
	$index = 0;
	while($row = $result->fetch_assoc()) {
		$out["arr"][$index] = escape($row);
		$index += 1;
	}
}
$conn->close();
header("Content-Type: application/json", true);
echo json_encode($out);
function escape($row) {
	$fout = [];
	foreach($row as $key => $val) {
		$fout[$key] = htmlspecialchars($val);
	}
	return $fout;
}
?>