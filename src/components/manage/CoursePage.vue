<template>
    <div>
        <el-row>
            <el-col :span="spans" v-for="item in courseData" :key="item.lesson_code">
                <el-card class="col-card" :body-style="{ padding: '0px' }" shadow="hover">
                    <div class="card-bg">
                        <span class="card-title"> {{ item.course_name }} </span>
                        <span class="card-sub-title">{{ item.grade }} - {{ item.major_name }}</span>
                        <div>
                            <span class="card-code"><i class="el-icon-c-scale-to-original">{{ item.lesson_code }}</i></span>
                            <span class="card-term">{{ item.term }}</span>
                        </div>
                    </div>
                    <div class="card-under-bg">
                        <span class="card-teacher"><i class="el-icon-s-flag">{{ item.teacher }}</i></span>
                        <span class="card-total"><i class="el-icon-s-custom">人数：{{ item.total }}</i></span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            spans: 4,
            courseData: []
        }
    },
    mounted() {
        this.$emit('setActiveMenuItem', '/manage/course');
        //挂载窗口宽度修改事件
        this.onClientWidthChanged(document.body.clientWidth);
        window.addEventListener('resize', () => {
            this.onClientWidthChanged(document.body.clientWidth);
        });
        //获取课程信息
        this.getCourseData();
    },
    methods: {
        //宽度变化设置
        onClientWidthChanged(width) {
            if (width >= 1920) {
                this.spans = 6;
            } else if (width >= 1400) {
                this.spans = 6;
            } else if (width >= 992) {
                this.spans = 8;
            } else if (width >= 768) {
                this.spans = 8;
            } else {
                this.spans = 24;
            }
        },
        //获取课程信息
        getCourseData() {
            this.$http.get('/course/mylesson')
                .then(response =>{
                    let data = response.data;
                    console.log(data);
                    if (data.code == 0) {
                        this.courseData = data.data.lessons;
                    } else if (data.code == 2) {
                        this.$logout();
                    }
                })
                .catch(error => {
                    console.log('getCourseDataError', error);
                });
        }
    }
}
</script>

<style scoped>

.col-card {
    margin: 5px;
}

.card-bg {
    background: url('~@/assets/img/course-header.png') no-repeat;
    background-size: 100% 100%;
	-moz-background-size: 100% 100%;
    width: 100%;
    display: inline-block;
    padding: 6%;
}

.card-title {
    display: block;
    margin-right: 14%;
    font-size: 20px;
    font-weight: bold;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    color: #ffffff;
}

.card-sub-title {
    display: block;
    margin-right: 14%;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin-bottom: 30px;
    color: #ffffff;
}

.card-code {
    display: inline-block;
    margin-right: 14%;
    font-size: 14px;
    color: #ffffff;
}

.card-term {
    display: inline-block;
    float: right;
    margin-top: 2px;
    margin-right: 10%;
    font-size: 14px;
    color: #ffffff;
}

.card-under-bg {
    padding: 4%;
}

.card-teacher {
    display: inline-block;
    color: #909399;
    font-size: 14px;
}

.card-total {
    display: inline-block;
    float: right;
    color: #909399;
    font-size: 14px;
}

</style>
