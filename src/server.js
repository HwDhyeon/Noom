import express from 'express';
import { createServer } from 'http';
import SocketIO from 'socket.io';

const PORT = 3000;
const HOST = '0.0.0.0';

const app = express();

app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/chat', (req, res) => {
  res.render('chat');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/profile', (req, res) => {
  res.render('profile');
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
    socket.to(roomName).emit('welcome');
  });
  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) => socket.to(room).emit('bye'));
  });
  socket.on('new_message', (msg, room, done) => {
    socket.to(room).emit('new_message', msg);
    done();
  });
});

server.listen(PORT, HOST, () => {
  console.log(`HTTP Server is running on http://127.0.0.1:${PORT}/`);
});
