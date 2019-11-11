import util from '../libs/util';


export default {

    //获取积分设置
    async get() {
        var result;
        await util.ajax.get("/api/v1/op/setting/point").then(function (data) {
            if (data.status==200)
            {
                result = data.data;
            }
        });
        return result;
    },
    //修改设置
    async update(param) {
        var result;
        await util.ajax.post("/api/v1/op/setting/point",param).then(function (data) {
            result = data.data;
        });
        return result;
    }
};
