import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { auth } from "@/server/firebase";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/3_widgets/login/LoginForm.vue"),
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("@/3_widgets/login/SignupForm.vue"),
  },
  {
    path: "/home",
    component: () => import("@/3_widgets/layout/AppLayout.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/2_pages/PageHome.vue"),
      },
      {
        path: "/chat/:id",
        name: "chat",
        component: () => import("@/2_pages/PageChat.vue"),
      },
    ],
  },
  {
    path: "/",
    redirect: "/login",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = auth.currentUser;

  if (requiresAuth && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;
