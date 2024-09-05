import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("@/3_widgets/layout/AppLayout.vue"),
    children: [
      {
        path: "/",
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
