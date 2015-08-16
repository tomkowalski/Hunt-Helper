<?php
require_once("../../php/db_util.php");
$out = array();
$i = 0;
if(isset($_POST["uname"])){
	$uname= escape($_POST["uname"]);
	$conn = login();
	$lat = escape($_POST["lat"]);
	$lng = escape($_POST["lng"]);
	$zoom = escape($_POST["zoom"]);
	$result = $conn->query("UPDATE user SET
		lat='$lat',
		lng='$lng',
		zoom='$zoom' 
		WHERE username='$uname'
		");
}
if(!isset($_POST["array"])) {
	$_POST["array"] = [];
}
foreach($_POST["array"] as $marker) {
	if(!isset($marker['id'])) {
		$id = -1;
	}
	else {
		$id = escape($marker['id']);	
	}
	$num = escape($marker['number']);
	$lat = escape($marker['lat']);
	$lng =escape($marker['lng']);
	$title = escape($marker['title']);
	$add = escape($marker['address']);
	$group = escape($marker['group']);
	$subgroup = escape($marker['subgroup']);
	$visited = escape($marker['visited']);
	$del = escape($marker['del']);
	$groupID = getOne("SELECT ID FROM userGroup WHERE name='$group'", "ID");
	if($groupID == "No Results") {
		//$groupID = -1;
	}
	$tempOut = array();
	if($id <= 0) {
		if($del == "true") {
			$tempOut["status"] = "saved";
			$tempOut["del"] = "yes";
		}
		else {
			$tempOut = prepCreate($groupID, $marker);
		}
	}
	else {
		$conn = login();
		if($del == "true") {
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
		else {
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
				$tempOut["status"] = "saved";
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
function prepCreate($groupID, $marker) {
	$tempOut = array();
	$num = escape($marker['number']);
	$lat = escape($marker['lat']);
	$lng =escape($marker['lng']);
	$title = escape($marker['title']);
	$add = escape($marker['address']);
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
	$tempOut["rows"] = $rows;
	if($rows <= 0) {
		$tempOut["status"] = "Error";
		if(!($groupID > 0)) {
			$tempOut["error"] = "Please Sign in or Login to save";
		}
	}
	else {
		$tempOut["status"] = "Saved";
		$tempOut["ID"] = getOne("SELECT ID FROM place WHERE name='$title' AND address='$add' AND group_key='$groupID' AND position='$num'", "ID");
	}
	return $tempOut; 
}
function escape($str) {
	$conn = login();
	$str = $conn->real_escape_string($str);
	return htmlspecialchars($str);
}
?>