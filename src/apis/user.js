import req from './base.js';

export default {
    //登陆
    login (data) {
        return req.post('users/login',data);
    },
    getUserInfo () {
        return req.get('users/getAllUsers');
    }
};