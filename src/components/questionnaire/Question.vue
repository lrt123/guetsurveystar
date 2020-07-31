<template>
    <div style="position: relative;">
        <el-card class="box-card" shadow="hover" :body-style="{ padding: '0' }">

            <div class="box-is-not-selected-wrapper" v-if="!isBoxSelected" @click="clickUnSelected">
                <div class="box-is-not-selected">
                    <div class="question-title-div">
                        <div style="width: 80%">{{questionIndex+1}}. {{questionTitleValue}}
                            <div style="display: inline" v-if="questionNullableValue===false" class="nullable-star">*
                            </div>
                        </div>
                    </div>

                    <el-radio-group v-if="typeValue===0" v-model="optionsValue">
                        <el-radio v-for="(item,index) in optionsValue" :key="index">{{item.myoption}}</el-radio>
                    </el-radio-group>

                    <el-input v-else-if="typeValue===1"
                              type="textarea" style="max-width: 80%"
                              placeholder="请输入内容（多行文本）"
                    ></el-input>
                </div>

                <div class="edit-icon"><i class="el-icon-edit-outline"></i></div>
            </div>


            <div class="box-is-selected" v-if="isBoxSelected">
                <div class="question-index">{{questionIndex+1}}.
                </div>
                <el-form>
                    <el-form-item label="标题：">
                        <el-input type="text" size="medium"
                                  style="max-width: 60%"
                                  v-model="questionTitleValue"
                                  placeholder="请输入标题"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="类型：">
                        <el-select v-model="typeValue" placeholder="请选择" size="medium">
                            <el-option
                                    v-for="item in typeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否选填：">
                        <el-select placeholder="是否可以不填写" v-model="questionNullableValue">
                            <el-option :value="true" :label="'是'"></el-option>
                            <el-option :value="false" :label="'否'"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="questionnaireType===1&&questionType===0" label="课程目标：">
                        <el-select @change="clickOption" v-model="goalValue" placeholder="请选择" size="medium">
                            <el-option
                                    v-for="(item,index) in courseGoals"
                                    :key="index"
                                    :label="'课程目标'+(index+1)"
                                    :value="item.id"
                            >
                            </el-option>
                        </el-select>
                        <div id="descdiv">目标描述： {{this.goalDesc}}</div>
                    </el-form-item>

                    <el-divider class="divider"></el-divider>

                    <div v-if="typeValue===0">
                        <el-form-item v-for="(item,index) in optionsValue" :key="index">
                            选项{{index+1}}：
                            <el-input v-model="optionsValue[index].myoption" style="max-width: 200px"></el-input>
                            <br>

                            <div style="padding-top: 5px;">
                                <label style="padding-right: 9px;">分值：</label>
                                <el-input v-model.number="optionsValue[index].score" type="number" min="0" max="100"
                                          :validate-event="true" style="max-width: 200px"
                                >
                                </el-input>
                            </div>
                            <el-tooltip effect="light"
                                        content="在下方添加"
                                        :open-delay="200"
                                        :hide-after="1500"
                                        placement="top">
                                <el-button size="medium" round class="add-option-button"
                                           @click="addOption"
                                ><i class="el-icon-plus"></i>
                                </el-button>
                            </el-tooltip>
                            <el-tooltip effect="light"
                                        content="删除本选项"
                                        :open-delay="200"
                                        :hide-after="1500"
                                        placement="top">
                                <el-button size="medium" round class="delete-option-button"
                                           @click="deleteOption(index)"
                                ><i class="el-icon-delete"></i>
                                </el-button>
                            </el-tooltip>
                        </el-form-item>
                    </div>

                    <el-form-item>
                        <el-button type="primary" @click="saveOneQuestion">保存</el-button>
                        <el-button @click="resetQuestion">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>


            <el-button class="delete-button" type="danger"
                       icon="el-icon-delete" circle
                       @click="clickDelete"
            ></el-button>


        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Question",
        props: {
            isBoxSelected: Boolean,
            questionIndex: Number,
            questionTitle: String,
            questionNullable: Boolean,
            questionType: Number,
            questionOptions: Array,
            courseGoals: Array,
            courseGoal: Number,
            questionnaireType: Number
        },
        methods: {
            clickUnSelected() {
                this.$emit('clickUnSelected');
            },
            saveOneQuestion() {
                this.$emit('saveOneQuestion', this.questionData);
                this.$emit('clickSelected');
            },
            resetQuestion() {
                this.$emit('resetQuestion');
                this.questionTitleValue = "请输入标题";
                this.questionNullableValue = false;
                this.typeValue = 'not_selected';
                this.optionsValue = [{'myoption':'','score':0}];
            },
            clickDelete() {
                this.$emit('clickDelete');
            },
            addOption() {
                this.optionsValue.push({'myoption':'','score':0});
            },
            deleteOption(index) {
                this.optionsValue.splice(index, 1);
            },
            clickOption(){
                for (const t of this.courseGoals){
                    if (t.id === this.goalValue){
                        this.goalDesc = t.desc
                        break
                    }
                }
            }
        },
        updated() {
            if (this.questionnaireType === 1){
                this.clickOption()
            }
        },

        data: function () {
            return {
                typeOptions: [
                    {
                        value: 'not_selected',
                        label: '请输入'
                    }, {
                        value: 0,
                        label: '单选'
                    },
                    {
                        value: 1,
                        label: '主观题'
                    }],
                optionsValue: this.questionOptions,
                typeValue: this.questionType,
                questionTitleValue: this.questionTitle,
                questionNullableValue: this.questionNullable,
                goalValue: this.courseGoal,
                goalDesc: ""
            }
        },
        computed: {
            questionData: function () {
              return {
                  questionIndex: this.questionIndex,
                  questionOptions: this.optionsValue,
                  questionTitle: this.questionTitleValue,
                  questionType: this.typeValue,
                  questionNullable: this.questionNullableValue,
                  courseGoal: this.goalValue
                };
            },
        },
    }
</script>

<style scoped>
    .box-is-not-selected {
        position: relative;
        text-align: left;
        margin-left: 20%;
        line-height: 40px;
    }

    .nullable-star {
        color: red;
    }

    .delete-button {
        position: absolute;
        right: 10%;
        top: 20px;
    }

    .question-index {
        margin-bottom: 20px;
    }

    .box-card {
        transition: all ease 300ms;
    }

    .delete-button {
        position: absolute;
    }

    .box-is-selected {
        text-align: left;
        margin-top: 30px;
        margin-bottom: 30px;
        margin-left: 20%;
    }

    .box-is-not-selected-wrapper {
        padding-top: 20px;
        padding-bottom: 20px;
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

    .divider {
        max-width: 80%;
    }

    .add-option-button {
        margin-left: 10px;
    }

    #descdiv{
        color: #60627A;
        margin-top: 16px;
        width: 65%;
    }

</style>
