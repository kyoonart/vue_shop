<template>
    <div>
  <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item> 商品列表</el-breadcrumb-item>
        </el-breadcrumb> 
        <!-- 卡片视图 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span='8'>
                    <el-input placeholder="请输入内容" v-model="queryinfo.query" clearable @clear='getGoodslist'>
                        <el-button slot="append" icon="el-icon-search" @click="getGoodslist">
                        </el-button>
                    </el-input>
                </el-col>
                 <el-col :span='4'>
                     <el-button type="primary" @click="goAddpage">
                         添加商品
                     </el-button>
                 </el-col>
            </el-row>
            <!-- 表格区域 -->
            <el-table :data="goodslist" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="70px"> </el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="140px">
                     <template slot-scope="scope">
                    {{ scope.row.add_time | dateFormat}}
                </template></el-table-column>
               
                <el-table-column label="操作">
                     <template slot-scope="scope">
                        <el-button type="primary" icon='el-icon-edit' size='mini'>编辑</el-button>
                        <el-button type="danger" icon='el-icon-delete' size='mini' @click="removeById(scope.row.goods_id)">删除</el-button>
                      
                     </template>
                 </el-table-column>
            </el-table>
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
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            queryinfo:{
                query:'',
                pagenum:1,
                pagesize:10,
            },
            // 商品数据
            goodslist:[],
            // 总数据条数
            total:0,
        }
    },
    created(){
        this.getGoodslist()
    },
    methods:{
        async getGoodslist(){
            const  {data:res} =await this.$http.get('goods',{params:this.queryinfo})
            if(res.meta.status!==200) return this.$message.error('请求失败')
                this.goodslist=res.data.goods;
                this.total=res.data.total
        },
        handleSizeChange(newsize){
            this.queryinfo.pagesize=newsize;
            this.getGoodslist() 
        },
        handleCurrentChange(newpage){
            this.queryinfo.pagenum=newpage
            this.getGoodslist()
        },
      async removeById(id){
        const confirmResult =await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmResult!=='confirm') {return this.$message.info('已取消删除')}
          const {data:res}=await this.$http.delete(`goods/${id}`)
        if(res.meta.status!==200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
          this.getGoodslist()
        },
        goAddpage(){
            this.$router.push('/goods/add')
        }
        
    },

}
</script>
<style lang="less" scoped> 

</style>