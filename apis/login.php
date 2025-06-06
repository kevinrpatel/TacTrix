<?php
include 'connection.php';
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://tac-trix.vercel.app');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$response = array();

$email = $_POST["email"];
$password = $_POST["password"];

$sql = mysqli_query($conn, "SELECT * FROM user_tbl WHERE email='$email'");
// print_r($sql);die;

if ($sql) {
    if (mysqli_num_rows($sql) > 0) {
       
        $row = mysqli_fetch_assoc($sql);
        // print_r($row);die;
        if (password_verify($password, $row['password'])) {
          
            $_SESSION['id'] = $row['id'];       // <-- Store in session
            $_SESSION['email'] = $row['email'];
            $_SESSION['name'] = $row['name'];
            // print_r($_SESSION['name']);die;
            
            $response["status"] = "true";
            // print_r(  $response["status"] = "true");die;
            $response["data"] = $row;
            // print_r(   $response["data"] = $row);die;
        } else {
            $response["status"] = "false";
            $response["message"] = "Incorrect password.";
        }
    } else {
        $response["status"] = "false";
        $response["message"] = "Email not found.";
    }
} else {
    $response["status"] = "false";
    $response["message"] = "Query error: " . mysqli_error($conn);
    // print_r( $response["message"] = "Query error: " . mysqli_error($conn));die;
}

echo json_encode($response);
?>
