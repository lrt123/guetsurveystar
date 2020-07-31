<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8" :xs="24" :sm="24" :md="24" :lg="24" :xl="24" v-for="(item,index) in questionInfo" :key="index">
                <el-card shadow="hover" class="box_card" >
                    <h3>{{'标题：'+item.title}}</h3>
                    <div>
                        {{'创建者：'+item.founder}}
                    </div>
                    <div>
                        {{'课 号： '+item.lesson_code}}
                    </div>
                    <div>
                        {{'创建时间： '+item.create_time}}
                    </div>
                    <div>
                        <el-button type="text" class="card_btn" @click="preview(item.id)" style="margin-left: 60%">预览</el-button>
                        <el-button type="text" class="card_btn" @click="fastcreate(item.id)">创建</el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog
                :visible.sync="detailVisible"
                append-to-body
                center

        >
            <el-container
                    style="height: 500px;width: 100%;"
            >
                <el-main>
                    <preview
                            :question-list="questionList"
                            :questionnaire="questionnaire"
                    ></preview>
                </el-main>
            </el-container>

            <div class="dialog_btn">

                <el-button @click="detailVisible=false">取消</el-button>
            </div>

        </el-dialog>
    </div>


</template>

<script>
    import preview from "./preview";
    export default {
        components:{preview},
        name: "ShareView",
        props:{
            questionInfo:Array,
            courseNo:String,
            lessonNo:String
        },
        data: function () {
            return{
                detailVisible:false,
                questionList:[],
                questionnaire:{},
                send_to:0,
                questionnaireType:0
            }
        },
        methods:{
            preview(id){
                this.fetchData(id)
                console.log(this.questionnaire)
                this.detailVisible = true
            },
            fetchData(id) {

                this.$http.get("/questionnaire/" + id, {}).then((res) => {

                    if (res.data.code === 0) {
                        this.questionList = []
                        let data = res.data.data
                        const tempList = data.questions
                        if (null == data.lesson_info.lesson_code){
                            this.questionnaire.lessonNo = "undefined"
                        }else{
                            this.questionnaire.lessonNo = data.lesson_info.lesson_code
                        }
                        this.questionnaire.questionnaireTitle = data.title
                        this.questionnaireType = data.type
                        this.send_to = data.sendTo
                        for (const t of tempList) {
                            const oneQuestion = {
                                questionIndex: t.index,
                                isBoxSelected: true,
                                questionTitle: t.desc,
                                questionNullable: t.nullable,
                                questionType: t.type,
                                courseGoal: t.target_id,
                                questionOptions: t.items
                            }
                            this.questionList.push(oneQuestion);
                        }
                        this.$message({message: "问卷已读取", duration: 1000});
                    } else {
                        this.$message({message: "code!=0！读取失败！", duration: 1000})
                    }
                }).catch((err) => {
                    console.log(err)
                    this.questionList = []
                    this.$message({message: "似乎没有设置选项", duration: 1000})
                })

            },
            fastcreate(id){
                this.$http.post('/questionnaire/clone',{
                    id: id,
                    no: this.lessonNo
                })
                .then(res => {
                    if (res.data.code === 0 ){
                        this.$router.push({name: 'questionnaire_edit_page',
                        params:{qid: res.data.data.id}})
                    }
                })
                // this.fetchData(id)
                // this.$http.post('/questionnaire/create', {
                //     'type': this.questionnaireType,
                //     'title': this.questionnaire.questionnaireTitle,
                //     'send_to': this.send_to
                // })
                //     .then(response =>{
                //         let data = response.data;
                //         if (data.code == 0) {
                //             this.$router.push({name: 'questionnaire_edit_page',
                //                 params: {
                //                     qid: data.data.id,
                //                     title:this.questionnaire.questionnaireTitle,
                //                     type:this.questionnaireType,
                //                     questionList:this.questionList,
                //                     courseNo:this.courseNo
                //             }});
                //         } else if (data.code == 2) {
                //             this.$logout();
                //         }
                //     })
                //     .catch(error => {
                //         console.log('getQuestionnaireDataError', error);
                //     });
            }
        },
    }
</script>

<style scoped>
    .box_card {
        width: 60%;
        margin-top: 10px;
        text-align: left;
        margin-left: 10%;
    }
    .card_btn{
        font-size: 16px;

    }
    .dialog_btn{
        margin-top: 5%;
        margin-left: 70%;
    }
    #container{
        width: 50%;
        height: 70%;
        border: 1px solid #eee
    }
</style>
