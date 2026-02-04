const Layout = () => import("@/layout/index.vue");

export default [
  {
    path: "/dashboard",
    name: "DashboardLayout",
    redirect: "/dashboard/index",
    component: Layout,
    meta: {
      icon: "tdesign/app",
      title: "需求看板",
      showLink: true,
      rank: 11
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
  },
  {
    path: "/workload",
    name: "WorkloadLayout",
    redirect: "/workload/index",
    component: Layout,
    meta: {
      icon: "fluent-mdl2/user-gauge",
      title: "设计师工作负载",
      showLink: true,
      rank: 12
    },
    children: [
      {
        path: "/workload/index",
        name: "设计师工作负载",
        component: () => import("@/views/workload/index.vue"),
        meta: {
          title: "设计师工作负载",
          icon: "fluent-mdl2/user-gauge"
        }
      }
    ]
  }
] satisfies Array<RouteConfigsTable>;
