<style lang="less">
    @import './list.less';
</style>

<template>

    <div>
        <div class="search-box">
            <Button size="middle" @click="showCagegory(0,0,0,true)" style="width:100px;" type="primary">添加分类</Button>

        </div>
        <Row>
            <Card>
                <p slot="title">
                    <Icon type="ios-list"></Icon>
                    商品分类
                </p>
                <Row type="flex" justify="center" align="middle" class="advanced-router">
                    <Table :columns="categoryColumns" :data="categorieData" style="width: 100%;"></Table>
                </Row>
            </Card>
        </Row>
        <Modal :width="900" :loading="loading" v-model="editCategory" v-bind:title="editCategoryTitle" width="500"
               @on-ok="ok" okText="保存">
            <Form ref="categoryModel" :model="categoryModel" :label-width="80" :rules="validate">
                <FormItem label="上级分类：" style="width: 300px">
                    <Select style="width:200px" v-model="categoryModel.parentId" placeholder="根节点">
                        <Option v-for="item in categorieData" :value="item.id" :key="item.id">{{item.breadName}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="分类名称：" style="width: 300px" prop="name">
                    <Input v-model="categoryModel.name" maxlength="20"></Input>
                </FormItem>
            </Form>
        </Modal>

        <Modal :width="900" v-model="delCategory" title="删除分类" width="500" @on-ok="del" okText="确认">
            确定删除当前分类？
        </Modal>
    </div>

</template>

<script>

    import api from '@/apis/category';

    export default {
        name: 'order_list',
        data() {
            var self = this;
            const valideEmptyStr = (rule, value, callback) => {
                if (value==null|| value.replace(/^\s\s*/, '').replace(/\s\s*$/, '')=='') {
                    callback(new Error('请输入分类名称'));
                } else {
                    callback();
                }
            };
            return {
                editCategory: false,
                delCategory: false,
                editCategoryTitle: '修改分类',
                categoryColumns: [
                    {
                        key: 'breadName',
                        title: '分类名称',
                        width: 1000
                    },
                    {
                        title: '操作',
                        key: 'show_more',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'text'
                                    },
                                    style:
                                        {
                                            color:'#5493c5'
                                        },
                                    on: {
                                        click: () => {
                                            this.showCagegory(params.row.id, params.row.name, params.row.parentId, false)
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'text'
                                    },
                                    style:
                                        {
                                            color:'#5493c5'
                                        },
                                    on: {
                                        click: () => {
                                            this.categoryModel.id = params.row.id;
                                            this.delCategory = true;
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                categorieData: [],
                categoryModel: {
                    id: '',
                    parentId: '',
                    name: ''

                },
                validate: {
                    name: [
                        {validator: valideEmptyStr}
                    ]
                },
                loading: true
            };
        },
        methods: {
            ok() {
                this.$refs['categoryModel'].validate((valid) => {
                    if (valid) {
                        var self = this;
                        self.changeLoading();
                        self.editCategory = false;
                        if (this.categoryModel.id == true || this.categoryModel.id < 1) {
                            this.categoryModel.id = null;
                            api.add(this.categoryModel).then(function (data) {
                                if (data.status != 0 && data.status == 0) {
                                    self.$Message.info('添加成功!');
                                }
                                else {
                                    self.$Message.info(data.message);
                                }
                                self.search();
                            });
                        }
                        else {
                            api.edit(this.categoryModel).then(function (data) {
                                if (data.status != 0 && data.status == 0) {
                                    self.$Message.info('修改成功!');
                                }
                                else {
                                    self.$Message.info(data.message);
                                }
                                self.search();
                            });
                        }
                    }
                    else {
                        return this.changeLoading();
                    }
                });
            },
            changeLoading() {
                this.loading = false;
                this.$nextTick(() => {
                    this.loading = true;
                });
            },
            cancel() {
                this.$Message.info('点击了取消');
            },
            showCagegory(id, name, parentId, isAdd) {

                    if (isAdd) {
                        this.editCategoryTitle = '添加分类';
                        this.categoryModel.id = null;
                    }
                    else {
                        this.categoryModel.name = name;
                        this.categoryModel.id = id;
                        this.categoryModel.parentId = parentId;
                        this.editCategoryTitle = '修改分类';
                    }
                    this.editCategory = true;
            },
            search() {
                var self = this;
                api.getList().then(function (data) {
                    self.categorieData = data.data;
                });


            },
            del() {
                var self = this;
                api.del(this.categoryModel.id).then(function (data) {
                    if (data.status == 0) {
                        self.$Message.info('删除成功!');
                    }
                    else {
                        self.$Message.info('删除失败!');
                    }
                    self.search();
                });
            },
        },
        created() {
            this.search();
        }
    };
</script>
