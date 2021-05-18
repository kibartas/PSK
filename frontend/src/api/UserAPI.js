import Api from './Api';

Api.defaults.headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${sessionStorage.getItem('token')}`,
};

// eslint-disable-next-line
export const updateCredentials = (id, credentials) => {
  return Api.patch(`/users/${id}`, credentials);
};
