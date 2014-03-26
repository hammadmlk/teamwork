"use strict"


// handles:
//  on solutionSpace
//  on answer


var socket; 
function connect(canvas, server_address, input_field_id, output_field_id ){
    if (getHash(input_field_id)===-1) return;

    socket = io.connect(server_address);
    
    // on socket connect, run function msg.
    socket.on('connect', msg("connect", "connected"))  
    
    socket.on('solutionSpace', function(solutionSpaceArray) {
        drawProgress(solutionSpaceArray, canvas);
    });
    
    socket.on('answer', function(answer) {
        handleAnswer(answer);
    });
    
    sendHash(socket, input_field_id);
    
    // code here to refresh page on server disconnect?

}


/*function (data) {
socket.emit('my other event', { my: 'data' });
socket.send("test");
}
*/
function handleAnswer(answer){
    msg("handleAnswer", "Password for the hash you submitted is: " + answer);
}

function sendHash(socket, input_field_id){
    if (getHash(input_field_id)!==-1){
        msg("sendHash", "emiting")
        socket.emit('hash', getHash(input_field_id));
    }
}

function drawProgress(solutionSpaceArray, canvas){
    msg("drawProgress", "drew"+Math.random())
    visualizeArray(solutionSpaceArray, canvas);
}
        
function getHash(id){
    if (typeof id === "undefined" ){
        console.log("error: 34D. No id to hash function");
        return;
    }
    var pass = document.getElementById(id).value;
    
    if (pass.length !== 6){
        document.getElementById(id).value = "invalid - must be 6 chars"
        return -1;
    }
    else{
        var hash = CryptoJS.MD5(pass).toString(CryptoJS.enc.Base64);
        
        msg ("hash", hash);
                    
        return hash;
    }
}


function print (e){
console.log(e);
}
function msg (elemId, text){
    console.log("MSG>> "+elemId + ":  " + text)
    //todo: fix this bad hack
    if (elemId == "handleAnswer")
        alert(text);
    //document.getElementById(elemId).innerHTML = text;
}



