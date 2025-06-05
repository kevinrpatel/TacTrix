<?php
include 'connection.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

$response = array();

$player1_id = $_POST['player1_id'];
$player2_id = $_POST['player2_id'];
$game_type = $_POST['game_type'];
$player1_symbol = $_POST['player1_symbol'];
$player2_symbol = $_POST['player2_symbol'];
$game_result = $_POST['game_result'];
$winner_id = $_POST['winner_id'];
$winner_type=$_POST['winner_type'];
$total_moves = $_POST['total_moves'];


// if ($player2_id === null) {
//     $query = "INSERT INTO game_history (player1_id, player2_id, winner_id) VALUES ($player1_id, NULL, $winner_id)";
// } else {
//     $query = "INSERT INTO game_history (player1_id, player2_id, winner_id) VALUES ($player1_id, $player2_id, $winner_id)";
// }
if ($game_result === "draw") {
 
    $query = "INSERT INTO game_history 
              (player1_id, player2_id, game_type, player1_symbol, player2_symbol, game_result, winner_id, winner_type, total_moves) 
              VALUES 
              ('$player1_id', NULL, '$game_type', '$player1_symbol', '$player2_symbol', '$game_result', NULL, '$winner_type', '$total_moves')";
} else {
    if ($winner_type === "computer") {
      
        $query = "INSERT INTO game_history 
                  (player1_id, player2_id, game_type, player1_symbol, player2_symbol, game_result, winner_id, winner_type, total_moves) 
                  VALUES 
                  ('$player1_id', NULL, '$game_type', '$player1_symbol', '$player2_symbol', '$game_result', NULL, '$winner_type', '$total_moves')";
    } else {
     
        $query = "INSERT INTO game_history 
                  (player1_id, player2_id, game_type, player1_symbol, player2_symbol, game_result, winner_id, winner_type, total_moves) 
                  VALUES 
                  ('$player1_id', NULL, '$game_type', '$player1_symbol', '$player2_symbol', '$game_result', '$winner_id', '$winner_type', '$total_moves')";
    }
}

$result = mysqli_query($conn, $query);

if ($result) {
    $response['status'] = true;
    $response['message'] = "Game history stored successfully";
} else {
    $response['status'] = false;
    $response['error'] = mysqli_error($conn);
}

echo json_encode($response);




?>
