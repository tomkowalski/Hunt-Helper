<?php
require_once("../../php/db_util.php");
$group = $_POST['group'];
$groupID = getOne("SELECT ID from userGroup WHERE name='$group'",'ID');
$out = array();
$conn = login();
$result = $conn->query("SELECT * FROM place WHERE group_key='$groupID'");
if(!$result) {
	$out[0] = "error";
}
else {
	$out[0] = "success";
	$index = 1;
	while($row = $result->fetch_assoc()) {
		$out[$index] = $row;
		$index += 1;
	}
}
$conn->close();
header("Content-Type: application/json", true);
echo json_encode($out);
?>