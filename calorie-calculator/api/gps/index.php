<?php 

$request_handle = fopen("./requests.txt", "a+");
fwrite($request_handle, "ACCESS: " . date("l jS  F Y h:i:s A") . " - " . $_SERVER['REMOTE_ADDR'] .
    " - " . $_SERVER['HTTP_USER_AGENT'] . "\n");
fclose($request_handle);


if (!isset($_GET['key'])) { return; }
if (!isset($_POST['data'])) { return; }

if ($_GET['key'] != "c93m1nbs8FSSmx932Askl") {
    return;
}

$handle = fopen("./coords.txt", "a+");
fwrite($handle, $_POST['data']);
fclose($handle);


?>

