import axios from 'axios';

const client = axios.create({
  baseURL: 'https://market2.store/wp-json/custom-api/v1',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

//client.defaults.headers.post['Content-Type'] = 'application/json';

export default client;
