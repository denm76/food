<?php
$_POST = json_decode(file_get_contents("php://input"),true);//Работа в PHP с форматом JSON
echo var_dump($_POST);

?>