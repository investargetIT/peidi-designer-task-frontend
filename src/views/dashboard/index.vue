<script setup lang="ts">
import { ref } from "vue";
import { TASK_TABS } from "./config";
import StatusCard from "./components/statusCard/index.vue";

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

const statusItems: StatusItem[] = [
  {
    id: "urgent-important",
    title: "紧急且重要",
    subtitle: "立即处理",
    count: 1,
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-600",
    iconColor: "text-red-600",
    icon: "triangle-alert",
    tasks: [
      {
        id: 1,
        title: "618大促主视觉设计",
        status: { label: "进行中", type: "success" },
        priority: { label: "极高", level: "highest" },
        tags: ["S1 销售转化", "I4 公司级"],
        date: "2024/1/25",
        requester: "张总监",
        assignee: "夏筠"
      }
    ]
  },
  {
    id: "urgent-not-important",
    title: "紧急不重要",
    subtitle: "快速处理",
    count: 2,
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-600",
    iconColor: "text-orange-600",
    icon: "clock",
    tasks: [
      {
        id: 2,
        title: "新品包装设计",
        status: { label: "进行中", type: "success" },
        priority: { label: "高", level: "high" },
        tags: ["S2 对外品牌", "I3 多项目"],
        date: "2024/2/15",
        requester: "产品部王经理",
        assignee: "尤俊力"
      },
      {
        id: 3,
        title: "小红书春节活动专题",
        status: { label: "已完成", type: "default" },
        priority: { label: "高", level: "high" },
        tags: ["S1 销售转化", "I2 项目"],
        date: "2024/1/19",
        requester: "市场部孙经理",
        assignee: "黄文文"
      }
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
    count: 2,
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    textColor: "text-gray-600",
    iconColor: "text-gray-600",
    icon: "lightbulb",
    tasks: [
      {
        id: 4,
        title: "行政简易需求",
        status: { label: "进行中", type: "success" },
        priority: { label: "低", level: "low" },
        tags: ["S3 内部支持", "I1 单一"],
        date: "2024/1/24",
        requester: "行政部李经理",
        assignee: "夏筠"
      },
      {
        id: 5,
        title: "人力招聘海报",
        status: { label: "普通队列", type: "info" },
        priority: { label: "中", level: "medium" },
        tags: ["S3 内部支持", "I2 项目"],
        date: "2024/2/28",
        requester: "HR赵经理",
        assignee: "夏筠"
      }
    ]
  }
];

const tabActive = ref("all");
</script>

<template>
  <div>
    <!-- 选项卡 -->
    <div class="peidi-dashboard-tabs flex">
      <div
        v-for="item in TASK_TABS"
        :key="item.value"
        class="peidi-dashboard-tab"
        :class="{ 'peidi-dashboard-tab-active': tabActive === item.value }"
        @click="tabActive = item.value"
      >
        {{ item.label }} <span>(1)</span>
      </div>
    </div>

    <!-- 状态卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-[20px]">
      <StatusCard
        v-for="status in statusItems"
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
