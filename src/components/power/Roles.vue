<template>
    <div>   
        <el-breadcrumb separator-class="el-icon-arrow-right">    
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>   
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>   
            <el-breadcrumb-item> 角色列表</el-breadcrumb-item>
        </el-breadcrumb>   
        <!-- 卡片视图 -->   
        <el-card>  
            <el-row>   
                <el-col>   
                    <el-button type="primary" @click="addDialogVisible=true">   
                        添加角色    
                    </el-button>   
                </el-col>   
            </el-row>   
            <!-- 角色列表区域 -->   
            <el-table :data="rolesLists" border stripe> 
                <!-- 展开列 -->    
                <el-table-column type="expand">
                    <template slot-scope="scope">
                            <el-row :class="['bdbottom',i1===0? 'bdtop': '','center']"  v-for="(item1,i1) in scope.row.children" :key="item1.id">   
                                <!-- 一级权限 -->   
                                <el-col :span="5"><el-tag closable @close="removeRightById(scope.row,item1.id)"> {{item1.authName}}</el-tag>   
                                <i class="el-icon-caret-right"></i></el-col>  
                                <!-- 二级权限 -->   
                                 <el-col :span="19">   
                                     <el-row  :class="[i2===0?'' :'bdtop','center']" v-for="(item2,i2) in item1.children" :key="item2.id">   
                                         <el-col span="6"><el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">
                                             {{item2.authName}}
                                             </el-tag> 
                                                <i class="el-icon-caret-right"></i></el-col>
                                         <el-col span="18">
                                             <el-tag type="warning" v-for='(item3) in item2.children' :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">
                                                 {{item3.authName}}
                                             </el-tag>
                                         </el-col>
                                     </el-row>  
                                 </el-col>
                        </el-row>
    
                            <!-- <pre>{{scope.row}}</pre> -->
</template>
                </el-table-column>  
                <el-table-column label="角色名称" prop="roleName"></el-table-column>   
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>   
                <el-table-column label="操作">   
<template slot-scope="scope">
    <el-button type="primary" icon="el-icon-edit" v-if="scope" size='small' @click="showEditDialog(scope.row.id)">  
        编辑</el-button>   
    <el-button type="danger" icon="el-icon-deleate" size='small' @click="deleatUserById(scope.row.id)">删除</el-button> 
    <el-button type="warning" icon="el-icon-setting" size='small' @click="showSetRightDialog(scope.row)">分配权限</el-button>
</template>
             </el-table-column>
             </el-table>  
        <!--添加角色 -->
        <el-dialog
  title="添加角色"
  :visible.sync="addDialogVisible"
  @close="addDialogVisibleClose"
  width="50%">
  <!-- 内容的主体区域 -->
  <el-form :model="addForm" :rules="addRules" ref="addFormRefs" label-width="70px">
  <el-form-item label="角色名称" prop="roleName">
    <el-input v-model="addForm.roleName"></el-input>
  </el-form-item>
   <el-form-item label="描述" prop="roleDesc">
    <el-input v-model="addForm.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
  </span>
</el-dialog>
<!-- 编辑角色信息 -->
<el-dialog
  title="修改用户"
  :visible.sync="EditDialogVisible"
  width="50%"
  @close="editDialogClose">
 <el-form :model="editForm" :rules="editFormRules" ref="editFormRefs" label-width="70px">
  <el-form-item label="用户名" >
    <el-input v-model="editForm.roleName" disabled></el-input>
  </el-form-item>
 <el-form-item label="描述" prop="roleDesc">
    <el-input v-model="editForm.roleDesc"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="EditDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editFormInfo">确 定</el-button>
  </span>
  </el-dialog>
  <!-- 分配权限对话框 -->
  <el-dialog
  title="分配权限"
  :visible.sync="setRightdialogVisible"
  width="30%" @close="setRightdialogClose">
  <!-- 树形控件0 -->
  <el-tree :data="rightLists" :props="treeProps" show-checkbox node-key="id" default-expand-all
  :default-checked-keys="defkeys" ref='treeRefs'></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
  </el-card>  
    </div>
</template>

