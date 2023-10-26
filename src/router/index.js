import { createRouter, createWebHistory } from "vue-router";
import { useAuthUser } from "@/stores/Auth/authUser";
import { URLS } from "@/utils/urls";
import { current } from "tailwindcss/colors";
import { decode } from "@/utils/jwtDecode";
import { utcTimeDiff } from "@/utils/formatters";
import MainLayout from "@/layouts/main/Main.vue";
import { SuperUser,Admin } from "@/utils/const";

const routes = [
  {
    path: "/",
    name: "",
    redirect: (to) => {
      return { path: `${URLS.DEFAULT}` };
    },
  },
  {
    path: "/login",
    name: "signin",
    component: () => import("@/views/Main/Auth/Signin.vue"),
  },
  {
    path: "/logout",
    meta: { requiresAuth: true },
    component: async () => {
      const authStore = useAuthUser();
      await authStore.logout();
    },
  },
  {
    path: "/server-down",
    name: "ServerDown",
    component: () => import("@/views/Main/Error/ServerDown.vue"),
  },
  {
    path: "/access-denied",
    name: "AccessDenied",
    component: () => import("@/views/Main/Error/AccessDenied.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/Main/Error/Error.vue"),
  },
  {
    path: "/main",
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "users",
        name: "Users",
        component: () => import("@/views/Main/Auth/UserMain.vue"),
        meta: { requiresAuth: true, requiresPermissions: [SuperUser,Admin, true] },
      },
      {
        path: "user-permission",
        name: "UserPermission",
        component: () => import("@/views/Main/Auth/Permissions/PermissionMain.vue"),
        meta: { requiresAuth: true, requiresPermissions: [SuperUser, true] },
      },
      {
        path: "logs",
        name: "Logs",
        component: () => import("@/views/Main/Logs/LogMain.vue"),
        meta: { requiresAuth: true, requiresPermissions: [SuperUser,Admin, true] },
      },
      {
        path: "csv-logs",
        name: "CSVLogs",
        component: () => import("@/views/Main/Logs/CSVLogMain.vue"),
        meta: { requiresAuth: true, requiresPermissions: [SuperUser,Admin, true] },
      },
      {
        path: "items",
        name: "Items",
        component: () => import("@/views/Main/Products/ProductMain.vue"),
        meta: { requiresAuth: true, requiresPermissions: [SuperUser,Admin, true] },
      },
      {
        path: "company",
        name: "Company",
        component: () => import("@/views/Main/Companies/CompanyMain.vue"),
        meta: { requiresAuth: true, requiresPermissions: [SuperUser,Admin, true] },
      },
     
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  },
});

router.beforeEach((to, from) => {
  const authStore = useAuthUser();
  if (to.meta.requiresAuth && !authStore.activeUser().token) {
    return {
      path: "/login",
    };
  } else {
    const mergedPermissions = [
      authStore.activeUser()?.role,
      ...authStore.activeUser()?.permissions,
    ];
    // var jwtDecode = decode(authStore.token());
    // var exp = jwtDecode["exp"];
    // console.log("exp", exp);
    // if (utcTimeDiff(exp) > 0) {
    let route = router.getRoutes()?.find((current) => current.name === to.name);
    if (route) {
      if (route?.meta?.requiresPermissions) {
        var hasPermission = route?.meta?.requiresPermissions
          ?.map((permission) => {
            if (
              mergedPermissions.includes(permission) &&
              to.name === route?.name
            ) {
              return true;
            } else {
              return false;
            }
          })
          ?.some((access) => access === true);

        if (!hasPermission) {
          return {
            path: "/access-denied",
          };
        }

        if (!hasPermission && to.name === "logout") {
          authStore.logout();
        }
      }
    } else {
      return {
        path: "/login",
      };
    }
  }
});

export default router;
