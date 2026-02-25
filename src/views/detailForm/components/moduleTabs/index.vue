<script setup lang="ts">
import { ref, watch } from "vue";
import uploadSection from "./uploadSection.vue";
import notesSection from "./notesSection.vue";

const props = defineProps<{
  recordDetail: any;
  newRecordFn: (data: any, callback?: () => void) => void;
}>();

const activeTab = ref("uploads");

const tabs = ref([
  { id: "uploads", label: "作品上传", count: 0 },
  { id: "logs", label: "任务日志", count: 0 }
]);

const handleTabChange = (tabId: string) => {
  activeTab.value = tabId;
};

watch(
  () => props.recordDetail,
  newValue => {
    tabs.value[1].count = newValue.descriptionExt?.logList?.length || 0;
  }
);
</script>

<template>
  <div class="pd-detailForm-moduleTabs">
    <!-- Tabs 导航 -->
    <div
      role="tablist"
      aria-orientation="horizontal"
      data-slot="tabs-list"
      class="pd-detailForm-moduleTabs__list"
      tabindex="0"
      data-orientation="horizontal"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        role="tab"
        :aria-selected="activeTab === tab.id"
        :aria-controls="`tab-content-${tab.id}`"
        :data-state="activeTab === tab.id ? 'active' : 'inactive'"
        :id="`tab-trigger-${tab.id}`"
        data-slot="tabs-trigger"
        class="pd-detailForm-moduleTabs__trigger"
        :class="{
          'pd-detailForm-moduleTabs__trigger--active': activeTab === tab.id
        }"
        :tabindex="activeTab === tab.id ? '0' : '-1'"
        data-orientation="horizontal"
        data-radix-collection-item=""
        @click="handleTabChange(tab.id)"
      >
        {{ tab.label }} ({{ tab.count }})
      </button>
    </div>

    <!-- Tab 内容区域 -->
    <div class="pd-detailForm-moduleTabs__content-area">
      <!-- 作品上传 Tab -->
      <div
        v-show="activeTab === 'uploads'"
        id="tab-content-uploads"
        role="tabpanel"
        aria-labelledby="tab-trigger-uploads"
        data-slot="tabs-content"
        class="pd-detailForm-moduleTabs__panel"
      >
        <uploadSection />
      </div>

      <!-- 任务日志 Tab -->
      <div
        v-show="activeTab === 'logs'"
        id="tab-content-logs"
        role="tabpanel"
        aria-labelledby="tab-trigger-logs"
        data-slot="tabs-content"
        class="pd-detailForm-moduleTabs__panel"
      >
        <notesSection
          :recordDetail="props.recordDetail"
          :newRecordFn="props.newRecordFn"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pd-detailForm-moduleTabs {
  &__list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: center;
    align-items: center;
    outline: none;
    border-radius: 0.5rem;
    background-color: rgb(224, 224, 224);
    padding: 3px;
    width: 100%;
    height: 2.25rem;
    color: #64748b;
  }

  &__trigger {
    display: inline-flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    gap: 0.375rem;
    transition:
      color 0.2s,
      box-shadow 0.2s;
    cursor: pointer;
    border: 1px solid transparent;
    border-radius: 0.375rem;
    background-color: transparent;
    padding: 0.25rem 0.5rem;
    height: calc(100% - 1px);
    color: #0f172a;
    font-weight: 500;
    font-size: 0.875rem;
    white-space: nowrap;

    &:focus-visible {
      outline: 1px solid #3b82f6;
      outline-offset: 1px;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
      border-color: #3b82f6;
    }

    &:disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    &--active {
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      border-color: #e2e8f0;
      background-color: #ffffff;
      color: #0f172a;
    }
  }

  &__content-area {
    margin-top: 1rem;
  }

  &__panel {
    // 面板样式可以根据需要添加
  }

  /* Dark mode variants */
  @media (prefers-color-scheme: dark) {
    &__list {
      background-color: rgb(224, 224, 224);
      color: #94a3b8;
    }

    &__trigger {
      color: #f1f5f9;

      &--active {
        border-color: #334155;
        background-color: #0f172a;
        color: #f1f5f9;
      }
    }
  }
}
</style>
