import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => { require(['@/views/login.vue'], resolve); }
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['@/views/error-page/404.vue'], resolve); }
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: resolve => { require(['@//views/error-page/403.vue'], resolve); }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: resolve => { require(['@/views/error-page/500.vue'], resolve); }
};

export const preview = {
    path: '/preview',
    name: 'preview',
    component: resolve => { require(['@/views/form/article-publish/preview.vue'], resolve); }
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: resolve => { require(['@/views/main-components/lockscreen/components/locking-page.vue'], resolve); }
};


// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/other',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: '/product/productDetail', title: '产品详情', name: 'productDetail', component: resolve => { require(['@/views/product/detail.vue'], resolve); } },
        { path: 'workbench', title: '个人中心', name: 'ownspace', component: resolve => { require(['@/views/own-space/own-space.vue'], resolve); } },
        { path: 'order/:order_id', title: '订单详情', name: 'order-info', component: resolve => { require(['@/views/advanced-router/component/order-info.vue'], resolve); } }, // 用于展示动态路由
        { path: 'message', title: '消息中心', name: 'message_index', component: resolve => { require(['@/views/message/message.vue'], resolve); } }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/',
        icon: 'key',
        name: 'home',
        title: '首页看板',
        component: Main,
        children: [
            { path: 'home_index', title: '首页看板', name: 'home_index', component: resolve => { require(['@/views/home/home.vue'], resolve); } }
        ]
    },
    {
        path: '/store',
        icon: 'lock-combination',
        title: '店铺',
        name: 'store',
        component: Main,
        children: [
            { path: 'store', title: '店铺', name: 'store_store', component: resolve => { require(['@/views/store/store.vue'], resolve); } }
        ]
    },
    {
        path: '/product',
        icon: 'social-buffer',
        name: 'product',
        title: '商品',
        component: Main,
        children: [
            {
                path: 'category',
                icon: 'compose',
                name: 'product_category',
                title: '商品分类',
                component: resolve => { require(['@/views/product/category.vue'], resolve); }
            },
            {
                path: 'list',
                icon: 'pound',
                name: 'product_list',
                title: '商品列表',
                component: resolve => { require(['@/views/product/list.vue'], resolve); }
            },

        ]
    },
    {
        path: '/order',
        icon: 'ios-grid-view',
        name: 'tables',
        title: '订单',
        component: Main,
        children: [
            { path: 'list', title: '订单列表', name: 'order_list', icon: 'arrow-move', component: resolve => { require(['@/views/order/list.vue'], resolve); } }
            //{ path: 'shipping', title: '订单发货', name: 'order_shipping', icon: 'edit', component: resolve => { require(['@/views/tables/editable-table.vue'], resolve); } }
        ]
    },
    {
        path: '/setting',
        icon: 'ios-infinite',
        name: 'advanced-router',
        title: '设置',
        component: Main,
        children: [
            { path: 'point', title: '积分设置', name: 'setting_point', icon: 'link', component: resolve => { require(['@/views/setting/point.vue'], resolve); } }
            //{ path: 'argument-page', title: '带参页面', name: 'argument-page', icon: 'android-send', component: resolve => { require(['@/views/advanced-router/argument-page.vue'], resolve); } }
        ]
    }
];

export const testRouter = {
    path: '/test-page',
    meta: {
        title: '测试页面'
    },
    name: 'testPage',
    component: resolve => { require(['@/views/test.vue'], resolve); }
};

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    preview,
    locking,
    ...appRouter,
    testRouter,
    page500,
    page403,
    page404
];
