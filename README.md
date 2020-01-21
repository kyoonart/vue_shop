## Vue商城后台管理系统开发

### 1.电商业务概述
**客户使用的业务服务**：PC端，小程序，移动web，移动app
**管理员使用的业务服务**：PC后台管理端。
**我完成的功能**：管理用户账号（登录，退出，用户管理，权限管理），商品管理（商品分类，分类参数，商品信息，订单），数据统计（采用Echarts渲染为折线图）
电商后台管理系统采用前后端分离的开发模式
前端项目是基于Vue的SPA（单页应用程序）项目

**前端技术栈:Vue,Vue-Router,Element-UI,Axios,Echarts**
后端技术栈：Node.js,Express,Jwt(模拟session),Mysql,Sequelize(操作数据库的框架)

### 2.项目初始化

A.安装Vue脚手架
B.通过脚手架创建项目
C.配置路由
D.配置Element-UI:在插件中安装，搜索vue-cli-plugin-element
E.配置Axios：在依赖中安装,搜索axios(运行依赖)
F.初始化git仓库
G.将本地项目托管到github

### 3.项目详情

#### 项目结构 

```
├─public                            打包发布文件夹 
├─ App.vue                             项目根组件
├─ main.js                             项目入口js
├─src   
|     └─-- assets                      默认样式表 
|     |        global.css                
|	  └─--  fonts				       图标文件夹一些好看的图标
|     |        demo.css
|     |        iconfont.css
|     |        iconfont.eot
|     |        iconfont.js
|     |        iconfont.svg
|     |        iconfont.ttf
|     |        iconfont.woff
|     └─-  components                 通用组件文件夹
│     |      └─-goods 				  商品管理组件库
│     │      |      Add.vue			  添加商品组件	 
│     │	     |       Cate.vue         商品列表组件
│     │      |      List.vue	      商品列表组件
│     │      |      Params.vue        商品分类组件
│     │      |      Echars.vue        数据统计组件
│     │      └─-order                 订单管理组件
│     │      |      Order.vue         订单列表组件
|     |      |      citydata.js	 	  全国地址文件
│     |      └─power                  商品权限组件库
│     │      |      Rights.vue        权限列表组件 
│     |      |      Roles.vue         角色权限组件
│     |      └─user                   用户有关组件    
│     |      |                                   
│     |      ├─     home.vue           主页组件  
│     │      ├─     Login.vue          登录组件
│     |      ├─     welcome.vue        欢迎页组件        
│     └─-plugins                      Element-ui组件
│     │       element.js                 
│     │
│     └─-router                       路由组件
│     |       index.js				  路由规则组件
|     |
```

##### 一些重要的知识点

+ 添加路由守卫

如果用户没有登录，不能访问/home,如果用户通过url地址直接访问，则强制跳转到登录页面
打开router.js

```javascript
//挂载路由导航守卫,to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作
router.beforeEach((to,from,next)=>{ 
  if(to.path === '/login')
    return next(); 
  //获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr)
    return next('/login')
  next()
})

```

+ 实现退出功能
  在Home组件中添加一个退出功能按钮,给退出按钮添加点击事件，添加事件处理代码如下：

```
export default {
    methods:{
        logout(){
            window.sessionStorage.clear();
            this.$router.push('/login');
        }
    }
}
```

+ axios请求拦截器

后台除了登录接口之外，都需要token权限验证，我们可以通过添加axios请求拦截器来添加token，以保证拥有获取数据的权限
在main.js中添加代码，在将axios挂载到vue原型之前添加下面的代码

```
/请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use(config=>{
  //为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem("token")
  return config
})
```

+ 表单规则验证

```
1).给<el-form>添加属性:rules="rules"，rules是一堆验证规则，定义在script、中
2).在script中添加rules：export default{ data(){return{......, rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ]
}......
3).通过<el-form-item>的prop属性设置验证规则<el-form-item label="活动名称" prop="name">
```

```
 this.$refs.addressFormRef.resetFields()  // //对话框关闭之后，重置表单数据
```

+ axios设置根路径

```
导入axios以发送ajax请求
打开main.js，import axios from 'axios';
设置请求的根路径：axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
挂载axios：Vue.prototype.$http = axios;
```

