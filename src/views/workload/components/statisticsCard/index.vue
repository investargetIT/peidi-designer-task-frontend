<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  statisticsInfo: {
    type: Object,
    required: true
  }
});

const statusItems = [
  {
    id: "active",
    label: "在岗",
    count: 0,
    colorClass: "bg-blue-500"
  },
  {
    id: "primary-duty",
    label: "主职责中",
    count: 0,
    colorClass: "bg-amber-500"
  },
  {
    id: "support-full",
    label: "支援满载",
    count: 0,
    colorClass: "bg-red-500"
  }
];

const percentage = computed(() => {
  const { totalHours, maxHours } = props.statisticsInfo;
  return Math.round((totalHours / maxHours) * 100);
});

const getStatusClass = (id: string) => {
  const item = statusItems.find(item => item.id === id);
  return item?.colorClass || "bg-gray-300";
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-gray-800">设计师工作负载</h2>
        <p class="text-sm text-gray-600">
          每月总工时 220h = 主职能 176h + 支援 44h
        </p>
      </div>

      <div class="flex gap-4 text-sm">
        <div
          v-for="item in statusItems"
          :key="item.id"
          class="flex items-center gap-1.5"
        >
          <div class="h-2 w-2 rounded-full" :class="item.colorClass"></div>
          <span>{{ item.label }} {{ item.count }}</span>
        </div>
      </div>
    </div>

    <!-- Progress Card -->
    <div
      class="flex flex-col gap-6 rounded-xl border py-6 shadow-sm bg-gray-50"
    >
      <div class="px-6 pt-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">团队本月工时</span>
          <span class="text-sm text-gray-600">
            {{ props.statisticsInfo.totalHours }}h /
            {{ props.statisticsInfo.maxHours }}h （{{ percentage }}%）
          </span>
        </div>

        <div
          class="relative w-full overflow-hidden rounded-full h-2 bg-blue-100"
        >
          <div
            class="h-full bg-blue-500 transition-all duration-300"
            :style="{ width: `${percentage}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
