import axios from 'axios';

const api = axios.create({
    //baseURL: 'http://192.168.0.6:3000',
    baseURL: 'http://142.93.121.180',
});

export default api;
