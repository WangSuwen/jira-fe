import util from '../libs/util';


export default {

    //登陆
    async login(userName,passWord) {
        var result;
        await util.ajax.post("/api/v1/op/login",{userName:userName,password:passWord}).then(function (data) {
            if (data.status==200)
            {
                result = data.data;
            }
        });
        return result;
    },
    //修改店铺信息
    async updateStore(param) {
        var result;
        await util.ajax.post("/api/v1/op/store",param).then(function (data) {
            if (data.status==200)
            {
                result = data.data;
            }
        });
        return result;
    },
    //获取店铺信息
    async getStore(param) {
        var result;
        await util.ajax.get("/api/v1/op/store",param).then(function (data) {
            if (data.status==200)
            {
                result = data.data;
            }
        });
        return result;
    },
    async getQiNiuToken() {
        var result;
        await util.ajax.get("/api/v1/op/qiniu").then(function (data) {
            if (data.status==200)
            {
                result = data.data;
            }
        });
        return result;
    }


};
