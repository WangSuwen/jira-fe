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
                </div>
            </Card>
        </div>
    </div>

</template>

<script>
    import Cookies from 'js-cookie';
    import api from '@/apis/user.js';

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
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        api.login({
                            account: this.form.account,
                            password: this.form.password
                        }).then(data => {
                            if (data) {
                                this.$store.commit('setAvator', data.avatar);
                                this.$root.go('home_index');
                            }
                        });

                    }
                });
            }
        }
    };
</script>

<style>

</style>
