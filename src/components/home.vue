<template>
<el-container class="home-container">
    <!-- 头部区域 -->
  <el-header><div>
      <img src="../assets/heima.png" alt="">
      <span>电商后台管理系统</span>
      </div> <el-button type="info" @click="exit">退出</el-button></el-header>
  <!-- 页面主体区域 -->
  <el-container>
<!--侧边栏 -->
    <el-aside :width="iscollapse?'64px':'200px'" >
        <!--侧标栏区域  -->
        <div class="togglebutton" @click="toggleCollapse">|||</div>
         <el-menu
      background-color="#313743 "
      text-color="#fff"
       active-text-color="#2e94fc"
      unique-opened
      :collapse="iscollapse"
      :collapse-transition="false"
      router
      :default-active="activePath">
      <!-- 一级菜单 -->
      <el-submenu :index="item.id+''" v-for="item in menulists" :key="item.id">
          <!-- 一级菜单模板区域 -->
        <template slot="title">
            <!-- 一级菜单图标 -->
          <i :class="icons[item.id]">
          </i>
          <!-- 一级菜单文本 -->
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item :index="'/' + subitem.path" v-for="subitem in item.children" :key="subitem.id"
        @click="saveNavState('/' + subitem.path)">
            <template slot="title">
            <!-- 二级菜单图标 -->
          <i class="el-icon-menu"></i>
          <!-- 二级菜单文本 -->
          <span>{{subitem.authName}}</span>
        </template></el-menu-item>  
       
      </el-submenu>
    
    </el-menu></el-aside>
<!-- 右侧肢体区域 -->
    <el-main><router-view></router-view></el-main>

  </el-container>
 </el-container>
 </template>
<script>
export default {
    created(){
  this.getMenus();
  this.activePath=window.sessionStorage.getItem('activePath');
    },
    data(){
        return{
            menulists:[],
            icons:{
                '125':'iconfont icon-user',
                '103':'iconfont icon-tijikongjian',
                '101':'iconfont icon-shangpin',
                '102':'iconfont icon-danju',
                '145':'iconfont icon-baobiao'
            },
            iscollapse:'false',
            activePath:'',
        }
    },
    methods:{
        exit(){
            window.sessionStorage.clear();
            this.$router.push('/login');
        },
        async getMenus(){
            const {data:res}=await this.$http.get('menus');
            if(res.meta.status!==200) return this.$message.error('res.meta.msg');
            this.menulists=res.data;
            console.log(res);
        },
        // 点击按钮 切换菜单的折叠与展开

        toggleCollapse(){
            this.iscollapse=!this.iscollapse;
        },
        saveNavState(activePath){
            window.sessionStorage.setItem('activePath',activePath);
            this.activePath=activePath;

        }
    }
} 
</script>
<style lang="less" scoped>
.home-container{
    height: 100%;
}
.el-header{
    background-color: #363d40;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    >div{
        display: flex;
        align-items: center;
        span{
            margin-left: 15px;

        }
    }
}
.el-aside{
    background-color: #313743;
    .el-menu{
        border-right: none;
    }
}
.main{
    background-color: #dbdfe3;
}
.iconfont{
    margin-right: 10px
}
.togglebutton{
    background-color: #454f61;
     font-size: 10px;
     text-align: center;
     line-height: 24px;
     color: #fff;
     height: 24px;
     letter-spacing: 0.2em;
}
</style>    