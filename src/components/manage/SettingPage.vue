<template>
    <div>
        <div class="st-wrapper">
        <el-divider class="st-divider" content-position="center">密码修改</el-divider>
            <el-form ref="form" :model="form" :rules="rules">
                <el-form-item label="原密码：" prop="oldPasswd" label-width="100px">
                    <el-input v-model="form.oldPasswd" prefix-icon="el-icon-lock" placeholder="请输入原密码" clearable></el-input>
                </el-form-item>
                <el-form-item label="新密码：" prop="newPasswd" label-width="100px">
                    <el-input v-model="form.newPasswd" prefix-icon="el-icon-lock" placeholder="请输入新密码" show-password></el-input>
                </el-form-item>
                <el-form-item label="再输一遍：" prop="passwdAgain" label-width="100px">
                    <el-input v-model="form.passwdAgain" prefix-icon="el-icon-lock" placeholder="请输入新密码" show-password></el-input>
                </el-form-item>
                <el-form-item style="float: right">
                    <el-button @click="onClearPasswd" round>重置内容</el-button>
                    <el-button type="primary" @click="onSubmitNewPasswd" round>修改密码</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="st-wrapper">
            <el-divider class="st-divider" content-position="center">资料修改</el-divider>
            <el-table :data="tableData" :show-header="false">
                <el-table-column prop="key" align="center" label="key"></el-table-column>
                <el-table-column prop="value" align="center" label="value"></el-table-column>
            </el-table>
            <el-button class="st-ban-btn" :disabled="true" round>暂未开放修改，敬请期待！</el-button>
        </div>
    </div>

</template>

<script>
export default {
    data() {
        return {
            form: {
                oldPasswd: '',
                newPasswd: '',
                passwdAgain: '',
            },
            tableData: [],
            rules: {
                oldPasswd: [
                    { required: true, message: '原密码不能为空', trigger: 'blur' }
                ],
                newPasswd: [
                    { required: true, message: '新密码不能为空', trigger: 'blur' }
                ],
                passwdAgain: [
                    { required: true, message: '校验的新密码不能为空', trigger: 'blur' },
                    { validator: this.validatePasswdAgain, trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {
        this.$emit('setActiveMenuItem', '/manage/setting');
        this.getUserData();
    },
    methods: {
        //验证两次密码输入是否一致
        validatePasswdAgain(rule, value, callback) {
            if (this.form.newPasswd != this.form.passwdAgain ) {
                callback(new Error('两次输入密码不一致'));
            } else {
                //如果每个分支不返回callback就会导致无法进行this.$refs.mform.validate判断
                callback(); 
            }
        },
        //清空密码输入内容
        onClearPasswd() {
            this.$msgbox.confirm('是否清空密码内容?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning',
                                callback: (action,instance) => {
                                    if (action == 'confirm') {
                                        this.$refs.form.resetFields();
                                    }
                                }});
        },
        //提交新密码数据
        onSubmitNewPasswd() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$http.post('/user/password', {"old": this.form.oldPasswd, "new": this.form.newPasswd})
                        .then(response =>{
                            let data = response.data;
                            console.log(data);
                            if (data.code == 0) {
                                console.log(data.data.token);
                                this.$setAuth(data.data.token);
                                this.$cookies.set("token", data.data.token);
                                window.localStorage.setItem('token', data.data.token);
                                this.$message({
                                        message: data.msg,
                                        center: true,
                                        duration: 2500
                                    });
                            } else if (data.code == 2) {
                                this.$logout();
                            } else {
                                this.$message({
                                        type: 'success',
                                        message: data.msg,
                                        center: true,
                                        duration: 2500
                                    });
                            }
                        })
                        .catch(error => {
                            console.log('setNewPasswdError', error);
                        });
                }
            });
        },
        //获取用户信息
        getUserData() {
            this.$http.get('/user/info')
                .then(response =>{
                    let data = response.data;
                    console.log(data);
                    if (data.code == 0) {
                        this.tableData = data.data.info;
                    } else if (data.code == 2) {
                        this.$logout();
                    }
                })
                .catch(error => {
                    console.log('getUserDataError', error);
                });
        }
    }    
}
</script>

<style scoped>


.st-wrapper {
    display: block;
    clear:both;
}

.st-divider {
    margin-top: 32px;
    margin-bottom: 32px;
}

.st-ban-btn {
    margin-top: 32px;
    margin-bottom: 32px;
    float: right;
    clear: both;
}
</style>
