import util from '../libs/util';


export default {

    //查询单个订单
    async getDetail(id) {
        var result;
        await util.ajax.get("/api/v1/op/order/" + id).then(function (data) {
            if (data.status == 200) {
                result = data.data;
            }
        });
        return result;
    },
    //获取订单列表
    async getList(pageIndex, pageSize, keyWords, status, payStatus) {
        var result;
        await util.ajax.get("/api/v1/op/order/list/" + pageIndex + "/" + pageSize,{params:{
            keyword: keyWords,
            status: status,
            payStatus: payStatus
        }} ).then(function (data) {
            if (data.status == 200) {
                result = data.data;
            }
        });
        return result;
    },
    //发货
    async deliver(param) {
        var result;
        await util.ajax.post("/api/v1/op/order/deliver", param).then(function (data) {
            if (data.status == 200) {
                result = data.data;
            }
        });
        return result;
    }
};
