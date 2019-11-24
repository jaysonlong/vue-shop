import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由静态引入定义
// import Login from '../views/Login.vue'
// import Home from '../views/Home.vue'
// import Welcome from '../views/Welcome.vue'
// import Users from '../views/user/Users.vue'
// import Rights from '../views/access/Rights.vue'
// import Roles from '../views/access/Roles.vue'
// import Categories from '../views/goods/Categories.vue'
// import Params from '../views/goods/Params.vue'
// import GoodsList from '../views/goods/List.vue'
// import GoodsAdd from '../views/goods/Add.vue'
// import Orders from '../views/order/Orders.vue'
// import Report from '../views/report/Report.vue'

// 路由分组懒加载定义
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/Login.vue')
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/Home.vue')
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../views/Welcome.vue')

const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../views/user/Users.vue')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../views/access/Rights.vue')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../views/access/Roles.vue')

const Categories = () => import(/* webpackChunkName: "Categories_Params" */ '../views/goods/Categories.vue')
const Params = () => import(/* webpackChunkName: "Categories_Params" */ '../views/goods/Params.vue')

const GoodsList = () => import(/* webpackChunkName: "GoodsList_GoodsAdd" */ '../views/goods/List.vue')
const GoodsAdd = () => import(/* webpackChunkName: "GoodsList_GoodsAdd" */ '../views/goods/Add.vue')

const Orders = () => import(/* webpackChunkName: "Orders_Report" */ '../views/order/Orders.vue')
const Report = () => import(/* webpackChunkName: "Orders_Report" */ '../views/report/Report.vue')

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
