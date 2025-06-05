<?php
include 'connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$response = array();

$room_code = strtoupper(bin2hex(random_bytes(3)));

$player1_id  = $_POST['player1_id'];

$player1_symbol = $_POST['player1_symbol'];

$player2_symbol = $_POST['player2_symbol'];
$game_status = $_POST['game_status'];

$sql="INSERT INTO rooms(room_code,player1_id,player1_symbol,player2_symbol,game_status) VALUES ('$room_code','$player1_id','$player1_symbol','$player2_symbol','$game_status')";
// print_r($sql);die;
$result = mysqli_query($conn,$sql);
 
if ($result) {
    $response['status'] =true;
    $response['room_code'] = $room_code;
} else {
    $response['status'] = 'error';
    $response['message'] = mysqli_error($conn);
}
echo json_encode($response);
?>
