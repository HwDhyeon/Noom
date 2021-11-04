const socket = io();
const user = JSON.parse(localStorage.getItem('user'));

const menu = document.querySelector('main.menu');

const createRoomForm = document.querySelector('#room-create');
const roomList = document.querySelector('.room-list table > tbody');
const chatting = document.querySelector('.chatting');

const messageForm = document.querySelector('.send-message');
const messageList = document.querySelector('.message');

chatting.hidden = true;

let roomNumber = 0;
let roomName = '';

const showRoom = () => {
  const roomNameText = document.querySelector('.room-name');
  roomNameText.innerText = `Room: #${roomName}`;
  menu.hidden = true;
  chatting.hidden = false;
};

const enterRoom = () => {
  console.log('Enter!');
};

const createNewRoom = (roomName, roomHost, roomUsers) => {
  const tr = document.createElement('tr');
  const number = document.createElement('td');
  const name = document.createElement('td');
  const host = document.createElement('td');
  const users = document.createElement('td');
  const enter = document.createElement('td');
  const enterLink = document.createElement('a');

  number.innerText = ++roomNumber;
  name.innerText = roomName;
  host.innerText = roomHost;
  users.innerText = roomUsers;
  enterLink.innerText = 'Enter';
  enterLink.addEventListener('click', enterRoom);
  enter.appendChild(enterLink);

  number.classList.add('number');
  name.classList.add('name');
  host.classList.add('host');
  users.classList.add('users');
  enter.classList.add('enter');

  [number, name, host, users, enter].forEach((td) => tr.appendChild(td));

  roomList.appendChild(tr);
};

const showRoomList = (rooms) => {
  rooms.forEach((room) => createNewRoom('Hi', 'Admin', '0/15'));
};

const createMessage = (message) => {
  const li = document.createElement('li');
  li.innerText = message;
  messageList.appendChild(li);
};

const handleCreateRoom = (event) => {
  event.preventDefault();
  if (!user) {
    location.href = '/login';
  }
  const input = createRoomForm.querySelector('input');
  roomName = input.value;
  input.value = '';
  socket.emit('enter_room', roomName, user.id, showRoom);
};

const handleMessageSubmit = (event) => {
  event.preventDefault();
  const input = messageForm.querySelector('input');
  const message = input.value;
  socket.emit('new_message', message, roomName, () => {
    createMessage(`You > ${message}`);
  });
  input.value = '';
};

createRoomForm.addEventListener('submit', handleCreateRoom);
messageForm.addEventListener('submit', handleMessageSubmit);

socket.on('connected', (rooms) => {
  console.log(rooms);
  showRoomList(Array.from(rooms));
});

socket.on('welcome', (user) => {
  createMessage(`${user} joined!`);
});

socket.on('bye', (user) => {
  createMessage(`${user} left 😥`);
});

socket.on('new_message', createMessage);
