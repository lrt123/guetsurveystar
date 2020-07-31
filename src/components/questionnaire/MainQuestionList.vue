<template>
    <div>
        <div class="main-question-list">
            <div style="padding: 0; display: inline">
                <el-card style="position: relative; text-align: center">
                    <div class="box-is-not-selected-wrapper" @click="editTitle">
                        <div v-if="questionnaire.isBoxSelected===false" class="box-is-not-selected">
                            <h1>{{questionnaire.questionnaireTitle}}</h1>
                            <div v-if="questionnaireType===1">
                                <h3>{{questionnaire.lessonNo}}</h3>
                            </div>
                            <h3>开始时间：{{questionnaire.time[0].toLocaleDateString()+' '+questionnaire.time[0].toLocaleTimeString()}}</h3>
                            <h3>结束时间：{{questionnaire.time[1].toLocaleDateString()+' '+questionnaire.time[1].toLocaleTimeString()}}</h3>
                        </div>

                        <div class="edit-icon"><i class="el-icon-edit-outline"></i></div>
                    </div>
                    <div v-if="questionnaire.isBoxSelected===true">
                        <el-form>
                            <el-form-item>
                                标题：
                                <el-input
                                        type="text" style="max-width: 20%"
                                        placeholder="请输入问卷标题"
                                        v-model="questionnaire.questionnaireTitle"
                                ></el-input>
                            </el-form-item>
                            <el-form-item v-if="questionnaireType===1">
                                课号：
                                <el-select @change="fetchmylesson" v-model="questionnaire.lessonNo" placeholder="请选择" style="width: 20%">
                                    <el-option
                                            v-for="(item,index) in this.questionnaire.mylessons"
                                            :key="index"
                                            :label="item.lesson_code + '-' + item.course_name"
                                            :value="item.lesson_code"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                时间：
                                <el-date-picker
                                        v-model="questionnaire.time"
                                        type="datetimerange"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>


                            <el-form-item>
                                <el-button type="primary" @click="saveQuestionnaireTitle">保存</el-button>
                                <el-button @click="resetQuestionnaireTitle">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-card>
            </div>
            <div style="height: 10px"></div>


            <Question v-if="hackReset" v-for="(item,index) in questionList"
                      :key="index"
                      :is-box-selected="item.isBoxSelected"
                      :question-index="index"
                      :question-title="item.questionTitle"
                      :question-nullable="item.questionNullable"
                      :question-type="item.questionType"
                      :question-options="item.questionOptions"
                      :course-goals="courseGoals"
                      :course-goal="item.courseGoal"
                      :questionnaire-type="questionnaireType"
                      @clickUnSelected="selectOneBox(index)"
                      @clickSelected="selectOneBox(index)"
                      @saveOneQuestion="saveOneQuestion"
                      @resetQuestion="resetQuestion(index)"
                      @clickDelete="deleteOneBox(index)"
            ></Question>
            <div v-if="hackReset===false">
                <el-alert
                        title="错误提示"
                        type="error"
                        center
                        description="请务必先选择您的课号！"
                >

                </el-alert>
            </div>
            <el-card class="add-question" :body-style="{ padding: '10px' }" shadow="hover">
                <div class="add-question-inner" @click="addNewQuestion(0)"><i class="el-icon-plus"></i>
                    添加问题
                </div>
            </el-card>
            <el-card style="text-align: center">

                <el-dialog
                        title="确认删除？"
                        :visible.sync="deleteVisible"
                        append-to-body
                        center
                >
                <span slot="footer" class="dialog-footer">
                    <el-button @click="deleteVisible=false" size="small">取 消</el-button>
                    <el-button @click="deleteQuestionnaire" type="danger" size="small">确认删除</el-button>
                </span>

                </el-dialog>
                <el-dialog
                        title="发布成功"
                        :visible.sync="releaseVisible"
                        append-to-body
                        center
                >
                    问卷链接为：
                    <el-link class="copy-link"
                             target="_blank" @click="copy"
                             :data-clipboard-text="'/fillin/'+this.$route.params.qid"
                             data-clipboard-action="copy"
                             type="primary"
                    >
                        {{this.questionnaire.questionnaireTitle}}-点击复制
                    </el-link>
                    <span slot="footer" class="dialog-footer">
                    <el-button @click="releaseEnd" type="primary">关 闭</el-button>
                </span>

                </el-dialog>

                <el-button type="danger" @click="deleteVisible = true">删 除</el-button>
                <el-button @click="saveQuestionnaire">保 存</el-button>
                <el-button @click="releaseQuestionnaire" type="primary">发 布</el-button>
            </el-card>


        </div>
    </div>
</template>

