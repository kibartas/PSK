import axios from "axios";
let baseUri = "https://localhost:44344/api";

let Api = axios.create({
    baseURL: baseUri,
    responseType: "blob",
    headers: {
        "Authorization": "Bearer " + window.sessionStorage.getItem("token")
    }
});

//example file download
// export const DownloadVideo = async (id) => {
//     return await Api.get("/videos/download/" + id)
//         .then((response) => {
//             const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement('a');

//             link.href = downloadUrl;
//             link.setAttribute('download', "video.mp4"); //any other extension
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//         })
//         .catch((error) => {
//             throw Error("An error has occurred calling the api: " + error);
//         });
// };