
import axios from 'axios'
import {NGROK_URL} from '@env'

export default axios.create({
  baseURL: "https://258f-91-152-126-92.ngrok-free.app",
});