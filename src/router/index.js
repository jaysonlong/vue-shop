import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由静态引入定义
// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
// import Users from '../components/user/Users.vue'
// import Rights from '../components/access/Rights.vue'
// import Roles from '../components/access/Roles.vue'
// import Categories from '../components/goods/Categories.vue'
// import Params from '../components/goods/Params.vue'
// import GoodsList from '../components/goods/List.vue'
// import GoodsAdd from '../components/goods/Add.vue'
// import Orders from '../components/order/Orders.vue'
// import Report from '../components/report/Report.vue'

// 路由分组懒加载定义
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Welcome.vue')

const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/Users.vue')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/access/Rights.vue')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/access/Roles.vue')

const Categories = () => import(/* webpackChunkName: "Categories_Params" */ '../components/goods/Categories.vue')
const Params = () => import(/* webpackChunkName: "Categories_Params" */ '../components/goods/Params.vue')

const GoodsList = () => import(/* webpackChunkName: "GoodsList_GoodsAdd" */ '../components/goods/List.vue')
const GoodsAdd = () => import(/* webpackChunkName: "GoodsList_GoodsAdd" */ '../components/goods/Add.vue')

const Orders = () => import(/* webpackChunkName: "Orders_Report" */ '../components/order/Orders.vue')
const Report = () => import(/* webpackChunkName: "Orders_Report" */ '../components/report/Report.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    redirect: '/welcome',
    component: Home,
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Categories },
      { path: '/params', component: Params },
      { path: '/goods', component: GoodsList },
      { path: '/goods/add', component: GoodsAdd },
      { path: '/orders', component: Orders },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 权限控制导航守卫
router.beforeEach((to, from, next) => {
  const tokenStr = window.sessionStorage.getItem('token')

  if (to.path === '/login') {
    if (tokenStr) return next('/home')
    next()
  } else {
    if (!tokenStr) return next('/login')
    next()
  }
})

export default router
