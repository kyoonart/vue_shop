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
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button> 
                </el-col>
            </el-row>   
            <!-- 表格区域 -->   
            <tree-table :data='cateList' :columns='columns' class="treeTable" :selection-type='false' :expand-type='false' show-index index-text='#' border> 
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
<template slot="option">
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
        <!-- 添加分类对话框 -->
        <el-dialog
  title="添加分类"
  :visible.sync="addDialogVisible"
  width="40%"
 @close='addDialogClose'>
  <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px" >
  <el-form-item label="分类名称:" prop="cat_name">
    <el-input v-model="addCateForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="父级分类:">
<div class="block">
  
  <!-- options 指定数据源 props指定配置对象 -->
  <el-cascader class='cascder'
    v-model="selectedKeys"
    :options="parentCateList"
   
    :props="cascaderProps"
    @change="parentCateChange"
    clearable change-on-select collapse-tags   ></el-cascader>
</div>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click='addForm'>确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            // 查询条件
            queryinfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            // 商品分类的数据 默认为空
            cateList: [],
            // 商品总条数
            total: '',
            columns: [{
                    label: '分类名称',
                    prop: 'cat_name'
                },
                {
                    label: '是否有效',
                    type: 'template',
                    template: 'isok'
                },
                {
                    label: '排序',
                    type: 'template',
                    template: 'order'
                },
                {
                    label: '操作',
                    type: 'template',
                    template: 'option'
                }
            ],
            // 控制分类弹框
            addDialogVisible: false,
            addCateForm: {
                // 将要添加分类的名称
                cat_name: '',
                // 父级分类的Id
                cat_pid: 0,
                // 分类的等级,默认是1级分类
                cat_level: 0
            },
            addCateFormRules: {
                cat_name: [{
                    required: true,
                    message: '请输入分类名称',
                    trigger: 'blur'
                }, {
                    min: 2,
                    max: 10,
                    message: '分类名的长度在2~10个字符之间',
                    trigger: 'blur'
                }]
            },
            // 父级分类
            parentCateList:[],
        // 指定级联配置对象
        cascaderProps:{
        expandTrigge:'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
        },
        // 选定级联的Id数组
        selectedKeys:[],
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        async getCateList() {
            const { data: res } = await this.$http.get('categories', { params: this.queryinfo });
            if (res.meta.status !== 200) {
                return this.$message.error('请求失败')
            };
            console.log(res);
            this.cateList = res.data.result;
            this.total = res.data.total;  
            this.$message.success('请求成功');
        },

        handleSizeChange(newsize) {
            this.queryinfo.pagesize = newsize;
            this.getCateList();
        },
        handleCurrentChange(newpage) {
            this.queryinfo.pagenum = newpage;
            this.getCateList();
        },
        showAddCateDialog() {
            // 打开对话框之前获取分类列表
            this.getParentCateList();
            this.addDialogVisible = true;
        },
       async getParentCateList(){
          const{data:res}= await this.$http.get('categories',{params:{ type : 2}}) ;
          if(res.meta.status!==200) return thi.$message.error('获取父级分类失败')
        this.parentCateList=res.data;
                console.log(res.data);
                
        },
        // 选择项发生改变触发这个函数
        parentCateChange(){
            if(this.selectedKeys.length>0){
                // 父级分类的id
                this.addCateForm.cat_pid=this.selectedKeys[this.selectedKeys.length-1];
                // 为当前分类的等级赋值
                this.addCateForm.cat_level=this.selectedKeys.length;
            }else{
                 this.addCateForm.cat_pid=0;
                this.addCateForm.cat_level=0
            } 
        },
        addForm(){
           this.$refs.addCateFormRef.validate(async (valid)=>{
               if(!valid) return 
               const {data:res}=  await this.$http.post('categories',this.addCateForm)
                if(res.meta.status!==201){
                    return this.$message.error('添加失败')
                }
                this.$message.success('添加成功');
                this.getCateList();
                this.addDialogVisible=false;
               })
            
        },
        // 对话框关闭的时候 重置表单
        addDialogClose(){
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys.length=0;
            this.addForm.cat_pid=0;
            this.addForm.cat_level=0;
        }
    },
}
</script>
<style lang="less" scoped>
.treeTable {
    margin-top: 15px
}
.cascder{
    width:100%;
}
</style>