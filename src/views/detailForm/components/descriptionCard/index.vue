<!-- src/views/detailForm/components/descriptionCard/index.vue -->
<script setup lang="ts">
const props = defineProps<{
  description: string;
}>();
</script>

<template>
  <div class="pd-detailForm-descriptionCard-container">
    <div class="pd-detailForm-descriptionCard-card">
      <div class="pd-detailForm-descriptionCard-header">
        <h3 class="pd-detailForm-descriptionCard-title">需求描述</h3>
      </div>

      <div class="pd-detailForm-descriptionCard-content">
        <p class="pd-detailForm-descriptionCard-text">
          {{ props.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pd-detailForm-descriptionCard-container {
  display: block;
}

.pd-detailForm-descriptionCard-card {
  display: flex;
  grid-column: span 2;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e5e5;
  border-radius: 0.75rem;
  background-color: #ffffff;
  padding: 1.5rem 0;
  color: #333333;
}

.pd-detailForm-descriptionCard-header {
  padding: 0 1.5rem;
}

.pd-detailForm-descriptionCard-title {
  margin: 0;
  font-weight: 600;
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.pd-detailForm-descriptionCard-content {
  padding: 0 1.5rem;
}

.pd-detailForm-descriptionCard-text {
  margin: 0;
  color: #333333;
  font-size: 0.875rem;
  line-height: 1.625;
  white-space: pre-wrap;
}
</style>
