import util from '../libs/util';

export default {
    //修改店铺信息
    async updateStore(param) {
        var result;
        await util.ajax.post("/api/v1/op/store",param).then(function (data) {
            if (data.code==200)
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
            if (data.code==200)
            {
                result = data.data;
            }
        });
        return result;
    },
    async getQiNiuToken() {
        var result;
        await util.ajax.get("/api/v1/op/qiniu").then(function (data) {
            if (data.code==200)
            {
                result = data.data;
            }
        });
        return result;
    }


};
