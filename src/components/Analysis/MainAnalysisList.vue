<template>
    <div>
        <div class="main-analysis-list">
            <el-card>
                <h1>{{questionnaire.title}}</h1>
                <div class="description-box">
                    <div>
                        <b>问卷状态：</b>{{questionnaire.status}}
                    </div>
                    <div>
                        <b>填写人数：</b>{{questionnaire.fillCount}}
                    </div>
                    <div>
                        <b>发布时间：</b>{{questionnaire.startTime}}
                    </div>
                    <div>
                        <b>截止时间：</b>{{questionnaire.endTime}}
                    </div>
                    <el-tabs v-if="tabVisible" v-model="selectedTab" @tab-click="tabClick">
                        <el-tab-pane label="查看选项统计" name="option"></el-tab-pane>
                        <el-tab-pane label="课程目标达成情况" name="detail"></el-tab-pane>
                    </el-tabs>
                </div>
                <el-button v-if="detailVisible" type="primary" @click="exportToExcel" round id="export_btn">导出</el-button>
            </el-card>
            <AnalysisCard
                    v-if="detailVisible===false"
                    v-for="(item,index) in questionList"
                    :key="index"
                    :question-index="index+1"
                    :question-id="item.questionId"
                    :question-title="item.questionTitle"
                    :question-type="item.questionType"
                    :question-value-list="item.questionValueList"
            >
            </AnalysisCard>
            <div v-if="detailVisible">

                <el-table
                        :data="detailInfo"
                        :default-sort="{prop:'account',order:'ascending'}"
                >
                    <el-table-column
                            prop="account"
                            label="学号">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="姓名">
                    </el-table-column>
                    <el-table-column
                            prop="major"
                            label="专业">
                    </el-table-column>
                    <el-table-column
                            prop="score"
                            label="得分">
                    </el-table-column>
                </el-table>

            </div>

        </div>
    </div>

</template>

<script>
    import AnalysisCard from "./AnalysisCard";

    export default {
        name: "MainAnalysisList",
        components: {AnalysisCard},
        methods: {
            fetchData() {
              this.$http.get("/questionnaire/"+this.$route.params.qid+"/analyze", {
              }).then((res) => {
                const data = res.data.data;
                this.questionnaire.title = data.title
                  this.questionnaire.startTime = data.start_time
                  this.questionnaire.endTime = data.end_time
                const temp = data.questions;

                let dataList = [];
                for (const t of temp){
                  for (const i of t.items){
                    dataList.push({'name': i.myoption, 'value': i.count})
                  }
                  dataList.sort((a, b) => {
                    return a.value - b.value
                  });
                  dataList.push({'name':'','static': '总计', 'static_value': t.total})
                    this.questionnaire.fillCount = t.total
                    this.questionList.push(
                        {
                            questionId:t.index,
                            questionTitle:t.desc,
                            questionType:t.type,
                            questionValueList:dataList
                        }
                    )
                  dataList = []
                }
                console.log(this.questionList)

              }).catch(() => {
                this.$message({message: "error！无数据！", duration: 1000})
              })
            },
            detail(){
                    this.$http.get("/questionnaire/"+this.$route.params.qid+"/analyze/lesson",{
                    }).then((res) => {
                        if (res.data.code === 0){
                            let data = res.data.data
                            this.detailInfo = data.data
                            this.detailVisible = true
                        }else{
                            this.$message({message: "error! 读取失败！", duration: 1000})
                        }
                    }).catch(res => {
                        this.$message({message: "error! 服务端无响应！", duration: 1000})
                    });

            },
            tabClick(tab,event){
                if (tab.name === 'detail'){
                    this.detail()
                }else if (tab.name === 'option'){
                    this.detailVisible = false
                }
            },
             exportToExcel() {
              //excel数据导出
             require.ensure([], () => {
                   const {
                     export_json_to_excel
                       } = require('../../assets/js/Export2Excel');
                   const tHeader = ['学号','姓名', '专业', '得分'];
                   const filterVal = ['account','name', 'major', 'score'];
                   const list = this.detailInfo;
                   const data = this.formatJson(filterVal, list);
                   export_json_to_excel(tHeader, data, this.questionnaire.title+'-统计情况');
                 })
             },
             formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
                   }

    },
        mounted() {
            this.fetchData();
            console.log(123,this.$route.params)
                let type = this.$route.params.type
                if (type !== 1){
                    this.tabVisible = false
                }
                console.log(this.$route.params.type)
        },
        data: function () {
            return {
                questionnaire: {
                    title: '这是一个标题',
                    status: '已完成',
                    startTime: "2020-6-18 19:00:25",
                    endTime: "2020-7-1 20:00:00",
                    fillCount: 299,
                },
                questionList: [],
                showDetail: false,
                detailVisible: false,
                tabVisible: true,
                selectedTab:'option',
                detailInfo: []
            }
        }
    }
</script>

<style scoped>
    .main-analysis-list {
        width: 70%;
        margin: auto;
    }

    .description-box {
        text-align: left;
        padding-left: 10%;
        line-height: 30px;
        font-size: 14px;
    }
    #export_btn{
        margin-top: 10px;
        margin-bottom: 10px;
        float: right;
    }
</style>
