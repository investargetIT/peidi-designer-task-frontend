<script setup lang="ts">
import { ref } from "vue";

const visible = ref(false);
const imgData = ref("");

const handleClose = () => {
  if (imgData.value) {
    URL.revokeObjectURL(imgData.value);
  }
  imgData.value = "";
};

const initImgPreview = (data: Blob) => {
  // console.log("图片预览:", data);
  const imageUrl = URL.createObjectURL(data);
  imgData.value = imageUrl;
  visible.value = true;
};

defineExpose({
  initImgPreview
});
</script>

<template>
  <div>
    <el-dialog
      v-model="visible"
      title="图片预览"
      width="700"
      @closed="handleClose"
      append-to-body
    >
      <div class="flex justify-center items-center">
        <el-image
          style="width: 600px; height: 600px"
          :src="imgData"
          :fit="'contain'"
        />
      </div>
    </el-dialog>
  </div>
</template>
