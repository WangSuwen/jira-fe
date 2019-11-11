<style lang="less">
    @import './store.less';
</style>

<template>
    <div>
        <Card>
            <p slot="title">
                <Icon type="person"></Icon>
                店铺信息
            </p>
            <div>
                <Form 
                    ref="storeInfo"
                    :model="storeInfo"
                    :label-width="100" 
                    label-position="right"
                    :rules="infoValidate"
                >
                    <FormItem label="店铺名称" prop="name">
                        <div style="display:inline-block;width:300px;">
                            <Input v-model="storeInfo.name" maxlength="15"  placeholder="给店铺起个响亮的名称，15字以内" ></Input>
                        </div>
                    </FormItem>
                    <FormItem label="店铺logo" >
                        <fieldset class="upload-pic">
                            <div class="div_aremove" >
                                <img :src="storeInfo.logoUrl" width="100px">
                            </div>
                            <div class="upload-btn">
                                <a href="javascript:;"  title="上传轮播图片" class="" style="cursor: pointer;">
                                    <input type="file" id="logoUpload" @change="uploadFile('logoUpload',1)" multiple="multiple" accept=".jpg,.jpeg,.png,.gif" style="position:  absolute;width:  100%;height: 100%;opacity: 0;cursor:pointer;">
                                </a>
                            </div>
                        </fieldset>
                        <div >建议尺寸160*160px</div>
                    </FormItem>
                    <FormItem label="店招图片">

                        <fieldset class="upload-pic">
                            <div class="div_aremove" >
                                <img :src="storeInfo.pictureUrl" width="300px">
                            </div>
                            <div class="upload-btn">
                                <a href="javascript:;"  title="上传轮播图片" class="" style="cursor: pointer;">
                                    <input type="file" id="picUpload" @change="uploadFile('picUpload',2)" multiple="multiple" accept=".jpg,.jpeg,.png,.gif" style="position:  absolute;width:  100%;height: 100%;opacity: 0;cursor:pointer;">
                                </a>
                            </div>
                        </fieldset>
                        <div >建议尺寸750*320px</div>
                    </FormItem>
                    <div>
                        <Button type="primary" style="width: 100px;" :loading="save_loading" @click="save">保存</Button>
                    </div>
                </Form>
            </div>
        </Card>
        <Modal v-model="editPasswordModal" :closable='false' :mask-closable=false :width="500">
            <h3 slot="header" style="color:#2D8CF0">修改密码</h3>
            <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="100" label-position="right" :rules="passwordValidate">
                <FormItem label="原密码" prop="oldPass" :error="oldPassError">
                    <Input v-model="editPasswordForm.oldPass" placeholder="请输入现在使用的密码" ></Input>
                </FormItem>
                <FormItem label="新密码" prop="newPass">
                    <Input v-model="editPasswordForm.newPass" placeholder="请输入新密码，至少6位字符" ></Input>
                </FormItem>
                <FormItem label="确认新密码" prop="rePass">
                    <Input v-model="editPasswordForm.rePass" placeholder="请再次输入新密码" ></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text">取消</Button>
                <Button type="primary"  @click="save">保存</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import api from '@/apis/common';
    import QXUpload from '../../libs/qiniuUpload';

export default {
    name: 'store_index',
    data () {
        const validePhone = (rule, value, callback) => {
            var re = /^1[0-9]{10}$/;
            if (!re.test(value)) {
                callback(new Error('请输入正确格式的手机号'));
            } else {
                callback();
            }
        };
        const valideRePassword = (rule, value, callback) => {
            if (value !== this.editPasswordForm.newPass) {
                callback(new Error('两次输入密码不一致'));
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
        return {
            storeInfo: {
                id:'',
                name: '',
                logoUrl: '',
                pictureUrl: '',
                pmsOwnerId: ''
            },
            uid: '', // 登录用户的userId
            securityCode: '', // 验证码
            phoneHasChanged: false, // 是否编辑了手机
            save_loading: false,
            identifyError: '', // 验证码错误
            editPasswordModal: false, // 修改密码模态框显示
            savePassLoading: false,
            oldPassError: '',
            identifyCodeRight: false, // 验证码是否正确
            hasGetIdentifyCode: false, // 是否点了获取验证码
            canGetIdentifyCode: false, // 是否可点获取验证码
            checkIdentifyCodeLoading: false,
            infoValidate: {
                name: [
                  /*  { required: true, message: '请输入店铺名称', trigger: 'blur' },*/
                    { validator: valideEmptyStr, trigger: 'blur' }
                ]
            },
            editPasswordForm: {
                oldPass: '',
                newPass: '',
                rePass: ''
            },
            passwordValidate: {
                oldPass: [
                    { required: true, message: '请输入原密码', trigger: 'blur' }
                ],
                newPass: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 6, message: '请至少输入6个字符', trigger: 'blur' },
                    { max: 32, message: '最多输入32个字符', trigger: 'blur' }
                ],
                rePass: [
                    { required: true, message: '请再次输入新密码', trigger: 'blur' },
                    { validator: valideRePassword, trigger: 'blur' }
                ]
            },
            inputCodeVisible: false, // 显示填写验证码box
            initPhone: '',
            gettingIdentifyCodeBtnContent: '获取验证码' // “获取验证码”按钮的文字
        };
    },
    methods: {
        getIdentifyCode () {
            this.hasGetIdentifyCode = true;
            this.$refs['storeInfo'].validate((valid) => {
                if (valid) {
                    this.canGetIdentifyCode = true;
                    let timeLast = 60;
                    let timer = setInterval(() => {
                        if (timeLast >= 0) {
                            this.gettingIdentifyCodeBtnContent = timeLast + '秒后重试';
                            timeLast -= 1;
                        } else {
                            clearInterval(timer);
                            this.gettingIdentifyCodeBtnContent = '获取验证码';
                            this.canGetIdentifyCode = false;
                        }
                    }, 1000);
                    this.inputCodeVisible = true;
                    // you can write ajax request here
                }
            });
        },
        showEditPassword () {
            this.editPasswordModal = true;
        },
        init () {
            var self = this;
            api.getStore().then(function (data) {
                self.storeInfo = data.data;
            });
        },
        submitCode () {
            let vm = this;
            vm.checkIdentifyCodeLoading = true;
            if (this.securityCode.length === 0) {
                this.$Message.error('请填写短信验证码');
            } else {
                setTimeout(() => {
                    this.$Message.success('验证码正确');
                    this.inputCodeVisible = false;
                    this.checkIdentifyCodeLoading = false;
                }, 1000);
            }
        },
        save()
        {
            this.$refs['storeInfo'].validate((valid) => {
                debugger
                if (valid) {

                    var self = this;
                    api.updateStore(this.storeInfo).then(function (data) {
                        if (data.status==0)
                        {
                            self.$Message.info('操作成功!');
                        }
                        else
                        {
                            self.$Message.info('操作失败!');
                        }
                    });

                }
            });
        },
        uploadFile(uploadId,type)
        {
            let self = this;
            //回调函数
            var observer = {
                next(res){
                    // ...
                },
                error(err){
                    // ...
                },
                complete(res){
                    var url=QXUpload.getBaseUrl()+fileName;
                    type==1?self.storeInfo.logoUrl=QXUpload.getBaseUrl()+fileName:self.storeInfo.pictureUrl=QXUpload.getBaseUrl()+fileName;

                }
            };
           var fileName=  QXUpload.upload(document.getElementById(uploadId).files[0],observer);

        }
    },
    mounted () {
        this.init();
    }
};
</script>
