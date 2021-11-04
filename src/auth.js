import { fromJSON } from './utils';

export const getUser = () => {
  return fromJSON(localStorage.getItem('user'));
};

export const isLoggedIn = () => {
  user = getUser();
  if (user) {
    return true;
  } else {
    return false;
  }
};
