import axios from 'axios';

const baseUri = 'https://localhost:44344/api';

const Api = axios.create({
  baseURL: baseUri,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default Api;

// example public request
// export const Register = async (data) => {
//     try {
//         const response = await Api.post("/Users/register/", data);
//         return response.data;
//     } catch(error) {
//         console.log(error);
//     }
// };
