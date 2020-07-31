<template>
    <div class="done-page">
        <i class="done-icon el-icon-success"></i>
        <div class="done-title">发布完成</div>
        <div class="done-title">{{ time }}s后跳转问卷中心...</div>
        <div class="done-title">皮一下，广告位招租</div>  
    </div>
</template>

<script>
export default {
    data() {
        return {
            time: 5,
            handler: null
        };
    },
    mounted() {
        this.$emit('setActiveBreadItem', 'bread_post_page');
        this.handler = setInterval (() => {
                this.time--;
                if (this.time == 0) {
                    clearInterval(this.handler);
                    this.$router.push({name: 'manage_questionnaire_page'});
                }
            }, 1000);  //反复执行函数本身
    }
};
</script>

<style scoped>

.done-page {
    text-align: center;
}

.done-icon {
    margin-top: 100px;
    font-size: 116px;
    color: #67C23A;
}

.done-title {
    margin-top: 16px;
    font-size:24px;
}

</style>