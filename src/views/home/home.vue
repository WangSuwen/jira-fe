<style lang="less">
    @import "./home.less";
    @import "../../styles/common.less";
</style>
<template>
    <div class="home-main">
        <Row :gutter="10">
            <Col :md="24">
                <Row :gutter="5">
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="user_created_count"
                            :end-val="count.toDeliverCount"
                            iconType="android-person-add"
                            color="#2d8cf0"
                            intro-text="待发货订单数"
                            hasDecimals="false"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="visit_count"
                            :end-val="count.recentWeeklyCount"
                            iconType="ios-eye"
                            color="#64d572"
                            :iconSize="50"
                            intro-text="近一周订单数"
                            hasDecimals="false"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="collection_count"
                            :end-val="count.totalIncome/100"
                            iconType="upload"
                            color="#ffd572"
                            intro-text="店铺总交易额(元)"
                            hasDecimals="true"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="transfer_count"
                            :end-val="count.recentWeeklyIncome/100"
                            iconType="shuffle"
                            color="#f25e43"
                            intro-text="近一周交易额(元)"
                            hasDecimals="true"
                        ></infor-card>
                    </Col>
                </Row>
            </Col>
        </Row>
    </div>
</template>

<script>
import countUp from './components/countUp.vue';
import inforCard from './components/inforCard.vue';
import api from '@/apis/home';


export default {
    name: 'home',
    components: {
        countUp,
        inforCard,
    },
    data () {
        return {
            count: {
                toDeliverCount: 0,
                recentWeeklyCount: 0,
                totalIncome: 0,
                recentWeeklyIncome: 0
            },
        };
    },
    computed: {
        avatorPath () {
            return localStorage.avatorImgPath;
        }
    },
    methods: {
        //初始化属性
        init()
        {
            var  self=this;
            api.toDeliverCount().then(function (data) {
                self.count.toDeliverCount=data.data;
            });
            api.recentWeeklyCount().then(function (data) {
                self.count.recentWeeklyCount=data.data;
            });
            api.totalIncome().then(function (data) {
                self.count.totalIncome=data.data;
            });
            api.recentWeeklyIncome().then(function (data) {
                self.count.recentWeeklyIncome=data.data;
            });
            setTimeout(() => {
                self.init();
            }, 600000);
        }
    },
    created() {
        this.init();
    }
};
</script>
