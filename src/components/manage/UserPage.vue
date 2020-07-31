<template>
    <div>
        <el-row class="grid-row">
            <el-col :span="24" class="grid-col" v-show="tipVisiabled">
                <el-tag size="medium" type="success" @close="closeTip" closable> {{ tip }} </el-tag>
            </el-col>
            <el-col :span="24">
                <el-table :data="tableData" :header-cell-style="{background:'#eef1f6',color:'#606266'}">
                    <el-table-column type="index" align="center" label="#"></el-table-column>
                    <el-table-column prop="key" align="center" label="资料名" >
                        <template slot-scope="scope">
                            <el-tag size="medium" type="primary">{{ scope.row.key }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="value" align="center" label="资料内容"></el-table-column>
                    <el-table-column align="center" label="操作">
                        <template>
                            <el-button size="mini" round>编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row class="grid-row">
            <el-col :span="8" class="grid-col-card" v-for="item in cardData" :key="item.id">
                <el-card shadow="hover">
                    <el-button :icon="item.icon" :type="item.type" style="font-size: 32px;" circle></el-button>
                    <p> {{ item.value }} </p>
                    <p>数量：{{ item.number }}</p>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tip: '欢迎回来！',
            tipVisiabled: true,
            timer: null,
            cardData: [
                {id: 'user-prepare', value: '待发布', type: 'warning', icon: 'el-icon-s-opportunity', number: 0},
                {id: 'user-doing', value: '未完成', type: 'danger', icon: 'el-icon-s-release', number: 0},
                {id: 'user-done', value: '已完成', type: 'success', icon: 'el-icon-s-claim', number: 0}
            ],

            tableData: [
                {key: '名字', value: '未命名'},
                {key: '账号', value: 'NULL'},
                {key: '密码', value: '********'},
                {key: '用户类型', value: 'NULL'},
                {key: '手机号', value: 'NULL'},
                {key: '所属单位', value: 'NULL'},
                {key: '地址', value: 'NULL'},
            ]
        }
    },
    mounted() {
        this.$emit('setActiveMenuItem', '/manage/user');
        this.timer = self.setInterval(this.setTime, 1000);
        this.getUserData();
    },
    methods: {
        //计时器
        setTime() {
            let msg = '';
            let date=new Date();
            let hour = date.getHours();
            let min = date.getMinutes();
            let sec = date.getSeconds();
            if (hour >= 0 && hour <6) {
                msg = '欢迎回来！现在是凌晨，再休息会儿吧！';
            } else if (hour >=6 && hour < 11) {
                msg = '早上好！欢迎回来！';
            } else if (hour >=11 && hour < 13) {
                msg = '中午时间，欢迎回来！';
            } else if (hour >=13 && hour < 18) {
                msg = '下午好！欢迎回来！';
            } else if (hour >=18 && hour < 24) {
                msg = '欢迎回来！入夜了，早点休息吧';
            }
            this.tip = '时间：' + (hour < 10 ? '0'+hour : hour) + ':' + (min < 10 ? '0'+min : min) + ':' + (sec < 10 ? '0'+sec : sec) + '，' + msg;
        },
        //关闭提示
        closeTip() {
            this.tipVisiabled = false;
            clearInterval(this.timer);
        },
        //获取用户信息
        getUserData() {
            this.$http.get('/user/info')
                .then(response =>{
                    let data = response.data;
                    if (data.code == 0) {
                        this.tableData = data.data.info;
                        let status = data.data.questionnaire_status
                        for (const t of this.cardData){
                            if (t.id === 'user-prepare'){
                                t.number = status.wait
                            }
                            else if (t.id === 'user-doing'){
                                t.number = status.unfinished
                            }
                            else if (t.id === 'user-done'){
                                t.number = status.finished
                            }
                        }
                    } else if (data.code == 2) {
                        this.$logout();
                    }
                })
                .catch(error => {
                    console.log('getUserDataError', error);
                });
        },
    }
}
</script>

<style scoped>

.grid-row {
    margin-top: 10px;
    text-align: center;
}

.grid-col {
    text-align: center;
    margin-bottom: 10px;
}

.grid-col-card {
    padding: 2px;
}

</style>
