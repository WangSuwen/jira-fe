import {otherRouter, appRouter} from '@/router/router';
import ProductApi from '@/apis/product';

const product = {
    data(){
        productDetail: {}
    },
    mutations: {
        SET_PRODUCT_DETAIL: (state, data) => {
            state.productDetail = data;
        }
    },
    actions: {
        // 获取商品详情
        getDetail({commit}, id) {
            return new Promise((resolve, reject) => {
                ProductApi.getDetail(id)
                    .then(response => {
                        if (!response.data.status) {
                            commit('SET_PRODUCT_DETAIL', response.data);
                        } else {

                        }
                    })
                    .catch(error => {
                        reject(error);
                    });
            });
        },
    }
};

export default product;