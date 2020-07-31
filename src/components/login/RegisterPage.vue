<template>
    <el-form ref="mform" :model="mform" :rules="rules" >
        <el-form-item class="login-margin-top" prop="username">
            <el-input v-model.trim="mform.username" prefix-icon="el-icon-user" placeholder="* 请输入注册账号(长度为6到16个字符)" minlength="8" maxlength="16" clearable></el-input>
        </el-form-item>
        <el-form-item  prop="passwd">
            <el-input v-model.trim="mform.passwd" prefix-icon="el-icon-lock" placeholder="* 请输入密码(长度为8到16个字符)" minlength="8" maxlength="16" show-password></el-input>
        </el-form-item>
        <el-form-item prop="passwd2">
            <el-input v-model.trim="mform.passwd2" prefix-icon="el-icon-lock" placeholder="* 请再输一遍密码" minlength="8" maxlength="16" show-password></el-input>
        </el-form-item>
        <el-form-item prop="name">
            <el-input v-model.trim="mform.name" prefix-icon="el-icon-document" placeholder="* 请输入名字" clearable></el-input>
        </el-form-item>
        <el-form-item prop="phoneNumber">
            <el-input v-model.trim="mform.phoneNumber" prefix-icon="el-icon-phone-outline" placeholder="* 请输入手机号" minlength="11" maxlength="11" clearable></el-input>
        </el-form-item>
        <el-form-item prop="company">
            <el-input v-model.trim="mform.company" prefix-icon="el-icon-office-building" placeholder="* 请输入公司名字" clearable></el-input>
        </el-form-item>
        <el-form-item>
            <el-button class="login-btn" :disabled="btn.status" :icon="btn.icon" type="primary" @click="register" round> {{ btn.text }} </el-button>
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
                text: '注 册'
            },
            mform : {
                username: '',
                passwd: '',
                passwd2: '',
                name: '',
                phoneNumber: '',
                company: ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入注册账号', trigger: 'blur' },
                    { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
                ],
                passwd: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur' }
                ],
                passwd2: [
                    { required: true, message: '请再输一遍密码', trigger: 'blur' },
                    { min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur' },
                    { validator: this.validatePasswdAgain, trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入名字', trigger: 'blur' },
                ],
                phoneNumber: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: this.validatePhoneNumber, trigger: 'blur' }
                ],
                company: [
                    { required: true, message: '请输入公司名称', trigger: 'blur' }
                ],
            }
        }
    },
    methods: {
        //验证两次密码输入是否一致
        validatePasswdAgain(rule, value, callback) {
            if (this.mform.passwd != "" && this.mform.passwd2 != "" && this.mform.passwd != this.mform.passwd2 ) {
                callback(new Error('两次输入密码不一致'));
            } else {
                //如果每个分支不返回callback就会导致无法进行this.$refs.mform.validate判断
                callback(); 
            }
        },
        //验证邮箱格式
        validateEmailFormat(rule, value, callback) {
            let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if (!reg.test(value)) {
                callback(new Error('邮箱格式错误'));
            } else {
                callback();
            }
        },
        //验证手机号格式
        validatePhoneNumber(rule, value, callback) {
            let reg = /^1[356789]\d{9}/
            if (!reg.test(value)) {
                callback(new Error('手机号格式错误'));
            } else {
                callback();
            } 
        },
        //改变注册按钮状态
        setLoadinBtnStatus(status) {
            this.btn.status = status;
            this.btn.icon = (status) ? 'el-icon-loading': '';
            this.btn.text = (status) ? '注册中...': '注 册';
        },
        //提交表单
        register() {
            this.$refs.mform.validate((valid) => {
                if (valid) {
                    this.setLoadinBtnStatus(true);
                    let msg, mtype;
                    let mdata = {
                        'account': this.mform.username,
                        'name': this.mform.name,
                        'password': this.mform.passwd,
                        'phone': this.mform.phoneNumber,
                        'cn': this.mform.company
                    };
                    
                    this.$http.post('/user/register',mdata)
                        .then(response =>{
                            let data = response.data;
                            msg = data.msg;
                            if (data.code == 0){
                                mtype = 'success';
                                setTimeout(() => { location.reload() }, 500);
                            } else {
                                mtype = 'warning';
                            }
                        })
                        .catch(error => {
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