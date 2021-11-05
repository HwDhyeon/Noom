// const socket = io();

const welcome = document.getElementById('welcome');
const call = document.getElementById('call');

const welcomeForm = welcome.querySelector('form');

const myFace = document.getElementById('my-face');
const muteBtn = document.getElementById('mute');
const cameraBtn = document.getElementById('camera');
const cameraSelect = document.getElementById('cameras');

call.hidden = true;

let roomName;

let myStream;
let myPeerConnection;
let muted = false;
let cameraOff = false;

const getCameras = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter((device) => device.kind == 'videoinput');
    const currentCamera = myStream.getVideoTracks()[0];
    cameras.forEach((camera) => {
      const option = document.createElement('option');
      option.value = camera.deviceId;
      option.innerText = camera.label;
      if (currentCamera.label == camera.label) option.selected = true;
      cameraSelect.appendChild(option);
    });
  } catch (e) {
    console.log(e);
  }
};

const getMedia = async (deviceId) => {
  const initialConstrains = {
    audio: true,
    video: { facingMode: 'user' },
  };
  const cameraConstrains = {
    audio: true,
    video: { deviceId: { exact: deviceId } },
  };
  try {
    myStream = await navigator.mediaDevices.getUserMedia(
      deviceId ? cameraConstrains : initialConstrains,
    );
    myFace.srcObject = myStream;
    if (!deviceId) await getCameras();
  } catch (e) {
    console.log(e);
  }
};

const startMedia = async () => {
  welcome.hidden = true;
  call.hidden = false;
  await getMedia();
  makeConnection();
};

const handleEnterRoom = (event) => {
  event.preventDefault();
  const input = welcomeForm.querySelector('input');
  roomName = input.value;
  socket.emit('enter_meeting_room', roomName, startMedia);
};

const handleMuteBtnClick = () => {
  myStream
    .getAudioTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (!muted) {
    muteBtn.innerText = 'Unmute';
  } else {
    muteBtn.innerText = 'Mute';
  }
  muted = !muted;
};

const handleCameraBtnClick = () => {
  myStream
    .getVideoTracks()
    .forEach((track) => (track.enabled = !track.enabled));
  if (cameraOff) {
    cameraBtn.innerText = 'Turn Camera Off';
  } else {
    cameraBtn.innerText = 'Turn Camera On';
  }
  cameraOff = !cameraOff;
};

const handleCameraChange = async () => {
  await getMedia(cameraSelect.value);
};

welcomeForm.addEventListener('submit', handleEnterRoom);

muteBtn.addEventListener('click', handleMuteBtnClick);
cameraBtn.addEventListener('click', handleCameraBtnClick);
cameraSelect.addEventListener('input', handleCameraChange);

// Socket Code
socket.on('welcome', async () => {
  const offer = await myPeerConnection.createOffer();
  myPeerConnection.setLocalDescription(offer);
  socket.emit('offer', offer, roomName);
});

socket.on('offer', (offer) => {
  console.log(offer);
});

/// RTC Code

const makeConnection = () => {
  myPeerConnection = new RTCPeerConnection();
  myStream
    .getTracks()
    .forEach((track) => myPeerConnection.addTrack(track, myStream));
};
