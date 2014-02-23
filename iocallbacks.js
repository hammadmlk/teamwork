//this file has all the callbacks that the socket.io server needs to handle.
// now now all callbacks that it makes or answers

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
    
    socket.on("hash", print);
    
    
    //socket.emit('news', { hello: 'world' });
    socket.emit('xyz', "xyzdata", print);
    
    socket.emit('job', {array:[1, 2, 3]});
    
    
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
  
  
  function disconnected (){
    console.log("disconnected");
  }
  function print (e){
    console.log(">> print: "+e);
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
