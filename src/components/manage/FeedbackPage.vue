<template>
    <div class="fb-page">
        <div class="fb-title">
            <el-tag type="warning">
                <i class="el-icon-info"></i>
                欢迎反馈~我们很高兴能够收到您的建议或者吐槽...
            </el-tag>     
        </div>   
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="反馈标题：" prop="title">
                <el-input v-model="form.title" placeholder="请填写反馈的标题"></el-input>
            </el-form-item>
            <el-form-item label="反馈类型：">
                <el-select v-model="form.ftype">
                    <el-option label="功能BUG" value="shanghai"></el-option>
                    <el-option label="功能建议" value="beijing"></el-option>
                    <el-option label="其它" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="联系方式：" prop="contact">
                <el-input v-model="form.contact" placeholder="请留下您的联系方式(QQ/微信/邮箱)"></el-input>
            </el-form-item>
            <el-form-item label="反馈内容：" prop="desc">
                <el-input 
                    type="textarea" 
                    v-model="form.desc" 
                    :autosize="{ minRows: 16, maxRows: 16}"
                    placeholder="这里填写您的建议或者吐槽..."
                ></el-input>
            </el-form-item>
            <el-form-item style="float: right">
                <el-button @click="onClear" round>重置</el-button>
                <el-button type="primary" @click="onSubmit" round>立即提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                title: '',
                ftype: '功能BUG',
                contact: '',
                desc: ''
            },
            rules: {
                title: [{ required: true, message: '反馈标题不能为空', trigger: 'blur' }],
                contact: [{ required: true, message: '联系方式不能为空', trigger: 'blur' }],
                desc: [{ required: true, message: '反馈内容不能为空', trigger: 'blur' }]
            }
        }
    },
    methods: {
        onSubmit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$message({
                        type: 'success',
                        message: '您的反馈我们已经收到了！',
                        center: true,
                        duration: 2500
                    });
                }
            });
        },
        onClear() {
            this.$msgbox.confirm('即将清空填写内容, 是否继续?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning',
                                callback: (action,instance) => {
                                    if (action == 'confirm') {
                                        this.$refs.form.resetFields();
                                    }
                                }});
        }
    }    
}
</script>

<style scoped>

.fb-page {
    padding-top: 2%;
    padding-left: 4%;
    padding-right: 4%;
}

.fb-title {
    text-align: center;
    margin-bottom: 24px;
}

</style>
