<template>
    <div>
        <div class="create-content" :style="marginStyle">
            <div class="create-title">
                请先填写一些问卷的基础信息
            </div>
            <el-row :gutter="10">
                <el-col :span="24">
                    <el-card shadow="hover" class="create-questionnaire-form">
                        <el-form ref="form" :model="form" :rules="rules">

                            <el-form-item label="问卷标题：" prop="title" label-width="100px">
                                <el-input v-model="form.title" prefix-icon="el-icon-edit-outline" placeholder="请输入问卷的标题(不能超过120个字)" clearable></el-input>
                            </el-form-item>

                            <el-form-item label="分发对象：" label-width="100px">
                                <el-select v-model="form.target" placeholder="请选择" style="width:100%">
                                    <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                        </el-form>
                    </el-card>
                </el-col>
            </el-row>
            <div class="create-sub-title">
                请选择问卷类型
            </div>
            <el-row :gutter="20">
                <el-col :span="spans" v-for="item in typeData" :key="item.id">
                    <div @click="onClickCreateQuestionnaireCard(item.tid)">
                        <el-card :shadow="item.shadow" class="create-questionnaire-card">
                            <i :class="item.icon" :style="item.style"></i>
                            <span> {{ item.value }} </span>
                            <div class="create-questionnaire-desc"> {{ item.desc }} </div>
                        </el-card>
                    </div>
                </el-col>
            </el-row>
            <div class="create-sub-title">
                点击按钮即可完成创建
            </div>
            <div class="create-questionnaire-btn">
                <el-button type="primary" @click="onClickCreateQuestionnaireBtn" round> 创建问卷 </el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tid: null,
            spans: 6,
            marginStyle: {
                'margin-left': '20%',
                'margin-right': '20%',
            },
            typeData: [
                {
                    id: 'qtype_common',
                    tid: 0,
                    value: '普通问卷',
                    desc: '丰富题型，易于编辑',
                    icon: 'el-icon-success',
                    path: '/manage/feedback',
                    style: {color: '#2672FF'},
                    shadow: 'hover',

                },
                {
                    id: 'qtype_class',
                    tid: 1,
                    value: '课程问卷',
                    desc: '了解课程掌握情况',
                    icon: 'el-icon-s-order',
                    path: '/manage/help',
                    style: {color: '#FFBD3A'},
                    shadow: 'hover'
                },
                {
                    id: 'qtype_vote',
                    value: '毕业问卷',
                    desc: '敬请期待...',
                    icon: 'el-icon-s-data',
                    path: '/logout',
                    style: {color: '#00BF6F'},
                    shadow: 'hover'
                },
                {
                    id: 'qtype_more',
                    value: '更多类型',
                    desc: '敬请期待...',
                    icon: 'el-icon-menu',
                    path: '/logout',
                    style: {color: '#FF6D56'},
                    shadow: 'hover'
                }
            ],
            options: [
                {
                    value: 2,
                    label: '学生'
                },
                {
                    value: 3,
                    label: '应届毕业生'
                },
                {
                    value: 5,
                    label: '企业人员'
                }
            ],
            form: {
                title: '',
                target: 2
            },
            rules: {
                title: [
                    { required: true, message: '问卷标题不能为空', trigger: 'blur' },
                    { max: 120, message: '问卷标题不能超过120个字哦！', trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {
        this.$emit('setActiveBreadItem', 'bread_create_page');
        //挂载窗口宽度修改事件
        this.onClientWidthChanged(document.body.clientWidth);
        window.addEventListener('resize', () => {
            this.onClientWidthChanged(document.body.clientWidth);
        });

    },
    methods: {
        //宽度变化设置
        onClientWidthChanged(width) {
            if (width >= 992) {
                this.spans = 6;
                let distance = parseInt(20 * (width / 1920)) + '%';
                this.marginStyle['margin-left'] = distance;
                this.marginStyle['margin-right'] = distance;

            } else {
                this.spans = 12;
                this.marginStyle['margin-left'] = 0;
                this.marginStyle['margin-right'] = 0;
            }
        },
        //问卷类型卡片被点击
        onClickCreateQuestionnaireCard(tid) {
            if (tid != null) {
                this.tid = tid;
                this.typeData.forEach(item => {
                    if (item.tid == tid) {
                        item.shadow = 'always';
                    } else {
                        item.shadow = 'hover';
                    }
                });
            }
            else{
                this.$message({message: "暂不支持该问卷类型！敬请期待！", duration:2000})
            }

        },
        //点击创建按钮
        onClickCreateQuestionnaireBtn() {
            this.$refs.form.validate(valid => {
                if (valid && this.tid!=null) {
                    this.$http.post('/questionnaire/create', {
                        'type': this.tid,
                        'title': this.form.title,
                        'send_to': this.form.target
                        })
                        .then(response =>{
                            let data = response.data;
                            if (data.code == 0) {
                                this.$router.push({name: 'questionnaire_edit_page',
                                    params: {qid: data.data.id,title:this.form.title,type:this.tid}});
                            } else if (data.code == 2) {
                                this.$logout();
                            }
                        })
                        .catch(error => {
                            console.log('getQuestionnaireDataError', error);
                        });
                }
            });
        }
    }
}
</script>

<style scoped>

.create-title {
    margin-bottom: 24px;
    font-size: 16px;
    text-align: center;
    color: #707070;
}

.create-sub-title {
    margin-top: 36px;
    margin-bottom: 24px;
    font-size: 16px;
    text-align: center;
    color: #707070;
}

.create-content {
    margin-top: 24px;
}

.create-questionnaire-card {
    margin-top: 16px;
    text-align: center;
    font-size: 18px;
    min-height: 100px;
    cursor: pointer;
}

.create-questionnaire-form {
    padding: 15px;

}

.create-questionnaire-desc {
    font-size: 10px;
    margin-top: 16px;
    color: #AAAAAA;
}

.create-questionnaire-btn{
    text-align: center;
    width: 100%;
}

.el-button {
    width: 100%;
}
</style>
