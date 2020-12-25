import axios from "axios";

const instance = axios.create({
  baseURL: "https://react-burger-builder-95f67.firebaseio.com/",
});

export default instance;
