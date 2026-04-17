const Layout = () => import("@/layout/index.vue");

export default [
  // {
  //   path: "/manageBoard",
  //   name: "ManageBoardLayout",
  //   redirect: "/manageBoard/index",
  //   component: Layout,
  //   meta: {
  //     icon: "tdesign/app",
  //     title: "管理看板",
  //     showLink: true,
  //     rank: 11
  //   },
  //   children: [
  //     {
  //       path: "/manageBoard/index",
  //       name: "管理看板",
  //       component: () => import("@/views/manageBoard/index.vue"),
  //       meta: {
  //         title: "管理看板",
  //         icon: "tdesign/app"
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: "/workload",
  //   name: "WorkloadLayout",
  //   redirect: "/workload/index",
  //   component: Layout,
  //   meta: {
  //     icon: "fluent-mdl2/user-gauge",
  //     title: "设计师工作负载",
  //     showLink: true,
  //     rank: 12
  //   },
  //   children: [
  //     {
  //       path: "/workload/index",
  //       name: "设计师工作负载",
  //       component: () => import("@/views/workload/index.vue"),
  //       meta: {
  //         title: "设计师工作负载",
  //         icon: "fluent-mdl2/user-gauge"
  //       }
  //     }
  //   ]
  // },
  {
    path: "/requireForm",
    name: "RequireFormLayout",
    redirect: "/requireForm/index",
    component: Layout,
    meta: {
      icon: "pixelarticons/notes-plus",
      title: "提交设计需求",
      showLink: true,
      rank: 13
    },
    children: [
      {
        path: "/requireForm/index",
        name: "提交设计需求",
        component: () => import("@/views/requireForm/index.vue"),
        meta: {
          title: "提交设计需求",
          icon: "pixelarticons/notes-plus"
        }
      }
    ]
  },
  {
    path: "/detailTable",
    name: "DetailTableLayout",
    redirect: "/detailTable/index",
    component: Layout,
    meta: {
      icon: "material-symbols/list-rounded",
      title: "任务列表",
      showLink: true,
      rank: 14
    },
    children: [
      {
        path: "/detailTable/index",
        name: "任务列表",
        component: () => import("@/views/detailTable/index.vue"),
        meta: {
          title: "任务列表",
          icon: "material-symbols/list-rounded"
        }
      }
    ]
  }
  // {
  //   path: "/detailForm",
  //   name: "DetailFormLayout",
  //   redirect: "/detailForm/index",
  //   component: Layout,
  //   meta: {
  //     icon: "ix/details",
  //     title: "任务详情",
  //     showLink: true,
  //     rank: 15
  //   },
  //   children: [
  //     {
  //       path: "/detailForm/index",
  //       name: "任务详情",
  //       component: () => import("@/views/detailForm/index.vue"),
  //       meta: {
  //         title: "任务详情",
  //         icon: "ix/details"
  //       }
  //     }
  //   ]
  // }
] satisfies Array<RouteConfigsTable>;
