
import axios from 'axios'
import { BASE_URL } from "@env";

export default axios.create({
  baseURL:  "https://rakval-1a943ba6019b.herokuapp.com",
});