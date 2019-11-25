import req from './base.js';

export default {
    //登陆
    async login (data) {
        return await req.post('users/login',data);
    }
};