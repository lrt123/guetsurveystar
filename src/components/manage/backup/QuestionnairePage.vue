<template>
    <div>
        <el-row class="grid-row">
            <el-col :span="24" class="grid-col">
                <el-steps simple>
                    <el-step title="创建" icon="el-icon-plus"></el-step>
                    <el-step title="发放" icon="el-icon-position"></el-step>
                    <el-step title="填写" icon="el-icon-edit"></el-step>
                </el-steps>
            </el-col>
        </el-row>
        <el-row :span="24" class="grid-row">
            <el-timeline>
                <el-timeline-item class="hidden-sm-and-down" placement="top" v-if="funcBthShow">
                    <el-card shadow="hover">
                        <el-checkbox v-model="funcChecked" class="quest-checkbox" @change="onFuncCheckboxChanged"></el-checkbox>
                        <el-button
                            v-for="item in funcBtnData"
                            :key="item.id" :type="item.type"
                            :icon="item.icon"
                            @click="onClickFuncBtn(item.value)"
                            round
                        > {{ item.value }} </el-button>
                    </el-card>
                </el-timeline-item>

                <el-timeline-item class="hidden-sm-and-up" placement="top" v-if="funcBthShow">
                    <el-card shadow="hover">
                        <el-checkbox v-model="funcChecked" class="quest-checkbox" @change="onFuncCheckboxChanged"></el-checkbox>
                        <el-button
                            v-for="item in funcBtnData"
                            :key="item.id" :type="item.type"
                            :icon="item.icon"
                            @click="onClickFuncBtn(item.value)"
                            circle
                        ></el-button>
                    </el-card>
                </el-timeline-item>

                <el-timeline-item v-for="(item, index) in questionnarieData" :key="item.id" :timestamp="item.time" placement="top">
                    <div @click="onClickQuestionnaireCard(item)">
                        <el-card shadow="hover">

                            <el-checkbox
                                v-model="item.checked"
                                style="float: left"
                                @click.stop.native="() => {}"
                            >[ID]：{{ item.id }} - [状态]：{{ item.status }}</el-checkbox>

                            <el-dropdown style="float: right" @command="onClickFuncMenu" v-if="funcBthShow">
                                <span class="el-dropdown-link">
                                    <i class="el-icon-s-unfold el-icon--right" style="font-size: 18px"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item
                                        v-for="dropItem in dropDownData"
                                        :key="dropItem.id" :type="dropItem.type"
                                        :icon="dropItem.icon"
                                        :command="{target: item, value: dropItem.value, index: index}"
                                    > {{ dropItem.value }} </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>

                            <h3 style="clear:both; margin-top: 32px"> {{ item.title }} </h3>

                            <el-table :data="item.ex" :show-header="false">
                                <el-table-column prop="key" align="center" label="key" width="100"></el-table-column>
                                <el-table-column prop="value" label="value"></el-table-column>
                            </el-table>
<!--                            学生按钮-->
                            <div v-if="student">
                                <el-button v-if="item.is_need_fill"
                                           @click="go_fill(item.id,0)"
                                           type="primary"
                                           class="form-btn">去填写</el-button>
                                <el-button v-if="item.is_need_fill===false"
                                           @click="go_fill(item.id,1)"
                                           class="form-btn"
                                           type="primary">查看详情</el-button>
                            </div>
<!--                            教师按钮-->
                            <div v-if="teacher">
                                <el-button v-if="item.editable"
                                           @click="go_edit(item.id,item.title,item.ex[1].value,item.type)"
                                           type="primary"
                                           class="form-btn">编辑</el-button>
                            </div>
                        </el-card>
                    </div>
                </el-timeline-item>

            </el-timeline>
        </el-row>
        <el-dialog
                :visible.sync="fastVisible"
                append-to-body
                center
                title="请先选择课程："
                width="15%"
        >
            <el-select v-model="courseNo" placeholder="请选择课程">
                <el-option v-for="(value,key,index) in courseNoInfo"
                           :key="index"
                           :label="value"
                           :value="key"
                >
                </el-option>
            </el-select>
            <el-dialog
                    :visible.sync="fastShowVisible"
                    append-to-body
                    center
                    title="快速创建"
                    width="40%"
            >
                <el-container
                        style="height: 500px;width: 100%"
                >
                    <el-main>
                        <ShareView
                                :question-info="questionInfo"
                                :course-no="courseNo"
                        ></ShareView>
                    </el-main>
                </el-container>

            </el-dialog>
            <br>
            <br>
            <el-button style="margin-left: 75%" @click="fast_create" type="primary" icon="el-icon-right" circle></el-button>
        </el-dialog>
    </div>
</template>

<script>

import ShareView from "../questionnaire/ShareView";

