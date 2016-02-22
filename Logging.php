<?php
//host, id, time, text
$json_string = file_get_contents('php://input'); ##今回のキモ

$obj = json_decode($json_string,true);
$host=$obj["host"];//$obj["host"]=null;
$myid=$obj["ID"];//$obj["ID"]=null;
//配信者
//hostが入ってない→ディレクトリをつくる
//hostが入っている→自分のファイルに保存
//配信者じゃない
$targeturl = "./LOG/".$host."/";   
if(file_exists($targeturl)){
}else{
    mkdir($targeturl,0777);
}
$tmp="";
foreach($obj as $key=>$val){
    $tmp.=$key." ".$val."\n";
}
file_put_contents($targeturl.$myid,$tmp);

