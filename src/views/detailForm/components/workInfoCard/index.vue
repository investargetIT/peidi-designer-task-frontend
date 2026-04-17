<!-- src/views/detailForm/components/workInfoCard/index.vue -->
<script setup lang="ts">
import { ref, watch } from "vue";

interface WorkInfo {
  assignee: string;
  estimatedHours: number;
  actualHours: number;
  startTime: string;
  endTime: string; // 新增完成时间字段
}

const props = defineProps({
  info: {
    type: Object as () => WorkInfo,
    required: true
  }
});

// 信息项配置数组
const infoItems = ref([
  {
    icon: "user",
    label: "负责人",
    value: ""
  },
  {
    icon: "clock",
    label: "预计工时",
    value: ""
  },
  {
    icon: "clock",
    label: "实际工时",
    value: ""
  },
  {
    icon: "calendar",
    label: "开始时间",
    value: ""
  },
  {
    icon: "calendar-check", // 新增完成时间图标
    label: "完成时间",
    value: ""
  }
]);

watch(
  () => [props.info],
  ([newInfo]) => {
    infoItems.value = [
      {
        icon: "user",
        label: "负责人",
        value: newInfo.assignee
      },
      {
        icon: "clock",
        label: "预计工时",
        value: `${newInfo.estimatedHours} 小时`
      },
      {
        icon: "clock",
        label: "实际工时",
        value: `${newInfo.actualHours} 小时`
      },
      {
        icon: "calendar",
        label: "开始时间",
        value: newInfo.startTime || "暂无"
      },
      {
        icon: "calendar-check", // 新增完成时间图标
        label: "完成时间",
        value: newInfo.endTime || "暂无"
      }
    ];
  },
  {
    immediate: true
  }
);
</script>

<template>
  <div class="pd-detailForm-workInfoCard-container">
    <div class="pd-detailForm-workInfoCard-card">
      <div class="pd-detailForm-workInfoCard-header">
        <h3 class="pd-detailForm-workInfoCard-title">工作信息</h3>
      </div>

      <div class="pd-detailForm-workInfoCard-content">
        <div
          v-for="(item, index) in infoItems"
          :key="index"
          class="pd-detailForm-workInfoCard-item"
        >
          <!-- 用户图标 -->
          <div
            v-if="item.icon === 'user'"
            class="pd-detailForm-workInfoCard-iconWrapper"
          >
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
              class="pd-detailForm-workInfoCard-icon"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>

          <!-- 时钟图标 -->
          <div
            v-else-if="item.icon === 'clock'"
            class="pd-detailForm-workInfoCard-iconWrapper"
          >
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
              class="pd-detailForm-workInfoCard-icon"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>

          <!-- 日历图标 -->
          <div
            v-else-if="item.icon === 'calendar'"
            class="pd-detailForm-workInfoCard-iconWrapper"
          >
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
              class="pd-detailForm-workInfoCard-icon"
            >
              <path d="M8 2v4"></path>
              <path d="M16 2v4"></path>
              <rect width="18" height="18" x="3" y="4" rx="2"></rect>
              <path d="M3 10h18"></path>
            </svg>
          </div>

          <!-- 日历完成图标 -->
          <div
            v-else-if="item.icon === 'calendar-check'"
            class="pd-detailForm-workInfoCard-iconWrapper"
          >
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
              class="pd-detailForm-workInfoCard-icon"
            >
              <path d="M8 2v4"></path>
              <path d="M16 2v4"></path>
              <rect width="18" height="18" x="3" y="4" rx="2"></rect>
              <path d="M3 10h18"></path>
              <path d="m9 16 2 2 4-4"></path>
            </svg>
          </div>

          <div class="pd-detailForm-workInfoCard-text">
            <p class="pd-detailForm-workInfoCard-label">{{ item.label }}</p>
            <p class="pd-detailForm-workInfoCard-value">{{ item.value }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pd-detailForm-workInfoCard-container {
  display: block;
}

.pd-detailForm-workInfoCard-card {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5e5;
  border-radius: 0.75rem;
  background-color: #ffffff;
  padding: 1.5rem 0;
  height: 100%;
  color: #333333;
}

.pd-detailForm-workInfoCard-header {
  padding: 0 1.5rem;
}

.pd-detailForm-workInfoCard-title {
  margin: 0;
  font-weight: 600;
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.pd-detailForm-workInfoCard-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1.5rem;
}

.pd-detailForm-workInfoCard-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.pd-detailForm-workInfoCard-iconWrapper {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.pd-detailForm-workInfoCard-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #666666;
}

.pd-detailForm-workInfoCard-text {
  flex: 1;
}

.pd-detailForm-workInfoCard-label {
  margin: 0 0 0.25rem 0;
  color: #666666;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.pd-detailForm-workInfoCard-value {
  margin: 0 0 0.25rem 0;
  font-weight: 500;
}
</style>
