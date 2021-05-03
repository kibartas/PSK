import axios from 'axios';

const baseUri = 'http://localhost:61346/api';

const Api = axios.create({
  baseURL: baseUri,
  headers: {
    'Content-Type': 'application/json',
  },
});

// eslint-disable-next-line
export const getCurrentUser = () =>
  Api.get('/users/current', {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  });

// example request with auth
// export const GetUserInfo = async () => {
//     return await Api.get("/users/info")
//         .then((response) => {
//             return response.data;
//         }).catch(error => {
//             console.log(error);
//         })
// };
