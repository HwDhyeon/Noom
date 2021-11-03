const messageList = document.querySelector('ul');
const nicknameForm = document.querySelector('#nickname');
const messageForm = document.querySelector('#message');
const socket = new WebSocket(`ws://${window.location.host}`);

const toJSON = (data) => {
  return JSON.stringify(data);
};

const createChat = (message) => {
  const li = document.createElement('li');
  li.innerText = message;
  messageList.appendChild(li);

  return li;
};

socket.addEventListener('open', () => {
  console.log('Connected to Server ✨');
});

socket.addEventListener('message', (message) => {
  createChat(message.data);
});

socket.addEventListener('close', () => {
  console.log('Disconnected from Server 😥');
});

const handleSetNickname = (event) => {
  event.preventDefault();
  const input = nicknameForm.querySelector('input');
  const nickname = input.value;
  input.value = '';
  socket.send(
    toJSON({
      type: 'nickname',
      payload: nickname,
    }),
  );
};

const handleSendMessage = (event) => {
  event.preventDefault();
  const input = messageForm.querySelector('input');
  const message = input.value;
  input.value = '';
  createChat(`You: ${message}`);
  socket.send(
    toJSON({
      type: 'message',
      payload: message,
    }),
  );
};

nicknameForm.addEventListener('submit', handleSetNickname);
messageForm.addEventListener('submit', handleSendMessage);
