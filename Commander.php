<?php
//登録と参照
//現在の参加しているかどうか
//現在の参加人数
//$past =file_get_contents("./counter.txt");
//$database=unserialize($past);
/*
if(isset($database["counter"]))
        $counter = $database["counter"];
else {
        $database["counter"]=0;
        $counter=0;
}
if(isset($database["num"]))
        $num = $database["num"];
else {
        $database["num"]=0;
        $num=0;
}
 */
header("Content-Type: application/json; charset=UTF-8");
//新規追加
$arrays= array();
if(isset($_GET["peerid"])){
    $arrays["peerid"]=$_GET["peerid"];
}else{
    $arrays["state"]="TEST";
}
echo json_encode($arrays);
//file_put_contents("./counter.txt",serialize($database));
