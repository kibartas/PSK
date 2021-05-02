import axios from 'axios';

const baseUri = 'http://localhost:61346/api';

const Api = axios.create({
  baseURL: baseUri,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${window.sessionStorage.getItem('token')}`,
  },
});

export default Api;

// example request with auth
// export const GetUserInfo = async () => {
//     return await Api.get("/users/info")
//         .then((response) => {
//             return response.data;
//         }).catch(error => {
//             console.log(error);
//         })
// };
