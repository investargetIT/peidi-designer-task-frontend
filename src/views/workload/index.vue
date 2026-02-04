<script setup lang="ts">
import StatisticsCard from "./components/statisticsCard/index.vue";
import PersonCard from "./components/personCard/index.vue";
import InfoCard from "./components/infoCard/index.vue";

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

const designers: Designer[] = [
  {
    id: 1,
    name: "黄文文",
    department: "设计中心",
    avatarText: "黄",
    skills: [
      { type: "primary", label: "社媒设计" },
      { type: "support", label: "品牌设计" },
      { type: "support", label: "集团设计" }
    ],
    workloads: [
      { title: "主职能工时", current: 24, max: 176 },
      { title: "支援工时", current: 0, max: 44 }
    ],
    stats: [
      { value: 1, label: "主职责任务" },
      { value: 0, label: "支援任务" },
      { value: "24h", label: "本月总工时" }
    ]
  },
  {
    id: 2,
    name: "张小明",
    department: "UI设计部",
    avatarText: "张",
    skills: [
      { type: "primary", label: "UI设计" },
      { type: "support", label: "交互设计" }
    ],
    workloads: [
      { title: "主职能工时", current: 156, max: 176 },
      { title: "支援工时", current: 32, max: 44 }
    ],
    stats: [
      { value: 3, label: "主职责任务" },
      { value: 2, label: "支援任务" },
      { value: "188h", label: "本月总工时" }
    ]
  },
  {
    id: 3,
    name: "李小红",
    department: "视觉设计组",
    avatarText: "李",
    skills: [
      { type: "primary", label: "平面设计" },
      { type: "support", label: "插画设计" },
      { type: "support", label: "包装设计" }
    ],
    workloads: [
      { title: "主职能工时", current: 88, max: 176 },
      { title: "支援工时", current: 44, max: 44 }
    ],
    stats: [
      { value: 2, label: "主职责任务" },
      { value: 1, label: "支援任务" },
      { value: "132h", label: "本月总工时" }
    ]
  },
  {
    id: 4,
    name: "王大力",
    department: "品牌设计部",
    avatarText: "王",
    skills: [
      { type: "primary", label: "品牌设计" },
      { type: "support", label: "VI设计" }
    ],
    workloads: [
      { title: "主职能工时", current: 176, max: 176 },
      { title: "支援工时", current: 12, max: 44 }
    ],
    stats: [
      { value: 4, label: "主职责任务" },
      { value: 1, label: "支援任务" },
      { value: "188h", label: "本月总工时" }
    ]
  }
];
</script>

<template>
  <div class="space-y-6">
    <!-- Statistics Card -->
    <div>
      <StatisticsCard />
    </div>

    <!-- Designer Cards Grid -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <PersonCard
        v-for="designer in [].concat(...Array(3).fill(designers))"
        :key="designer.id"
        :designer="designer"
      />
    </div>

    <!-- Info Card -->
    <div class="mt-6">
      <InfoCard />
    </div>
  </div>
</template>
