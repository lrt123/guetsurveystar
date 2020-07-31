<template>
<div class="container-style">
    <el-container>
        <el-header class="header-style" :style="paddingStyle">
            <div class="icon-title" v-show="isShow">
                <el-link style="font-size: 20px; color: #409EFF" icon="el-icon-s-data" :underline="false" type="primary">校园调研星</el-link>
            </div>
            <el-menu class="header-right-menu" mode="horizontal" router>

                <el-tooltip class="item" effect="dark" placement="bottom-start" v-for="item in headerMenu" :key="item.id" :content="item.value">
                    <el-menu-item :index="item.path" @click="onHeaderMenuItemClick(item.value)">
                        <i :class="item.icon"></i>
                    </el-menu-item>
                </el-tooltip>

                <el-submenu index="4" v-show="!isShow">
                    <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span slot="title">菜单</span>
                    </template>
                    <el-menu-item v-for="item in menu" :key="item.id" :index="item.path" >
                        <i :class="item.icon"></i>
                        <span slot="title"> {{ item.value }} </span>
                    </el-menu-item>
                </el-submenu>
            </el-menu>
            
        </el-header>

        <el-container :style="marginStyle">
            <el-aside class="aside-style" v-show="isShow">
                <el-menu :default-active="defaultActiveItemName" router>
                    <el-menu-item :index="item.path" v-for="item in menu" :key="item.id">
                        <i :class="item.icon"></i>
                        <span slot="title"> {{ item.value }} </span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main style="margin-top: 1%">
                <router-view v-on:setActiveMenuItem="setMenuDefaultActive($event)"></router-view>
            </el-main>
        </el-container>

    </el-container>
</div>
</template>

<script>

export default {
    data() {
        return {
            paddingStyle: {
                'padding-left': '12%',
                'padding-right': '12%'
            },
            marginStyle: {
                'margin-left': '12%',
                'margin-right': '12%',
            },
            isShow: true,
            defaultActiveItemName: '/manage/user',
            headerMenu: [
                {id: 'header-menu-feedback', value: '反馈', icon: 'el-icon-s-comment', path: '/manage/feedback'},
                {id: 'header-menu-help', value: '帮助', icon: 'el-icon-question', path: '/manage/help'},
                {id: 'header-menu-logout', value: '退出登录', icon: 'el-icon-s-promotion', path: '/logout'}
            ],
            smenu: [
                {id: 'aside-menu-person', value: '个人中心', icon: 'el-icon-user', path: '/manage/user'},
                {id: 'aside-menu-questionnaire', value: '我的问卷', icon: 'el-icon-tickets', path: '/manage/questionnaire'},
                {id: 'aside-menu-course', value: '我的课程', icon: 'el-icon-reading', path: '/manage/course'},
                {id: 'aside-menu-setting', value: '设置中心', icon: 'el-icon-setting', path: '/manage/setting'},
            ],
            tmenu: [
                {id: 'aside-menu-person', value: '个人中心', icon: 'el-icon-user', path: '/manage/user'},
                {id: 'aside-menu-questionnaire', value: '我的问卷', icon: 'el-icon-tickets', path: '/manage/questionnaire'},
                {id: 'aside-menu-statistics', value: '统计结果', icon: 'el-icon-pie-chart', path: '/manage/statistics'},
                {id: 'aside-menu-course', value: '我的课程', icon: 'el-icon-reading', path: '/manage/course'},
                {id: 'aside-menu-setting', value: '设置中心', icon: 'el-icon-setting', path: '/manage/setting'},
            ],
            omenu: [
                {id: 'aside-menu-person', value: '个人中心', icon: 'el-icon-user', path: '/manage/user'},
                {id: 'aside-menu-questionnaire', value: '我的问卷', icon: 'el-icon-tickets', path: '/manage/questionnaire'},
                {id: 'aside-menu-statistics', value: '统计结果', icon: 'el-icon-pie-chart', path: '/manage/statistics'},
                {id: 'aside-menu-setting', value: '设置中心', icon: 'el-icon-setting', path: '/manage/setting'},
            ],
            menu: [],
        }
    },
    mounted() {
        //挂载窗口宽度修改事件
        this.onClientWidthChanged(document.body.clientWidth);
        window.addEventListener('resize', () => {
            this.onClientWidthChanged(document.body.clientWidth);
        });

        //根据角色显示不同的菜单
        let mtype = window.localStorage.getItem('type');
        if (mtype == 1) {
            this.menu = this.tmenu;
        } else if (mtype == 2) {
            this.menu = this.smenu;
        } else if (mtype == 5) {
            this.menu = this.omenu;
        }
    },
    methods: {
        //宽度变化设置
        onClientWidthChanged(width) {
            if (width >= 992) {
                this.isShow = true;
                let distance = parseInt(12 * (width / 1920)) + '%';
                this.paddingStyle['padding-left'] = distance;
                this.paddingStyle['padding-right'] = distance;
                this.marginStyle['margin-left'] = distance;
                this.marginStyle['margin-right'] = distance;
            } else {
                this.isShow = false;
                this.paddingStyle['padding-left'] = 0;
                this.paddingStyle['padding-right'] = 0;
                this.marginStyle['margin-left'] = 0;
                this.marginStyle['margin-right'] = 0;
            }
        },
        
        setMenuDefaultActive(itemName) {
            this.defaultActiveItemName = itemName;
        },
        loginOut() {
            this.$msgbox.confirm('即将退出登录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    callback: (action,instance) => {
                        if (action == 'confirm') {
                            window.localStorage.clear();
                            this.$cookies.remove('token');
                            this.$http.get('/user/logout');
                            this.$router.push({path: '/login'});
                            this.$logout();
                        }
                    }});
        },
        onHeaderMenuItemClick(value) {
            if (value == '退出登录') {
                this.loginOut();
            }
        }
    }
}
</script>

<style scoped>

.el-menu {
    border-right: none;
}

.el-menu--horizontal > .el-menu-item {
    border-bottom: none;
}

.el-menu--horizontal > .el-menu-item.is-active {
    border-bottom: none;
    color: #909399;
}

.container-style {
    height: 100%;
}

.aside-style {
    width: 100%;
    max-width: 224px;
    min-height: 800px;
    padding-top: 1%;
    border-right: 1px solid #EBEBEB;
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

.icon-title {
    display: inline-block;
    margin-left: 16px;
    margin-top: 12px;
    text-align: center;
}

.header-right-menu {
    display: inline-block;
    float: right;
}

</style>