<script>
export default {
    data() {
        return {
            rolesLists: [],
            // 所有权限数组
            rightLists:[],
            // 树
            treeProps:{
                label:'authName',
                children:'children'
            },
            // 树结构默认选择中的节点的Id值
            defkeys:[],
            roleId:'',
            // 默认隐藏弹出框
            addDialogVisible: false,
            EditDialogVisible: false,
            // 控制分配权限对话框
            setRightdialogVisible: false,
            addForm: {
                roleName: '',
                roleDesc: ''
            },
            editForm: {},
            editFormRules: {
                roleDesc: [{
                    required: true,
                    message: '请输入角色描述',
                    trigger: 'blur'
                }, {
                    min: 3,
                    max: 15,
                    message: '角色描述的长度在3~10个字符之间',
                    trigger: 'blur'
                }]
            },
            addRules: {
                roleName: [{
                    required: true,
                    message: '请输入角色描述',
                    trigger: 'blur'
                }, {
                    min: 3,
                    max: 10,
                    message: '角色的长度在3~10个字符之间',
                    trigger: 'blur'
                }],
                roleDesc: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                }, {
                    min: 3,
                    max: 15,
                    message: '角色描述的长度在3~10个字符之间',
                    trigger: 'blur'
                }],
            }
        }
    },
    created() {
        this.getroleLists()
    },
    methods: {
        async getroleLists() {
            const { data: res } = await this.$http.get('roles');
            if (res.meta.status !== 200) {
                return this.$message.error('获取失败');
            }
            this.rolesLists = res.data
        },
        addDialogVisibleClose() {
            this.$refs.addFormRefs.resetFields()
        },
        editDialogClose() {
            this.$refs.editFormRefs.resetFields()
        },
        async addRole() {
            this.$refs.addFormRefs.validate(async valid => {
                //  console.log(valid);
                if (!valid) return;
                const { data: res } = await this.$http.post('roles', this.addForm);
                if (res.meta.status !== 201) {
                    this.$message.error("添加用户信息失败");
                }
                this.$message.success('添加成功');
                //    影藏对话框;
                this.addDialogVisible = false;
                //    重新渲染列表
                this.getroleLists();
            })
        },
        async showEditDialog(id) {
            this.EditDialogVisible = true;
            console.log(id);

            const { data: res } = await this.$http.get('roles/' + id)
            if (res.meta.status !== 200) {
                return this.$message.error('修改失败')
            }
            this.editForm = res.data;
            this.EditDialogVisible = true;
        },
        editFormInfo() {
            this.$refs.editFormRefs.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.put('roles/' + this.editForm.id, {
                    roleName: this.editForm.roleName,
                    roleDesc: this.editForm.roleDesc
                })
                console.log(this.editForm.roleName);
                if (res.meta.status !== 200) return this.$message.error('修改信息失败');
                this.EditDialogVisible = false; //关闭
                this.getroleLists(); //重新渲染
                this.$message.success('修改信息成功');
            })
        },
        async deleatUserById(id) {
            const confirmresult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            console.log(confirmresult);
            if (confirmresult !== 'confirm') { return this.$message.info('已取消删除') }
            const { data: res } = await this.$http.delete('roles/' + id)
            if (res.meta.status !== 200) { return this.$message.error('删除失败') }
            this.$message.success('删除成功');
            this.getroleLists();
        },
        async removeRightById(role, rightId) {
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err);
            if (confirmResult !== 'confirm') return this.$message.info('取消了删除')
            const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
            if (res.meta.status !== 200) return this.$message.error('删除权限失败')
            this.$message.success('删除权限成功')
            role.children = res.data;
            // this.getroleLists(); 会重新渲染整个列表 不建议使用
        },
        async showSetRightDialog(role) {
            this.roleId=role.id 
            const { data: res } = await this.$http.get('rights/tree')
            if (res.meta.status !== 200) { return this.$message.error('获取失败') }
                this.rightLists=res.data;
                // 递归调用获取权限
                this.getdefkeys(role,this.defkeys);
                this.setRightdialogVisible=true; 
        },
        // 通过递归的形式,获取角色下所有的三级权限的id并保存到defkeys数组中
        getdefkeys(node,arr){
            // 如果当前节点不包含children属性则的三级节点
            if(!node.children)
            return arr.push(node.id)
            node.children.forEach(item => {
                this.getdefkeys(item,arr);     
            });
        },
        // 监听分配权限 关闭后清空已保存的权限
        setRightdialogClose(){
            this.defkeys.length=0;
        },
        // 点击分配权限
      async  allotRights(){
           const keys=[...this.$refs.treeRefs.getCheckedKeys(),
           ...this.$refs.treeRefs.getHalfCheckedKeys()] ;
           console.log(keys);
           const idStr=keys.join(',');
           console.log(idStr);
       const {data:res}= await this.$http.post(`roles/${this.roleId})/rights`,{rids: idStr});
       console.log(res);
        
           if(res.meta.status!==200) return this.$message.error('分配权限失败');
           this.$message.success('分配权限成功');
           this.getroleLists();
           this.setRightdialogVisible=false;
        }   
        }
}
</script>
<style lang="less">
.el-tag {
    margin: 8px;
}

.bdtop {
    border-top: 1px solid #ccc;
}

.bdbottom {
    border-bottom: 1px solid #ccc;
}

.center {
    display: flex;
    align-items: center;
}
</style>