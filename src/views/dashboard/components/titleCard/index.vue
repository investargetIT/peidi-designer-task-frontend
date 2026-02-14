<script setup lang="ts">
import { useRouter } from "vue-router";
import PixelarticonsPlus from "~icons/pixelarticons/plus";

const router = useRouter();

const props = defineProps({
  totalRequests: {
    type: Number,
    required: true
  }
});
const getBadgeClass = () => {
  return "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700";
};

const handleAddClick = () => {
  router.push({ name: "提交设计需求" });
};
</script>

<template>
  <div class="pb-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold mb-2 text-gray-800">设计师任务管理</h1>
        <p class="text-gray-600">系统自动判断资源情况，智能分配任务队列</p>
      </div>
      <div class="flex items-center gap-3">
        <el-button type="primary" @click="handleAddClick">
          <el-icon>
            <PixelarticonsPlus />
          </el-icon>
          新建需求
        </el-button>
      </div>
    </div>

    <div class="flex gap-6 mt-6">
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600">总需求数</span>
        <span :class="getBadgeClass()">
          {{ props.totalRequests }}
        </span>
      </div>
    </div>
  </div>
</template>
