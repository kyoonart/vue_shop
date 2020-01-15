<template>
    <div>
      <el-button type="info" @click="exit">退出</el-button>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    methods:{
        exit(){
            window.sessionStorage.clear();
            this.$router.push('/login');
        }
    }
}
</script>
<style lang="less" scoped>

</style>    