<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item> 
            <el-breadcrumb-item> 添加商品</el-breadcrumb-item>
        </el-breadcrumb>
       <!-- 卡片视图 -->
        <el-card>
            <!-- 提示信息区域 --> 
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false"> 
            </el-alert>
            <!-- 步骤条 -->
     <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>  
                <el-step title="商品内容"></el-step>   
                <el-step title="完成"></el-step>  
            </el-steps>    
            <!-- 左侧导航栏 --> 
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width='100px' label-position="top">
                <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave='beforeTabLeave' @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">  
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price"> 
                            <el-input v-model="addForm.goods_price" type="number"></el-input>  
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight"></el-input> 
                        </el-form-item>   
                        <el-form-item label="商品数量" prop="goods_number">  
                            <el-input v-model="addForm.goods_number"></el-input>  
                        </el-form-item>   
                        <el-form-item label="商品分类" prop="goods_cat">   
                            <el-cascader expand-trigger="hover" :options="goodsList" :props="cateProps  " v-model="addForm.goods_cat" @change="handleChange"> 
                            </el-cascader>  
                        </el-form-item>  
                    </el-tab-pane>  
                    <el-tab-pane label="商品参数" name="1"> 
                    <el-form-item :label="item.attr_name" v-for="item in manyTableDate" :key="item.attr_id">  
                            <el-checkbox-group v-model="item.attr_vals">   
                                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>   
                            </el-checkbox-group>   
                        </el-form-item>  
                    </el-tab-pane>  
                    <el-tab-pane label="商品属性" name="2">  
                        <el-form-item :label="item.attr_name" v-for="item in onlyTableDate" :key="item.attr_id"> 
                            <el-input v-model="item.attr_vals"></el-input>
                    </el-form-item>   
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">   
                        <el-upload   :on-success="handleSuccess" class="upload-demo" action="http://127.0.0.1:8888/api/private/v1/upload" :on-remove="handleRemove" list-type="picture" :headers="headerObj" :on-preview="handlePreview">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>  
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                      <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                      <!-- 添加商按钮 -->
                      <el-button type="primary" class="Addbtn" @click="addGoods">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>  
        </el-card> 
          <!-- 图片预览框  -->
          <el-dialog class="preView"
  title="图片预览"
  :visible.sync="previewDialogVisible"
  width="50%"
  >
 <img :src="previewPath" alt="" class="previewPic">
</el-dialog>
    </div>
</template>
<script>
import _ from 'lodash'
export default {
    data() {
        return {
            activeIndex: '0',
            addForm: {
                goods_name: '',
                goods_number: 0,
                goods_weight: '',
                goods_price: 0,
                goods_cat: [],
                  // 图片路径
                 pics:[],
                //  商品详情
                 goods_introduce:'',
                 attrs:[]

            },      
            // 商品分类列表数据
            goodsList: [],
            addFormRules: {
                goods_name: [{
                    required: true,
                    message: '请输入商品名称',
                    trigger: 'blur'
                }],
                goods_number: [{
                    required: true,
                    message: '请输入商品数量',
                    trigger: 'blur'
                }],
                goods_weight: [{
                    required: true,
                    message: '请输入商品重量',
                    trigger: 'blur'
                }],
                goods_price: [{
                    required: true,
                    message: '请输入商品价格',
                    trigger: 'blur'
                }],
                goods_cat: [{
                    required: true,
                    message: '请输入商品价格',
                    trigger: 'blur'
                }],
            },
            cateProps: {
                label: 'cat_name',
                value: 'cat_id',
                children: 'children'
            },
            // 动态参数列表数据
            manyTableDate: [],
            //静态参数列表
            onlyTableDate: [],
            // 
            headerObj:{
                Authorization:window.sessionStorage.getItem('token')
            },
            previewPath:'',
            previewDialogVisible:false,
          
        }
    },
    created() {
        this.getCatelist()
    },
    methods: {
        async getCatelist() {
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200) return this.$message.error('请求失败')
            this.goodsList = res.data;
        },
        // 级联选择器发生变化会触发这个选择器、
        handleChange() {
            if (this.addForm.goods_cat.length !== 3) this.addForm.goods_cat = [];

        },
        // 控制切换的函数 只有选择了第三级标签才能切换
        beforeTabLeave(activeName, oldActiveName) {
            if (oldActiveName = '0' && this.addForm.goods_cat.length !== 3) {
                this.$message.error('请先选择商品分类')
                return false;
            }
        },
        async tabClicked() {
            if (this.activeIndex === '1') {
                const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: "many" } })
                if (res.meta.status !== 200) return this.$message.error('请求失败')
                console.log(res);
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',');
                })
                this.manyTableDate = res.data;
            } else if (this.activeIndex === '2') {
                const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: "only" } })
                if (res.meta.status !== 200) return this.$message.error('请求失败')
                console.log(res);
                this.onlyTableDate = res.data;
            }
        },
        // 预览图片
        handlePreview(file){
            // 拿到图片地址
            this.previewPath=file.response.data.url;
            // 弹出图片预览框
            this.previewDialogVisible=true;
        },
        // 移除图片的操作
        handleRemove(file){
            // 1、获取将要删除的图片的路径
            const filePath=file.response.data.tmp_path;
            // 2 知道索引
            let i =this.addForm.pics.findIndex(x=>
                x.pic === filePath
            )
            this.addForm.pics.splice(i,1);
            console.log(this.addForm);
            
            },
        handleSuccess(response){
        let picInfo={pic:response.data.tmp_path}
       this.addForm.pics.push(picInfo)
       console.log(this.addForm);
       
        },
        addGoods(){
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid){
                    return this.$message.error('请填写必要的表单数据')
                }
                // 执行添加事件的业务逻辑
                // 此时不能直接将addForm数组表单数据转化为字符串 因为级联选择框规定数据必须是数组类型
                // 所以可以进行深拷贝 把数据拿一份出来 再操作
                 const form=_.cloneDeep(this.addForm);
                 form.goods_cat=form.goods_cat.join(',')
                //  处理动态参数和静态属性
                this.manyTableDate.forEach(item=>{
                    const newInfo={
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals.join('')
                    };
                    this.addForm.attrs.push(newInfo)
                })
                
                   this.onlyTableDate.forEach(item=>{
                    const newInfo={
                        attr_id:item.attr_id,
                        attr_value:item.attr_vals
                    };
                    this.addForm.attrs.push(newInfo)
                })
                form.attrs=this.addForm.attrs
                console.log(form);
                // 发起请求添加数据
            const {data:res}=await this.$http.post('goods',form)
            if(res.meta.status!==201) return this.$message.error('添加商品失败')
            this.$message.success('添加商品成功')
            this.$router.push('/goods')
                 
            })
        }

    },
    computed: {
        cateId() {
            if (this.addForm.goods_cat.length === 3) {
                return this.addForm.goods_cat[2]
            }
            return null
        }
    }
}
</script>
<style lang="less" scoped>
.el-steps {
    margin-top: 15px;
    margin-left: 35px
}

.el-tabs {
    margin-top: 10px
}

.el-checkbox {
    margin: 0 8 px 0 0 !important;
}
.previewPic{
    width: 100%;
}

.Addbtn{
margin-top: 10px;
float:right;
}

</style>