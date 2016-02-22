<?php
//新規登録 peerid=***を渡してidもらう
//idをもとにpeeridを取得 myid=***
//peeridをもとにidを取得 genuineid= ***
//退出 idをもとに  exit=*** 戻り値はその後の人数
//現在の参加しているかどうか refer=id  boolean
//現在の参加人数 refer==part 数字
//参加者全員 refer==all json
$past =file_get_contents("./counter.txt");
$database=unserialize($past);
//counterとnumを取り出す
//counterは通し番号 numは参加人数
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

//新規追加
if(isset($_GET["clear"])){
    $target = $_GET["clear"];
    if($target=="all"){
        $database="";
    }else{
        $database[$target]=null;
    }
}else if(isset($_GET["peerid"])){
        $peerid = $_GET["peerid"];
        $database[$counter]["id"]=$peerid;
        $database[$counter]["live"]=true;
        echo $counter;
        $database["counter"]=$counter+1;
        $database["num"]=$num+1;
}else if(isset($_GET["myid"])){//参照
        $myid = $_GET["myid"];
        if(isset($database[$myid]))
                echo $database[$myid]["id"];
        else echo "ERROR NO ID";
}else if(isset($_GET["genuineid"])){//登録されていれば通しID返却
    $myid_genu = $_GET["genuineid"];
    foreach($database as $cot => $genu){
        if($genu["id"]==$myid_genu){
            echo $cot;
            break;
        }
        if($cot==$counter-1){echo false;}
    }
}else if(isset($_GET["exit"])){ //終了して通し番号をもらう
    if($database[$_GET["exit"]]["live"]==true){
    $database["num"]=$num-1;
    $database[$_GET["exit"]]["live"]=false;
    echo $num-1;//減った後のユーザ数
    }else{echo false;}
}else if(isset($_GET["refer"])){    //参加状況について
    if($_GET["refer"]=="part"){echo $num;}//参加人数
    else if($_GET["refer"]=="all"){ //参加者全員
        $output = array();
        foreach($database as $cot=>$genu){
            if($genu["live"]==true){$output[$cot] =$genu["id"];}
        }
        echo json_encode($output);
    }else{
        if(isset($database[$_GET["refer"]])){//そのidが存在していたか
            //そのidが生きているか
            if($database[$_GET["refer"]]["live"]==true)echo "true";
            else echo "false";
        }else{//存在すらしてねえ
            echo "false";
        }
    }
}else{
        echo "ERROR BAD REQUEST";
}
file_put_contents("./counter.txt",serialize($database));
