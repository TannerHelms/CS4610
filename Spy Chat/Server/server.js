const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 8080;

io.on('connection', (socket) => {
    var username = '';
  
  console.log('user connected');

  socket.on('username', (data) => {
    username = data;
  })

  socket.on('message', (data) => {
    const currentTime = new Date().toLocaleTimeString();
    const message = {
        data: data,
        user: username,
        date: currentTime
    }
    console.log(message);
    io.emit('message', message);
  })

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
})
server.listen(port, function() {
  console.log(`Listening on port ${port}`);
});