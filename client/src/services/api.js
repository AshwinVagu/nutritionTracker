import axios from "axios";

const axiosServer = axios.create({
  // baseURL: "http://localhost:5000", //dev
  baseURL: "http://127.0.0.1:5000", //dev for mac
  //   baseURL: "https://rf-server.onrender.com/",
  // baseURL: "http://34.148.1.161:5000/" //server on GCP
});

export default axiosServer;
