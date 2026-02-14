<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { TASK_TABS } from "./config";
import StatusCard from "./components/statusCard/index.vue";
import TitleCard from "./components/titleCard/index.vue";
import { ElMessage } from "element-plus";
import { getPmDesignRequestsPage } from "@/api/design";
import { DESIGN_ENUM } from "@/constants";
import dayjs from "dayjs";

// 组件会用到的枚举数据
const ENUM_MAP = {
  // priority - 属性 对应表
  PRIORITY_ATTR_MAP: {
    1: "not-urgent-not-important",
    2: "not-urgent-important",
    3: "urgent-not-important",
    4: "urgent-important"
  },
  // priority - 等级 对应表
  PRIORITY_LEVEL_MAP: {
    1: "low",
    2: "medium",
    3: "high",
    4: "highest"
  },
  // status - 类型 对应表
  TASK_STATUS_MAP: {
    DRAFT: "info",
    PENDING: "warning",
    IN_PROGRESS: "success",
    COMPLETED: "default",
    OUTSOURCED: "info",
    RUSH: "default"
  }
};

interface StatusItem {
  id: string;
  title: string;
  subtitle: string;
  count: number;
  bgColor: string;
  borderColor: string;
  textColor: string;
  iconColor: string;
  icon: string;
  tasks: TaskItem[];
}

interface TaskItem {
  id: number;
  title: string;
  status: {
    label: string;
    type: "success" | "warning" | "danger" | "default" | "info";
  };
  priority: {
    label: string;
    level: "highest" | "high" | "medium" | "low";
  };
  tags: string[];
  date: string;
  requester: string;
  assignee: string;
}

const totalRequests = ref<number>(0);

const statusItems = ref<StatusItem[]>([
  {
    id: "urgent-important",
    title: "紧急且重要",
    subtitle: "立即处理",
    count: 0,
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-600",
    iconColor: "text-red-600",
    icon: "triangle-alert",
    tasks: [
      // {
      //   id: 1,
      //   title: "618大促主视觉设计",
      //   status: { label: "进行中", type: "success" },
      //   priority: { label: "极高", level: "highest" },
      //   tags: ["S1 销售转化", "I4 公司级"],
      //   date: "2024/1/25",
      //   requester: "张总监",
      //   assignee: "夏筠"
      // }
    ]
  },
  {
    id: "urgent-not-important",
    title: "紧急不重要",
    subtitle: "快速处理",
    count: 0,
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-600",
    iconColor: "text-orange-600",
    icon: "clock",
    tasks: [
      // {
      //   id: 2,
      //   title: "新品包装设计",
      //   status: { label: "进行中", type: "success" },
      //   priority: { label: "高", level: "high" },
      //   tags: ["S2 对外品牌", "I3 多项目"],
      //   date: "2024/2/15",
      //   requester: "产品部王经理",
      //   assignee: "尤俊力"
      // },
      // {
      //   id: 3,
      //   title: "小红书春节活动专题",
      //   status: { label: "已完成", type: "default" },
      //   priority: { label: "高", level: "high" },
      //   tags: ["S1 销售转化", "I2 项目"],
      //   date: "2024/1/19",
      //   requester: "市场部孙经理",
      //   assignee: "黄文文"
      // }
    ]
  },
  {
    id: "not-urgent-important",
    title: "不紧急但重要",
    subtitle: "计划处理",
    count: 0,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-600",
    iconColor: "text-blue-600",
    icon: "target",
    tasks: []
  },
  {
    id: "not-urgent-not-important",
    title: "不紧急不重要",
    subtitle: "有空再处理",
    count: 0,
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    textColor: "text-gray-600",
    iconColor: "text-gray-600",
    icon: "lightbulb",
    tasks: [
      // {
      //   id: 4,
      //   title: "行政简易需求",
      //   status: { label: "进行中", type: "success" },
      //   priority: { label: "低", level: "low" },
      //   tags: ["S3 内部支持", "I1 单一"],
      //   date: "2024/1/24",
      //   requester: "行政部李经理",
      //   assignee: "夏筠"
      // },
      // {
      //   id: 5,
      //   title: "人力招聘海报",
      //   status: { label: "普通队列", type: "info" },
      //   priority: { label: "中", level: "medium" },
      //   tags: ["S3 内部支持", "I2 项目"],
      //   date: "2024/2/28",
      //   requester: "HR赵经理",
      //   assignee: "夏筠"
      // }
    ]
  }
]);

const tabActive = ref("ALL");

