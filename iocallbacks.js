//this file has all the callbacks that the socket.io server needs to handle.
// now now all callbacks that it makes or answers

//clear window
var util = require('util');
util.print("\u001b[2J\u001b[0;0H");

function start(io) {
  io.set('log level', 1)

  io.sockets.on('connection', connectionFunc);
  
  var array;
  
  function connectionFunc (socket) {
    console.log(">> incoming connection: id " + socket.id)
    
    socket.on('disconnect', disconnected)
    //socket.on('anything', function(data) {})
    //socket.on('message', function(message, callback) {})
 
    socket.on("jobResponse", print);
    
    socket.on("hash", function(theHash){
        hashReceived(theHash, socket.id)
    });
    
    function hashReceived(theHash, socketId){
        console.log("args: : ",arguments.length);
        console.log(theHash,socketId);
    }
    
    //socket.emit('news', { hello: 'world' });
    socket.emit('xyz', "xyzdata", print);
    
    socket.emit('job', new jobStruc("aabldl", "senderId", 4, 5000));
    
    //socket.emit('answer', "password");
    
    //simulate periodically updating solution space. 
    setInterval(function(){
        array = makeArray();
    }, 100)
    
    //emit solution space periodically. 
    setInterval(function(){
        socket.emit('solutionSpace', array);
    }, 1000)
    
  }
  
  console.log("   info  - iocallbacks  registered.");
  
  
  
  /// start Server data structures
  
  function jobStruc(hash, senderId, chunkNumber, chunkSize){
    this.hash = hash;
    this.senderId = senderId;
    this.chunkNumber = chunkNumber; //starts from 0
    this.chunkSize = chunkSize;
    this.password = "notKnown";
    this.chunkStatus = "0"
  }
  
  // worker class        use: var w = new Worker(id);
  function Worker (id) {
    this.type = "classWorker" // will be used for type checking
    this.id = id;
    this.status = "free";
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

  // Task class
  function Task(hash, senderId){
    this.hash = hash;
    this.senderId = senderId;
    this.status = "pending"; // todo: remove this code
    this.password = "not known";
    this.chunks = makeChunks(/*308915775/10773*/2, -1);
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
        console.log ("task: "+ this.hash + " | " + this.senderId + " | " + this.status + " | " + this.password + " | " + this.chunks)
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
    
    function decimalTo26(decimal){
    // takes a decimal and returns the base 26 representation.
    // [input-->output],  [0 --> a], [25 --> z], [26 --> ba], [17575 --> zzz]
    // 26todec(alphabetIndex*26^place). example for bzz 1*26^2 + 25*26^1 + 25*26^0
    // a is like 0. so aaaazz == zz just like 0007 == 7
    
        //print("==========");
        var alphabets = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
        var divisor = decimal;
        var base=26; var qoutient; var remainder;
        var ans=[];
        do {
            quotient = Math.floor(divisor/base);
            remainder = divisor%base;
            //console.log("q:", quotient, "d:", divisor, "r:", remainder);
            divisor = quotient;            
            ans.push(alphabets[remainder]);
        } while (quotient>0)
        
        ansx=[];
        while(ans.length>0){
            ansx.push(ans.pop());
        }
        //print (ansx);
        return ansx
    };
  }
  
  // TaskList class
  function TaskList(){
    this.tasks = [];
    this.add = function(hash, senderId){
        this.tasks.push(new Task(hash, senderId))
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
        // todo: what is all chunks of the 'pending' task are already distributed??
        for(var i=0; i<this.tasks.length; i++){
            if (this.tasks[i].status === "pending"){
                var ti = i; // task index
                var ci = this.tasks[i].nextChunkIndex() // chunk index
                
                return {task: i, chunk: ci};
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
 /*
  var wl = new WorkerList();
  wl.add("1");
  wl.print();
  print(wl.nextAvailable());
  wl.changeStatus("1", "newStatus");
  wl.remove("3");
  */
  
  
  
  
  
  function Apple (type) {
    this.type = type;
    this.color = "red";
    this.getInfo = function() {
        return this.color + ' ' + this.type + ' apple';
    };
}
  
  
  
  /// end Server data structures 
  
  
  
  function disconnected (){
    console.log("disconnected");
  }
  function print (e){
    console.log(">>print: ", e);
  }

  function makeArray(){
    array = [];
    for (var i=0;i<100;i++){
        array.push(Math.random())
    }
    return array
  }  
  
  // send to current request socket client
  //socket.emit('message', "this is a test");

  // sending to all clients, include sender
  //io.sockets.emit('message', "this is a test");

  // sending to all clients except sender
  //socket.broadcast.emit('message', "this is a test");

  // sending to all clients in 'game' room(channel) except sender
  //socket.broadcast.to('game').emit('message', 'nice game');

  // sending to all clients in 'game' room(channel), include sender
  //io.sockets.in('game').emit('message', 'cool game');

  // sending to individual socketid
  //io.sockets.socket(socketid).emit('message', 'for your eyes only');

}

exports.start = start;
