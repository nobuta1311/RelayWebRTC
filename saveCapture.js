var date_obj;
var videoElement
$(function (){
$("#save-cap").click(function(){
        if($(this).text()=="Save"){
        $(this).text("Stop");
        if($("#my-video").length){
            saveCapture("my-video");
        }else{
            saveCapture("peer-video");
        }
        }else{
            saveCapture("STOP");
            $(this).text("Save");
        }
});
});
function saveCapture(videoid){
    if(videoid=="STOP"){
        saving=false;
    }else{
    videoElement = document.getElementById(videoid);
    canvasElement = document.getElementById("canvas");
    canvasContext = canvasElement.getContext("2d");
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    count = 0;
    date_obj = new Date();
    setTimeout(saveFunc,calcWaitingTime(10),videoid);
    }
}
function saveFunc(videoid){
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        date_obj = new Date();
        e.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        var now_text = ("0"+date_obj.getMinutes()).slice(-2)+("0"+date_obj.getSeconds()).slice(-2);//+("00"+date_obj.getMilliseconds()).slice(-3);

        var imageData = canvasContext.getImageData(0,0,canvasElement.width-1, canvasElement.height-1);
        canvasContext.drawImage(videoElement,0,0);
        upload(canvasElement,now_text);
        /*
         * var btn= document.getElementById("btn-download");
        btn.href = canvasElement.toDataURL('image/bmp');
        btn.download = myID+"-"+now_text+'.bmp';
        btn.dispatchEvent(e);
        */
        if(saving){
            setTimeout(saveFunc,calcWaitingTime(10),videoid);
        }
}
function calcWaitingTime(t){//秒
    date_obj = new Date();
   // date_obj = performance.now();
    return ((t-date_obj.getSeconds()%10)*1000-date_obj.getMilliseconds());
}


function toBlob (canvas) {
        var base64 = canvas.toDataURL('image/png');
        var bin = atob(base64.replace(/^.*,/,''));
        var buffer = new Uint8Array(bin.length);
        for (var i=0;i<bin.length;i++){
                buffer[i] = bin.charCodeAt(i);
        }
        var blob = new Blob([buffer.buffer],{type: "image/png"});
        return blob;
}
function upload(canvas,timetext){
        var messageToServer = peerTable[0]+","+myID+":"+timetext+".png";
        var blob_data = toBlob(canvas);
        var fd = new FormData();
        fd.append("image",blob_data,messageToServer);
        $.ajax(
                {
                url:'upload.php',
                type:'POST',
                processData:false,
                contentType:false,
                data:fd,
                datatype:"image/png",
                success:function(data){
                },error:function(XMLHttpRequest, textStatus, errorThrown){
                }
                
        });
}

