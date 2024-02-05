import express from "express";
import fs from "fs";
import { engine } from "express-handlebars";
import { createServer } from "node:http";
import { Server } from "socket.io";
import * as dotenv from "dotenv";
dotenv.config();
const DEBUG = process.env.NODE_ENV !== "production";
const MANIFEST = DEBUG ? {} : JSON.parse(fs.readFileSync("./static/.vite/manifest.json").toString());

const app = express();
const server = createServer(app);
const io = new Server(server);


io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  var username = '';
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
    io.emit('message', message);
  })
})


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
        res.redirect(`http://${process.env.ASSET_URL}:5173${req.url}`);
    } else {
        next();
    }
  }) 
} else {
  app.use(express.static('static'));
}


app.get("/", (req, res) => {
    res.render('index', {
      debug: DEBUG,
      jsBundle: DEBUG ? "" : MANIFEST['src/main.jsx']['file'],
      cssBundle: DEBUG ? "" : MANIFEST['src/main.jsx']['css'][0],
      layout : false,
      assetURL : process.env.ASSET_URL
    })
});

server.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}...`);
});