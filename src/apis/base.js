import axios from 'axios';
import Vue from 'vue';

const BASE_API = {
  development: 'http://localhost:3000/',
  production: 'http://www.loveruoxi.com:9202/'
};
// create an axios instance
const service = axios.create({
  baseURL: BASE_API[process.env.NODE_ENV === 'production' ? 'production' : 'development'], // api的base_url
  withCredentials: 'include',
  timeout: 35000 // request timeout
});

function showErrMsg (msg, duration = 2000) {
  Vue.prototype.$Message.error({
    background: true,
    content: msg,
    duration
  });
}

// 拦截器
service.interceptors.request.use(config => {
  return config;
}, error => {
  // eslint-disable-next-line no-console
  console.log(error); // for debug
  Promise.reject(error);
});

// respone interceptor
service.interceptors.response.use(
  response => {
    if (response && response.data) {
      if (response.data.code === 200) {
        return response.data.data;
      } else if (response.data.code === 10002) {
        window.location.href = window.location.origin + '/#/login';
      } else {
        showErrMsg(response.data.msg);
        return null;
      }
    } else {
      showErrMsg(response.data.msg);
    }
  },
  error => {
    let errMsg = '';
    if (!error.response) {
      errMsg = '系统错误';
    } else if (error.response.status === 404) {
      errMsg = '接口未找到';
    } else if (error.response.data.msg) {
      errMsg = error.response.data.msg;
    }
    showErrMsg(errMsg, 5000);
    return false;
  });
export default service;
