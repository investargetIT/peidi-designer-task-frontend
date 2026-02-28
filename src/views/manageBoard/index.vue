<script setup lang="ts">
import { ref } from "vue";

const timePeriod = ref<"week" | "month">("week");

// 计算当前选中项的样式
const getTimePeriodClass = (period: "week" | "month") => {
  return timePeriod.value === period
    ? "px-2 py-1 rounded text-xs bg-blue-100 text-blue-600 cursor-pointer"
    : "px-2 py-1 rounded text-xs hover:bg-gray-100 cursor-pointer";
};

// 切换时间周期
const switchTimePeriod = (period: "week" | "month") => {
  timePeriod.value = period;
};

// 核心指标数据
const coreMetrics = ref([
  {
    title: "本周新需求数",
    value: 20
  },
  {
    title: "本周已完成数",
    value: 29
  },
  {
    title: "本周插单次数",
    value: 7
  },
  {
    title: "当前延期任务",
    value: 5
  }
]);

// 需求结构分布
const demandDistribution = ref({
  usageScene: [
    { label: "S1销售转化", value: 45, color: "bg-blue-500" },
    { label: "S2对外品牌", value: 30, color: "bg-green-500" },
    { label: "S3内部支持", value: 15, color: "bg-yellow-500" },
    { label: "S4长期资产", value: 10, color: "bg-red-500" }
  ],
  impactScope: [
    { label: "I1单一", value: 12, color: "bg-gray-300" },
    { label: "I2项目", value: 26, color: "bg-green-500" },
    { label: "I3多项目", value: 38, color: "bg-blue-500" },
    { label: "I4公司级", value: 24, color: "bg-purple-500" }
  ]
});

// 四象限任务数
const quadrantTasks = ref([
  {
    title: "重要且紧急",
    value: 9,
    color: "#F4F5FA"
  },
  {
    title: "不重要但紧急",
    value: 5,
    color: "#FFF7EA"
  },
  {
    title: "重要不紧急",
    value: 14,
    color: "#E9EFFD"
  },
  {
    title: "不重要不紧急",
    value: 8,
    color: "#F0F8FA"
  }
]);

// 设计师资源与负载
const designerLoad = ref([
  {
    name: "夏筠",
    role: "品牌设计",
    mainHours: 120,
    supportHours: 29,
    supportRatio: 60
  },
  {
    name: "黄文文",
    role: "社媒设计",
    mainHours: 96,
    supportHours: 44,
    supportRatio: 100
  },
  {
    name: "尤俊力",
    role: "包装设计",
    mainHours: 80,
    supportHours: 20,
    supportRatio: 40
  }
]);

// 延期任务与插单决策
const delayTasks = ref([
  { task: "新品包装 A", reason: "插单挤占", days: 3 },
  { task: "年会物料", reason: "需求多次变更", days: 3 }
]);

// 插单决策记录
const insertionRecords = ref([
  { task: "紧急包装", method: "延后任务", impact: "5月延期上市" },
  { task: "渠道礼盒", method: "启用外包", impact: "无任务受影响" }
]);

// 计算支援比例颜色
const getSupportRatioColor = ratio => {
  return ratio >= 80 ? "bg-red-500" : "bg-blue-500";
};
</script>

