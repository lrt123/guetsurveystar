<template>
    <div>
        <el-row :span="24" class="grid-row">
            <el-timeline>


                <el-timeline-item v-for="(item, index) in questionnarieData" :key="item.id" :timestamp="item.time" placement="top">
                    <div>
                        <el-card shadow="hover">
                            <div>{{ index + 1 }}. [ID]：{{ item.id }} - [状态]：{{ item.status }}</div>
                            <h3 style="clear:both; margin-top: 32px; margin-left: 20px"> 标题：{{ item.title }} </h3>
                            <el-table :data="item.ex" :show-header="false">
                                <el-table-column prop="key" align="center" label="key" width="100"></el-table-column>
                                <el-table-column prop="value" label="value"></el-table-column>
                            </el-table>
                            <el-button class="st-btn" @click="go_analyze(item.id,item.type)" type="primary" round>查看统计结果</el-button>
                        </el-card>
                    </div>
                </el-timeline-item>

            </el-timeline>
        </el-row>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                questionnarieData: [],
            }
        },
        mounted() {
            this.$emit('setActiveMenuItem', '/manage/statistics');
            this.getQuestionnaireData();
        },
        methods: {
            //请求问卷信息
            getQuestionnaireData() {
                this.$http.get('/user/myquestionnaire')
                    .then(response =>{
                        let data = response.data;
                        let questionList = []
                        if (data.code === 0) {
                            data.data.my_questionnaire.forEach((item,index) => {
                                if (item.status === 2){
                                    item.checked = false;
                                    item.status = '已截止'
                                    item.ex = [
                                        {key: '[作者]：', value: item.founder},
                                        {key: '[课号]：', value: item.lesson_code},
                                        {key: '[专业]：', value: item.major},
                                        {key: '[时间]：', value: item.create_time + '-' + item.end_time}
                                    ];
                                    questionList.push(item)
                                }
                            });
                            console.log(questionList)
                            this.questionnarieData = questionList;
                        } else if (data.code == 2) {
                            this.$logout();
                        }
                    })
                    .catch(error => {
                        console.log('getQuestionnaireDataError', error);
                    });
            },
            //跳转问卷分析页面
            go_analyze(id,type){
                this.$router.push({name: 'analyze_page', params: {qid: id,type: type}})
            }
        }
    }
</script>

<style scoped>

.st-btn {
    margin-top: 25px;
    margin-bottom: 25px;
    float: right;
}

</style>
