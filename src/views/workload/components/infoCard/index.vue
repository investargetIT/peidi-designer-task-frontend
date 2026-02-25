<script setup lang="ts">
interface RuleItem {
  id: number | string;
  title: string;
  content: string;
  isWarning?: boolean;
}

const rules: RuleItem[] = [
  {
    id: 1,
    title: "主职能设计师优先：",
    content: "新需求优先分配给该类型的主职能设计师"
  },
  {
    id: 2,
    title: "支援设计师接力：",
    content: "主设计师无空余时，检查有支援职能的其他设计师"
  },
  {
    id: 3,
    title: "主职责优先原则：",
    content: "支援设计师如有进行中的主职责项目，优先完成主职责"
  },
  {
    id: 4,
    title: "工时分配：",
    content: "每月 220h，其中主职能 176h，支援上限 44h"
  },
  {
    id: "!",
    title: "兜底方案：",
    content: "所有设计师都无法承接时，需求方只能选择延期或外包",
    isWarning: true
  }
];

const getBadgeClass = (isWarning?: boolean) => {
  return isWarning
    ? "flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-xs font-medium flex-shrink-0"
    : "flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xs font-medium flex-shrink-0";
};

const getContentClass = () => {
  return "px-6 text-sm text-gray-600 space-y-2";
};
</script>

<template>
  <div class="flex flex-col gap-6 rounded-xl border py-6 shadow-sm bg-gray-50">
    <div class="grid items-start gap-2 px-6 pb-3">
      <div class="font-semibold text-sm flex items-center gap-2 text-gray-800">
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
          class="h-4 w-4 text-blue-500"
        >
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
        任务分配优先级规则
      </div>
    </div>

    <div :class="getContentClass()">
      <div v-for="rule in rules" :key="rule.id" class="flex items-start gap-2">
        <span :class="getBadgeClass(rule.isWarning)">
          {{ rule.id }}
        </span>
        <span>
          <strong class="text-gray-800">{{ rule.title }}</strong>
          {{ rule.content }}
        </span>
      </div>
    </div>
  </div>
</template>
