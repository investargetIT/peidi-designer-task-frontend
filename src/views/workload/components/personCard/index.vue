<script setup lang="ts">
interface Designer {
  id: number;
  name: string;
  department: string;
  avatarText: string;
  skills: Array<{
    type: "primary" | "support";
    label: string;
  }>;
  workloads: Array<{
    title: string;
    current: number;
    max: number;
  }>;
  stats: Array<{
    value: string | number;
    label: string;
  }>;
}

const props = defineProps<{
  designer: Designer;
}>();

const getBadgeClass = (type: "primary" | "support") => {
  return type === "primary"
    ? "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-600"
    : "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600";
};

const getProgressPercentage = (current: number, max: number) => {
  return Math.round((current / max) * 100);
};

const getProgressColor = (title: string, percentage: number) => {
  if (title.includes("支援")) {
    return percentage >= 100 ? "bg-amber-500" : "bg-blue-500";
  }
  return "bg-blue-500";
};

const getIconComponent = (title: string) => {
  if (title.includes("主职能")) {
    return "briefcase";
  } else if (title.includes("支援")) {
    return "users";
  }
  return "";
};
</script>

<template>
  <div
    class="flex flex-col gap-6 rounded-xl border py-6 shadow-sm bg-white transition-all"
  >
    <!-- Header -->
    <div class="flex items-center justify-between px-6 pb-3">
      <div class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold"
        >
          {{ props.designer.avatarText }}
        </div>
        <div>
          <div class="font-semibold text-base text-gray-800">
            {{ props.designer.name }}
          </div>
          <div class="text-xs text-gray-600">
            {{ props.designer.department }}
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="px-6 space-y-4">
      <!-- Skills Section -->
      <div class="space-y-2">
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="(skill, index) in props.designer.skills"
            :key="index"
            :class="getBadgeClass(skill.type)"
          >
            {{ skill.type === "primary" ? "主:" : "援:" }} {{ skill.label }}
          </span>
        </div>
      </div>

      <!-- Workload Sections -->
      <div
        v-for="workload in props.designer.workloads"
        :key="workload.title"
        class="space-y-2"
      >
        <div class="flex items-center justify-between text-sm">
          <span class="flex items-center gap-1.5 text-gray-600">
            <svg
              v-if="getIconComponent(workload.title) === 'briefcase'"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-3.5 w-3.5"
            >
              <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              <rect width="20" height="14" x="2" y="6" rx="2"></rect>
            </svg>
            <svg
              v-else-if="getIconComponent(workload.title) === 'users'"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-3.5 w-3.5"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            {{ workload.title }}
          </span>
          <span class="font-medium"
            >{{ workload.current }}h / {{ workload.max }}h</span
          >
        </div>

        <div
          class="relative w-full overflow-hidden rounded-full h-2 bg-blue-100"
        >
          <div
            class="h-full transition-all duration-300"
            :class="
              getProgressColor(
                workload.title,
                getProgressPercentage(workload.current, workload.max)
              )
            "
            :style="{
              width: `${getProgressPercentage(workload.current, workload.max)}%`
            }"
          ></div>
        </div>

        <div class="flex justify-between text-xs text-gray-600">
          <span
            >使用率:
            {{ getProgressPercentage(workload.current, workload.max) }}%</span
          >
          <span>剩余: {{ workload.max - workload.current }}h</span>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-3 gap-2 text-center">
        <div
          v-for="(stat, index) in props.designer.stats"
          :key="index"
          class="rounded-md bg-gray-50 p-2"
        >
          <div class="text-lg font-semibold text-gray-800">
            {{ stat.value }}
          </div>
          <div class="text-xs text-gray-600">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
