<style lang="less">
    @import './list.less';
</style>

<template>
    <Card>
        <div class="clearfix search-wrapper">
            <div class="pull-left">
                <div class="search-box">
                    <Button size="middle" style="width:100px;" @click="addProduct" type="primary">+发布商品</Button>
                </div>
            </div>
            <div class="pull-right">
                <div class="search-box">
                    <div class="group">
                        <Input type="text" style="width:200px" maxlength="45" size="small" v-model="keyWords" placeholder="请输入商品名称或商品编号"/>
                    </div>

                    <Button size="small" style="width:100px;" @click="search(1)" type="primary">搜索</Button>
                </div>
            </div>
        </div>
        <div>
            <Row>
                <Card>
                    <p slot="title">
                        <Icon type="ios-list"></Icon>
                        商品列表
                    </p>

                    <Tabs v-model="status" @on-click="changeStuaus">
                        <TabPane label="在售" name="1"></TabPane>
                        <TabPane label="已售罄" name="3"></TabPane>
                        <TabPane label="已下架" name="2"></TabPane>
                    </Tabs>
                    <Row type="flex" justify="center" align="middle" class="advanced-router">
                        <Table :columns="shoppingColumns" :data="shoppingData" style="width: 100%;"></Table>
                    </Row>
                    <Page v-bind:total="totalSize" v-bind:current="pageIndex" v-bind:page-size="pageSize" @on-change="search" class="pager-top"></Page>

                </Card>
            </Row>
        </div>

        <Modal :width="900" v-model="productRemove" width="500" okText="确定" @on-ok="ok">
            确定{{this.currentActiveProduct.status==2?"上架":"下架"}}此商品吗？
        </Modal>
    </Card>
</template>

<script>

    import api from '@/apis/product';
    import moment from 'moment';
    import util from '../../libs/util';

    export default {
        name: 'order_list',
        data() {
            return {
                totalSize: 0,
                pageIndex: 1,
                pageSize:10,
                productRemove: false,
                keyWords: '',
                status:'1',  // 0：未上架，1：在售，2：下架，3：已售罄
                currentActiveProduct:{
                    id:0,
                    active:1
                },
                shoppingColumns: [
                    {
                        title: '商品缩略图',
                        key: 'mainPictureUrl',
                        width:120,
                        render: (h, params) => {
                            return h('div', {
                                attrs: {
                                    style: 'width: 80px;height: 40px;'
                                },

                            },[
                                h('img', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    attrs: {
                                        src: params.row.mainPictureUrl, style: 'width: 80px;height: 40px;border-radius: 2px;'
                                    },
                                    style: {
                                    },
                                }),
                            ]);
                        }
                    },
                    {
                        title: '商品名称',
                        key: 'name',
                        align: 'center',
                        render: (h, params) => {
                            return h('a', {
                                props: {
                                    type: 'text',
                                    size: 'small'
                                },
                                attrs: {
                                    href: '#/product/productDetail?id='+params.row.id
                                }
                            }, params.row.name);
                        }
                    },
                    {
                        title: '价格',
                        key: 'price',
                        render: function (h, params) {
                            return h('div',
                                this.row.price/100);
                        }
                    },
                    {
                        title: '库存',
                        key: 'inventoryQty'
                    },
                    {
                        title: '上架时间',
                        key: 'inTime',
                        render: function (h, params) {
                            return h('div',
                                this.row.inTime==null?'':new Date(this.row.inTime).Format('yyyy-MM-dd'));
                        }
                    },
                    {
                        title: '操作',
                        key: 'show_more',
                        align: 'center',
                        render: (h, params) => {
                            return h('Button', {
                                props: {
                                    type: 'text',
                                    size: 'small'
                                },
                                style:
                                    {
                                        color:'#5493c5'
                                    },
                                on: {
                                    click: () => {
                                        let query = {id: params.row.id,status:params.row.status};
                                        this.activeProduct(query);
                                    }
                                }
                            }, params.row.status==1?"下架":"上架");
                        }
                    }
                ],
                shoppingData: []
            };
        },
        methods: {
            ok() {

                if (this.currentActiveProduct==null||this.currentActiveProduct=="undefined"||this.currentActiveProduct.id<1)
                {
                    return;
                }
                var  self=this;
                api.active(this.currentActiveProduct.id,this.currentActiveProduct.status==1?2:1).then(function (data) {
                    if (data.status==0)
                    {
                        self.$Message.info('操作成功!');
                    }
                    else
                    {
                        self.$Message.info('操作失败!');
                    }
                    self.search(1);
                });
            },
            cancel() {
                this.$Message.info('点击了取消');
            },
            activeProduct(param) {
                this.productRemove = true;
                this.currentActiveProduct.id=param.id;
                this.currentActiveProduct.status=param.status;
            },
            addProduct() {
                this.$router.push({path: '/product/productDetail'})
            },
            search(currentPage) {
                if (!/^(0|[1-9][0-9]*)$/.test(currentPage) )
                {
                    currentPage = 1;
                }

                if (currentPage == null || currentPage == "undefined") {
                    currentPage = 1;
                }
                var self = this;
                api.getList(this.keyWords, this.status, currentPage, this.pageSize).then(function (data) {
                    self.shoppingData = data.list;
                    self.totalSize = data.total;
                });
            },
            changeStuaus()
            {
                this.search(1);
            }
        },
        created() {
            util.initFormatter();
            this.search();
        }, watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'search'
        },
    };
</script>
