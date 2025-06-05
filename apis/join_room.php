<?php
include 'connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$response = array();

$room_code = $_POST['room_code'] ?? '';
$player2 = $_POST['player2'] ?? '';

// Check if the room exists
$sql = "SELECT * FROM rooms WHERE room_code = '$room_code'";
$result = mysqli_query($conn, $sql);

if (mysqli_num_rows($result) > 0) {
    // Room exists, now check if player1 is already assigned
    $row = mysqli_fetch_assoc($result);
    
    // If player2 is not yet assigned, update the database
    if (empty($row['player2'])) {
        $update_sql = "UPDATE rooms SET player2 = '$player2' WHERE room_code = '$room_code'";
        $update_result = mysqli_query($conn, $update_sql);

        if ($update_result) {
            $response['status'] = "yes";
            $response['message'] = "Player 2 joined the game successfully.";
            $response['room_code'] = $room_code;
        } else {
            $response['status'] = "no";
            $response['error'] = mysqli_error($conn);
        }
    } else {
        // Room already has two players
        $response['status'] = "no";
        $response['message'] = "The room is already full.";
    }
} else {
    // Room does not exist
    $response['status'] = "no";
    $response['message'] = "Room not found.";
}

echo json_encode($response);
?>
