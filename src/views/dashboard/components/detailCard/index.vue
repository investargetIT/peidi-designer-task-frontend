<script setup lang="ts">
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
  tasks: TaskItem[];
}

const props = defineProps<Props>();

const getStatusClass = (type: string) => {
  const classes = {
    success: "bg-green-100 text-green-800 border-green-300",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
    danger: "bg-red-100 text-red-700 border-red-300",
    default: "bg-gray-100 text-gray-800 border-gray-300",
    info: "bg-blue-100 text-blue-800 border-blue-300"
  };
  return classes[type as keyof typeof classes] || classes.default;
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
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="task in props.tasks"
      :key="task.id"
      class="flex flex-col gap-6 rounded-xl border py-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white"
    >
      <div class="p-4 space-y-3">
        <!-- Title -->
        <div class="flex items-start justify-between gap-2">
          <h4 class="font-semibold text-sm leading-tight flex-1">
            {{ task.title }}
          </h4>
        </div>

        <!-- Status and Priority Badges -->
        <div class="flex flex-wrap gap-2">
          <span
            class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium"
            :class="getStatusClass(task.status.type)"
          >
            {{ task.status.label }}
          </span>
          <span
            class="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium"
            :class="getPriorityClass(task.priority.level)"
          >
            {{ task.priority.label }}
          </span>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-1 text-xs">
          <span
            v-for="(tag, index) in task.tags"
            :key="index"
            class="px-2 py-0.5 bg-gray-100 rounded text-gray-700"
          >
            {{ tag }}
          </span>
        </div>

        <!-- Date and Requester -->
        <div class="flex items-center gap-4 text-xs text-gray-600">
          <div class="flex items-center gap-1">
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
              class="h-3 w-3"
            >
              <path d="M8 2v4"></path>
              <path d="M16 2v4"></path>
              <rect width="18" height="18" x="3" y="4" rx="2"></rect>
              <path d="M3 10h18"></path>
            </svg>
            <span>{{ task.date }}</span>
          </div>
          <div class="flex items-center gap-1">
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
              class="h-3 w-3"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>{{ task.requester }}</span>
          </div>
        </div>

        <!-- Assignee -->
        <div class="text-xs">
          <span class="text-gray-600">负责人：</span>
          <span class="font-medium text-gray-800">{{ task.assignee }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
