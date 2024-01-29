import express from "express";
import path from "path";
import fs from "fs";
import { engine } from "express-handlebars";

const app = express();
app.set("port", 3000);
const server = require('http').Server(app);
const io = require("socket.io")(server);
const DEBUG = process.env.NODE_ENV !== "production";
const MANIFEST = DEBUG ? {} : JSON.parse(fs.readFileSync("./static/.vite/manifest.json").toString());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next()
});

if (DEBUG) {
  app.use((req, res, next) => {
    if (req.url.includes(".")) {
        res.redirect(`http://localhost:5173${req.url}`);
    } else {
        next();
    }
}) 
} else {
  app.use(express.static('static'));
}


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
    res.render('index', {
      debug: DEBUG,
      jsBundle: DEBUG ? "" : MANIFEST['src/main.jsx']['file'],
      cssBundle: DEBUG ? "" : MANIFEST['src/main.jsx']['css'][0],
      layout : false
    })
});

server.listen(3000, () => {
    console.log(`Listening on port 3000...`);
});