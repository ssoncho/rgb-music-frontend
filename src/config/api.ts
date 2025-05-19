import axios from "axios";
import config from "../config";

const api = axios.create({
  baseURL: config.apiUrl,
  timeout: 5000,
});

export default api;
