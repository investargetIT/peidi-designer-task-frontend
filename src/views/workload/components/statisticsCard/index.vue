<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  statisticsInfo: {
    type: Object,
    required: true
  }
});

const statusItems = computed(() => [
  {
    id: "active",
    label: "在岗",
    count: props.statisticsInfo.onDutyPeople,
    colorClass: "bg-blue-500"
  },
  {
    id: "primary-duty",
    label: "主职责中",
    count: props.statisticsInfo.primaryPeople,
    colorClass: "bg-amber-500"
  },
  {
    id: "support-full",
    label: "支援满载",
    count: props.statisticsInfo.supportFullPeople,
    colorClass: "bg-red-500"
  }
]);

const percentage = computed(() => {
  const { totalHours, maxHours } = props.statisticsInfo;
  return Math.round((totalHours / maxHours) * 100);
});
</script>

<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-gray-800">设计师工作负载</h2>
        <p class="text-sm text-gray-600">
          <span>每月总工时 220h = 主职能 176h + 支援 44h，</span>
          <span>
            系统按主职能 / 支援工时拆分负载，用于判断是否还能承接新任务。
          </span>
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
      <div class="px-6">
        <p class="text-sm font-medium text-gray-700 text-right">
          本月主职能已用 {{ props.statisticsInfo.primaryTotalHours }}h |
          支援已用 {{ props.statisticsInfo.supportTotalHours }}h | 剩余总容量
          {{ props.statisticsInfo.maxHours - props.statisticsInfo.totalHours }}h
        </p>

        <div class="flex items-center justify-between mb-2 mt-1">
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
