<?php
date_default_timezone_set("Asia/Tokyo");
$filesource = $_FILES["image"]["tmp_name"];

    //$filesource= $_POST["pic"];
$tmp= explode(",",$_FILES["image"]["name"]);
$host = $tmp[0];
$filename = $tmp[1];

$targeturl = "./image/".$host."/";   
if(file_exists($targeturl)){
}else{
    mkdir($targeturl,0777);
}
if(isset($filesource)){
    $uploadfile=__DIR__."/image/".$host."/".$filename;
    if (move_uploaded_file($filesource,$uploadfile)) {
        echo "success";
    } else {
        echo "false";
    }
}
?>
