import axios from "axios";
let baseUri = "https://localhost:44344/api";

let Api = axios.create({
    baseURL: baseUri,
    headers: {
        "Content-Type": "application/json"
    }
});

//example public request
// export const Register = async (data) => {
//     return await Api.post("/Users/register/", data)
//         .then((response) => {
//             return response.data;
//         }).catch(error => {
//             console.log(error);
//         })
// };