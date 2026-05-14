<script setup lang="ts">
import { ref, watch, computed } from "vue";

const props = defineProps({
  taskDetail: {
    type: Object,
    required: true
  }
});

const verification = ref("");

watch(
  () => props.taskDetail,
  () => {
    verification.value = props.taskDetail.verificationResult || "";
  },
  {
    immediate: true
  }
);

const hasResult = computed(() => !!verification.value);
</script>

<template>
  <div class="pd-detailForm-verificationResultCard-container">
    <div class="pd-detailForm-verificationResultCard-card">
      <div class="pd-detailForm-verificationResultCard-header">
        <div class="pd-detailForm-verificationResultCard-header-left">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="pd-detailForm-verificationResultCard-header-icon"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <h3 class="pd-detailForm-verificationResultCard-title">AI校验结果</h3>
        </div>
      </div>

      <div class="pd-detailForm-verificationResultCard-hint">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="pd-detailForm-verificationResultCard-hint-icon"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
        <span class="pd-detailForm-verificationResultCard-hint-text">
          AI自动查找文件名含「信息模板」的Excel和含「结果」的图片进行校验
        </span>
      </div>

      <div class="pd-detailForm-verificationResultCard-content">
        <!-- 有校验结果 -->
        <div v-if="hasResult" class="pd-detailForm-verificationResultCard-result">
          <p class="pd-detailForm-verificationResultCard-text">{{ verification }}</p>
        </div>

        <!-- 占位提示 -->
        <div v-else class="pd-detailForm-verificationResultCard-placeholder">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="pd-detailForm-verificationResultCard-placeholder-icon"
          >
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
          <p class="pd-detailForm-verificationResultCard-placeholder-text">
            暂无校验结果
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pd-detailForm-verificationResultCard-container {
  display: block;
}

.pd-detailForm-verificationResultCard-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-shadow:
    0 2px 8px 0 rgba(0, 0, 0, 0.08),
    0 1px 2px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
  padding: 1.25rem;
  height: 100%;
  color: #333333;
  overflow: hidden;
}

.pd-detailForm-verificationResultCard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pd-detailForm-verificationResultCard-header-left {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.pd-detailForm-verificationResultCard-header-icon {
  color: #3b82f6;
}

.pd-detailForm-verificationResultCard-title {
  margin: 0;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.5;
  color: #1f2937;
}

.pd-detailForm-verificationResultCard-hint {
  display: flex;
  align-items: flex-start;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  background-color: #eff6ff;
  border-radius: 8px;
  border: 1px solid #dbeafe;
}

.pd-detailForm-verificationResultCard-hint-icon {
  color: #3b82f6;
  flex-shrink: 0;
  margin-top: 1px;
}

.pd-detailForm-verificationResultCard-hint-text {
  font-size: 0.75rem;
  color: #1e40af;
  line-height: 1.5;
}

.pd-detailForm-verificationResultCard-content {
  flex: 1;
  min-height: 0;
}

.pd-detailForm-verificationResultCard-result {
  padding: 1rem;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  max-height: 200px;
  overflow-y: auto;
}

.pd-detailForm-verificationResultCard-text {
  margin: 0;
  color: #374151;
  font-size: 0.875rem;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
}

.pd-detailForm-verificationResultCard-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem 1rem;
  background-color: #f9fafb;
  border-radius: 10px;
  border: 1px dashed #d1d5db;
}

.pd-detailForm-verificationResultCard-placeholder-icon {
  color: #d1d5db;
}

.pd-detailForm-verificationResultCard-placeholder-text {
  margin: 0;
  font-size: 0.875rem;
  color: #9ca3af;
  text-align: center;
}

/* 滚动条样式 */
.pd-detailForm-verificationResultCard-result::-webkit-scrollbar {
  width: 4px;
}

.pd-detailForm-form-result::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 2px;
}

.pd-detailFormFormForm::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

.pd-detailFormFormForm:hover::-webkit-scrollbar-thumb {
  background: #9ca3af;
}
</style>
