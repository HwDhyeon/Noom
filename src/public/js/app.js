const socket = io();

const welcome = document.querySelector('#welcome');
const form = welcome.querySelector('form');

const room = document.getElementById('room');

room.hidden = true;

let roomName;

const addMessage = (message) => {
  const ul = room.querySelector('ul');
  const li = document.createElement('li');
  li.innerText = message;
  ul.appendChild(li);
};

const handleNicknameSubmit = (event) => {
  event.preventDefault();
  const input = room.querySelector('#nickname input');
  const nickname = input.value;
  socket.emit('nickname', nickname);
  input.value = '';
};

const handleMessageSubmit = (event) => {
  event.preventDefault();
  const input = room.querySelector('#message input');
  const message = input.value;
  socket.emit('new_message', message, roomName, () => {
    addMessage(`You: ${message}`);
  });
  input.value = '';
};

const showRoom = () => {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector('h3');
  h3.innerText = `Room: ${roomName}`;
  const nicknameForm = room.querySelector('#nickname');
  const messageForm = room.querySelector('#message');
  nicknameForm.addEventListener('submit', handleNicknameSubmit);
  messageForm.addEventListener('submit', handleMessageSubmit);
};

const handleEnterRoom = (event) => {
  event.preventDefault();
  const input = form.querySelector('input');
  roomName = input.value;
  input.value = '';
  socket.emit('enter_room', roomName, showRoom);
};

form.addEventListener('submit', handleEnterRoom);

socket.on('welcome', (user) => {
  addMessage(`${user} joined!`);
});

socket.on('bye', (user) => {
  addMessage(`${user} left 😥`);
});

socket.on('new_message', addMessage);
