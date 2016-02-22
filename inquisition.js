//テスト用にここに記述
var ConnectionStateURL="./ConnectionState.php?";
var IDURL = "./ID.php?";
function inquiry_tables(){
    //参加者一覧をポーリング
    var response =id_exchange("all",4,false);
    peerTable = JSON.parse(response);   //参加しているgenuineIDのみ帰ってくる
    //接続ボタンを作る　実験時には用いない
    // var div = $("<button type=\"button\" id=\"connect-"+0+"\">"+"Connect to "+0+"</button>");//disabledにできる
    //makeListener(0);
    //$("#connect-buttons").append(div);
    response = noticeConnect("","",5);  //接続状況ポーリング
    connectionTable = JSON.parse(response);//connectionTable更新
}

function id_exchange(command_str,mode,isasync){
    var mode_str="";
    var result;
    switch(mode){
        case 0: //genuine-num登録
            mode_str = "peerid";
            break;
        case 1: //num-genuine参照
            //mode_str = "myid";
            return peerTable[command_str];
            break;
        case 2: //genuine-num参照
            Object.keys(peerTable).forEach(function(key){
                if(peerTable[key]===command_str){
                    result=key;
                }
            });
            return result;
            break;
        case 3: //終了するIDを伝える。
            mode_str = "exit";
            break;
        case 4: //partで参加人数 allで参加者全員
            mode_str = "refer";
            break;
        case 5:
            mode_str = "clear";
            break;
    }
    var accessurl =IDURL+mode_str+"="+command_str; 
    $.ajax({
        async:isasync,
        url: accessurl,
            type: "GET",
            dataType: "html"
    }).done(function(res) {
        result=res;
    });
    return result;
}

function noticeConnect(from_parameter,to_parameter,mode){
    var isasync = false;
    if(mode===0){
        isasync=true;
    }
    var url = "";
    var result ="false";
        switch(mode){
            case 6: //fromユーザのすべてをfalseにする
                url = "from="+from_parameter+"&mode="+mode;
                break;
            case 0: //特定の関係を参照
                url = "from="+from_parameter+"&to="+to_parameter+"&mode="+mode;
                break;
            case 1: //fromとtoを参照してtrueにする
                 url = "from="+from_parameter+"&to="+to_parameter+"&mode="+mode;
                break;
            case 2: //fromとtoを指定してfalseにする
                url = "from="+from_parameter+"&to="+to_parameter+"&mode="+mode;
                break;
            case 3: //fromを指定して接続相手をすべて表示
                url = "from="+from_parameter+"&mode="+mode;
                break;
            case 4:
                url = "clear=all";
                break;
            default://全て参照
                break;
        }
        $.ajax({
            async:isasync,
            url:ConnectionStateURL+url,
            type:"get",
            datatype:"html",
        }).done(function(res){
            result = res;
        })  ;  
        return result;
}
