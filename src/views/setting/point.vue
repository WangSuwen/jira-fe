<style lang="less">
    @import './point.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                积分设置
            </p>
            <div>
                <Form 
                    ref="settings"
                    :model="settings"
                    :label-width="200" 
                    label-position="right"
                    :rules="infoValidate"
                >
                    <FormItem label="积分抵扣比例" prop="pointExchangeRate">
                        <div style="display:inline-block;width:300px;">
                            <Tooltip content="请输入100的倍数" placement="bottom">
                                <InputNumber v-model="settings.pointExchangeRate" placeholder="输入100的倍数"  step="100" min="100" max="100000" ></InputNumber> =1元
                            </Tooltip>
                        </div>
                    </FormItem>
                    <FormItem label="积分可抵每笔订单总额的" >
                        <div style="display:inline-block;width:300px;">
                            <InputNumber v-model="settings.cellingPointAccountOrder" placeholder="输入0-100间的整数"   min="1" max="100"></InputNumber>  %
                        </div>
                    </FormItem>
                    <div>
                        <Button type="primary" style="width: 100px;"  @click="save">保存</Button>
                    </div>
                </Form>
            </div>
        </Card>
    </div>
</template>

<script>
    import api from '@/apis/setting';
export default {
    name: 'store_index',
    data () {
        const valide = (rule, value, callback) => {
            if (value%100!=0) {
                callback(new Error('请输入100的倍数'));
            }else {
                callback();
            }
        };
        return {
            settings: {
                //积分抵扣比例
                pointExchangeRate: '',
                //积分可抵扣每笔订单总额百分比
                cellingPointAccountOrder: ''
            },
            infoValidate: {
                pointExchangeRate: [
                    {validator: valide}
                ]
            },
        };
    },
    methods: {
        init () {
            var self = this;
            api.get().then(function (data) {
                self.settings.pointExchangeRate = data.data.pointExchangeRate;
                self.settings.cellingPointAccountOrder = data.data.cellingPointAccountOrder;
            });
        },
        save()
        {
            this.$refs['settings'].validate((valid) => {
                if (valid) {
                    var self = this;
                    api.update(this.settings).then(function (data) {
                        if (data.status==0)
                        {
                            self.$Message.info('操作成功!');
                        }
                        else
                        {
                            self.$Message.info(data.message);
                        }
                    });
                }
            });
        }
    },
   /* watch:{
        'settings.pointExchangeRate':function (val) {
            if (val/100!=0)
            {
               alert("aaa")
            }
        }
    },*/
    mounted () {
        this.init();
    }
};
</script>
