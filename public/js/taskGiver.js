"use strict"


// handles:
//  on solutionSpace
//  on answer


var socket; 
function connectTaskGiver(canvas, the_hash, output_field_id ){
    if (typeof the_hash != 'string') return;

    socket = io.connect();
    
    // on socket connect, run function msg.
    socket.on('connect', msg("connect", "connected"))  
    
    socket.on('solutionSpace', function(solutionSpaceArray) {
        drawProgress(solutionSpaceArray, canvas);
    });
    
    socket.on('answer', function(answer) {
        //alert('The answer is here.') //todo:
        //console.log('THE ANS IS HERE')
        handleAnswer(answer);
    });
    
    sendHash(socket, the_hash);
    
    // code here to refresh page on server disconnect?

}


/*function (data) {
socket.emit('my other event', { my: 'data' });
socket.send("test");
}
*/
function handleAnswer(answer){
    alert('the Password is:'+answer) // todo: check whats wrong with msg function
    msg("handleAnswer", "got: " + answer);
}

function sendHash(socket, the_hash){
    msg("sendHash", "emiting")
    socket.emit('hash', the_hash);
}

function drawProgress(solutionSpaceArray, canvas){
    msg("drawProgress", "drew"+Math.random())
    visualizeArray(solutionSpaceArray, canvas);
}


function print (e){
console.log(e);
}
function msg (elemId, text){
    "use strict"
    console.log("MSG>> "+elemId + ":  " + text)
    //todo: fix this bad hack
    if (elemId === "handleAnswer"){
        alert(text);
        console.log('THE ANS IS HERE 3')
    }
    //document.getElementById(elemId).innerHTML = text;
}



