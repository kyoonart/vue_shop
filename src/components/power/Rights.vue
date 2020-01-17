<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item> 权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
<el-table :data="rightsLists" table stripe>
<el-table-column type="index"></el-table-column>
<el-table-column label="权限名称" prop="authName"></el-table-column>
<el-table-column label="路径" prop="path"></el-table-column>
<el-table-column label="权限等级" prop="level">
    <template slot-scope="scope">
        <el-tag v-if="scope.row.level==='0'">一级</el-tag>
        <el-tag v-if="scope.row.level==='1'" type='success'> 二级</el-tag>
        <el-tag v-if="scope.row.level==='2'" type="warning">三级 </el-tag>
    </template>
</el-table-column>
    </el-table>
    
    
        </el-card>    
    </div>
</template>
<script>
export default {
    data() {
        return {
            rightsLists:[]
        }


    },
    created() {
this.getrightsLists()
    },
    methods:{
   async getrightsLists(){
       const {data:res}=await this.$http.get('rights/list')
    //    console.log(res);
       if(res.meta.status!==200) return this.$message.error('请求列表失败')
       this.rightsLists=res.data;
    //    console.log(res.data);
       
}
    }
}
</script>
<style lang="less" scoped>
    
</style>