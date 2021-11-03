import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { fromJSON } from './utils';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('home');
});
app.get('/*', (req, res) => {
  res.redirect('/');
});

const server = createServer(app);
const wss = new WebSocketServer({ server });

const sockets = [];

wss.on('connection', (socket, req) => {
  sockets.push(socket);
  socket['nickname'] = 'John';
  console.log(`Connected from Client ✨`);
  socket.on('close', () => {
    console.log('Disconnected from Client 😥');
  });
  socket.on('message', (message) => {
    const data = fromJSON(message);
    switch (data.type) {
      case 'message':
        console.log(`Get message from Client (${data.payload})`);
        sockets.forEach((currentSocket) => {
          currentSocket.send(`${socket.nickname}: ${data.payload.toString()}`);
        });
        break;
      case 'nickname':
        socket['nickname'] = data.payload;
        break;
    }
  });
});

server.listen(3000, () => {
  console.log(`Listening on http://127.0.0.1:3000/ and ws://127.0.0.1:3000/`);
});
