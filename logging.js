var LoggingURL="./Logging.php";
var logdump={};
function writeLog(logstr){
    var DD = new Date();
       var time = ("0"+DD.getHours()).slice(-2)+":"+("0"+DD.getMinutes()).slice(-2)+":"+("0"+DD.getSeconds()).slice(-2)+":"+("00"+DD.getMilliseconds()).slice(-3);

    $("#log-space").prepend(time+"\t||"+logstr+"<br>");
    logdump[time]=logstr;
}
function uploadLog(){
    logdump["ID"]=myID;
    logdump["host"]=peerTable[0];
    var sendjson = JSON.stringify(logdump);
    $.ajax({
            url:LoggingURL,
            type:"post",
            datatype:"application/json",
            data:sendjson,
    }).done(function(res){
    });
}
function showNortify(str1,str2) {
    return; //今は使わないようにしておく
    var nortify = window.Notification || window.mozNotification || window.webkitNotification;
    nortify.requestPermission(function(permission){
    });
    var nortifyins = new nortify(str1,
               {
                body:str2,
                icon:"logo_color.png",
                autoClose: 1000,
            }
    );
}
function renewTable(){  
    //コネクションテーブルを現時点保有している変数に従って更新　変化があったあとに使用
    var tableText = "<table border=1><tr><th></th>";
        Object.keys(peerTable).forEach(function(key){   //peerTableから１行目
                tableText+="<th>"+key+"</th>";
        });
        tableText+="<th>→</th><th>←</th></tr>"; //1行目右端
        Object.keys(connectionTable).forEach(function(key1){    //connectionTableから2行目以降
            var ar2 = connectionTable[key1];
            ar2[key1]="＼";
            tableText+="<tr><td>"+key1+"</td>";
            Object.keys(ar2).forEach(function(key2){
              //  writeLog(key1+" "+key2);
             //   if(key2!="counter"&&key2!="connected")
            //    $("#connection-table").append(key1+" "+key2+"  "+connectionTable[key1][key2]+"   ");
                if(connectionTable[key1][key2]===true)
                    tableText+="<td>"+"▶"+"</td>";
                else if (key2!="counter" && key2!="connected" &&  connectionTable[key2][key1]===true)
                    tableText+="<td>"+"◀"+"</td>";
                else if(connectionTable[key1][key2]===false)
                    tableText+="<td>"+"×"+"</td>";
                else
                    tableText+="<td>"+connectionTable[key1][key2]+"</td>";
                });
          //  $("#connection-table").append("sum"+connectionTable[key1]['counter']+"<br>");
            tableText+="</tr>";
        });
        tableText+="</table>";
       $("#connection-table").empty();
       $("#connection-table").append($(tableText));
       //テーブル更新完了
}
