<style lang="less">
    @import "detail.less";
</style>
<template>
    <Card>
        <Tabs value="name1">
            <TabPane label="商品信息" name="name1">
                <Row>
                    <Form :label-width="100" ref="product" :model="product" :rules="infoValidate">
                        <Col span="12">

                        <FormItem label="商品名称：" prop="name">
                            <Input v-model="product.name"></Input>
                        </FormItem>
                        <FormItem label="商品图片：">
                            <fieldset class="upload-pic">
                                <div class="div_aremove" v-for="(item,index) in product.pictures">
                                    <a href="javascript:;" title="删除" @click="removeFile(item.name)" class="a_remove">×</a>
                                    <img :src="item.url" width="100px">
                                </div>
                                <div class="upload-btn">
                                    <a href="javascript:;"  title="上传轮播图片" class="" style="cursor: pointer;">
                                        <input type="file" id="logoUpload" @change="uploadFile('logoUpload')" multiple="multiple" accept=".jpg,.jpeg,.png,.gif" style="position:  absolute;width:  100%;height: 100%;opacity: 0;cursor:pointer;">
                                        </a>
                                </div>
                            </fieldset>

                        </FormItem>
                        <FormItem label="商品编号：" prop="code">
                            <Input v-model="product.code"></Input>
                        </FormItem>
                        <FormItem label="商品库存：" prop="inventoryQty">
                            <Input v-model="product.inventoryQty"></Input>
                            <!-- <InputNumber style="width:350px" v-model="product.inventoryQty" :max="10000" :min="0" ></InputNumber>-->
                        </FormItem>
                        <FormItem label="商品价格：" prop="price">
                            <Input v-model="product.price"></Input>
                            <!--  <InputNumber style="width:350px" v-model="product.price" :max="100000" :min="0" ></InputNumber>-->
                        </FormItem>


                        </Col>
                        <Col span="12">

                        <FormItem label="商品分类：" prop="categoryIds">
                            <Select style="width:200px" v-model="product.categoryIds" multiple placeholder="根节点">
                                <Option v-for="item in categorys" :value="item.id">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="商品运费：">
                            <RadioGroup v-model="shippingFeeRD">
                                <Radio label="包邮"></Radio>
                                <Radio checked="checked" label="一口价"></Radio>
                            </RadioGroup>
                            <InputNumber style="width:80px" :max="100000" :min="0" placeholder="0.00"
                                         v-if="webItemDisplay.shippingFee"
                                         v-model="product.shippingFee"></InputNumber>
                        </FormItem>

                        <FormItem label="积分兑换方式：">
                            <RadioGroup v-model="exchangeModeRD">
                                <Radio label="不使用"></Radio>
                                <Radio label="使用"></Radio>
                                <div style="float:right" v-if="webItemDisplay.exchangeMode">
                                    <InputNumber :max="100000" :min="0" style="width:80px"
                                                 v-model="product.exchangePoint"></InputNumber>
                                    积分
                                    +
                                    <InputNumber :max="100000" :min="0" style="width:80px"
                                                 v-model="product.exchangeMoney"></InputNumber>
                                    元
                                </div>
                            </RadioGroup>

                        </FormItem>

                        </Col>
                    </Form>
                </Row>
                <label class="ivu-form-item-label" style="width: 100px;">商品详情：</label>
                <textarea id="articleEditor" v-model="product.fullDescription"></textarea>

                <div style="margin-top:10px">
                    <Button type="primary" v-bind:disabled="product.status==2"  @click="save">保存</Button>
                </div>
            </TabPane>
        </Tabs>
    </Card>
