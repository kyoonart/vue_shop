<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item> 订单列表</el-breadcrumb-item>
        </el-breadcrumb> 
        <!-- 卡片视图区域 -->
        <el-card>
        <el-row>
            <el-col :span="8">
                <el-input placeholder="请输入内容">
                    <el-button slot="append" icon="el-icon-search">
                    </el-button>
                </el-input>
            </el-col>
        </el-row>
            <el-table :data="orderlist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label='订单编号' prop="order_number"></el-table-column>
                <el-table-column label='订单价格' prop="order_price"></el-table-column>
                <el-table-column label='是否付款' prop="pay_status">
                    <template slot-scope="scope">
                     <el-tag v-if="scope.row.par_status==='1'" type="success">已付款</el-tag>
                     <el-tag v-else type="danger">未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label='是否发货' prop="is_send"></el-table-column>
                <el-table-column label='下单时间' prop="create_time">
                    <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
                </el-table-column>
                <el-table-column label='操作'>
                   <template >
                        <el-button type="primary"  size='mini' icon="el-icon-edit" @click="showBox">
                    </el-button>
                        <el-button  type="success" size='mini' icon="el-icon-location" @click="showProgressBox">
                    </el-button>
                   </template>

                </el-table-column>
        
            </el-table>
        </el-card>
                 <!-- 分页功能 -->
              <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total=total background>
    </el-pagination>
    <!-- 弹出对话框  修改地址-->
    <el-dialog
  title="修改地址"
  :visible.sync="addressVisible"
  width="50%" 
  :before-close="handleClose"
  @close='addressClose'>
    <el-form :model="addressForm" ref="addressRef" :rules="addressRules" label-width="100px" > 
        <el-form-item label="省市区/县" prop="address1">
       <el-cascader v-model="addressForm.address1" :options="cityDate" expand-trigger='hover'></el-cascader>
    </el-form-item>
     <el-form-item label="详细地址" prop="address2">
        <el-input v-model="addressForm.address2"></el-input>
    </el-form-item>
    </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addressVisible = false">取 消</el-button>
    <el-button type="primary" @click="addressVisible = false">确 定</el-button>
  </span>
</el-dialog>
<!-- 展示物流进度的对话框 -->
<el-dialog
  title="物流进度"
  :visible.sync="pressVisible"
  width="50%" 
  :before-close="handleClose"
  @close='addressClose'>
   <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in pressInfo"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
  
</el-dialog>
    </div>
</template>
<script>
import cityDate from './citydata'
export default {
    data(){
        return {
            queryinfo:{
                query:'',
                pagenum:1,
                pagesize:10
            },
            orderlist:[],
             total:0,
            //  控制修改地址的对话框的显示与隐藏
             addressVisible:false ,
            //  控制物流对话框的显示与隐藏
            pressVisible:false,
            pressInfo:[],
             addressForm:{
                 address1:[],
                 address2:''
             },
             addressRules:{
                address1: [{
                    required: true,
                    message: '请选择',
                    trigger: 'blur'
                }],
                address2: [{
                    required: true,
                    message: '请输入详细地址',
                    trigger: 'blur'
                }],

        },
        // 全国地址
        cityDate:cityDate,
        }
    },
    created(){
        this.getOrderList()
    },
    methods:{
            async getOrderList(){
                const {data:res}=await this.$http.get('orders',{
                    params:this.queryinfo
                })
                if(res.meta.status!==200)return this.$message.error('请求失败')
                this.$message.success('请求成功')
                this.orderlist=res.data.goods;
                this.total=res.data.total
            }   ,
              handleSizeChange(newsize){
            this.queryinfo.pagesize=newsize;
            this.getOrderList() 
        },
        handleCurrentChange(newpage){
            this.queryinfo.pagenum=newpage
            this.getOrderList()
        },
        showBox(){
            this.addressVisible=true
        },
        addressClose(){
            this.$refs.addressRef.resetFields()
        },
      async  showProgressBox(){
          const {data:res} =await this.$http.get('/kuaidi/1106975712662')
          if(res.meta.status!==200) return this.$message.error('查下物流信息失败')
          this.pressInfo=res.data;
          this.pressVisible=true
        }
    },
}
</script>
<style lang="less" scoped>
.el-cascader{
    width: 100%
}
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';
</style>