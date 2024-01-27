import express from "express";
import path from "path";


const app = express();
app.set("port", 3000);
const server = require('http').Server(app);
const io = require("socket.io")(server);


app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next()
});

app.use((req, res, next) => {
    if (req.url.includes(".")) {
        res.redirect(`http://localhost:5173${req.url}`);
    } else {
        next();
    }
})

io.on('connection', (socket: any) => {
    var username = '';
  
    console.log('user connected');
  
  
    socket.on('username', (data: any) => {
      username = data;
    })
  
    socket.on('message', (data: any) => {
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

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views/index.html"));
});

server.listen(3000, () => {
    console.log(`Listening on port 3000...`);
});