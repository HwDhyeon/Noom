const socket = io();

const welcome = document.querySelector('#welcome');
const form = welcome.querySelector('form');

const handleEnterRoom = (evnet) => {
  event.preventDefault();
  const input = form.querySelector('input');
  socket.emit('enter_room', { payload: input.value });
  input.value = '';
};

form.addEventListener('submit', handleEnterRoom);
