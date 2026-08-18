import axios from "axios";

const api = axios.create({
  baseURL: "https://student-dropout-backend.onrender.com/api",
});

export default api;
