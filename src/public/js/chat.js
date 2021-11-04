const socket = io();
const user = JSON.parse(localStorage.getItem('user'));

const menu = document.querySelector('main.menu');

const createRoomForm = document.querySelector('#room-create');
const roomList = document.querySelector('.room-list');
const roomListTable = roomList.querySelector('table > tbody');
const chatting = document.querySelector('.chatting');

const roomNameText = document.querySelector('.room-name');

const messageForm = document.querySelector('.send-message');
const messageList = document.querySelector('.message');

chatting.hidden = true;
roomList.hidden = true;

let roomNumber = 0;
let roomName = '';

const showRoom = () => {
  roomNameText.innerText = `Room: #${roomName}`;
  menu.hidden = true;
  chatting.hidden = false;
};

const showRoomList = () => (roomList.hidden = false);
const hideRoomList = () => (roomList.hidden = true);

const cleanRoomList = () => {
  roomListTable.innerHTML = '';
};

const enterRoom = (event) => {
  const td = event.target.parentNode;
  const tr = td.parentNode;
  const name = tr.querySelector('.name');
  roomName = name.innerText;
  socket.emit('enter_room', roomName, user.id, showRoom);
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

  roomListTable.appendChild(tr);
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

socket.on('welcome', (user, count) => {
  roomNameText.innerText = `Room: #${roomName} ${count}`;
  createMessage(`${user} joined!`);
});

socket.on('bye', (user, count) => {
  roomNameText.innerText = `Room: #${roomName} ${count}`;
  createMessage(`${user} left 😥`);
});

socket.on('new_message', createMessage);
socket.on('room_changed', (rooms) => {
  if (rooms.length) {
    showRoomList();
    rooms.forEach((room) => createNewRoom(room, 'Admin', '0/15'));
  } else {
    cleanRoomList();
    hideRoomList();
  }
});
