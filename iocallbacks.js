
function start(io) {


  

  io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
  });

  console.log("   info  - iocallbacks registered.");





}

exports.start = start;
