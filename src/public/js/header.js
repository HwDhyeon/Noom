const profile = document.querySelector('li.profile');

const headerInit = () => {
  const link = document.createElement('a');
  const user = localStorage.getItem('user');

  if (user) {
    link.setAttribute('href', '/profile');
    link.innerText = 'Profile';
  } else {
    link.setAttribute('href', '/login');
    link.innerText = 'Login';
  }

  profile.appendChild(link);
};

headerInit();
