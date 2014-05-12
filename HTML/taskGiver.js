"use strict"


// handles:
//  on solutionSpace
//  on answer


var socket; 
function connectTaskGiver(canvas, server_address, input_field_id, output_field_id ){
   
    socket = io.connect(server_address);
    
    // on socket connect, run function msg.
    socket.on('connect', msg("connect", "connected"))  
    
    socket.on('solutionSpace', function(solutionSpaceArray) {
        //drawProgress(solutionSpaceArray, canvas);
    });
    
    socket.on('answer', function(answerPairList) {
        handleAnswer(answerPairList);
    });
    
    var func_feild_id = "foo"; var pairlist_feild_id = "pairlist"; var aggr_field_id = "aggr";
    sendWorkSet(socket, func_feild_id, pairlist_feild_id, aggr_field_id);
    
    // code here to refresh page on server disconnect?

}


/*function (data) {
socket.emit('my other event', { my: 'data' });
socket.send("test");
}
*/
function handleAnswer(answer){
    msg("handleAnswer", JSON.stringify(answer));
}

function sendWorkSet(socket, func_feild_id, pairlist_feild_id, aggr_field_id){
    if (getWorkSet(func_feild_id, pairlist_feild_id, aggr_field_id)!==-1){
        msg("sendWorkSet", "emiting")
        socket.emit('WorkSet', getWorkSet(func_feild_id, pairlist_feild_id, aggr_field_id));
    }
}
        
function getWorkSet(func_feild_id, pairlist_feild_id, aggr_field_id){
    if (typeof func_feild_id === "undefined" || 
      typeof pairlist_feild_id === "undefined" || 
      typeof aggr_field_id === "undefined"){
        console.log("error: 34D. No id to getWorkSet function");
        return -1;
    }
    var func = document.getElementById(func_feild_id).value;
    var pairlist = document.getElementById(pairlist_feild_id).value;
    var aggr = document.getElementById(aggr_field_id).value;
    
    var WorkSet = {};
    WorkSet.foo = func;
    WorkSet.pairlist = JSON.parse(pairlist);
    WorkSet.aggr = aggr; //input1, input2
    
    print("WorkSet", WorkSet);
    
    msg ("WorkSet", WorkSet);
    
    return WorkSet;
    
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

function drawProgress(solutionSpaceArray, canvas){
    msg("drawProgress", "drew"+Math.random())
    visualizeArray(solutionSpaceArray, canvas);
}

