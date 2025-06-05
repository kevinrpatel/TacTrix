<?php

$conn = new mysqli("localhost","root","","tic tac toe");
if($conn->connect_error){
    die("Connection failed: " . $conn->connect_error);
}

?>