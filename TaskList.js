"use strict";

// Task class
function Task(hash, senderId){
this.hash = hash;
this.senderId = senderId;
this.status = "pending";
this.password = "not known";
this.chunks = makeChunks(308915775/152551, -1);
// public functions
this.passwordFound = function (chunkindex, password){
    this.changeChunkValue(chunkindex,2);
    this.password = password;
    this.status = "complete";
}
this.changeChunkValue = function(index, newval){
    this.chunks[index]=newval
}
this.nextChunkIndex = function(){
// return the first chunk with status 'not started (-1)'
// if none found return -1;
// todo: none 'not started' return first 'started but pending'
    for(var i=0; i<this.chunks.length; i++){
        if (this.chunks[i]===-1){
            return i;
        }
    }
    return -1;
}
this.print = function(){
    console.log ("task: "+ this.hash + " | " + this.senderId + " | " + this.status + " | " + this.password + " | " /*+ this.chunks*/)
}

// private functions
function makeChunks(howmany, status){
// status =   -1: not started,   0: started but pending   1: complete no success   2: complete success
    var chunks=[];
    while(howmany--){
        chunks.push(status)
    }
    return chunks;
}

}

// TaskList class
function TaskList(){
this.tasks = [];
this.add = function(hash, senderId){
    this.tasks.push(new Task(hash, senderId))
};
this.removeSender = function(senderId){
//TODO: should remove all task from sender, not just first
// find task with task.id=id and remove it from TaskList. 
// Return index removed. -1 if none found.
    var ir=-1; // index to remove
    for (var i=0; i<this.tasks.length; i++){
        if (this.tasks[i].senderId === senderId){
            ir = i;
            break;
        }
    }
    if (ir!==-1){
        this.tasks.splice(ir, 1);
    }
    return ir    
};
this.remove = function(hash, senderId){
// find task with task.hash=hash and task.id=id and remove it from TaskList. 
// Return index removed. -1 if none found.
    var ir=-1; // index to remove
    for (var i=0; i<this.tasks.length; i++){
        if (this.tasks[i].hash === hash  && this.tasks[i].senderId === senderId){
            ir = i;
            break;
        }
    }
    if (ir!==-1){
        this.tasks.splice(ir, 1);
    }
    return ir    
};
this.nextTaskChunkIndex = function (){
    // return the first task with status "pending'
    // if none found return -1;
    // todo: what if all chunks of the 'pending' task are already distributed??
    for(var i=0; i<this.tasks.length; i++){
        if (this.tasks[i].status === "pending"){
            var ti = i; // task index
            var ci = this.tasks[i].nextChunkIndex() // chunk index
            
            if(ci!==-1){
                return {task: ti, chunk: ci};
            }
        }
    }
    return -1;
}
this.chunkSolution = function (senderId, chunkIndex, sol, password){
    if (this.indexOf(senderId)===-1){
        // bad bad
        return;
    }
    if (sol === 2){
        this.tasks[this.indexOf(senderId)].passwordFound(chunkIndex, password)
    }
    else if (sol === 1){
        this.tasks[this.indexOf(senderId)].changeChunkValue(chunkIndex, sol)
    }
}
this.solutionAvailable = function(){
// return the index of task (in tasks array) with status = complete 
// -1 is none available
    for (var i = 0; i<this.tasks.length; i++){
        if (this.tasks[i].status==="complete"){
            return i;
        }
    }
    return -1;
}
this.getChunkMap = function(){
    if (this.tasks.length>0){
        return this.tasks[0].chunks
    }
    return [0,0,0,0,0,0];
}
this.print = function(){
    console.log("---TaskList Start ---");
    for (var i=0; i<this.tasks.length;i++){
        this.tasks[i].print();
    }
    console.log("--- TaskList End ---\n\n");
}

// should be private function
this.indexOf = function (senderId){
    for (var i=0; i<this.tasks.length; i++){
        if(this.tasks[i].senderId === senderId){
            return i;
        }
    }
    return -1;
}
}

/*
console.log("\n\n");

var TL = new TaskList();

TL.add('#0', "sid0");  TL.add('#1', "sid1");  TL.add('#2', "sid2");  TL.add('#3', "sid3");
TL.print();

TL.remove('#2', "sid2"); TL.remove('#1', "sid1");   TL.remove('#6', "sid0");   TL.remove('#3', "sid");
TL.remove('#x', "sidx");
TL.print();  
console.log("nextTaskChunkIndex:", TL.nextTaskChunkIndex(),"\n");

TL.chunkSolution("sid0", 0, 1, "pas");
TL.print();
console.log("nextTaskChunkIndex:", TL.nextTaskChunkIndex(),"\n");

TL.chunkSolution("sid0", 1, 2, "pas");
TL.print();
console.log("nextTaskChunkIndex:", TL.nextTaskChunkIndex(),"\n");

TL.chunkSolution("sid3", 0, 1, "pas");
TL.print();
console.log("nextTaskChunkIndex:", TL.nextTaskChunkIndex(),"\n");

TL.chunkSolution("sid3", 1, 2, "pas");
TL.print();
console.log("nextTaskChunkIndex:", TL.nextTaskChunkIndex(),"\n");
*/


/*
t= new Task("myhash", "mysenderid");
console.log(t);
print("-------");
console.log("nci: ", t.nextChunkIndex());
t.changeChunkValue(0,1)
t.changeChunkValue(1,1)
t.changeChunkValue(3,1)
console.log("nci: ", t.nextChunkIndex());
print("-------");
console.log(t);
t.passwordFound(4, "ThePassCode");
print("-------");
console.log(t);
*/

module.exports = TaskList;
