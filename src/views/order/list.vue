<style lang="less">
    @import './list.less';
</style>

<template>
    <Card>
        <div class="search-box">
            <div class="group">
                <label>商品名称或编号</label>
                <Input type="text" style="width:200px" size="small" maxlength=45  v-model="keyword" placeholder="请输入商品名称或编号"/>
            </div>
            <Button size="small" style="width:100px;" @click="search(1)" type="primary">搜索</Button>
        </div>

        <div>
            <Row>
                <Card>
                    <p slot="title">
                        <Icon type="ios-list"></Icon>
                        订单列表
                    </p>

                    <Tabs v-model="status" @on-click="changeOrderStatus">
                        <TabPane label="全部" name="0"></TabPane>
                        <TabPane label="待支付" name="1"></TabPane>
                        <TabPane label="待发货" name="2"></TabPane>
                        <TabPane label="已发货" name="3"></TabPane>
                        <TabPane label="已关闭" name="4"></TabPane>
                    </Tabs>

                    <Row type="flex" justify="center" align="middle" class="advanced-router">
                        <Table :columns="orderColumns" :data="orderData" style="width: 100%;"></Table>
                    </Row>
                    <Page v-bind:total="totalSize" v-bind:current="pageIndex" @on-change="search" class="pager-top"></Page>

                </Card>

            </Row>
        </div>

        <Modal :width="900" v-model="deliver" title="订单发货" @on-ok="ok" width="400" okText="发货">
            <Form :model="currentDeliverProduct" :label-width="80">
                <FormItem label="物流公司：" style="width: 300px">
                    <Input v-model="currentDeliverProduct.company"></Input>
                </FormItem>
                <FormItem label="物流单号：" style="width: 300px">
                    <Input v-model="currentDeliverProduct.trackingNo"></Input>
                </FormItem>
            </Form>
        </Modal>
        <Modal  v-model="orderDetailDisplay" title="订单详情" width="1000">
            <Form :label-width="80">
                <Row type="flex" justify="center" align="middle" class="advanced-router">
                    <Table :columns="orderItemColumns" :data="orderDetail.orderItemList" style="width: 100%;"></Table>
                </Row>
                <div align="right" class="table_title">订单总额：{{orderDetail.money/100}}</div>
                <p class="step-content" ></p>
                <div align="left"  size="middle"  class="table_title mgleft">订单信息</div>
                <hr class="hrmain"/>
                <table align="center" width="100%"  class="tableDetail mgleft">
                    <tr>
                        <td  width="14%">订单总额：</td>
                        <td  width="20%">￥{{orderDetail.money/100}}</td>
                        <td  width="14%">积分抵扣：</td>
                        <td  width="20%">{{orderDetail.exchangePoint!=null?'￥'+orderDetail.exchangePoint:''}}<!--（抵扣数量500--></td>
                        <td  width="14%">支付金额：</td>
                        <td>￥{{orderDetail.payCash/100}}</td>
                    </tr>
                    <tr>
                        <td>订单号：</td>
                        <td>{{orderDetail.orderCode}}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>创建时间：</td>
                        <td>{{new Date(orderDetail.gmtCreate).Format('yyyy-MM-dd hh:mm:ss')}}</td>
                        <td>支付时间：</td>
                        {{orderDetail.payTime!=null? new Date(orderDetail.payTime).Format('yyyy-MM-dd hh:mm:ss'):''}}
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>支付状态：</td>
                        <td>{{orderDetail.payStatus == '1' ? '已支付' : '未支付'}}</td>
                        <td>支付方式：</td>
                        <td>{{orderDetail.payMode==null?'':orderDetail.payMode==0?'银行卡':'微信'}}</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>发货状态：</td>
                        <td>{{this.convertOrderStatus(orderDetail.status)}}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </table>
                <p class="step-content" ></p>

                <div align="left" size="middle"  class="table_title mgleft">收货信息</div>
                <hr class="hrmain"/>
                <table align="center" width="100%"  class="tableDetail mgleft">
                    <tr>
                        <td width="14%">收货人：</td>
                        <td width="20%">{{orderDetail.receiver}}</td>
                        <td width="14%">收货地址：</td>
                        <td width="20%">{{orderDetail.receiverAddress}}</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>手机号：</td>
                        <td>{{orderDetail.receiverMobile}}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </table>
                <p class="step-content" ></p>

                <div align="left" size="middle"  class="table_title mgleft">物流信息</div>
                <hr class="hrmain" />
                <table align="center" width="100%"  class="tableDetail mgleft">
                    <tr>
                        <td width="14%">物流公司：</td>
                        <td width="20%">{{orderDetail.company}}</td>
                        <td width="14%">物流单号：</td>
                        <td width="20%">{{orderDetail.trackingNo}}</td>
                        <td></td>
                        <td></td>
                    </tr>
                </table>
            </Form>
        </Modal>
    </Card>
</template>