<script>
    import Question from "./Question";
    import Clipboard from 'clipboard';

    export default {
        name: "MainQuestionList",
        components: {Question},

        data: function () {
            return {
                questionList: [],
                questionnaire: {
                    isBoxSelected: false,
                    lessonNo: "",
                    questionnaireTitle: "请输入标题",
                    time:[new Date(),new Date()],
                    mylessons:[]
                },
                deleteVisible: false,
                deleted: false,
                releaseVisible: false,
                hackReset:true,
                questionnaireType: 0,
                courseGoals: [],
                courseNo:''
            }
        },

        methods: {
            fetchData() {
                this.$http.get("/course/mylesson", {}).then((res) => {
                    const lessons = res.data.data.lessons
                    for (const t of lessons) {
                        this.questionnaire.mylessons.push(t)
                    }
                })

                //获取问卷信息
                this.$http.get("/questionnaire/"+this.$route.params.qid, {
                }).then((res) => {
                    let data = res.data.data
                    this.questionnaireType = data.type
                    this.questionnaire.questionnaireTitle = data.title
                    if (data.start_time !== ""){
                        this.questionnaire.time[0] = new Date(data.start_time)
                        this.questionnaire.time[1] = new Date(data.end_time)
                    }

                    const tempList = data.questions;
                    const resList = [];
                    for (const t of tempList) {
                        const oneQuestion = {
                            questionIndex:t.index,
                            isBoxSelected:false,
                            questionTitle:t.desc,
                            questionNullable:t.nullable,
                            questionType:t.type,
                            courseGoal: t.target_id,
                            questionOptions:t.items
                        }
                        resList.push(oneQuestion)
                    }
                    this.questionList = resList;
                    if (null !== data.lesson_info){
                        this.questionnaire.lessonNo = data.lesson_info.lesson_code
                        this.fetchCourseGoal(data.lesson_info.course_code)
                    }
                    this.$message({message: "问卷已读取", duration: 1000});
                    // this.reload();
                    if (this.questionnaireType === 1 && this.questionnaire.lessonNo === ""){
                        console.log('yes')
                        this.hackReset = false
                    }
                })

            },


            selectOneBox(index) {
                this.questionList[index].isBoxSelected = !this.questionList[index].isBoxSelected;
            },

            resetQuestion(index) {
                return;  // process in the question.vue
            },

            saveOneQuestion(data) {
                const index = data['questionIndex'];
                const oneQuestion = {
                    questionIndex: index,
                    isBoxSelected: true,
                    questionTitle: data['questionTitle'],
                    questionNullable: data['questionNullable'],
                    questionType: data['questionType'],
                    questionOptions: data['questionOptions'],
                    courseGoal: data['courseGoal']
                };
                this.questionList.splice(index, 1, oneQuestion);
            },

            deleteOneBox(index) {
                console.log(this.questionList.splice(index, 1))
                for (let i = index; i < this.questionList.length; i++) {
                    this.questionList[i].questionIndex--;
                }
                this.reload()
            },
            addNewQuestion(type) {
                const newQuestion = {
                    questionIndex: this.questionList.length,
                    isBoxSelected: true,
                    questionTitle: "",
                    questionNullable: false,
                    questionType: type,
                    questionOptions: [
                        {
                            "myoption": '能',
                            "score": 100
                        },
                        {
                            "myoption": '大部分能',
                            "score": 80
                        },
                        {
                            "myoption": '部分能',
                            "score": 60
                        },
                        {
                            "myoption": '大部分不能',
                            "score": 40
                        }
                    ],
                    courseGoal: null,
                };
                this.questionList.push(newQuestion);
            },
            saveQuestionnaireTitle() {
                this.questionnaire.isBoxSelected = false;
            },
            resetQuestionnaireTitle() {
                this.questionnaire.isBoxSelected = {
                    isBoxSelected: false,
                    questionnaireTitle: "请输入标题",
                    questionnaireId: this.$route.params.qid,
                };
            },
            editTitle() {
                this.questionnaire.isBoxSelected = true;
            },
            saveQuestionnaire() {
                this.$http.post("/questionnaire/edit", {
                    questionnaire:
                        {
                            questionnaireId: parseInt(this.$route.params.qid),
                            questionnaireTitle: this.questionnaire.questionnaireTitle,
                            lessonNo: this.questionnaire.lessonNo,
                            startTime: this.questionnaire.time[0].getTime(),
                            endTime: this.questionnaire.time[1].getTime()
                        },
                    questionList: this.questionList,
                }).then((res) => {
                    let data = res.data;
                    if (data.code === 0) {
                        this.$message({message: "问卷已保存", duration: 1000});
                        this.$router.push('/manage/questionnaire');
                    } else {
                        this.$message({message: "error！问卷未保存！", duration: 1000});
                    }
                }).catch(() => {
                    this.$message({message: "error！问卷未保存！", duration: 1000});
                });

            },
            deleteQuestionnaire() {
                this.deleteVisible = false;
                this.$http.post('/questionnaire/delete', {"id": [this.$route.params.qid]})
                    .then(response => {
                        console.log(response.data);
                        if (response.data.code == 0) {
                            this.$message({message: "删除成功", duration: 1000});
                            this.$router.back()
                        } else if (response.data.code == 2) {
                            this.$message({message: "删除失败", duration: 1000});
                            this.deleteVisible = true
                        }
                    });
            },
            releaseQuestionnaire() {
                this.$http.post("/questionnaire/edit", {
                    questionnaire:
                        {
                            questionnaireId: parseInt(this.$route.params.qid),
                            questionnaireTitle: this.questionnaire.questionnaireTitle,
                            lessonNo: this.questionnaire.lessonNo,
                            startTime: this.questionnaire.time[0].getTime(),
                            endTime: this.questionnaire.time[1].getTime()
                        },
                    questionList: this.questionList,
                })
                    .then(() => {
                        this.$http.post('/questionnaire/status', {"id": this.$route.params.qid, "status":1})
                            .then((res)=>{
                                if (res.data.code===0){
                                    this.$message({message: "问卷已发布", duration: 1000})
                                }else{
                                    this.$message({message: "error! 问卷未发布", duration: 1000})
                                }

                            }).catch(()=>{
                            this.$message({message: "error！问卷未发布！", duration: 1000});
                        })
                        this.releaseEnd()
                    }).catch(() => {
                    this.$message({message: "error！问卷未发布！", duration: 1000});
                });


                this.releaseVisible = true;

            },
            releaseEnd() {
                this.releaseVisible = false;
                this.$router.push('/questionnaire/done');
            },
            reload() {
                this.hackReset = false
                this.$nextTick(() => {
                    this.hackReset = true
                })
            },
            copy() {
                const clipboard = new Clipboard('.copy-link')
                clipboard.on('success', e => {
                    console.log('复制成功')
                    this.$message({message: "复制成功", duration: 1000})
                    // 释放内存
                    clipboard.destroy()
                })
                clipboard.on('error', e => {
                    // 不支持复制
                    console.log('该浏览器不支持自动复制')
                    // 释放内存
                    clipboard.destroy()
                })
            },
            fetchmylesson(value) {
                this.hackReset = true
                let courseNo = ''
                for (const t of this.questionnaire.mylessons) {
                    if (t.lesson_code === value) {
                        courseNo = t.course_code
                        if (courseNo === this.courseNo){
                            return
                        }
                        this.courseNo = courseNo
                        this.$http.get("course/target/" + courseNo, {}).then((res) => {
                            const targetList = res.data.data.Targets
                            const resList = [];
                            for (const t of targetList) {
                                resList.push(t)
                            }
                            this.courseGoals = resList
                        })
                        this.reload()
                        break;
                    }
                }
            },
            fetchCourseGoal(courseNo){
                        this.$http.get("course/target/" + courseNo, {}).then((res) => {
                            const targetList = res.data.data.Targets
                            const resList = [];
                            for (const t of targetList) {
                                resList.push(t)
                            }
                            this.courseGoals = resList
                        })
                        console.log(this.courseGoals)
                        this.reload()

            }
        },

        created() {
            // if (null != this.$route.params.title){
            //     this.questionnaire.questionnaireTitle = this.$route.params.title
            // }
            if (null != this.$route.params.type){
                this.questionnaireType = this.$route.params.type
            }
            this.$emit('setActiveBreadItem', 'bread_edit_page');


            // if (null != this.$route.params.questionList){
            //     this.fetchCourseGoal(this.$route.params.courseNo)
            //     this.questionList = this.$route.params.questionList
            //     this.$http.get("/course/mylesson", {}).then((res) => {
            //         const lessons = res.data.data.lessons
            //         for (const t of lessons) {
            //             this.questionnaire.mylessons.push(t)
            //         }
            //     })
            //     return
            // }
            // console.log(this.$route.params.qid)
            if (null != this.$route.params.qid ){
              this.fetchData();
            }
        }
    }
</script>

<style scoped>
    .main-question-list {
        height: 100%;
        background-color: white;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }

    .add-question-inner {
        width: 50%;
        height: 50px;
        padding-top: 25px;
        text-align: center;
        margin-left: auto;
        margin-right: auto;
        border-color: rgba(128, 128, 128, 0.5);
        color: rgba(128, 128, 128, 0.5);
        border-width: 2px;
        border-style: dashed;
        font-weight: bolder;
        cursor: pointer;
    }

    .box-is-not-selected {
        position: relative;
    }

    .box-is-not-selected-wrapper {
        cursor: pointer;
    }

    .box-is-not-selected-wrapper:hover .box-is-not-selected {
        filter: blur(8px);
    }

    .edit-icon {
        display: none;
    }

    .box-is-not-selected-wrapper:hover .edit-icon {
        display: inline;
        height: 100%;
        width: 100%;
        background-color: rgba(179, 229, 252, 0.3);
        position: absolute;
        top: 0;
        left: 0;
    }

    .el-icon-edit-outline {
        position: absolute;
        top: calc(50% - 30px);
        left: calc(50% - 30px);
        font-size: 60px;
        color: rgba(128, 0, 128, 0.6);
    }

</style>
