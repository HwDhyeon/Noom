const logoutBtn = document.querySelector('.logout');
const usernameText = document.querySelector('.username');

const user = JSON.parse(localStorage.getItem('user'));
usernameText.innerText = user.id;

const handleLogout = () => {
  localStorage.removeItem('user');
  location.href = '/';
};

logoutBtn.addEventListener('click', handleLogout);
