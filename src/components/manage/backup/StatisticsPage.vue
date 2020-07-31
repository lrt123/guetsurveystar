<template>
    <div>
        <el-row :span="24" class="grid-row">
            <el-timeline>


                <el-timeline-item v-for="(item, index) in questionnarieData" :key="item.id" :timestamp="item.time" placement="top">
                    <div @click="onClickQuestionnaireCard(item)">
                        <el-card shadow="hover">

                            [ID]：{{ item.id }} - [状态]：{{ item.status }}


                            <h3 style="clear:both; margin-top: 32px; margin-left: 20px"> 标题：{{ item.title }} </h3>

                            <el-table :data="item.ex" :show-header="false">
                                <el-table-column prop="key" align="center" label="key" width="100"></el-table-column>
                                <el-table-column prop="value" label="value"></el-table-column>
                            </el-table>
                            <el-button @click="go_analyze(item.id,item.type)" type="primary">查看统计结果</el-button>
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
                idType: null,
                funcBthShow: false,
                questionnarieData: [],
            }
        },
        mounted() {
            this.$emit('setActiveMenuItem', '/manage/statistics');
            this.onIdentityJudge();
            this.getQuestionnaireData();
        },
        methods: {
            //身份判断
            onIdentityJudge() {
                this.idType = window.localStorage.getItem('type');
                this.funcBthShow = (this.idType != 2);
            },
            //问卷被点击切换选中状态
            onClickQuestionnaireCard(item) {
                item.checked = !item.checked;
            },
            //点击FuncBtn
            onClickFuncBtn(value) {
                if (value === '创建') {
                    this.$router.push({path: '/questionnaire/create'});
                } else if (value === '发布' || value === '停止') {
                    let items = [];
                    this.questionnarieData.forEach(item => {
                        if (item.checked) {
                            items.push(item);
                        }
                    });
                    this.changeQuestionnaireStatus(items, value);
                } else if (value === '删除') {
                    this.$msgbox.confirm('是否要删除问卷?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error',
                        callback: (action,instance) => {
                            if (action === 'confirm') {
                                let ids = [];
                                let indexs = [];
                                let i = 0;
                                this.questionnarieData.forEach(item => {
                                    if (item.checked) {
                                        ids.push(item.id);
                                        indexs.push(i);
                                    }
                                    i++;
                                });
                                indexs.reverse();
                                this.deleteQuestionnaire(ids, indexs);
                            }
                        }});
                }
            },
            //点击FuncMenu选项
            onClickFuncMenu(args) {
                if (args.value == '编辑') {

                } else if (args.value == '发布' || args.value == '停止') {
                    this.changeQuestionnaireStatus([args.target], args.value);
                } else if (args.value == '删除') {
                    this.$msgbox.confirm('是否要删除问卷?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error',
                        callback: (action,instance) => {
                            if (action == 'confirm') {
                                this.deleteQuestionnaire([args.target.id], [args.index]);
                            }
                        }});
                }
            },
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
            go_analyze(id,type){
                this.$router.push({name: 'analyze_page', params: {qid: id,type: type}})
            }
        }
    }
</script>

<style scoped>

</style>
