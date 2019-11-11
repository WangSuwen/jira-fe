import util from '../libs/util';


export default {

    //获取商品详情
    async getDetail(id) {
        ///api/v1/pms/admin/test/health   测试地址
        var result;
        await util.ajax.get("/api/v1/op/product/" + id).then(function (data) {
            if (data.status==200&&data.data.status==0)
            {
                result = data.data.data;
            }
        });
        return result;
    },
    //获取商品列表
    async getList(keyWord ,status, pageIndex, pageSize) {
        var result;
        await  util.ajax.get("/api/v1/op/product/list/"+pageIndex+"/"+pageSize,{params:{keyword:keyWord,status:status}}).then(function (data) {
            if (data.status==200&&data.data.status==0)
            {
                result = data.data.data;
            }
        });
        return result;
    },
    //添加商品
    async add(model) {
        var result;
        await  util.ajax.post("/api/v1/op/product/",model).then(function (data) {
            result = data.data;
        });
        return result;
    },
    //修改商品
    async edit(model) {
        var result;
        await util.ajax.put("/api/v1/op/product/",model).then(function (data) {
            result = data.data;
        });
        return result;
    },
    //商品上下架
    async active (id,status)
    {
        var result;
        await  util.ajax.put("/api/v1/op/product/active/"+id+"/"+status).then(function (data) {
            result = data.data;
        });
        return result;
    }


};
