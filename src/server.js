import express from 'express';
import { createServer } from 'http';
import SocketIO from 'socket.io';
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
const io = SocketIO(server);

io.on('connection', (socket) => {
  socket.on('enter_room', (roomName, done) => {
    socket.join(roomName);
    done();
  });
});

server.listen(3000);
