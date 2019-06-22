import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("./views/login.vue")
    },
    {
      path: "/dashboard",
      name: "dashboard",
      redirect: "/home",
      component: () => import("./views/dashboard.vue"),
      children: [
        {
          path: "/home",
          name: "home",
          component: () => import("./views/home.vue")
        },
        {
          path: "/myposts",
          name: "myposts",
          component: () => import("./views/myposts.vue")
        }
      ]
    }
  ]
});
