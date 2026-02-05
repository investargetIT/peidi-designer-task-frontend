<script setup lang="ts">
import ContentForm from "./components/contentForm/index.vue";
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2 text-gray-800">提交设计需求</h1>
      <p class="text-gray-600">
        填写需求信息后，系统将自动判断资源情况并分配到相应队列
      </p>
    </div>

    <div>
      <ContentForm />
    </div>
  </div>
</template>
