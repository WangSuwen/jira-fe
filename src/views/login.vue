<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                            <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                            <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">输入任意用户名和密码即可</p>
                </div>
            </Card>
        </div>
    </div>

</template>

<script>
    import Cookies from 'js-cookie';
    import api from '@/apis/common';

    export default {
        data() {
            return {
                form: {
                    userName: '',
                    password: ''
                },
                rules: {
                    userName: [
                        {required: true, message: '账号不能为空', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'}
                    ]
                },
                resp: {
                    cause: '',
                    code: '',
                    localizedMessage: '',
                    message: ''
                }
            };
        },
        methods: {
            handleSubmit() {

                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        var self = this;
                        api.login(this.form.userName, this.form.password).then(function (data) {
                            if (data.status != 0) {
                                self.showMessage(data.message);
                                return;
                            }
                            Cookies.set('token', data.data.token, {expires: 7});
                            Cookies.set('user', self.form.userName, {expires: 7});
                            Cookies.set('password', self.form.password, {expires: 7});
                            self.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');
                            if (self.form.userName === 'iview_admin') {
                                Cookies.set('access', 0);
                            } else {
                                Cookies.set('access', 1);
                            }
                            self.$router.push({
                                name: 'home_index'
                            });
                        });

                    }
                });
            },
            showMessage (message) {
                const title = '登陆失败';
                const content = '<p>'+message+'</p>';
                this.$Modal.error({
                    title: title,
                    content: content
                });
            }
        }
    };
</script>

<style>

</style>
