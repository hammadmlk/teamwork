//this file has all the callbacks that the socket.io server needs to handle.
// now now all callbacks that it makes or answers

var TaskList = require('./TaskList.js')
var WorkerList = require('./WorkerList.js')

//clear window
var util = require('util');
util.print("\u001b[2J\u001b[0;0H");

function start(io) {
  io.set('log level', 1)

  io.sockets.on('connection', connectionFunc);
  
  var array;
  
  var workerList = new WorkerList();
  var taskList = new TaskList();
  
  // when job and worker available emit. Check ever x milliseconds 
  setInterval(function(){
        var workerId = workerList.nextAvailable();
        var nextTCIndex = taskList.nextTaskChunkIndex();
        
        if(workerId===-1 || nextTCIndex ===-1){
            return
        }

        workerList.changeStatus(workerId, "busy")
        
        var hash = taskList.tasks[nextTCIndex.task].hash;
        var senderId = taskList.tasks[nextTCIndex.task].senderId;
        var chunkIndex = nextTCIndex.chunk;
        
        taskList.tasks[nextTCIndex.task].changeChunkValue(chunkIndex, 0)
        
        if (chunkIndex == -1){
            console.log("EXIT\n EXIT\n EXIT");
            
        }
        
        var jobDatax = new jobStruc(hash, senderId, workerId, chunkIndex, 152551)
        
        io.sockets.socket(workerId).emit('job', jobDatax);
  }, 1)
  
  // check if solution is available for any task. If yes send answer to taskGiver. and remove the task from taskList
  setInterval(function(){
        var solAvailable = taskList.solutionAvailable()
        if (solAvailable!==-1){
            var hash = taskList.tasks[solAvailable].hash
            var password = taskList.tasks[solAvailable].password
            var senderId = taskList.tasks[solAvailable].senderId
            io.sockets.socket(senderId).emit('answer', password);
            taskList.remove(hash, senderId);
        }
  }, 100)
  
  setInterval(function(){
        console.log("\n\nWORKER LIST::::") 
        workerList.print();
        console.log("\n\nTASK LIST::::") 
        taskList.print();
  }, 5000)
  
  function connectionFunc (socket) {
    console.log(">> incoming connection: id " + socket.id)
    
    socket.on('newWorker', function(){
        workerList.add(socket.id);
        console.log("newWorkerAdded")
    })
    
    socket.on('disconnect', function(){
            console.log("disconnected ", socket.id);
            workerList.remove(socket.id)
            taskList.removeSender(socket.id)    
    })
    
    socket.on("hash", function(theHash){
        taskList.add(theHash, socket.id)
        console.log("new hash received: ", theHash, socket.id);
    });
    
    socket.on("jobResponse", function(jobData){
        //print(jobData);
        print (jobData.chunkNumber+jobData.lastCheck)
        taskList.chunkSolution(
            jobData.senderId,
            jobData.chunkNumber,
            jobData.chunkStatus,
            jobData.password
            );
        workerList.changeStatus(jobData.workerId, "free")
    });
    
    //socket.emit('job', new jobStruc("aabldl", "senderId","workerId", 4, 5000));
        
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
  
  function jobStruc(hash, senderId, workerId, chunkNumber, chunkSize){
    this.hash = hash;
    this.senderId = senderId;
    this.workerId = workerId;
    this.chunkNumber = chunkNumber; //starts from 0
    this.chunkSize = chunkSize;
    this.password = "notKnown";
    this.chunkStatus = "0"
  };
  
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
  
  /*  usage key:
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
  
  // callback.  callback function runs on sender.
  //socket.on('message', function(message, callback) {})
  
  */

}

exports.start = start;
