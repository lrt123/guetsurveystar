<template>
  <div>
    <el-row>
      <el-col class="main-answer-list" :sm="24" :md="{span:18,offset:3}" :lg="{span:16,offset:4}"
              :xl="{span:14,offset:5}">
        <el-card shadow="always" class="box-card">
          <div v-if="questionnaire.isBoxSelected===false">
            <h1>标题：{{questionnaire.questionnaireTitle}}</h1>
            <h3>课号：{{questionnaire.lessonNo}}</h3>
          </div>
        </el-card>
        <el-form >
          <div v-for="(item,index) in questionList"
               :key="index">
            <el-card class="box-card">
              <el-form-item>
                <div class="question-title-div">
                  <div style="display: inline"><b>{{index+1}}. {{item.questionTitle}}</b></div>
                  <div style="display: inline" v-if="item.questionNullable===false" class="nullable-star">
                    *
                  </div>
                </div>

              </el-form-item>

              <el-form-item>
                <el-radio-group :disabled="disabled" class="singleoptiongroup" v-if="item.questionType===0"
                                v-model="answerList[index].answerIndex">
                  <el-radio class="singleoption" v-for="(optionItem,optionIndex) in item.questionOptions" :key="optionIndex"
                            :label="optionIndex" >{{optionItem.myoption}}
                  </el-radio>
                </el-radio-group>



                <el-input :disabled="disabled" v-else-if="item.questionType===1"
                          type="textarea" style="max-width: 80%"
                          placeholder="请输入内容"
                          v-model="answerList[index].answerText"
                ></el-input>

              </el-form-item>
            </el-card>

          </div>


          <el-form-item>
            <el-card class="box-card" style="width: 95%">

              <el-dialog
                width="70%"
                title="确认提交？"
                :visible.sync="submitVisible"
                append-to-body
                center
              >
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="submitVisible = false">取 消</el-button>
                                <el-button @click="submitAnswer" type="primary">确认提交</el-button>
                            </span>

              </el-dialog>
              <el-dialog
                width="70%"
                title="确认保存？"
                :visible.sync="saveVisible"
                append-to-body
                center
              >
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="saveVisible = false">取 消</el-button>
                                <el-button @click="saveAnswer" type="primary">确认保存</el-button>
                            </span>

              </el-dialog>
              <el-dialog
                width="70%"
                title="确认重置？"
                :visible.sync="resetVisible"
                append-to-body
                center
              >
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="resetVisible = false">取 消</el-button>
                                <el-button @click="resetAnswer" type="primary">确认重置</el-button>
                            </span>

              </el-dialog>
              <div v-if="buttonVisible">
                <el-button type="primary" @click="submitVisible = true">提 交</el-button>
                <el-button @click="saveVisible = true">保 存</el-button>
                <el-button @click="resetVisible = true">重 置</el-button>
              </div>

            </el-card>
          </el-form-item>
        </el-form>

      </el-col>
    </el-row>
  </div>


</template>

