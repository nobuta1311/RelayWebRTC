//用意する変数
var Branch = Array(1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1);
var isexam=false;
var peerNum;
function routing(partnerID){
    //inquiry_tables();
    //1つのピアからの接続可能人数を指定
    //1ならば直線状につながる
    if(connectionTable[myID]["counter"]<Branch[0]){
        //自分から直接つなげる
       writeLog("DIRECT CONNECT : "+partnerID);
      // connectionTable[myID]["counter"]++;
        /*ここに実験用の分岐強制設定*/
        if(connectionTable[myID]["counter"]!=0 && isexam){
            connectionTable[partnerID]["counter"]=Branch[1];
        }
        /*ここまで実験用の分岐強制設定*/
        connect(partnerID,localStream);

    }else{  //リレー式につなげる場合。
        writeLog("RELAYLY CONNECT : "+partnerID);
        var checked = Array();
        checked[0]=false;
        connect_func(myID,partnerID,0,checked);
           //繋げ元から余裕があればそこから繋げる
           //そうでなければすでに繋がっているところを見つける
    }
    //次に自分の映像を持っている他のピアから直接つなげるかどうか
   
}
function connect_func(fromID,toID,count,checked){
    writeLog("from,B,toID,counter"+fromID+","+Branch[count]+","+toID+","+connectionTable[fromID]["counter"]);
    //自分の余裕があれば直接接続する
    if(connectionTable[fromID]["counter"]<Branch[count++]){
        writeLog("LET CONNECT : "+fromID+" "+toID);
        /*ここに実験用の分岐強制設定*/
        if(connectionTable[fromID]["counter"]!=0 && isexam===true){
            //許容範囲内で最後の接続でなければ，つまり1人を除いてすべて
            //counterをマックスにしておくことにより，そこからつながないようにする
            connectionTable[toID]["counter"]=Branch[count+1];
         //   writeLog("counterとBが"+connectionTable[fromID]["counter"]+""+Branch[count]+"なので"+toID+"の接続数を"+Branch[count+1]+"にする");
        }
       /* ここまで実験用の分岐強制設定*/
        letConnect(fromID,toID);
        return 0;
    }
    //fromIDがすでに接続している相手をみつける
    //複数いる場合はその相手が接続している数が少ないほう
    var min = 100; var new_from=undefined;

    Object.keys(connectionTable[fromID]).forEach(function(key){
        var cState = connectionTable[fromID][key];

        if(key!="counter" && key!="connected" && cState==true && checked[key]===undefined){//接続できているところをたどる
            checked[key]=false;
            if(min>connectionTable[key]['counter']){
                min =connectionTable[key]['counter'];
                new_from = key;
                //接続数最小のものを決める
            }else if(new_from==undefined){
                new_from = key;
            }
        }
    });
    //fromIDとnew_fromは既につながっているからその先を確かめる
    return connect_func(new_from,toID,count,checked);
}
function connect(to_id,send_stream){  //コネクションボタン押した
    
    var handler = window.setInterval(function(){
        if(connectionTable[myID]["connected"]!=0 || myID==0){
           var call = peer.call(id_exchange(to_id,1,false),send_stream); //send_stream
            connectedCall[to_id]=call;
            writeLog("CALL TO : "+to_id);
            noticeConnect(myID,to_id,1);
            connectionTable[myID][to_id]=true;
            connectionTable[myID]["counter"]++;
            connectionTable[to_id]["connected"]++;
            renewTable();
            calledDo(to_id);
            clearInterval(handler);
        }
    },100);

}
function disconnect(to_id){
    writeLog(connectedCall[to_id].open);
    to_id.destroy();
    writeLog(connectedCall[to_id].open);
}

function letConnect(fromID,toID){
         sendText(fromID,"0,"+toID+","+myID);
         connectionTable[fromID][toID]=true;
         connectionTable[fromID]["counter"]++;
         connectionTable[toID]["connected"]++;
         renewTable();
   // showNortify("配信者からの通知",fromID+"と"+toID+"を接続します");
   /*
    if(connectionTable[fromID]["connected"]!=0){
         sendText(fromID,"0,"+toID+","+myID);
    }else{
    var handler = window.setInterval(function(){
        if(connectionTable[fromID]["connected"]!=0){
            sendText(fromID,"0,"+toID+","+myID);
            clearInterval(handler);
        }
    },1000);
    }
    */
}
