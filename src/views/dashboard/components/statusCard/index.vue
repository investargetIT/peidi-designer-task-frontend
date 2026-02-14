<script setup lang="ts">
import DetailCard from "../detailCard/index.vue";

interface StatusConfig {
  title: string;
  subtitle: string;
  count: number;
  bgColor: string;
  borderColor: string;
  textColor: string;
  iconColor: string;
  icon: string;
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

interface Props {
  statusConfig: StatusConfig;
  tasks: TaskItem[];
}

const props = defineProps<Props>();

const getBadgeClass = () => {
  return "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700";
};

const getPriorityClass = (level: string) => {
  const classes = {
    highest: "bg-red-100 text-red-700",
    high: "bg-orange-100 text-orange-700",
    medium: "bg-blue-100 text-blue-700",
    low: "bg-gray-100 text-gray-700"
  };
  return classes[level as keyof typeof classes] || classes.low;
};

const getIconDefinition = (iconName: string) => {
  const icons: Record<
    string,
    { paths?: string[]; circles?: Array<{ cx: number; cy: number; r: number }> }
  > = {
    "triangle-alert": {
      paths: [
        "M21.73 18 13.73 4a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
        "M12 9v4",
        "M12 17h.01"
      ]
    },
    clock: {
      circles: [{ cx: 12, cy: 12, r: 10 }],
      paths: ["M12 6v6l4 2"]
    },
    target: {
      circles: [
        { cx: 12, cy: 12, r: 10 },
        { cx: 12, cy: 12, r: 6 },
        { cx: 12, cy: 12, r: 2 }
      ]
    },
    lightbulb: {
      paths: [
        "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
        "M9 18h6",
        "M10 22h4"
      ]
    }
  };

  return icons[iconName] || icons["triangle-alert"];
};
</script>

<template>
  <div
    class="flex flex-col gap-6 rounded-xl py-6 shadow-sm border-2"
    :class="[props.statusConfig.bgColor, props.statusConfig.borderColor]"
  >
    <div class="grid items-start gap-2 px-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div :class="props.statusConfig.iconColor">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-5 w-5"
            >
              <!-- Render circles -->
              <circle
                v-for="(circle, index) in getIconDefinition(
                  props.statusConfig.icon
                ).circles || []"
                :key="`circle-${index}`"
                :cx="circle.cx"
                :cy="circle.cy"
                :r="circle.r"
              />

              <!-- Render paths -->
              <path
                v-for="(pathData, index) in getIconDefinition(
                  props.statusConfig.icon
                ).paths || []"
                :key="`path-${index}`"
                :d="pathData"
              />
            </svg>
          </div>
          <div>
            <div class="font-semibold text-lg text-gray-800">
              {{ props.statusConfig.title }}
            </div>
            <p class="text-sm text-gray-600">
              {{ props.statusConfig.subtitle }}
            </p>
          </div>
        </div>
        <span :class="getBadgeClass()">
          {{ props.statusConfig.count }}
        </span>
      </div>
    </div>

    <div class="px-6">
      <div class="space-y-3">
        <el-scrollbar v-if="props.tasks.length > 0" height="720px">
          <DetailCard :tasks="props.tasks" />
        </el-scrollbar>

        <p v-else class="text-sm text-gray-600 text-center py-4">暂无需求</p>
      </div>
    </div>
  </div>
</template>
