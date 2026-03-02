<script setup lang="ts">
import { ref } from "vue";

type DialogType = "task_need_staus"; // 任务需求状态

const visible = ref(false);
const dialogType = ref("task_need_staus");

defineExpose({
  show(type: DialogType) {
    dialogType.value = type;
    visible.value = true;
  }
});
</script>

<template>
  <div>
    <el-dialog v-model="visible" title="解释说明" width="600" append-to-body>
      <div
        class="text-[#0a0a0a] text-[14px]"
        v-if="dialogType === 'task_need_staus'"
      >
        <p class="font-bold mb-[10px]">目前任务需求状态可改变的顺序为：</p>
        <ul class="list-disc list-inside space-y-1">
          <li class="ml-4">1. 草稿-待分配-待审核-进行中-已完成待审核-已完成</li>
          <li class="ml-4">2. 已外包-已完成待审核-已完成</li>
          <li class="ml-4">3. 插单处理-已完成待审核-已完成</li>
        </ul>

        <p class="block font-bold mb-[10px]" style="margin-top: 10px">
          注意：已关闭一直禁用，有额外的作废按钮
        </p>
      </div>

      <template #footer>
        <div>
          <el-button type="primary" @click="visible = false">
            已了解
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
