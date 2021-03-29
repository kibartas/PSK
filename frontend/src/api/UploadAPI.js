import axios from "axios";
let baseUri = "https://localhost:44344/api";

let Api = axios.create({
    baseURL: baseUri,
    headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": "Bearer " + window.sessionStorage.getItem("token")
    }
});

//example file upload
// export const UploadFiles = async (files) => {
//     return await Api.post("/Users/upload-files/", files)
//         .then((response) => {
//             return response.data;
//         }).catch(error => {
//             console.log(error);
//         })
// };

