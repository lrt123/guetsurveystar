<template>
<div class="login-bg">

    <el-container direction="vertical">
        <el-main class="login-center">
            <el-link class="login-title" style="font-size: 24px; color: #409EFF" icon="el-icon-s-data" :underline="false" type="primary" @click="goToFace" >校园调研星</el-link>
            <el-tabs stretch>
                <el-tab-pane>
                    <span slot="label"><i class="el-icon-coordinate"></i> 登录账号</span>
                    <login-page></login-page>
                </el-tab-pane> 
                <el-tab-pane>
                    <span slot="label"><i class="el-icon-edit"></i> 校企注册</span>
                    <register-page></register-page>
                </el-tab-pane>
            </el-tabs>
        </el-main>
    </el-container>

</div>
</template>

<script>
import loginPage from '../components/login/LoginPage.vue'
import registerPage from '../components/login/RegisterPage.vue'

export default {
    components: {
        'login-page': loginPage,
        'register-page': registerPage
    },
    methods: {
        goToFace() {
            this.$router.push({path: '/'})
        }
    }
}
</script>

<style>

.login-bg {
    background: #FDFDFD;
    position: absolute;
    width: 100%;
    height: 100%;
}

.login-title {
    margin-bottom: 24px;
    text-align: center;
}

.login-center {
    width: 100%;
    max-width: 420px;
    flex-direction: column;
    margin:0px;
    position: absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    text-align: center;
}

.login-margin-top {
    margin-top: 24px;
}

.login-full-width {
    width: 100%;
}

.login-btn {
    width: 100%;
    margin-top: 24px;
    margin-bottom: 16px;
}

</style>
