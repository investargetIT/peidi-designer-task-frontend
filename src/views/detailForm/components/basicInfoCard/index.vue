<!-- src/views/detailForm/components/basicInfoCard/index.vue -->
<script setup lang="ts">
import { ref, watch } from "vue";

interface BasicInfo {
  designType: string;
  subType: string;
  deadline: string;
  usageScenario: string;
  impactRange: string;
  submitter: string;
  priority: string;
  status: string;
}

const props = defineProps({
  info: {
    type: Object as () => BasicInfo,
    required: true
  }
});

// 信息项配置数组
const infoItems = ref([
  {
    icon: "layers",
    label: "设计类型",
    value: "",
    subValue: ""
  },
  {
    icon: "calendar",
    label: "截止时间",
    value: ""
  },
  {
    icon: "target",
    label: "使用场景",
    value: ""
  },
  {
    icon: "circle-alert",
    label: "影响范围",
    value: ""
  },
  {
    icon: "user",
    label: "提交人",
    value: ""
  }
]);

watch(
  () => props.info,
  newInfo => {
    infoItems.value = [
      {
        icon: "layers",
        label: "设计类型",
        value: newInfo.designType,
        subValue: newInfo.subType
      },
      {
        icon: "calendar",
        label: "截止时间",
        value: newInfo.deadline
      },
      {
        icon: "target",
        label: "使用场景",
        value: newInfo.usageScenario
      },
      {
        icon: "circle-alert",
        label: "影响范围",
        value: newInfo.impactRange
      },
      {
        icon: "user",
        label: "提交人",
        value: newInfo.submitter
      }
    ];
  },
  {
    immediate: true
  }
);
</script>
<template>
  <div class="pd-detailForm-basicInfoCard-container">
    <div class="pd-detailForm-basicInfoCard-card">
      <div class="pd-detailForm-basicInfoCard-header">
        <h3 class="pd-detailForm-basicInfoCard-title">基本信息</h3>
      </div>

      <div class="pd-detailForm-basicInfoCard-content">
        <div
          v-for="(item, index) in infoItems"
          :key="index"
          class="pd-detailForm-basicInfoCard-item"
        >
          <!-- 设计类型图标 -->
          <div
            v-if="item.icon === 'layers'"
            class="pd-detailForm-basicInfoCard-iconWrapper"
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
              class="pd-detailForm-basicInfoCard-icon"
            >
              <path
                d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"
              ></path>
              <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"></path>
              <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"></path>
            </svg>
          </div>

          <!-- 日历图标 -->
          <div
            v-else-if="item.icon === 'calendar'"
            class="pd-detailForm-basicInfoCard-iconWrapper"
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
              class="pd-detailForm-basicInfoCard-icon"
            >
              <path d="M8 2v4"></path>
              <path d="M16 2v4"></path>
              <rect width="18" height="18" x="3" y="4" rx="2"></rect>
              <path d="M3 10h18"></path>
            </svg>
          </div>

          <!-- 目标图标 -->
          <div
            v-else-if="item.icon === 'target'"
            class="pd-detailForm-basicInfoCard-iconWrapper"
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
              class="pd-detailForm-basicInfoCard-icon"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="6"></circle>
              <circle cx="12" cy="12" r="2"></circle>
            </svg>
          </div>

          <!-- 警告图标 -->
          <div
            v-else-if="item.icon === 'circle-alert'"
            class="pd-detailForm-basicInfoCard-iconWrapper"
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
              class="pd-detailForm-basicInfoCard-icon"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" x2="12" y1="8" y2="12"></line>
              <line x1="12" x2="12.01" y1="16" y2="16"></line>
            </svg>
          </div>

          <!-- 用户图标 -->
          <div
            v-else-if="item.icon === 'user'"
            class="pd-detailForm-basicInfoCard-iconWrapper"
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
              class="pd-detailForm-basicInfoCard-icon"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>

          <div class="pd-detailForm-basicInfoCard-text">
            <p class="pd-detailForm-basicInfoCard-label">{{ item.label }}</p>
            <p class="pd-detailForm-basicInfoCard-value">{{ item.value }}</p>
            <p
              v-if="item.subValue"
              class="pd-detailForm-basicInfoCard-subValue"
            >
              {{ item.subValue }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pd-detailForm-basicInfoCard-container {
  display: block;
}

.pd-detailForm-basicInfoCard-card {
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

.pd-detailForm-basicInfoCard-header {
  padding: 0 1.5rem;
}

.pd-detailForm-basicInfoCard-title {
  margin: 0;
  font-weight: 600;
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.pd-detailForm-basicInfoCard-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1.5rem;
}

.pd-detailForm-basicInfoCard-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.pd-detailForm-basicInfoCard-iconWrapper {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.pd-detailForm-basicInfoCard-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #666666;
}

.pd-detailForm-basicInfoCard-text {
  flex: 1;
}

.pd-detailForm-basicInfoCard-label {
  margin: 0 0 0.25rem 0;
  color: #666666;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.pd-detailForm-basicInfoCard-value {
  margin: 0 0 0.25rem 0;
  font-weight: 500;
}

.pd-detailForm-basicInfoCard-subValue {
  margin: 0;
  color: #666666;
  font-size: 0.875rem;
  line-height: 1.25rem;
}
</style>
