import req from './base.js';
import Api from './Api.js';

const request = options => {
    return req(options);
};
const _Api = Api;
const Ajax = {};
Ajax.install = function (Vue) {
    /**
     * @param url 接口地址
     * @param params get、post 传递的参数
     * @param paramsUrl 拼接在 url 后面传递的参数，对应于Nodejs 用 req.params.XXX 来取
     */
    Vue.prototype.request = function (url, params, paramsUrl, loading = true) {
        if (loading) {
            this.$store.commit('toggleFullPageLoading', true);
        }
        return request({
            url: _Api[url].urlParams ? `${_Api[url].url}/${paramsUrl.join('/')}` : _Api[url].url,
            method: _Api[url].method,
            [_Api[url].method === 'get' ? 'params' : 'data']: params
        }).then(data => {
            this.$nextTick(() => {
                this.$store.commit('toggleFullPageLoading', false);
            });
            return data;
        });
    }
};
export default Ajax;