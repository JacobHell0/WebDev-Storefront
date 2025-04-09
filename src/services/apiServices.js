// HANDLES ALL SERVER CALLS FROM FRONT END

import axios from 'axios';

//Single axios setup
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: false,
  headers: 
  {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});


export default //CURRENTLY ALL JUST DEBUG REQUESTS
{
  getHelloMessage() 
  {
    return apiClient.get('/hello');
  },
  getGoodbyeMessage()
  {
    return apiClient.get('/goodbye')
  },
  getServerStatus()
  {
    return apiClient.get('/status')
  },
};
