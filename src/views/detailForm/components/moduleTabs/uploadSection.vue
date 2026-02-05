<script setup lang="ts">
import { ref, reactive } from "vue";
import { UploadFilled, Document, Picture } from "@element-plus/icons-vue";
import LucideImageUp from "~icons/lucide/image-up";
import IconamoonEye from "~icons/iconamoon/eye";
import TablerDownload from "~icons/tabler/download";
import RiDeleteBinLine from "~icons/ri/delete-bin-line";

interface UploadFile {
  id: number;
  name: string;
  size: string;
  type: string;
  url: string;
  uploadTime: string;
}

const uploadedFiles = reactive<UploadFile[]>([
  {
    id: 1,
    name: "壁纸.png",
    size: "2.2 MB",
    type: "image/png",
    url: "",
    uploadTime: "2026/2/5 15:22:43"
  }
]);

// 修改处理函数，正确处理 Element Plus upload 组件的回调参数
const handleFileUpload = (uploadFile: any) => {
  const file = uploadFile.raw; // 获取原始文件对象
  if (!file) return false;

  const newFile: UploadFile = {
    id: uploadedFiles.length + 1,
    name: file.name,
    size: formatFileSize(file.size),
    type: file.type,
    url: URL.createObjectURL(file),
    uploadTime: new Date().toLocaleString("zh-CN")
  };
  uploadedFiles.push(newFile);
  console.log("上传文件:", file);
  return false; // 阻止自动上传
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const previewFile = (file: UploadFile) => {
  window.open(file.url, "_blank");
};

const downloadFile = (file: UploadFile) => {
  const link = document.createElement("a");
  link.href = file.url;
  link.download = file.name;
  link.click();
};

const deleteFile = (id: number) => {
  const index = uploadedFiles.findIndex(file => file.id === id);
  if (index > -1) {
    uploadedFiles.splice(index, 1);
  }
};
</script>

<template>
  <div class="mt-4">
    <el-card>
      <div class="flex items-center gap-2 mb-8">
        <el-icon size="24">
          <LucideImageUp />
        </el-icon>
        <span class="font-semibold text-lg">作品上传</span>
      </div>

      <div class="space-y-6">
        <!-- 上传区域 -->
        <el-upload
          class="w-full"
          drag
          :auto-upload="false"
          :on-change="handleFileUpload"
          :show-file-list="false"
          multiple
          accept="image/*,.pdf,.ai,.psd,.sketch,.fig"
        >
          <el-icon class="el-icon--upload">
            <UploadFilled />
          </el-icon>
          <div class="el-upload__text">
            拖拽文件到此处，或<em>点击选择文件</em>
          </div>
          <div class="el-upload__tip">支持 JPG、PNG、PDF、AI、PSD 等格式</div>
        </el-upload>

        <!-- 已上传文件列表 -->
        <div v-if="uploadedFiles.length > 0" class="space-y-3">
          <div class="text-sm font-medium mb-2">
            已上传文件 ({{ uploadedFiles.length }})
          </div>

          <div
            v-for="file in uploadedFiles"
            :key="file.id"
            class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div
              class="h-12 w-12 rounded bg-gray-200 flex items-center justify-center overflow-hidden"
            >
              <el-icon v-if="file.type.startsWith('image/')" size="24">
                <Picture />
              </el-icon>
              <el-icon v-else size="24">
                <Document />
              </el-icon>
            </div>

            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ file.name }}</p>
              <p class="text-xs text-gray-500">
                {{ file.size }} · {{ file.uploadTime }}
              </p>
            </div>

            <div class="flex gap-1">
              <el-button text size="small" @click="previewFile(file)">
                <el-icon size="16">
                  <IconamoonEye />
                </el-icon>
              </el-button>

              <el-button text size="small" @click="downloadFile(file)">
                <el-icon size="16">
                  <TablerDownload />
                </el-icon>
              </el-button>

              <el-button
                text
                size="small"
                type="danger"
                @click="deleteFile(file.id)"
              >
                <el-icon size="16">
                  <RiDeleteBinLine />
                </el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-upload-dragger) {
  width: 100%;
  padding: 24px;
}

:deep(.el-upload__tip) {
  color: #999;
  font-size: 12px;
}
</style>
