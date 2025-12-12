import { createRouter, createWebHistory } from 'vue-router'

// 鎳掑姞杞借矾鐢辩粍浠?const Login = () => import('../views/Login.vue')
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
const DHTManager = () => import('../views/DHTManager.vue')
const ForgotPassword = () => import('../views/ForgotPassword.vue')
const ResetPassword = () => import('../views/ResetPassword.vue')

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
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword
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
      },
      {
        path: '/dht-manager',
        name: 'DHTManager',
        component: DHTManager,
        meta: { requiresAuth: true, requiresAdmin: true }
      }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 璺敱瀹堝崼
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))
  const isAuthenticated = user !== null
  const isAdmin = user && user.roles && user.roles.includes('admin')
  
  // 妫€鏌ユ槸鍚﹂渶瑕佽璇?  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({ name: 'Login' })
    return
  }
  
  // 妫€鏌ユ槸鍚﹂渶瑕佺鐞嗗憳鏉冮檺
  if (to.matched.some(record => record.meta.requiresAdmin) && !isAdmin) {
    // 濡傛灉鏄鐞嗗憳椤甸潰浣嗙敤鎴蜂笉鏄鐞嗗憳锛岃烦杞埌棣栭〉
    next({ name: 'Home' })
    return
  }
  
  next()
})

export default router
