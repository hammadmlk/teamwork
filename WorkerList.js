"use strict";

// worker class        use: var w = new Worker(id);
function Worker (id) {
this.type = "classWorker" // will be used for type checking
this.id = id;
this.status = "free";  // free or busy
}

// WorkerList class   
function WorkerList () {
this.type = "classWorkerList" // will be used for type checking
this.workers = [];
this.add = function(id) {
    var w = new Worker(id);
    this.workers.push(w);
};
this.remove = function(id) {
// find worker with worker.id=id and remove it from WorkerList. 
// Return index removed. -1 if none found.
    var ir=-1; // index to remove
    for (var i=0; i<this.workers.length; i++){
        if (this.workers[i].id === id){
            ir = i;
            break;
        }
    }
    if (ir!==-1){
        this.workers.splice(ir, 1);
    }
    return ir
};
this.changeStatus = function(id, status){
// change status of worker in WorkerList with worker.id===id. 
// Return the number index of changed worker in WorkerList. -1 if none found.
    for (var i=0; i<this.workers.length; i++){
        if (this.workers[i].id === id){
            this.workers[i].status=status;
            return i;
        }
    }
    return -1;
};
this.nextAvailable = function(){
// returns the id of the first free worker from WorkerList 
// Return the -1 if no one free
    for (var i=0; i<this.workers.length; i++){
        if (this.workers[i].status === "free"){
            return this.workers[i].id;
        }
    }
    return -1;
};
this.print = function(){
    console.log(this.workers);
};
} 


module.exports = WorkerList


/*
var wl = new WorkerList();
wl.add("1");
wl.print();
print(wl.nextAvailable());
wl.changeStatus("1", "newStatus");
wl.remove("3");
*/