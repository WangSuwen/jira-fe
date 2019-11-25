import Vue from 'vue';
import iView from 'view-design';
import 'view-design/dist/styles/iview.css';
import {router} from './router/index';
import {appRouter} from './router/router';
import store from './store';
import App from './app.vue';
import Ajax from './apis/Ajax.js';
import vueInit from './mixins/vue-init';
import { VirtualScroller } from 'vue-virtual-scroller';

Vue.use(iView);
Vue.use(Ajax);
Vue.component('virtual-scroller', VirtualScroller);

new Vue({
    el: '#app',
    router,
    store,
    mixins: [vueInit],
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted () {
        this.currentPageName = this.$route.name;
        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
        // 权限菜单过滤相关
        this.$store.commit('updateMenulist');
        // iview-admin检查更新
        // util.checkUpdate(this);
    },
    created () {
        let tagsList = [];
        appRouter.map((item) => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        this.$store.commit('setTagsList', tagsList);
    }
});
