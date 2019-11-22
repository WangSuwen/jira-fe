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
                        <FormItem prop="account">
                            <Input v-model="form.account" placeholder="请输入用户名" prefix="ios-contact"/>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" password v-model="form.password" placeholder="请输入密码" prefix="ios-lock"/>
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
                    account: '',
                    password: ''
                },
                rules: {
                    account: [
                        {required: true, message: '账号不能为空', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'}
                    ]
                }/* ,
                resp: {
                    cause: '',
                    code: '',
                    localizedMessage: '',
                    message: ''
                } */
            };
        },
        methods: {
            handleSubmit() {
                debugger;
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        api.login(this.form.account, this.form.password).then(data => {
                            debugger;
                            if (data.code !== 200) {
                                this.showMessage(data.msg);
                                return;
                            }
                            // Cookies.set('token', data.data.token, {expires: 7});
                            // Cookies.set('user', this.form.account, {expires: 7});
                            // Cookies.set('password', this.form.password, {expires: 7});
                            this.$store.commit('setAvator', data.avatar);
                            // if (this.form.account === 'iview_admin') {
                            //     Cookies.set('access', 0);
                            // } else {
                            //     Cookies.set('access', 1);
                            // }
                            this.$router.push({
                                name: 'home_index'
                            });
                        });

                    }
                });
            },
            showMessage (message) {
                this.$Message.error({
                    background: true,
                    content: '登录失败'
                });
            }
        }
    };
</script>

<style>

</style>