<script>
    export default {
        name: "FillIn",
        data: function () {
            return {
                questionList: [],
                answerList: [],
                questionnaire: {
                    isBoxSelected: false,
                    lessonNo: "1911266",
                    questionnaireTitle: "软件项目管理课程目标调查",
                    questionnaireId: this.$route.params.qid,
                },
                submitVisible: false,
                resetVisible: false,
                alreadySubmit: null,
                saveVisible: false,
                cannotSubmit: null,
                buttonVisible: true,
                disabled: false
            }
        },
        computed: {
            aaa: function () {
                return {
                    answerList: this.answerList,
                }
            }
        },
        methods: {
            fetchData() {
              /*单机*/
                      // const tempList = this.questionList;
                      // const ansList = [];
                      // for (const t of tempList) {
                      //     const oneAnswer = {
                      //         questionId: t['questionId'],
                      //         questionTitle: t['questionTitle'],
                      //         questionType: t['questionType'],
                      //         questionNullable: t['questionNullable'],
                      //         answerSingleCheck: '',
                      //         answerText: '',
                      //         courseGoal: t['courseGoal']
                      //     };
                      //     ansList.push(oneAnswer);
                      // }
                      // this.answerList=ansList
              /*单机*/

                this.$http.get("/questionnaire/"+this.$route.params.qid, {
                }).then((res) => {

                    if (res.data.code === 0){
                      let data = res.data.data
                      const tempList = data.questions
                      const resList = [];
                      const ansList = [];
                      if (data.lock === true){
                        this.disabled = true
                        this.buttonVisible = false
                      }
                      this.questionnaire.lessonNo=data.lesson_info.lesson_code
                      this.questionnaire.questionnaireTitle=data.title

                      for (const t of tempList) {
                        const oneQuestion = {
                          questionIndex:t.index,
                          isBoxSelected:true,
                          questionTitle:t.desc,
                          questionNullable:t.nullable,
                          questionType:t.type,
                          target_id: t.target_id,
                          questionOptions:t.items
                        }
                        const oneAnswer = {
                          isBoxSelected:true,
                          questionId: t.index,
                          questionTitle: t.desc,
                          questionType: t.type,
                          answerIndex: t.my_answer,
                          target_id: t.target_id,
                          answerText:''
                        };
                        if (oneAnswer.questionType===1){
                          oneAnswer.answerText = t.my_answer
                        }
                        resList.push(oneQuestion);
                        ansList.push(oneAnswer);
                      }
                      this.questionList = resList;
                      this.answerList = ansList;
                      if (this.buttonVisible === false){
                        this.$message({message: "问卷已提交，不可更改！", duration: 2000})
                      }else {
                        this.$message({message: "问卷已读取", duration: 1000});
                      }

                    }
                    else{
                      this.$message({message: "error！读取失败！", duration: 1000})
                      this.$router.back()
                    }
                    }).catch((res)=>{
                      this.$message({message:"error! 读取失败",duration:1000})
                      // this.$router.back()
                })

            },
            submitAnswer() {
                let postAnsList = []
                let oneAnswer = {}
                for (const t of this.answerList){
                  if (t.questionType === 0){
                    oneAnswer = {
                      answer: t.answerIndex
                    }
                  }
                  else if (t.questionType === 1){
                    oneAnswer = {
                      answer: t.answerText
                    }
                  }
                  postAnsList.push(oneAnswer)
                }
                if (this.checkValidate()) {
                    this.$http.post("/questionnaire/submit", {
                        id:this.$route.params.qid,
                        answerList: postAnsList
                    }).then(() => {
                        this.submitVisible = false;
                        this.alreadySubmit = true;
                        this.cannotSubmit = true;
                        this.$message({message: "问卷已提交", duration: 1000});
                        this.$router.back()
                    }).catch(() => {
                        this.$message({message: "error！提交失败！", duration: 1000})
                    });
                }
            },
            saveAnswer(){
              let postAnsList = []
              let oneAnswer = {}
              for (const t of this.answerList){
                if (t.questionType === 0){
                  if (t.answerIndex === null){
                    oneAnswer = {
                      answer: -1
                    }
                  }else{
                    oneAnswer = {
                      answer: t.answerIndex
                    }
                  }

                }
                else if (t.questionType === 1){
                  oneAnswer = {
                    answer: t.answerText
                  }
                }
                postAnsList.push(oneAnswer)
              }
              this.$http.post("/questionnaire/save", {
                id: this.$route.params.qid,
                answerList: postAnsList
              }).then(() => {
                this.saveVisible = false;
                this.$message({message: "问卷已提交", duration: 1000});
              }).catch(() => {
                this.$message({message: "error！提交失败！", duration: 1000})
              });
            },
          resetAnswer() {
                this.fetchData();
                this.resetVisible = false;
            },
            checkValidate() {
                for (const oneAnswer of this.answerList) {
                    if (oneAnswer.questionNullable === true) {
                        console.log('nullable', oneAnswer);
                        continue;
                    } else {
                        if (oneAnswer.questionType === 0 && oneAnswer.answerIndex === null ||
                            oneAnswer.questionType === 1 && oneAnswer.answerIndex === ''
                        ) {
                            console.log(oneAnswer.answerSingleCheck)
                            console.log('error')
                            console.log(this.answerList)
                            this.$message.error(oneAnswer.questionId % 1000 + 1 + ' ' + oneAnswer.questionTitle + ' 是必填字段！');
                            return false;
                        }
                    }
                }
                return true;
            }
        },
        mounted() {
            console.log(this.questionList)
            if (this.$route.params.status === 1){
              this.buttonVisible = false
              this.disabled = true
            }
            this.fetchData();
            this.$emit('setActiveBreadItem', 'bread_fillin_page');

        }
    }
</script>

<style scoped>
    .main-answer-list {
        position: relative;
        text-align: left;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }

    .box-card {
        padding-left: 5%;
    }

    .nullable-star {
        color: red;
    }

    .singleoptiongroup{
      display: flex;
      flex-direction: column;
    }

    .singleoption{
      padding-bottom: 15px;
      padding-top: 15px;
    }

</style>
