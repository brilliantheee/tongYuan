import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    // 登录页路由
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login'),
    },

    // {
    //     path: '/',
    //     name: 'map',
    //     component: () => import('@/views/IndexMap'),
    // },
    {
        path: '/',
        name: 'tle',
        component: () => import('@/views/tle'),
    },
    {
        path: '/tle',
        name: 'tle',
        component: () => import('@/views/tle'),
    },
    {
        path: '/index',
        name: 'Index',
        component: () => import('@/views/index'),
    },    
    {
        path: '/indexNew',
        name: 'indexNew',
        component: () => import('@/views/indexNew'),
    },
    {
        path: '/pmap',
        name: 'pmap',
        component: () => import('@/views/pMap'),
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

// 路由守卫：在每次路由切换之前检查用户是否已登录
router.beforeEach((to, from, next) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') || false; // 这里假设登录状态存储在 localStorage 中

    // 如果目标路由不是登录页且未登录，跳转到登录页
    if (to.name !== 'Login' && !isLoggedIn) {
        next({ name: 'Login' });
    } else {
        next(); // 继续路由导航
    }
})

export default router
