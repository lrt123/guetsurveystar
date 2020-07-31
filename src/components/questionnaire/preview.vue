<template>
  <div>
    <el-row>
      <el-col class="main-answer-list" >
        <el-card shadow="always" class="box-card">
            <h1>标题：{{questionnaire.questionnaireTitle}}</h1>
            <h3>课号：{{questionnaire.lessonNo}}</h3>
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
                <el-radio-group disabled class="singleoptiongroup" v-if="item.questionType===0"
                                >
                  <el-radio class="singleoption" v-for="(optionItem,optionIndex) in item.questionOptions" :key="optionIndex"
                            :label="optionIndex" >{{optionItem.myoption}}
                  </el-radio>
                </el-radio-group>



                <el-input disabled v-else-if="item.questionType===1"
                          type="textarea" style="max-width: 80%"
                          placeholder="请输入内容"
                ></el-input>

              </el-form-item>
            </el-card>

          </div>

        </el-form>

      </el-col>
    </el-row>
  </div>


</template>

<script>
    export default {
        props:{
          questionList: Array,
          questionnaire: Object
        },
        data: function () {
            return {
            }
        },
        methods: {

        },
        mounted() {
          console.log(this.questionnaire)
          console.log(111)
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
