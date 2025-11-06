import { createRouter, createWebHistory } from 'vue-router'

// 懒加载路由组件
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const UserProfile = () => import('../views/UserProfile.vue')
const Store = () => import('../views/Store.vue')
const Library = () => import('../views/Library.vue')
const Home = () => import('../views/Home.vue')
const Admin = () => import('../views/Admin.vue')
const AdminTools = () => import('../views/AdminTools.vue')
const DownloadClients = () => import('../views/DownloadClients.vue')
const AuctionHouse = () => import('../views/AuctionHouse.vue')
const Community = () => import('../views/Community.vue')
const Developer = () => import('../views/Developer.vue')
const AuditTeam = () => import('../views/AuditTeam.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/store',
    name: 'Store',
    component: Store
  },
  {
    path: '/library',
    name: 'Library',
    component: Library,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/tools',
    name: 'AdminTools',
    component: AdminTools,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/downloads',
    name: 'DownloadClients',
    component: DownloadClients
  },
  {
    path: '/auction',
    name: 'AuctionHouse',
    component: AuctionHouse
  },
  {
        path: '/community',
        name: 'Community',
        component: Community
      },
      {
        path: '/developer',
        name: 'Developer',
        component: Developer
      },
      {
        path: '/audit-team',
        name: 'AuditTeam',
        component: AuditTeam
      }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))
  const isAuthenticated = user !== null
  const isAdmin = user && user.roles && user.roles.includes('admin')
  
  // 检查是否需要认证
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: 'Login' })
    return
  }
  
  // 检查是否需要管理员权限
  if (to.matched.some(record => record.meta.requiresAdmin) && !isAdmin) {
    // 如果是管理员页面但用户不是管理员，跳转到首页
    next({ name: 'Home' })
    return
  }
  
  next()
})

export default router