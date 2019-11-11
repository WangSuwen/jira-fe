import util from '../libs/util';


export default {

    //代发货订单数
    async toDeliverCount() {
        var result;
        await util.ajax.get("/api/v1/op/statistic/order/toDeliverCount").then(function (data) {
            if (data.status==200)
            {
                result = data.data;
            }
        });
        return result;
    },
    //近一周订单数
    async recentWeeklyCount() {
        var result;
        await util.ajax.get("/api/v1/op/statistic/order/recentWeeklyCount").then(function (data) {
            if (data.status==200)
            {
                result = data.data;
            }
        });
        return result;
    },
    //店铺总交易额
    async totalIncome() {
        var result;
        await util.ajax.get("/api/v1/op/statistic//finance/totalIncome").then(function (data) {
            if (data.status==200)
            {
                result = data.data;
            }
        });
        return result;
    },
    //近一周交易额
    async recentWeeklyIncome() {
        var result;
        await util.ajax.get("/api/v1/op/statistic/finance/recentWeeklyIncome").then(function (data) {
            if (data.status==200)
            {
                result = data.data;
            }
        });
        return result;
    },
};
