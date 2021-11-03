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

const showRoom = () => {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector('h3');
  h3.innerText = `Room: ${roomName}`;
};

const handleEnterRoom = (event) => {
  event.preventDefault();
  const input = form.querySelector('input');
  roomName = input.value;
  input.value = '';
  socket.emit('enter_room', roomName, showRoom);
};

form.addEventListener('submit', handleEnterRoom);

socket.on('welcome', () => {
  addMessage('User is joined!');
});
