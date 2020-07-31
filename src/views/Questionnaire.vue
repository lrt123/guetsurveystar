<template>
<div class="container-style">
    <el-container>
        <el-header class="header-style">
            <div class="header-left" v-show="isShow">
                <el-link class="login-title" :underline="false" style="font-size: 22px; color: #409EFF;margin-right: 8px" icon="el-icon-back" @click="back"></el-link>
                <el-link class="login-title" @click="homepage" style="font-size: 22px; color: #409EFF" icon="el-icon-s-home" type="primary" :underline="false"></el-link>
            </div>
            <div class="header-center">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item v-for="item in breadData" :key="item.id">
                        <span :class="(item.id === activeBreadItemId) ? 'bread-title-bold' : ''"> {{ item.value }} </span>
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </el-header>

        <el-container>
            <el-main style="margin-top: 1%">
                <router-view v-on:setActiveBreadItem="setActiveBreadItem($event)"> </router-view>
            </el-main>
        </el-container>

    </el-container>
</div>
</template>

<script>

export default {
    data() {
        return {
            isShow: true,
            activeBreadItemId: '',
            breadData: [
                {id:'bread_create_page', value: '创建', cls: ''},
                {id:'bread_edit_page', value: '编辑', cls: ''},
                {id:'bread_post_page', value: '发布', cls: ''},
                {id:'bread_fillin_page', value: '填写', cls: ''}
            ]
        }
    },
    mounted() {

    },
    methods: {
        setActiveBreadItem(id) {
            this.activeBreadItemId = id;
        },
        back(){
            this.$router.back()
        },
        homepage(){
            this.$router.push("/manage")
        }

    }
}
</script>

<style scoped>

.container-style {
    margin: 0;
    width: 100%;
    height: 100%;
}

.header-style {
    width: 100%;
    height: 100%;
    max-height: 100px;
    -webkit-box-shadow: 0px 2px 3px rgba(51, 51, 51, 0.35);
    -moz-box-shadow: 0px 2px 3px rgba(51, 51, 51, 0.35);
    box-shadow: 0px 2px 3px #E6E6E6;
    overflow:hidden;

}

.header-left {
    margin-left: 5px;
    margin-top: 20px;
    float: left;
}

.header-center {
    text-align: center;

}

.el-breadcrumb {
    margin-top: 22px;
    font-size: 16px;
    display: inline-block;
}

.bread-title-bold {
    font-weight: bold;
}

</style>
