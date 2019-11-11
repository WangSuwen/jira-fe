import util from '../libs/util';


export default {

    //查询商品分类列表
    async getList() {
        var result;
        await util.ajax.get("/api/v1/op/category/list").then(function (data) {
            if (data.status==200)
            {
                result = data.data;
            }
        });
        return result;
    },
    //添加商品分类
    async add(param) {
        var result;
        await util.ajax.post("/api/v1/op/category",param).then(function (data) {
            if (data.status==200)
            {
                result = data.data;
            }
        });
        return result;
    },
    //修改商品分类
    async edit(param) {
        var result;
        await util.ajax.put("/api/v1/op/category",param).then(function (data) {
            if (data.status==200)
            {
                result = data.data;
            }
        });
        return result;
    },
    //删除商品分类
    async del(id) {
        var result;
        await util.ajax.delete("/api/v1/op/category/"+id).then(function (data) {
            if (data.status==200)
            {
                result = data.data;
            }
        });
        return result;
    }
};