<template>
  <div>
    <!-- 头部标题 -->
    <div class="flex justify-between items-center mb-5">
      <div>
        <h1 class="text-2xl font-bold text-[#0a0a0a]">
          设计项目管理 | 管理看板
        </h1>
        <p class="text-sm text-[#4A5565] mt-1">
          从任务视角看业务结构、看人力负载、看风险走势
        </p>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm">数据周期:</span>
        <span
          :class="getTimePeriodClass('week')"
          @click="switchTimePeriod('week')"
        >
          本周
        </span>
        <span
          :class="getTimePeriodClass('month')"
          @click="switchTimePeriod('month')"
        >
          本月
        </span>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-5">
      <!-- 左侧区域 -->
      <div class="col-span-2 space-y-5">
        <!-- 核心指标 -->
        <div class="bg-white rounded-lg shadow-sm p-5">
          <div class="mb-4">
            <p class="text-lg font-medium text-[#0a0a0a]">核心指标</p>
          </div>
          <div class="grid grid-cols-4 gap-4">
            <div
              class="text-center p-3 bg-gray-50 rounded"
              v-for="item in coreMetrics"
            >
              <div class="text-sm text-[#4A5565] mb-1">{{ item.title }}</div>
              <div class="text-xl font-bold text-[#0a0a0a]">
                {{ item.value }}
              </div>
            </div>
          </div>
        </div>

        <!-- 需求结构分布 -->
        <div class="bg-white rounded-lg shadow-sm p-5">
          <div class="text-lg font-medium text-[#0a0a0a] mb-4">
            需求结构分布
          </div>
          <div class="grid grid-cols-2 gap-6">
            <!-- 使用场景分布 -->
            <div>
              <div class="text-sm font-medium text-[#0a0a0a] mb-2">
                按使用场景 S 分布
              </div>
              <div
                class="relative w-full h-16 bg-gray-100 rounded-lg overflow-hidden mb-3 flex"
              >
                <div
                  v-for="(item, index) in demandDistribution.usageScene"
                  :key="index"
                  class="h-full"
                  :class="item.color"
                  :style="{ width: item.value + '%' }"
                ></div>
              </div>
              <div class="space-y-2">
                <div
                  v-for="(item, index) in demandDistribution.usageScene"
                  :key="index"
                  class="flex items-center text-sm text-[#4A5565]"
                >
                  <span
                    class="w-3 h-3 rounded-full mr-2"
                    :class="item.color"
                  ></span>
                  {{ item.label }}: {{ item.value }}%
                </div>
              </div>
            </div>

            <!-- 影响范围分布 -->
            <div>
              <div class="text-sm font-medium text-[#0a0a0a] mb-2">
                按影响范围 I 分布
              </div>
              <div class="space-y-3 mt-3">
                <div
                  v-for="(item, index) in demandDistribution.impactScope"
                  :key="index"
                  class="flex items-center"
                >
                  <span class="w-20 text-sm text-[#4A5565]">{{
                    item.label
                  }}</span>
                  <div class="flex-1 mx-3">
                    <div class="h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        class="h-full rounded-full"
                        :class="item.color"
                        :style="{ width: item.value + '%' }"
                      ></div>
                    </div>
                  </div>
                  <span class="w-10 text-sm text-[#4A5565]"
                    >{{ item.value }}%</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 设计师资源与负载 -->
        <div class="bg-white rounded-lg shadow-sm p-5">
          <div class="text-lg font-medium text-[#0a0a0a] mb-4">
            设计师资源与负载
          </div>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50">
                  <th
                    class="py-3 px-4 text-left text-sm font-medium text-[#0a0a0a]"
                  >
                    设计师
                  </th>
                  <th
                    class="py-3 px-4 text-left text-sm font-medium text-[#0a0a0a]"
                  >
                    主职能
                  </th>
                  <th
                    class="py-3 px-4 text-left text-sm font-medium text-[#0a0a0a]"
                  >
                    主职能工时
                  </th>
                  <th
                    class="py-3 px-4 text-left text-sm font-medium text-[#0a0a0a]"
                  >
                    支持工时
                  </th>
                  <th
                    class="py-3 px-4 text-left text-sm font-medium text-[#0a0a0a]"
                  >
                    支援占比
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr
                  v-for="designer in designerLoad"
                  :key="designer.name"
                  class="hover:bg-gray-50"
                >
                  <td class="py-3 px-4 text-sm text-[#4A5565]">
                    {{ designer.name }}
                  </td>
                  <td class="py-3 px-4 text-sm text-[#4A5565]">
                    {{ designer.role }}
                  </td>
                  <td class="py-3 px-4 text-sm text-[#4A5565]">
                    {{ designer.mainHours }}h
                  </td>
                  <td class="py-3 px-4 text-sm text-[#4A5565]">
                    {{ designer.supportHours }}h
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex items-center">
                      <div
                        class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mr-2"
                      >
                        <div
                          class="h-full rounded-full"
                          :class="getSupportRatioColor(designer.supportRatio)"
                          :style="{ width: designer.supportRatio + '%' }"
                        ></div>
                      </div>
                      <span class="text-sm text-[#4A5565]"
                        >{{ designer.supportRatio }}%</span
                      >
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-3 text-sm text-[#4A5565]">
            ⓘ
            每个人每月只有220h，这个不会轻易改动。因此主职能多了，支援池就会变小。
          </div>
        </div>
      </div>

      <!-- 右侧区域 -->
      <div class="space-y-5">
        <!-- 任务优先级 & 紧急度概览 -->
        <div class="bg-white rounded-lg shadow-sm p-5">
          <div class="text-lg font-medium text-[#0a0a0a] mb-4">
            任务优先级 & 紧急度概览
          </div>
          <div class="grid grid-cols-2 gap-3 mb-3">
            <div
              class="p-4 rounded-lg border text-center cursor-pointer"
              :style="{ backgroundColor: item.color }"
              v-for="item in quadrantTasks"
              :key="item.title"
            >
              <div class="text-sm text-[#4A5565]">{{ item.title }}</div>
              <div class="text-lg font-bold text-[#0a0a0a] mt-1">
                ⭐ {{ item.value }}
              </div>
            </div>
          </div>
          <div class="text-xs text-[#4A5565]">
            ⓘ 点击象限可跳转到对应任务列表
          </div>
        </div>

        <!-- 延期任务与插单决策 -->
        <div class="bg-white rounded-lg shadow-sm p-5">
          <div class="mb-6">
            <h3 class="text-lg font-medium text-[#0a0a0a] mb-3">
              延期任务记录
            </h3>
            <div class="space-y-2 mb-3">
              <div
                v-for="task in delayTasks"
                :key="task.task"
                class="flex justify-between items-center py-2 border-b border-gray-100"
              >
                <div class="text-sm text-[#4A5565]">{{ task.task }}</div>
                <div class="text-sm text-[#4A5565]">{{ task.reason }}</div>
                <div class="text-sm text-[#4A5565]">{{ task.days }}天</div>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-lg font-medium text-[#0a0a0a] mb-3">
              插单决策记录
            </h3>
            <div class="space-y-2 mb-3">
              <div
                v-for="record in insertionRecords"
                :key="record.task"
                class="flex justify-between items-center py-2 border-b border-gray-100"
              >
                <div class="text-sm text-[#4A5565]">{{ record.task }}</div>
                <div class="text-sm text-[#4A5565]">{{ record.method }}</div>
                <div class="text-sm text-[#4A5565]">{{ record.impact }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部说明 -->
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-sm text-[#4A5565]">
            管理看板聚焦「业务结构 × 人力负载 ×
            风险与插单」，让设计团队状态可视化，决策可解释，可复盘。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
