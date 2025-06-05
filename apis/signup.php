<?php
include 'connection.php';
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$response = array();
$name = $_POST['name'];
$email = $_POST['email'];
$password = $_POST['password'];

// Check if the email already exists
$CheckemailQuery = "SELECT * FROM user_tbl WHERE email='$email'";
$result = mysqli_query($conn, $CheckemailQuery);
// print_r($result);die;

if (mysqli_num_rows($result) > 0) {
    // Email already exists
    $response["status"] = "error";
    $response["message"] = "Email already exists";
} else {
    // Proceed with password hashing and insertion
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $sql = "INSERT INTO user_tbl (name, email, password) VALUES ('$name', '$email', '$hashedPassword')";

    $insertResult = mysqli_query($conn, $sql);

    if ($insertResult) {
        $response['status'] = "yes";
    } else {
        $response['status'] = "no";
        $response['error'] = mysqli_error($conn); 
    }
}

echo json_encode($response);
?>