export default {
    components: {ShareView},
    data() {
        return {
            idType: null,
            funcChecked: false,
            funcBthShow: false,
            funcBtnData: [
                {id:'questionnaire-btn-create', value: '创建', type: 'primary', icon: 'el-icon-edit'},
                {id:'questionnaire-btn-post', value: '发布', type: 'success', icon: 'el-icon-position'},
                {id:'questionnaire-btn-stop', value: '停止', type: 'warning', icon: 'el-icon-remove-outline'},
                {id:'questionnaire-btn-delete', value: '删除', type: 'danger', icon: 'el-icon-delete'},
                {id:'questionnaire-btn-fastcreate', value: '快速创建', type: 'success', icon: 'el-icon-s-opportunity'}
            ],
            dropDownData: [
                {id:'questionnaire-btn-create', value: '编辑', type: 'success', icon: 'el-icon-edit'},
                {id:'questionnaire-btn-post', value: '发布', type: 'success', icon: 'el-icon-position'},
                {id:'questionnaire-btn-stop', value: '停止', type: 'warning', icon: 'el-icon-remove-outline'},
                {id:'questionnaire-btn-delete', value: '删除', type: 'danger', icon: 'el-icon-delete'},
            ],
            courseNoInfo:{},
            courseNo:'',
            questionnarieData: [],
            student: false,
            teacher: false,
            fastVisible: false,
            fastShowVisible: false,
            questionInfo: []
        }
    },
    mounted() {
        this.$emit('setActiveMenuItem', '/manage/questionnaire');
        this.onIdentityJudge();
        this.getQuestionnaireData();
    },
    methods: {
        //身份判断
        onIdentityJudge() {
            this.idType = window.localStorage.getItem('type');
            if (this.idType == 2){
                this.student=true
            }else if (this.idType == 1){
                this.teacher = true
            }
            this.funcBthShow = (this.idType != 2);
        },
        //问卷被点击切换选中状态
        onClickQuestionnaireCard(item) {
            item.checked = !item.checked;
        },
        //全选选择框状态变化
        onFuncCheckboxChanged() {
            this.questionnarieData.forEach(item => {
                item.checked = this.funcChecked;
            });
        },
        //点击FuncBtn
        onClickFuncBtn(value) {
            if (value == '创建') {
                this.$router.push({path: '/questionnaire/create'});
            } else if (value == '发布' || value == '停止') {
                let items = [];
                this.questionnarieData.forEach(item => {
                    if (item.checked) {
                        items.push(item);
                    }
                });
                this.changeQuestionnaireStatus(items, value);
            } else if (value == '删除') {
                this.$msgbox.confirm('是否要删除问卷?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error',
                    callback: (action,instance) => {
                        if (action == 'confirm') {
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
            } else if (value === '快速创建'){
                    this.fastVisible = true
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
        //设置问卷状态
        changeQuestionnaireStatus(items, status) {
            items.forEach(i => {
                if (status == '发布' && i.status != '收集中') {
                    this.setQuestionnaireStatus(i, 1, '收集中');
                } else if (status == '停止' && i.status != '已截至') {
                    this.setQuestionnaireStatus(i, 2, '已截至');
                }
            });
        },
        //请求问卷信息
        getQuestionnaireData() {
            this.$http.get('/user/myquestionnaire')
                .then(response =>{
                    let data = response.data;
                    if (data.code === 0) {
                        data.data.my_questionnaire.forEach(item => {
                            item.checked = false;

                            if (item.sendTo === parseInt(this.idType) && item.status === 1){
                                item.is_need_fill = true
                            }else {
                                item.is_need_fill = false
                            }
                            if (item.course_code!=""){
                                this.courseNoInfo[item.course_code]=item.lesson_name
                            }

                            if (item.status == 0) {
                                item.status = '未发布';
                                item.editable = true
                            } else if (item.status == 1) {
                                item.status = '收集中';
                            }  else if (item.status == 2) {
                                item.status = '已截止';
                                item.editable = true
                            }


                            item.ex = [
                                {key: '[作者]：', value: item.founder},
                                {key: '[课号]：', value: item.lesson_code},
                                {key: '[专业]：', value: item.major},
                                {key: '[时间]：', value: item.create_time + '-' + item.end_time}
                            ];
                        });
                        this.questionnarieData = data.data.my_questionnaire;
                    } else if (data.code === 2) {
                        this.$logout();
                    }
                })
                .catch(error => {
                    console.log('getQuestionnaireDataError', error);
                });
        },
        //设置问卷状态
        setQuestionnaireStatus(item, status, newValue) {
            this.$http.post('/questionnaire/status', {"id": item.id, "status":status})
                .then(response => {
                    if (response.data.code === 0) {
                        item.status = newValue;
                        if (status===0||status===2){
                            item.editable = true
                        }else {
                            item.editable = false
                        }
                    } else if (response.data.code === 2) {
                        this.$logout();
                    }
                });
        },
        //删除问卷
        deleteQuestionnaire(ids, indexs) {
            this.$http.post('/questionnaire/delete', {"id": ids})
                .then(response => {
                    console.log(response.data);
                    if (response.data.code == 0) {
                        indexs.forEach(i => {
                            this.questionnarieData.splice(i, 1);
                        });
                    } else if (response.data.code == 2) {
                        this.$logout();
                    }
                });
        },
        //填写问卷
        go_fill(id,status){
            this.$router.push({name: 'questionnaire_fillin_page', params: {qid: id,status: status}})
        },
        //编辑问卷
        go_edit(id,title,lessonNo,type){
            this.$router.push({name: 'questionnaire_edit_page', params: {qid: id,title: title,lessonNo: lessonNo,type:type}})
        },
        //快速创建
        fast_create(){
            this.$http.get("/questionnaire/"+this.courseNo+"/all",{})
                .then(res =>{
                    if (res.data.code===0){
                        let templist = []
                        this.questionInfo = []
                        templist = res.data.data.list
                        for (const t of templist){
                            this.questionInfo.push(t)
                        }
                        console.log(this.questionInfo)
                        this.fastShowVisible = true
                    }
                })
        }
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

.quest-checkbox {
    float: left;
    margin-top: 10px;
}

    .form-btn{
        margin-top: 10px;
    }


</style>
