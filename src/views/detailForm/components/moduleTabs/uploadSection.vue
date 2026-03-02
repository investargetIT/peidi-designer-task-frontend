<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import { UploadFilled, Document, Picture } from "@element-plus/icons-vue";
import {
  default_upload_url,
  testAllIPs,
  chaohuiDownload
} from "@/utils/chaohuiapi_pro";
import LucideImageUp from "~icons/lucide/image-up";
import IconamoonEye from "~icons/iconamoon/eye";
import TablerDownload from "~icons/tabler/download";
import RiDeleteBinLine from "~icons/ri/delete-bin-line";
import { ElMessage, ElMessageBox } from "element-plus";
import { storageLocal } from "@pureadmin/utils";
import dayjs from "dayjs";
import ImgDialog from "./imgDialog.vue";

const USER_INFO: any = storageLocal().getItem("dataSource");

const props = defineProps({
  recordDetail: {
    type: Object,
    required: true
  },
  taskDetail: {
    type: Object,
    required: true
  },
  newRecordFn: {
    type: Function,
    required: true
  }
});

//#region 预览图片
const imgDialogRef = ref(null);
//#endregion

const sid = ref("");
const postUrl = ref("");
const uploadRef = ref<any>(null);

interface UploadFile {
  name: string;
  size: string;
  type: string;
  url: string;
  uploadTime: string;
}

const uploadedFiles = ref<UploadFile[]>([
  // {
  //   name: "壁纸.png",
  //   size: "2.2 MB",
  //   type: "image/png",
  //   url: "",
  //   uploadTime: "2026/2/5 15:22:43"
  // }
]);

// 处理文件上传
const handleFileUpload = (file: any) => {
  // console.log("上传组件变化:", file);
  if (file.response) {
    return;
  }
  const fileRaw = file.raw; // 获取原始文件对象

  const { name, type, lastModified } = fileRaw;

  const dotIndex = name.lastIndexOf(".");
  const fileNameWithoutExtension = name.slice(0, dotIndex);
  const fileExtension = name.slice(dotIndex);
  const fileName = `${fileNameWithoutExtension}_${Date.now()}${fileExtension}`; // 如果可以上传多个文件，这里需要用fileList.forEach()处理
  let newFile: any = new File([fileRaw], fileName, {
    type: type,
    lastModified: lastModified
  });
  newFile.uid = fileRaw.uid; // new File 没有uid属性，会导致组件底层报错，这里手动加上
  file.raw = newFile; // 用newFile替换file的数据
  uploadRef.value.submit();
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// 处理上传成功
const handleUploadSuccess = (res: any, file: any) => {
  // console.log("上传成功:", res, file);

  const fileRaw = file.raw; // 获取原始文件对象
  if (!fileRaw) return false;

  const newFile: UploadFile = {
    name: fileRaw.name,
    size: formatFileSize(fileRaw.size),
    type: fileRaw.type,
    url: URL.createObjectURL(fileRaw),
    uploadTime: new Date().toLocaleString("zh-CN")
  };
  // uploadedFiles.push(newFile);
  const newFileList = [...uploadedFiles.value, newFile];
  props.newRecordFn({
    ...props.recordDetail,
    requestId: props.taskDetail.id,
    createdAt: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
    userName: USER_INFO?.username || "",
    userId: USER_INFO?.id || null,
    content: JSON.stringify({
      ...props.recordDetail.content,
      fileList: newFileList
    }),
    descriptionExt: JSON.stringify({
      ...props.recordDetail.descriptionExt
    })
  });
};

// 处理上传错误
const handleUploadError = (err: any, file: any) => {
  console.error("上传错误:", err, file);
  ElMessage.error("文件上传失败:" + JSON.stringify(err));
};

//#region 操作文件逻辑
const previewFile = async (file: UploadFile) => {
  const imgData = await chaohuiDownload(file.name, "preview");
  // console.log("预览文件:", imgData);
  imgDialogRef.value.initImgPreview(imgData);
};

const downloadFile = (file: UploadFile) => {
  // console.log("下载文件:", file);
  chaohuiDownload(file.name);
};

const deleteFile = (fileName: string) => {
  ElMessageBox.confirm(`确定删除文件${fileName}吗？`, "删除确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      const index = uploadedFiles.value.findIndex(
        file => file.name === fileName
      );
      if (index > -1) {
        // 创建新的文件列表（不包含要删除的文件）
        const updatedFileList = uploadedFiles.value.filter(
          file => file.name !== fileName
        );

        // 同步更新到recordDetail
        props.newRecordFn({
          ...props.recordDetail,
          requestId: props.taskDetail.id,
          createdAt: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
          userName: USER_INFO?.username || "",
          userId: USER_INFO?.id || null,
          content: JSON.stringify({
            ...props.recordDetail.content,
            fileList: updatedFileList
          }),
          descriptionExt: JSON.stringify({
            ...props.recordDetail.descriptionExt
          })
        });
      }
    })
    .catch(() => {});
};
//#endregion

// 初始化NAS插件
const initNAS = async () => {
  try {
    const res: any = await testAllIPs();
    if (res?.sid) {
      sid.value = res.sid;
      postUrl.value = res.postUrl;
      // console.log("NAS初始化成功:", { sid: res.sid, postUrl: res.postUrl });
    } else {
      console.warn("NAS初始化返回数据不完整:", res);
      ElMessage.error("NAS初始化返回数据不完整");
    }
  } catch (error) {
    console.error("NAS初始化失败:", error);
    ElMessage.error("文件服务器连接失败，请稍后重试");
  }
};

onMounted(async () => {
  await initNAS();
});

watch(
  () => props.recordDetail,
  newValue => {
    if (newValue.content?.fileList) {
      uploadedFiles.value = newValue.content.fileList;
    }
  }
);
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
          ref="uploadRef"
          class="w-full"
          drag
          :auto-upload="false"
          :on-change="handleFileUpload"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :show-file-list="false"
          accept="image/*,.pdf,.ai,.psd,.sketch,.fig"
          :action="postUrl"
          :data="{
            path: default_upload_url,
            create_parents: false
          }"
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
            :key="file.name"
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
              <el-button
                text
                size="small"
                @click="previewFile(file)"
                :disabled="!file.type.startsWith('image/')"
              >
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
                @click="deleteFile(file.name)"
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

    <ImgDialog ref="imgDialogRef" />
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
