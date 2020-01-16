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
                    <el-input placeholder="请输入内容" v-model="queryinfo.query" clearable @clear="getUserList" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
                    </el-input>
                </el-col>
               <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="userlist" border stripe>
                <el-table-column type="index"> </el-table-column>
                <el-table-column label="姓名" prop="username"> </el-table-column>
                <el-table-column label="邮箱" prop="email"> </el-table-column>
                <el-table-column label="电话" prop="mobile"> </el-table-column>
                <el-table-column label="角色" prop="role_name"> </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope"> 
        	      <el-switch
        	    v-model="scope.row.mg_state"
        	    active-color="#13ce66"
        	    inactive-color="#ff4949"
        	    @change="userStatueChanged(scope.row)">
        	</el-switch>
</template>
    </el-table-column>
    <el-table-column label="操作" > 
<template slot-scope="scope">
    <el-button type="primary" icon="el-icon-edit" size="small" @click="showEditDialog(scope.row.id)">
    </el-button>
    <el-button type="danger" icon="el-icon-delete" size="small" @click="deleatUserById(scope.row.id)"></el-button>
    <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="true">
    <el-button type="warning" icon="el-icon-setting" size="small"></el-button>
    </el-tooltip>
</template>
      </el-table-column>
   </el-table>
   <!-- 分页 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryinfo.pagesize"
      layout="total ,sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 提示框 -->
    <el-dialog
  title="添加用户"
  :visible.sync="addDialogVisible"
  @close="addDialogVisibleClose"
  width="50%"
  >
  <!-- 内容的主体区域 -->
  <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="70px">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
   <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
   <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
   <el-form-item label="手机" prop="phonenum">
    <el-input v-model="addForm.phonenum"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>
<!-- 修改对话框 -->
<el-dialog
  title="修改用户"
  :visible.sync="EditDialogVisible"
  width="50%"
  @close="editDialogClose">
 <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
  <el-form-item label="用户名" >
    <el-input v-model="editForm.username" disabled></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="editForm.email" > </el-input>
  </el-form-item >
  <el-form-item label="电话"  prop="mobile">
    <el-input v-model="editForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="EditDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editFormInfo">确 定</el-button>
  </span>
</el-dialog>
</el-card>
</div>
</template>
<script>
export default {
    data() {
        // 验证邮箱规则
        var checkEmail = (rule, value, callback) => {
            var regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            if (regEmail.test(value)) {
                return callback();
            }
            callback(new Error('请输入合法的邮箱'));
        }
        // 验证手机号码规则而 
        var checkPhoneNum = (rule, value, callback) => {
            var regPhone = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
            if (regPhone.test(value)) {
                return callback();
            }
            callback(new Error('请输入正确的手机号码'));
        }
        return {
            queryinfo: {
                query: '',
                // 当前的页数
                pagenum: 1,
                // 当前每页显示器显示多少条数据
                pagesize: 2
            },
            userlist: [],
            total: 0,
            // 控制对话框的显示与隐藏 默认隐藏
            addDialogVisible: false,
            // 控住修改对话框 默认隐藏
            EditDialogVisible: false,
            addForm: {
                username: '',
                password: '',
                email: '',
                phonenum: ''
            },
            addRules: {
                username: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                }, {
                    min: 3,
                    max: 10,
                    message: '用户名的长度在3~10个字符之间',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }, {
                    min: 6,
                    max: 16,
                    message: '密码的长度在6~16个字符之间',
                    trigger: 'blur'
                }],
                email: [{
                    required: true,
                    message: '请输入邮箱',
                    trigger: 'blur'
                }, {
                    validator: checkEmail,
                    trigger: 'blur'
                }],
                phonenum: [{
                        required: true,
                        message: '请输入手机号码',
                        trigger: 'blur'
                    },
                    {
                        validator: checkPhoneNum,
                        trigger: 'blur'
                    }
                ]
            },
             //  修改后的数据
            editForm:{
                // username:'',
                // mobile:'',
                // email:''

            },
        //    修改数据验证的规则
        editFormRules:{
             email: [{
                    required: true,
                    message: '请输入邮箱',
                    trigger: 'blur'
                }, {
                    validator: checkEmail,
                    trigger: 'blur'
                }],
                mobile: [{
                        required: true,
                        message: '请输入手机号码',
                        trigger: 'blur'
                    },
                    {
                        validator: checkPhoneNum,
                        trigger: 'blur' 
                    }
                ]
        },
       
        }
    },
    created() {
        this.getUserList();
    },
    methods: {
        async getUserList() {
            const { data: res } = await this.$http.get('users', {
                params: this.queryinfo
            })
            console.log(res);
            if (res.meta.status !== 200) return this.$message.error('获取用户列表失败');
            this.userlist = res.data.users;
            this.total = res.data.total;
        },
        handleSizeChange(newSize) {
            this.queryinfo.pagesize = newSize;
            this.getUserList();
        },
        handleCurrentChange(newpage) {
            this.queryinfo.pagenum = newpage;
            this.getUserList();
        },
        //    监听状态开关的改变
        async userStatueChanged(userinfo) {
            const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            if (res.meta.status !== 200) {
                return
                userinfo.mg_state = !userinfo.mg_state;
                this.$message.error('更新用户信息失败');
            }
            this.$message.success('更新用户信息成功');
        },
        addDialogVisibleClose() {
            this.$refs.addFormRef.resetFields();
        },
        addUser() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return;
                const { data: res } = await this.$http.post('users', this.addForm);
                if (res.meta.status !== 201) {
                    this.$message.error("添加用户信息失败");
                }
                this.$message.success('添加成功');
                //    影藏对话框;
                this.addDialogVisible = false;
                //    重新渲染列表
                this.getUserList();
            })
        },
        // 根据id获取修改信息
       async showEditDialog(id) {
            this.EditDialogVisible = true;
            const {data:res}=await this.$http.get('users/'+id)
              if(res.meta.status!==200) {
                  return this.$message.error('修改失败')
              }                  
            this.editForm=res.data;
             this.EditDialogVisible=true;
        },
        // 监听修改用户对话框的关闭事件、
         editDialogClose(){
            this.$refs.editFormRef.resetFields();
        },
        editFormInfo(){
            this.$refs.editFormRef.validate(async valid=>{
                if(!valid) return 
                const {data:res}=await this.$http.put('users/'+this.editForm.id,{
                    email:this.editForm.email,
                    mobile:this.editForm.mobile
                })
                if(res.meta.status!==200)
                return this.$message.error('更新用户信息失败')
                // 关闭对话框
                this.EditDialogVisible=false;
                // 重新数据刷新列表
                this.getUserList();
                // 提示修改信息成功
                this.$message.success('更新用户信息成功')
            })
        },
       async deleatUserById(id){
        const confirmresult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        console.log(confirmresult);
        if(confirmresult !== 'confirm')
       { return this.$message.info('已取消删除')}
       const {data:res}=await this.$http.delete('users/'+id)
        if(res.meta.status!==200)
        {return this.$message.error('删除失败')}
         this.$message.success('删除成功');
         this.getUserList();
        },
    }
}
</script>
<style lang="less" scoped>

</style>