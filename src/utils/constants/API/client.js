import axios from 'axios';
import {BASE_URL} from './commonUrl.js';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;
