import axios from "axios";

const api = axios.create({
  baseURL: "https://student-dropout-ml-server.onrender.com/api",
});

export default api;
