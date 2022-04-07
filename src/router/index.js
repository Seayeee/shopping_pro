import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/login'
import home from '../components/home'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      //重定向
      path:'/',
      redirect:'/login'
    },
    {
      path: '/login',
      component:login
      
    },
    {
        path:'/home',
        component:home
    }
  ]
})

//挂载路由导航守卫
//对路由器的每个路由进行判断，to表示用户输入的网址（即将要访问的），
//from表示从哪个路径跳转过来
//next 是函数，表示放行
//如果to登录页，直接next放行
//否则，判断是否有token，如果有则放行，没有则路由定向到/login
router.beforeEach((to,from,next)=>{
  if(to.path === '/login') return next();
  const tokenstr = window.sessionStorage.getItem('token');
  if(!tokenstr) return next('/login');
  next();
}
)
export default router;