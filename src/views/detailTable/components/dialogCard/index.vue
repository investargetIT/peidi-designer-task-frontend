<script setup lang="ts">
import { ref } from "vue";
import DetailForm from "@/views/detailForm/index.vue";

const dialogVisible = ref(false);

const requestId = ref(null);
const initDialog = (id: string) => {
  requestId.value = id;
  dialogVisible.value = true;

  // console.log("打开详情弹窗:", id);
};

defineExpose({
  initDialog
});
</script>

<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :title="'任务详情'"
      width="1300"
      :close-on-click-modal="false"
      append-to-body
      top="2vh"
    >
      <DetailForm :resquestId="requestId" />
    </el-dialog>
  </div>
</template>