<script>

    import api from '@/apis/order';
    import util from '../../libs/util';

    export default {
        name: 'order_list',
        data() {
            return {
                totalSize: 0,
                pageIndex: 1,
                pageSize: 10,
                status: '0',  //0:全部，1：待支付，2：代发货。3：已发货，4：已关闭
                payStatus: '',
                keyword: '',
                currentDeliverProduct: {
                    id: 0,
                    company: '',
                    trackingNo: ''
                },
                modal1: true,
                orderColumns: [
                    {
                        title: '订单号',
                        key: 'orderCode',
                        align: 'center'
                    },
                    {
                        title: '下单时间',
                        key: 'gmtCreate',
                        align: 'center',
                        render: function (h, params) {
                            return h('div',
                                new Date(this.row.gmtCreate).Format('yyyy-MM-dd hh:mm:ss'));
                        }
                    },
                    {
                        title: '订单金额',
                        key: 'money',
                        align: 'center',
                        render: function (h, params) {
                            return h('div',
                                this.row.money/100);
                        }
                    },
                    {
                        title: '收货人',
                        align: 'center',
                        key: 'receiver'
                    },
                    {
                        title: '支付状态',
                        key: 'payStatus',
                        align: 'center',
                        render: function (h, params) {
                            return h('div',
                                this.row.payStatus == 1 ? "已支付" : "未支付");
                        }
                    },
                    {
                        title: '订单状态',
                        key: 'status',
                        align: 'center',
                        render: function (h, params) {
                            var status='待支付';
                            if (this.row.status == 0) {
                                status = '已关闭'
                            }else if (this.row.status == 1) {
                                status = '待发货'
                            }else if (this.row.status == 2) {
                                status = '已发货'
                            }
                            return h('div',
                                status
                            );
                        }
                    },
                    {
                        title: '操作',
                        key: 'show_more',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text',
                                        size: 'small'
                                    },
                                    style:
                                        {
                                            display: params.row.status == 1 ? "" : "none",color:'#5493c5'
                                        },
                                    on: {
                                        click: () => {
                                            this.currentDeliverProduct.id = params.row.id;
                                            this.deliver = true;
                                        }
                                    }
                                }, '发货'),
                                h('Button', {
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
                                            this.showOrderDateil(params.row.id);
                                        }
                                    }
                                }, '查看')
                            ]);
                        }
                    }

                ],
                orderItemColumns: [
                    {
                        title: '商品图片',
                        key: 'mainPictureUrl',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {
                                attrs: {
                                    //style: 'width: 80px;height: 40px;'
                                },

                            }, [
                                h('img', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    attrs: {
                                        src: params.row.url, style: 'width: 70px;height: 70px;border-radius: 2px;margin:5px 0px 5px 0px;'
                                    },
                                    style: {},
                                }),
                            ]);
                        }
                    },
                    {
                        title: '商品名称',
                        key: 'productName',
                        align: 'center'
                    },
                    {
                        title: '商品价格',
                        key: 'itemMoney',
                        align: 'center',
                        render: function (h, params) {
                            return h('div',
                                "￥"+params.row.itemMoney/100+(params.row.point!=null?"+"+params.row.point+"积分":''));
                        }
                    },
                    {
                        title: '数量',
                        align: 'center',
                        key: 'itemCount'
                    },
                    {
                        title: '总计',
                        key: 'totalMoney',
                        align: 'center',
                        render: function (h, params) {
                            return h('div',
                                "￥"+params.row.totalMoney/100+(params.row.totalPoint!=null?"+"+params.row.totalPoint+"积分":''));
                        }
                    }
                ],
                orderData: [],
                deliver: false,
                orderDetailDisplay: false,
                orderDetail: {
                    id: '',                      //订单id
                    money: '',                   //订单总额
                    exchangePoint: '',           //积分抵扣
                    payCash: '',                 //支付金额
                    orderCode: '',               //订单号
                    gmtCreate: '',               //创建时间
                    payTime: '',                 //支付时间
                    payStatus: '',               //支付状态
                    payMode: '',                 //支付方式id
                    payModeDesc:'',              //支付方式
                    status: '',                  //发货状态

                    receiver: '',                //收货人
                    receiverAddress: '',         //收货地址
                    receiverMobile: '',          //手机号

                    company: '',                 //物流公司
                    trackingNo: '',              //物流单号

                    orderItemList: []                //订单明细

                }
            };
        },
        methods: {
            ok() {
                if (this.currentDeliverProduct == null || this.currentDeliverProduct == "undefined" || this.currentDeliverProduct.id < 1) {
                    return;
                }
                var self = this;
                api.deliver({
                    orderId: this.currentDeliverProduct.id,
                    company: this.currentDeliverProduct.company,
                    trackingNo: this.currentDeliverProduct.trackingNo
                }).then(function (data) {
                    if (data.status == 0) {
                        self.$Message.info('操作成功!');
                    }
                    else {
                        self.$Message.info('操作失败!');
                    }
                    self.search(1);
                    self.currentDeliverProduct.id = '';
                    self.currentDeliverProduct.company = '';
                    self.currentDeliverProduct.trackingNo = '';
                });
            },
            cancel() {
                this.$Message.info('点击了取消');
            },
            showDeliverGoods() {
                this.deliver = true;
            },
            showOrderDateil(orderId) {
                this.orderDetailDisplay = true;
                var self = this;
                api.getDetail(orderId).then(function (data) {
                    self.orderDetail = data.data;
                });
            },
            search(currentPage) {
                if (currentPage == null || currentPage == "undefined") {
                    currentPage = 1;
                }
                var self = this;
                let par1;
                let par2;
                switch (this.status) {
                    case '0':
                        par1 = null;
                        par2 = null;
                        break;
                    case '1':
                        par1 = 3;
                        par2 = 0;
                        break;
                    case '2':
                        par1 = 1;
                        par2 = 1;
                        break;
                    case '3':
                        par1 = 2;
                        par2 = 1;
                        break;
                    case '4':
                        par1 = 0;
                        par2 = 0;
                        break;
                }

                api.getList(currentPage, this.pageSize, this.keyword, par1, par2).then(function (data) {
                    self.orderData = data.data.list;
                    self.totalSize = data.data.total;
                });
            },
            convertOrderStatus(status) {
                switch (status) {
                    case 1:
                        return '待发货';
                    case 2:
                        return '已发货';
                    case 0:
                        return '取消';
                }
            },
            changeOrderStatus() {
                this.search(1);
            }

        },
        monted: {},
        created() {
            util.initFormatter();
            this.search(1);
        }
    };
</script>
