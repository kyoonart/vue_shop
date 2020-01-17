<template>
    <div> 
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb> 
        <el-card>
        <el-row>
            <el-col>
                <el-button type="primary">添加商品</el-button>
            </el-col>
        </el-row>
<!-- 表格区域 -->
        <tree-table :data='cateList' :columns='columns' class="treeTable"
        :selection-type='false' :expand-type='false' show-index index-text='#' border>
        <!-- 是否有效区域 -->
        <template slot="isok" slot-scope="scope">
        <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color:lightgreen"></i>
         <i class="el-icon-error" v-else style="color:red"></i>
    </template>
    <!-- 排序区域 -->
    <template slot="order" slot-scope="scope">
        <el-tag size="mini" v-if="scope.row.cat_level==0">一级</el-tag>
        <el-tag type="success" size="mini" v-else-if="scope.row.cat_level==1">二级</el-tag>
        <el-tag type="warning" size="mini" v-else>三级</el-tag>
    </template>
    <!-- 操作区域 -->
    <template slot="option" >
        <el-button type="primary" icon='el-icon-edit' size="mini">编辑</el-button>
        <el-button type="danger" icon='el-icon-delete' size="mini">删除</el-button>
    </template>
        </tree-table>
<!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[3,5,10,20]"
      :page-size="queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            // 查询条件
            queryinfo:{
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            // 商品分类的数据 默认为空
            cateList:[],
            // 商品总条数
            total:'',
            columns:[{
                label:'分类名称',
                prop:'cat_name'
            },
            {
                label:'是否有效',
                type:'template',
                template:'isok'
            },
             {
                label:'排序',
                type:'template',
                template:'order'
            },
             {
                label:'操作',
                type:'template',
                template:'option'
            }]
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
       async getCateList(){
           const {data:res}=await this.$http.get('categories',{params:this.queryinfo});
           if(res.meta.status!==200){
               return this.$message.error('请求失败')
           };
           console.log(res);   
           this.cateList=res.data.result;
           this.total=res.data.total;
           this.$message.success('请求成功');
       },
    
    handleSizeChange(newsize){
        this.queryinfo.pagesize=newsize;
        this.getCateList();
    },
    handleCurrentChange(newpage){
        this.queryinfo.pagenum=newpage;
          this.getCateList();
    },
    },
    }
</script>
<style lang="less" scoped>
.treeTable{
    margin-top: 15px
}
</style>