<template>
    <div>
        <el-card class="box-card" shadow="hover">
            <div class="analysis-title">{{questionIndex}}. {{questionTitle}}</div>

            <el-divider></el-divider>


            <div v-if="questionType===0">

                <el-radio-group v-model="showBar" class="choose-show">
                    <el-radio :label="true">数量</el-radio>
                    <el-radio :label="false">占比</el-radio>
                </el-radio-group>

                <el-row>
                    <el-col :xs="24" :sm="18" :md="18" :lg="18" :xl="18">
                        <div v-show="showBar===true" :id="'barChart'+questionIndex" class="bar-chart"
                             :style="{height:barHeight}"></div>

                        <div v-show="showBar===false" :id="'pieChart'+questionIndex" class="pie-chart"></div>
                    </el-col>

                    <el-col :xs="24" :sm="6" :md="6" :lg="6" :xl="6">
                        <el-table
                                :data="questionValueList"
                                :default-sort="{prop:'name',order:'ascending'}"
                                class="analysis-table">
                            <el-table-column
                                    prop="name"
                                    label="选项">
                            </el-table-column>
                            <el-table-column
                                    prop="value"
                                    label="人数">
                            </el-table-column>
                            <el-table-column
                                    prop="static_value"
                                    label="总计">
                            </el-table-column>
                        </el-table>
                    </el-col>

                </el-row>

            </div>


        </el-card>
    </div>
</template>

<script>
    import echarts from "echarts/lib/echarts"
    import "echarts/lib/chart/bar"
    import "echarts/lib/chart/pie"
    import "echarts/lib/component/tooltip"

    export default {
        name: "AnalysisCard",
        props: {
            questionIndex: Number,
            questionId: Number,
            questionTitle: String,
            questionType: Number,
            questionValueList: Array
        },
        mounted() {
            this.fetchData();
        },
        methods: {
            fetchData() {
                console.log(12345,this.questionValueList)
                this.barHeight = this.questionValueList.length*33+150+'px'
                this.drawBar();
                this.drawPie();
                // if (this.questionType === 0 ) {
                //     this.$http.get("/questionnaire/"+this.route.params.qid+"/analyze", {
                //     }).then((res) => {
                //         const data = res.data.data;
                //         const temp = data.items;
                //         const dataList = [];
                //         for (const t in temp) {
                //             dataList.push({'name': t.myoption, 'value': t.count})
                //         }
                //         dataList.sort((a, b) => {
                //             return a.value - b.value
                //         });
                //         this.questionValueList = dataList;

                //
                //     }).catch(() => {
                //         this.$message({message: "error！读取失败！", duration: 1000})
                //     })
                //  }
                // else {
                //     this.$http.get("/api/getWriteValue", {
                //         params: {
                //             questionId: this.questionId
                //         }
                //     }).then((res) => {
                //         this.writeValueList = res['data']
                //     }).catch(() => {
                //         this.$message({message: "error！读取失败！", duration: 1000})
                //     })
                // }

            },
            drawBar() {
                const myBarChart = echarts.init(document.getElementById('barChart' + this.questionIndex), 'light');
                myBarChart.setOption({
                    tooltip: {},
                    grid: {left: '15%'},
                    xAxis: {},
                    yAxis: {
                        data: this.questionValueList.map(x => x['name'])
                    },
                    series: [{
                        name: '选择人数',
                        type: 'bar',
                        data: this.questionValueList
                    }]
                });
            },
            drawPie() {
                const myPieChart = echarts.init(document.getElementById('pieChart' + this.questionIndex), 'light');
                myPieChart.setOption({
                    tooltip: {},
                    grid: {left: 20},
                    series: [{
                        name: '选择人数',
                        type: 'pie',
                        data: this.questionValueList
                    }]
                });

            }
        },

        data: function () {

            return {
                showBar: true,
                writeValueList: null,
                // questionValueList: [
                //   {
                //   name:"会",
                //   value:55
                //   },
                //   {
                //     name:"不会",
                //     value:5
                //   },
                //   {
                //     name:"会一点",
                //     value:33
                //   },
                //   {
                //     name:"都会",
                //     value:100
                //   }
                // ],
                barHeight: '250px'
            }
        }
    }
</script>

<style scoped>
    .bar-chart {
        width: 100%;
    }

    .pie-chart {
        margin-left: calc(25% - 100px);
        width: 400px;
        height: 300px;
    }

    .box-card {
        transition: all ease 300ms;
        text-align: left;
    }

    .analysis-table {
    }

    .choose-show {
        margin-left: 80px;
    }

    .analysis-title {
        margin: 15px;
        font-size: 14px;
    }
</style>
