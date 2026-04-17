import { $t } from "@/plugins/i18n";
import { isDevEnv } from "@/utils/debug";
const Layout = () => import("@/layout/index.vue");

export default [
  {
    path: "/debug",
    name: "DebugLayout",
    redirect: "/debug/index",
    component: Layout,
    meta: {
      icon: "ri/bug-line",
      title: $t("pd.menus.debug"),
      showLink: isDevEnv(),
      rank: 1001
    },
    children: [
      {
        path: "/debug/index",
        name: "Debug",
        component: () => import("@/views/debug/index.vue"),
        meta: {
          title: $t("pd.menus.debug"),
          icon: "ri/bug-line"
        }
      }
    ]
  },
  {
    path: "/dashboard",
    name: "DashboardLayout",
    redirect: "/dashboard/index",
    component: Layout,
    meta: {
      icon: "tdesign/app",
      title: "需求看板",
      showLink: isDevEnv(),
      rank: 1002
    },
    children: [
      {
        path: "/dashboard/index",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        meta: {
          title: "需求看板",
          icon: "tdesign/app"
        }
      }
    ]
  }
] satisfies Array<RouteConfigsTable>;
