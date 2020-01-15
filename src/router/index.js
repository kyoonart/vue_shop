import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/home.vue'


Vue.use(VueRouter)

const router = new VueRouter({
        routes: [
            { path: '/', redirect: '/login' },
            { path: '/login', component: Login },
            { path: '/home', component: Home }
        ]
    })
    // 路由守卫控制访问权限
    // to将要访问的地址
    // from代表从哪个路径而来
    // next()放行 next('/login')强制跳转
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next();
    // 拿到保存的token值 判断是否已经登录
    const tokenstr = window.sessionStorage.getItem('token')
    if (!tokenstr) return next('/login');
    next();
})


export default router