+ 实现更新用户状态
  当用户点击列表中的switch组件时，用户的状态应该跟随发生改变。
  A.首先监听用户点击switch组件的事件，并将作用域插槽的数据当做事件参数进行传递

```
<el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
```

+ 使用插件展示数据
  使用第三方插件vue-table-with-tree-grid展示分类数据
      1).在vue 控制台中点击依赖->安装依赖->运行依赖->输入vue-table-with-tree-gird->点击安装
      2).打开main.js，导入vue-table-with-tree-grid
      import TreeTable from 'vue-table-with-tree-grid'
      .....
      Vue.config.productionTip = false
+ ![1FImVA.jpg](https://s2.ax1x.com/2020/01/21/1FImVA.jpg)



+ 完成图片上传
  使用upload组件完成图片上传
  在element.js中引入upload组件，并注册
  因为upload组件进行图片上传的时候并不是使用axios发送请求
  所以，我们需要手动为上传图片的请求添加token，即为upload组件添加headers属性

+ 使用富文本插件
  想要使用富文本插件vue-quill-editor，就必须先从依赖安装该插件
  引入并注册vue-quill-editor，打开main.js，编写如下代码

  ```
  //导入vue-quill-editor（富文本编辑器）
  
  import VueQuillEditor from 'vue-quill-editor'
  
  //导入vue-quill-editor的样式
  
  import 'quill/dist/quill.core.css'
  
  import 'quill/dist/quill.snow.css'
  
  import 'quill/dist/quill.bubble.css'
  
  ......
  
  //全局注册组件
  
  Vue.component('tree-table', TreeTable)
  
  //全局注册富文本组件
  
  Vue.use(VueQuillEditor)
  ```

+ 安装lodash，把addForm进行深拷贝

​    将addForm进行深拷贝，避免goods_cat数组转换字符串之后导致级联选择器报错

```
//官方推荐将lodash导入为_
import _ from 'lodash'

const form = _.cloneDeep(xxx)  //深拷贝语法

```

+ 项目优化
  实现步骤：
  A.生成打包报告，根据报告优化项目
  B.第三方库启用CDN
  C.Element-UI组件按需加载
  D.路由懒加载
  E.首页内容定制

+ 添加进度条

给项目添加进度条效果，先打开项目控制台，打开依赖，安装nprogress
打开main.js，编写如下代码

```
//导入进度条插件
import NProgress from 'nprogress'
//导入进度条样式
import 'nprogress/nprogress.css'
.....
//请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use(config => {
  //当进入request拦截器，表示发送了请求，我们就开启进度条
  NProgress.start()
  //为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem("token")
  //必须返回config
  return config
})
//在response拦截器中，隐藏进度条
axios.interceptors.response.use(config =>{
  //当进入response拦截器，表示请求已经结束，我们就结束进度条
  NProgress.done()
  return config
})
```

+ 修改webpack的默认配置
  默认情况下，vue-cli 3.0生成的项目，隐藏了webpack配置项，如果我们需要配置webpack
  需要通过vue.config.js来配置。
  在项目根目录中创建vue.config.js文件

+ 项目上线
  通过node创建服务器
  在vue_shop同级创建一个文件夹vue_shop_server存放node服务器
  使用终端打开vue_shop_server文件夹，输入命令 npm init -y
  初始化包之后，输入命令 npm i express -S
  打开vue_shop目录，复制dist文件夹，粘贴到vue_shop_server中
  在vue_shop_server文件夹中创建app.js文件,编写代码如下：

```
const express = require('express')

const app = express()

app.use(express.static('./dist'))

app.listen(8080,()=>{
    console.log("server running at http://127.0.0.1:8080")
})
```

+ 使用pm2管理应用
  打开vue_shop_server文件夹的终端，输入命令：npm i pm2 -g
  使用pm2启动项目，在终端中输入命令：pm2 start app.js --name 自定义名称
  查看项目列表命令：pm2 ls
  重启项目：pm2 restart 自定义名称
  停止项目：pm2 stop 自定义名称
  删除项目：pm2 delete 自定义名称