<template>
<div>
   <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item> 用户列表</el-breadcrumb-item>
</el-breadcrumb>
<el-card>
   <el-row :gutter="20">
       <el-col :span="7"> 
            <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
    <el-button slot="append" icon="el-icon-search"></el-button></el-input>  
       </el-col>
       <el-col :span="4">
           <el-button type="primary">添加用户</el-button>
       </el-col>
   </el-row>
   <!-- 用户列表区域 -->
   <el-table :data="userlist" border stripe>
        <el-table-column type="index" > </el-table-column>
       <el-table-column label="姓名"  prop="username"> </el-table-column>
       <el-table-column label="邮箱"  prop="email"> </el-table-column>
       <el-table-column label="电话"  prop="mobile"> </el-table-column>
       <el-table-column label="角色"  prop="role_name"> </el-table-column>
      <el-table-column label="状态"> 
        <template slot-scope="scope"> 
      <el-switch
    v-model="scope.row.mg_state"
    active-color="#13ce66"
    inactive-color="#ff4949">
</el-switch>
</template>
      </el-table-column>
      <el-table-column label="操作" > 
          <template >
     <el-button type="primary" icon="el-icon-edit"  size="small"></el-button>
     <el-button type="danger" icon="el-icon-delete"  size="small"></el-button>
        <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="true">
        <el-button type="warning" icon="el-icon-setting"  size="small"></el-button>
    </el-tooltip>
   
          </template>
      </el-table-column>
   </el-table>
</el-card>
</div>
</template>
<script>
export default {
    data(){
        return{
            queryinfo:{
                query:'',
                pagenum:"1",
                pagesize:2
            },
            userlist:[],
            total:0,
        
        }
    },
    created(){
        this.getUserList();
    },
    methods:{
      async getUserList()
       {
         const {data:res}  = await this.$http.get('users',{
                 params:this.queryinfo
        })
        console.log(res);
        if(res.meta.status!==200) return this.$message.error('获取用户列表失败');
        this.userlist=res.data.users;
        this.total=res.data.total;
       }
    }
}
</script>
<style lang="less" scoped>

</style> 