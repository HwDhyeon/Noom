import express from 'express';
import { createServer } from 'http';
import { instrument } from '@socket.io/admin-ui';
import { Server } from 'socket.io';

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

app.get('/meeting', (req, res) => {
  res.render('meeting');
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
const io = new Server(server, {
  cors: {
    origin: ['https://admin.socket.io'],
    credentials: true,
  },
});

instrument(io, {
  auth: false,
});

const publicRooms = () => {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io;

  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });

  return publicRooms;
};

const countRoom = (roomName) => {
  return io.sockets.adapter.rooms.get(roomName)?.size;
};

io.on('connection', (socket) => {
  socket['nickname'] = 'Mr.';
  io.sockets.emit('room_changed', publicRooms());

  socket.on('enter_chatting_room', (roomName, nickname, done) => {
    socket.join(roomName);
    socket['nickname'] = nickname;
    done();
    socket.to(roomName).emit('welcome', socket.nickname, countRoom(roomName));
    io.sockets.emit('room_changed', publicRooms());
  });
  socket.on('enter_meeting_room', (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit('welcome');
  });
  socket.on('disconnecting', () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit('bye', socket.nickname, countRoom(room) - 1),
    );
  });
  socket.on('disconnect', () => {
    io.sockets.emit('room_changed', publicRooms());
  });
  socket.on('new_message', (msg, room, done) => {
    socket.to(room).emit('new_message', `${socket.nickname} > ${msg}`);
    done();
  });
  socket.on('offer', (offer, roomName) => {
    socket.to(roomName).emit('offer', offer);
  });
  socket.on('answer', (answer, roomName) => {
    socket.to(roomName).emit('answer', answer);
  });
  socket.on('ice', (ice, roomName) => {
    socket.to(roomName).emit('ice', ice);
  });
});

server.listen(PORT, () => {
  console.log(`HTTP Server is running on http://127.0.0.1:${PORT}/`);
});
