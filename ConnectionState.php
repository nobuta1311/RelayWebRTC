<?php
$past =file_get_contents("./connection.txt");
$database=unserialize($past);
if($database=="")$database=array();
//aとbをつなげる　?from=a&to=b boolean
//aとbがつながっているか知る boolean
//aの接続相手を知る ?from=a json
//すべての接続状態をまとめて json
if(isset($_GET["from"])&& isset($_GET["to"]) && isset($_GET["mode"])){
    $a = $_GET["from"]; $b=$_GET["to"];
    if(!isset($database[$a]["counter"]))$database[$a]["counter"]=0;
    if(!isset($database[$b]["counter"]))$database[$b]["counter"]=0;
    if(!isset($database[$a]["connected"]))$database[$a]["connected"]=0;
    if(!isset($database[$b]["connected"]))$database[$b]["connected"]=0;
    if($_GET["mode"]==0){//参照
        if(isset($database[$a][$b]))echo $database[$a][$b];
        else{   //セットされてない
            $database[$a][$b]=false;
            $database[$b][$a]=false;
            file_put_contents("./connection.txt",serialize($database));
            echo false;
        }
    }else if($_GET["mode"]==1){//1ならばtrueにする
        $database[$a][$b]=true;
        $database[$b][$a]=false;
        $database[$a]["counter"]++;
        $database[$b]["connected"]++;
        file_put_contents("./connection.txt",serialize($database));
        //接続通知
        echo true;
    }else{//2ならばfalseにする
        $database[$a][$b]=false;
        $database[$b][$a]=false;
        $database[$a]["counter"]--;
        $database[$b]["connected"]--;
        file_put_contents("./connection.txt",serialize($database));
        echo true;
    }
}else if(isset($_GET["from"])){ //from 6で全部false 3で参照
    if($_GET["mode"]==3){
    if(isset($database[$_GET["from"]]))
        echo json_encode($database[$_GET["from"]]);
    else{   //セットされてない相手は
        foreach($database as $key => $data){
            $database[$_GET["from"]][$key]=false;
            $database[$key][$_GET["from"]]=false;
            echo $key."と".$_GET["from"]."をfalseにする";
        }
        $database[$_GET["from"]]["counter"]=0;
        $database[$_GET["from"]]["connected"]=0;
        file_put_contents("./connection.txt",serialize($database));
        echo "mode3";//true
    }
    }else{   //mode=6なので全部false
        print_r($database);
        foreach($database as $key1 => $data1){
            if($database[$key1][$_GET["from"]]==true)$database[$key1]["counter"]--;
            else if($database[$_GET["from"]][$key1]==true)$database[$key1]["connected"]--;
            unset($database[$key1][$_GET["from"]]);
        }
        unset($database[$_GET["from"]]);
        print_r($database);
        file_put_contents("./connection.txt",serialize($database));
   }
}else if(isset($_GET["clear"])){
    $database="";
    file_put_contents("./connection.txt",serialize($database));
}else{
    //すべての接続状態をまとめて
    echo json_encode($database);
}
