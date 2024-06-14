import axios from 'axios';

const baseUrl = import.meta.env.VITE_REACT_APP_NODE_ENV === 'development'
  ? import.meta.env.VITE_REACT_APP_API_URL_DEV
  : import.meta.env.VITE_REACT_APP_API_URL_PROD;

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 600000,
});

instance.interceptors.response.use(
  (response) => {
    console.log('base url: ' + baseUrl);
    return response.data;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);

export default instance;
  // baseURL: 'https://imagealert-dot-sod-cl-bi-sandbox.appspot.com', // Set the base URL for your API endpoint from your .env file
  // baseURL: 'https://imagealert-dot-sod-cl-bi-sandbox.appspot.com', // Set the base URL for your API endpoint from your .env file
  // baseURL: import.meta.env.NODE_ENV === 'dev' ?  import.meta.env.VITE_REACT_APP_API_URL_DEV : import.meta.env.VITE_REACT_APP_API_URL_PROD,
