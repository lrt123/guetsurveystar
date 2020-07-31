<template>
    <el-form ref="mform" :model="mform" :rules="rules">
        <el-form-item class="login-margin-top" prop="username">
            <el-input v-model="mform.username" prefix-icon="el-icon-user" placeholder="请输入账号" clearable></el-input>
        </el-form-item>
        <el-form-item prop="passwd">
            <el-input v-model="mform.passwd" prefix-icon="el-icon-lock" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
        <el-form-item class="login-full-width">
            <el-select v-model="mform.type" placeholder="请选择" style="width:100%">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button class="login-btn" :disabled="btn.status" :icon="btn.icon" type="primary" @click="login" round> {{ btn.text }} </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    data() {
        return {
            btn: {
                icon: '',
                status: false,
                text: '登 录'
            },
            mform: {
                username: '',
                passwd: '',
                type: 2
            },
            rules: {
                username: [{ required: true, message: '请输入登录账号', trigger: 'blur' }],
                passwd: [{ required: true, message: '请输入登录密码', trigger: 'blur' }]
            },
            options: [
                {
                    value: 2,
                    label: '类型: 学生登录'
                },
                {
                    value: 1,
                    label: '类型: 教师登录'
                },
                {
                    value: 5,
                    label: '类型: 校企人员登录'
                }
            ]
        }
    },
    methods: {
        //改变登录按钮状态
        setLoadinBtnStatus(status) {
            this.btn.status = status;
            this.btn.icon = (status) ? 'el-icon-loading': '';
            this.btn.text = (status) ? '登录中...': '登 录';
        },
        //登录账号
        login() {
            this.setLoadinBtnStatus(false);


            this.$refs.mform.validate(valid => {
                if (valid) {
                    this.setLoadinBtnStatus(true);
                    let msg, mtype;
                    let mdata = {
                        'account': this.mform.username,
                        'password': this.mform.passwd,
                        'role': this.mform.type
                    };
                    
                    this.$http.post('/user/login',mdata)
                        .then(response =>{
                            let data = response.data;
                            console.log(data);
                            if (data.code == 0){
                                msg = '登录成功！';
                                mtype = 'success';
                                this.$cookies.set("token", data.data.token);
                                window.localStorage.setItem('token', data.data.token);
                                window.localStorage.setItem('type', this.mform.type);
                                this.$setAuth(data.data.token);
                                this.$router.push({path: '/manage'});
                            } else {
                                msg = '登录失败！账号或密码错误';
                                mtype = 'warning';
                            }
                        })
                        .catch(error => {
                            console.log(error);
                            msg = '请求错误！';
                            mtype = 'error'
                            
                        })
                        .finally(() => {
                            this.setLoadinBtnStatus(false);
                            this.$message({
                                type: mtype,
                                message: msg,
                                center: true,
                                duration: 2500
                                });
                        });
                }
            });
        }
    }
}
</script>

<style>

</style>