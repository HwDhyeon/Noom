const form = document.querySelector('form');
const userId = document.getElementById('userid');
const userPassword = document.getElementById('userpass');

const handleSubmit = (event) => {
  event.preventDefault();
  const id = userId.value;
  const password = userPassword.value;
  localStorage.setItem('user', JSON.stringify({ id, password }));
  location.href = '/';
};

form.addEventListener('submit', handleSubmit);