// 修改计算属性：确保始终返回所有四个状态项，即使任务为空
const filteredStatusItems = computed<StatusItem[]>(() => {
  if (tabActive.value === "ALL") {
    // 全部：返回所有状态项，保持原有任务列表
    return statusItems.value.map(status => ({
      ...status,
      tasks: status.tasks,
      count: status.tasks.length
    }));
  }

  // 其他选项卡：返回所有状态项，但更新任务列表为筛选后的结果
  const targetType = ENUM_MAP.TASK_STATUS_MAP[tabActive.value];
  if (!targetType) return statusItems.value;

  return statusItems.value.map(status => {
    // 筛选出匹配的任务
    const filteredTasks = status.tasks.filter(
      task => task.status.type === targetType
    );

    // 返回状态项，更新任务列表和计数（即使为空也返回）
    return {
      ...status,
      tasks: filteredTasks,
      count: filteredTasks.length
    };
  });
});

// 计算每个选项卡的任务数量
const getTabCount = (tabValue: string): number => {
  if (tabValue === "ALL") {
    // 全部：统计所有任务
    return statusItems.value.reduce(
      (total, status) => total + status.tasks.length,
      0
    );
  }

  // 其他选项卡：根据任务状态筛选
  const targetType = ENUM_MAP.TASK_STATUS_MAP[tabValue];
  if (!targetType) return 0;

  return statusItems.value.reduce((total, status) => {
    const count = status.tasks.filter(
      task => task.status.type === targetType
    ).length;
    return total + count;
  }, 0);
};

// 为每个选项卡计算数量
const tabCounts = computed(() => {
  const counts: Record<string, number> = {};
  TASK_TABS.forEach(tab => {
    counts[tab.value] = getTabCount(tab.value);
  });
  return counts;
});

//#region 请求相关
// 获取需求列表
const fetchDesignTaskList = () => {
  return getPmDesignRequestsPage({
    pageNo: 1,
    pageSize: 10e3
  })
    .then((res: any) => {
      if (res?.code === 200) {
        // console.log("获取需求列表:", res?.data);

        // 数据处理
        const tasksTemp = {
          "urgent-important": [],
          "urgent-not-important": [],
          "not-urgent-important": [],
          "not-urgent-not-important": []
        };

        const records = res?.data?.records || [];
        for (const record of records) {
          const key = ENUM_MAP.PRIORITY_ATTR_MAP[record.priority];
          if (key) {
            tasksTemp[key].push({
              id: record.id,
              title: record.title,
              status: {
                label: DESIGN_ENUM.TASK_STATUS[record.status],
                type: ENUM_MAP.TASK_STATUS_MAP[record.status]
              },
              priority: {
                label: DESIGN_ENUM.PRIORITY[record.priority],
                level: ENUM_MAP.PRIORITY_LEVEL_MAP[record.priority]
              },
              tags: [
                record.usageScenario +
                  " " +
                  DESIGN_ENUM.USAGE_SCENARIO_MAP[record.usageScenario],
                record.impactRange +
                  " " +
                  DESIGN_ENUM.IMPACT_RANGE_MAP[record.impactRange]
              ],
              date: dayjs(record.deadline).format("YYYY/MM/DD"),
              requester: record.createUserName,
              assignee: record.assignedToName
            });
          }
        }

        // console.log("处理后的任务列表:", tasksTemp);

        const statusItemsTemp = statusItems.value.map(status => ({
          ...status,
          tasks: tasksTemp[status.id],
          count: tasksTemp[status.id].length
        }));

        statusItems.value = statusItemsTemp;

        totalRequests.value = records.length;
      } else {
        ElMessage.error("获取需求列表失败:" + res?.msg);
      }
    })
    .catch(error => {
      ElMessage.error("获取需求列表失败:" + error.message);
    });
};
//#endregion

onMounted(() => {
  fetchDesignTaskList();
});
</script>

<template>
  <div>
    <!-- 标题栏 -->
    <TitleCard :totalRequests="totalRequests" />

    <!-- 选项卡 -->
    <div class="peidi-dashboard-tabs flex">
      <div
        v-for="item in TASK_TABS"
        :key="item.value"
        class="peidi-dashboard-tab"
        :class="{ 'peidi-dashboard-tab-active': tabActive === item.value }"
        @click="tabActive = item.value"
      >
        {{ item.label }} <span>({{ tabCounts[item.value] }})</span>
      </div>
    </div>

    <!-- 状态卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-[20px]">
      <StatusCard
        v-for="status in filteredStatusItems"
        :key="status.id"
        :status-config="status"
        :tasks="status.tasks"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.peidi-dashboard-tabs {
  gap: 8px;
  border-radius: 8px;
  background-color: rgb(224, 224, 224);
  padding: 4px;
  width: fit-content;
  color: #0a0a0a;
  font-size: 14px;

  .peidi-dashboard-tab {
    transition: all 0.3s ease-in-out;
    cursor: pointer;
    box-sizing: border-box;
    border: 1px solid transparent;
    border-radius: 8px;
    padding: 4px;

    span {
      margin-left: 4px;
      color: #737373;
      font-size: 12px;
    }
  }

  .peidi-dashboard-tab-active {
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.1),
      0 4px 8px rgba(0, 0, 0, 0.08),
      0 8px 16px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(0, 0, 0, 0.05);
    background-color: #fff;
  }
}
</style>
