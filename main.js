navigator.getUserMedia  = navigator.getUserMedia    || navigator.webkitGetUserMedia || navigator.mozGetUserMedia|| navigator.msGetUserMedia;
/*変数定義*/
var localAudio;
var peerTable = Array();
var saving=true;
var connectionTable = Array();
var target=0;
var localStream;
var streams = Array();  //自分の保持するstreamのURLをここに記録する。
var connectedCall = Array();
var connectedConn = Array();
var stackTable = Array();
var myID;
var ready=false;
var canvasElement,canvasElement2;
var canvasContext,canvasContext2;
var videoElement;
var e = document.createEvent("MouseEvents");
var peer = new Peer({ key: '2e8076d1-e14c-46d4-a001-53637dfee5a4', debug: 3});
/*
peer.on('open', function(){ //回線を開く
    writeLog("OPENED");
});
*/
peer.on('call', function(call){ //かかってきたとき
   //inquiry_tables();
   var pid = id_exchange(call.peer,2,false);
   showNortify(myID+"からの通知",pid+"から動画が届きました");
   writeLog("CALLED BY: "+pid);
   call.answer(null);  //何も返さないようにしておく。
   connectedCall[pid]=call;
   calledDo(pid);
   connectionTable[pid]["counter"]++;
   connectionTable[myID]["connected"]++;
   connectionTable[pid][myID]=true;
   Object.keys(peerTable).forEach(function(key){    //connectionTableを埋める
       if(myID!=key){
           if(connectionTable[key][myID]==undefined){connectionTable[key][myID]=false;}
           if(connectionTable[myID][key]==undefined){connectionTable[myID][key]=false;}
           if(connectionTable[myID][key]==true){
               connectedCall[key].close();
            //   sendText(0,"2,"+key);
           }
       }
   });
   //再接続の動作
   renewTable();
});
/*総合関数*/
$(function (){
    $("#joinReceiver").attr("disabled",false);
    $("#joinProvider").attr("disabled",false);

    $('#joinProvider').click(function(){//配信者参加処理
        for(var i=0;i<12;i++)
            Branch[i]=$("[name=br"+i+"]").val();//分岐数取得
        isexam=$('#isexam').prop("checked");
        $("#branch-selector").remove();//分岐数設定消去
        if($(this).text()=="exit"){
            uploadLog();
        //stopRecording(localRecorder);
        id_exchange(myID,3,false);//myIDを削除
        $(this).text("Join as a Provider");
        Object.keys(peerTable).forEach(function(key1){
            if(connectedCall[key1]!=null)//配信してたら切る
                connectedCall[key1].close();
        });
        noticeConnect(myID,"",6);//callコネクション削除
        dataDisconnectAll();//コネクションも切断
        writeLog("COMPLETE EXITTING");
        $("#joinReceiver").attr("disabled", "false");
    }else{
        $("h4").css("background","#0089a1");
        noticeConnect("","",4);
        id_exchange("all",5,false);
        navigator.getUserMedia({ video:true,audio:false}, function(stream){
            var div = $("<video id=\"my-video\" autoplay=\"1\"></video>");//disabledにできるwidth: 600px;\
            localStream = stream;
            $("#videos").append(div);
            $('#my-video').prop('src', window.URL.createObjectURL(localStream));
            },function() { alert("Error to getUserMedia.");

        });
        writeLog("YOU ARE PROVIDER");
        initialize();
        $(this).text("exit");
        $("h4").css("background","salmon");
        $("#joinReceiver").attr("disabled", "true");
    }
});
$('#joinReceiver').click(function(){//受信者参加処理
    $("#branch-selector").remove();//分岐数設定消去
    if($(this).text()=="exit"){
        $("h4").css("background","#0089a1");
        uploadLog();
        id_exchange(myID,3,false);//myIDをサーバから除去
        $(this).text("Join as a Receiver");
        Object.keys(peerTable).forEach(function(key){
            if(connectedCall[key]!=null){
                connectedCall[key].close();
            }
        });
        noticeConnect(myID,"",6);
        dataDisconnectAll();
        writeLog("FINISH EXITTING");
        $("#joinProvider").attr("disabled", "false");
    }else{
        writeLog("YOU ARE RECEIVER");
        initialize();        
        $(this).text("exit");
        $("h4").css("background","DeepSkyBlue");
        $("#joinProvider").attr("disabled", "true");

    }
});
$("#SendTextButton").click(function(){
        Object.keys(peerTable).forEach(function(key1){
            sendText(key1,"3,"+myID+","+$("#mes").val());
        });
});
});
/*
接続ボタンを作る関数
実験時には用いない
function makeListener(key){//接続ボタンをつくる
    $("#connect-buttons").on( 
        'click',"#connect-"+key,
        function(){
            target = key;
            writeLog("REQUEST VIDEO :"+key);
            sendText(0,"2,"+myID);
        }
    );
}
*/
function initialize(){
    myID = id_exchange(peer.id,0,false);
    peerTable[myID]=peer.id;
    inquiry_tables();   //他の状況をサーバから取得する．
    noticeConnect(myID,"",3);//サーバのコネクションテーブルの自分の部分更新 asyncでなくてよい
    connectionTable[myID]=[];
    connectionTable[myID]["counter"]=0;
    connectionTable[myID]["connected"]=0;
    dataConnectAll();   //全員に接続する．これにより相手は自分のID2つを知る．
    writeLog("YOU ARE : "+peer.id);
    renewTable();
    $("#my-id").text(peer.id);
    $('#my-number').text(myID);
    writeLog("YOUR ID : "+myID);    
}


function calledDo(pid){ //コネクションした後のやりとり
            connectedCall[pid].on('stream', function(stream){//callのリスナ
            Object.keys(peerTable).forEach(function(key){   //接続されたことを通知する
                if(key!=myID)
                    sendText(key,"4,"+pid+","+myID);
            });
            if(Object.keys(stackTable).length!==0){
                Object.keys(stackTable).forEach(function(key){
                    sendText(0,"2,"+key);
                    writeLog("RECALL FOLLOWER");
                    delete stackTable[key];
                });
            }    

            streams[target]=stream;
            /*
            if(stream.getAudioTracks()[0]!=undefined){
                localAudio=stream;
                $("#audio").prop("src",URL.createObjectURL(localAudio));
                return;
            }
            */
            var url = URL.createObjectURL(streams[target]);
            //url変換したものを格納し、したの行のように表示させる。
            var div = $("<video id=\"peer-video"+"\" width=\"640\";  autoplay=\"1\"></video>");//disabledにできる
            $("#videos").append(div);
            $('#peer-video').prop('src', url);
        });
        connectedCall[pid].on('close',function(){
         //   writeLog(pid+"'s stream has closed.");
        });
}