</template>
<script>
    import tinymce from "tinymce";
    import api from '@/apis/product';
    import categoryApi from '@/apis/category';
    import util from '../../libs/util';
    import QXUpload from '../../libs/qiniuUpload';

    export default {
        data() {
            const validePrice = (rule, value, callback) => {
                var re = /^[0-9]+(\.[0-9]{2})?$/;
                if (value==null ||value=='') {
                    callback(new Error('产品价格不能为空'));
                }
                if (value.length > 10) {
                    callback(new Error('长度超出'));
                }
                if (!re.test(value)) {
                    callback(new Error('请输入两位以内的数字'));
                } else {
                    callback();
                }
            };
            const valideQty = (rule, value, callback) => {
                var re = /^[0-9]*$/;
                if (value!=0&&(value==null ||value=='') ) {
                    callback(new Error('产品库存不能为空'));
                }
                if (value.length > 10) {
                    callback(new Error('长度超出'));
                }
                if (!re.test(value)) {
                    callback(new Error('请输入整数类型'));
                } else {
                    callback();
                }
            };
            const valideEmptyStr = (rule, value, callback) => {
                if (value==null|| value.replace(/^\s\s*/, '').replace(/\s\s*$/, '')=='') {
                    callback(new Error('请输入店铺名称'));
                } else {
                    callback();
                }
            };
            const valideCategory = (rule, value, callback) => {
                if (value==null|| value.length==0) {
                    callback(new Error('请选择商品分类'));
                } else {
                    callback();
                }
            };
            return {
                product: {
                    id: '',
                    name: '',
                    code: '',
                    categoryIds: [],
                    inventoryQty: null,
                    price: null,
                    pictures: [],
                    fullDescription: '',
                    shippingFee: 0,

                    exchangeMode: '1',
                    exchangeMoney: 0,
                    exchangePoint: 0,
                    status: ''
                },
                categorys: [],
                webItemDisplay: {
                    shippingFee: true,
                    exchangeMode: true
                },
                infoValidate: {
                    name: [
                        {validator: valideEmptyStr,message:'请输入商品名称'}
                    ],
                    code: [
                        {validator: valideEmptyStr,message:'请输入商品编号'}
                    ],
                    inventoryQty: [
                        {validator: valideQty}
                    ],
                    price: [
                        {validator: validePrice}
                    ],
                    categoryIds: [
                        {validator: valideCategory}

                    ]
                },
                shippingFeeRD: '一口价',
                exchangeModeRD: '使用',
                inventoryQty: 0,
                uploadvisibility:''
            };
        },
        methods: {
            save() {
                var self = this;
                var id = this.$route.query.id;


                this.$refs['product'].validate((valid) => {
                    if (valid) {

                        if (this.product.pictures.length == 0) {
                            this.$Message.info('请选择商品图片!');
                            return;
                        }
                        this.product.price = this.product.price * 100;
                        this.product.shippingFee = this.product.shippingFee * 100;
                        this.product.exchangeMoney = this.product.exchangeMoney * 100;
                        this.product.fullDescription = tinymce.get('articleEditor').getContent();
                        if (id != null && id != "undefined" && id > 0) {
                            api.edit(this.product).then(function (data) {
                                if (data.status != null && data.status == 0) {
                                    self.$Message.info('修改成功!');
                                    self.$router.push({path: '/product/list'})
                                }
                                else {
                                    self.$Message.info(data.message);
                                    self.product.price = self.product.price/ 100;
                                    self.product.shippingFee = self.product.shippingFee / 100;
                                    self.product.exchangeMoney = self.product.exchangeMoney / 100;
                                }
                            });
                        }
                        else {
                            api.add(this.product).then(function (data) {
                                debugger
                                if (data.status != null && data.status == 0) {
                                    self.$Message.info('添加成功!');
                                    self.$router.push({path: '/product/list'})
                                }
                                else {
                                    self.$Message.info(data.message);
                                    self.product.price = self.product.price / 100;
                                    self.product.shippingFee = self.product.shippingFee / 100;
                                    self.product.exchangeMoney = self.product.exchangeMoney / 100;
                                }

                            });
                        }
                    }
                });
            },
            getDetail(id) {
                var self = this;
                api.getDetail(id).then(function (data) {
                    self.product = data;
                    self.product.price = self.product.price / 100;
                    self.product.shippingFee = self.product.shippingFee / 100;
                    self.product.exchangeMoney = self.product.exchangeMoney / 100;
                    tinymce.get('articleEditor').setContent(self.product.fullDescription);

                    if (self.product.shippingFee == 0) {
                        self.shippingFeeRD = '包邮';
                    }
                    if (self.product.exchangeMode == 0) {
                        self.exchangeModeRD = '不使用';
                    }
                });
            },
            initCategory() {
                var self = this;
                categoryApi.getList().then(function (data) {
                    self.categorys = data.data;
                });
            },
            hideItem() {
                this.webItemDisplay.shippingFee = false;
            },
            uploadFile(uploadId) {
                let self = this;
                let pics = [];
                let flag = true;   //用来处理异步回调
                //回调函数
                var observer = {
                    next(res) {
                        // ...
                    },
                    error(err) {
                        // ...
                    },
                    complete(res) {
                        // var url = QXUpload.getBaseUrl() + fileName;
                        if (flag) {
                            self.product.pictures = self.product.pictures.concat(pics);
                            console.log(pics);
                            flag = false;
                        }
                        else {
                            self.product.pictures = self.product.pictures;
                        }
                    }
                };
                var fileName;
                var fileCount = document.getElementById(uploadId).files.length;
                if (fileCount > 5) {
                    self.$Message.info('请选择五张以内图片!');
                    return;
                }
                for (var i = 0; i < fileCount; i++) {
                    fileName = QXUpload.upload(document.getElementById(uploadId).files[i], observer);
                    var url = QXUpload.getBaseUrl() + fileName;
                    pics.push({url: url, name: fileName});
                }
            },
            removeFile(name) {
                var newPictures = [];
                for (var i = 0; i < this.product.pictures.length; i++) {
                    if (this.product.pictures[i].name != name) {
                        newPictures.push(this.product.pictures[i]);
                    }
                }
                this.product.pictures = newPictures;
            }
        },
        mounted() {
            tinymce.init({
                selector: "#articleEditor",
                branding: false,
                elementpath: false,
                height: 220,
                resize: "both",
                language: "zh_CN.GB2312",
                menubar: "edit insert view format table tools",
                theme: "modern",
                plugins: [
                    "advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools",
                    "searchreplace visualblocks visualchars code  fullpage",
                    "insertdatetime media nonbreaking save table contextmenu directionality",
                    "emoticons paste textcolor colorpicker textpattern imagetools codesample"
                ],
                toolbar1:
                    " newnote print fullscreen preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample",
                image_advtab: true,
            });
        },
        watch: {
            shippingFeeRD: function (val) {
                var isFree = val == '包邮' ? true : false;

                this.webItemDisplay.shippingFee = !isFree
                if (isFree) {
                    this.product.shippingFee = 0;
                }
            },
            exchangeModeRD: function (val) {
                var notUse = val == '不使用' ? true : false;
                this.webItemDisplay.exchangeMode = !notUse
                if (notUse) {
                    this.product.exchangeMode = 0;
                    this.product.exchangeMoney = 0;
                    this.product.exchangePoint = 0;
                }
                else {
                    this.product.exchangeMode = 1;
                }
            },
            inventoryQty: function (val) {
                this.inventoryQty.push(val.replace(/[^\d]/g, ''));
                console.log(this.inventoryQty);
            }

        },
        computed: {
            uploadList() {
                return this.$refs.upload ? this.$refs.upload.fileList : [];
            }
        },
        created() {
            var id = this.$route.query.id;
            this.initCategory();
            if (id != null && id != "undefined") {
                this.getDetail(id);
            }
        },
        destroyed() {
            tinymce.get("articleEditor").destroy();
        }
    };
</script>
