<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { Upload } from "@element-plus/icons-vue";
import RiChat4Line from "~icons/ri/chat-4-line";
import LucideSend from "~icons/lucide/send";
import { storageLocal } from "@pureadmin/utils";
import dayjs from "dayjs";

const USER_INFO: any = storageLocal().getItem("dataSource");

const props = defineProps<{
  taskDetail: any;
  recordDetail: any;
  newRecordFn: (data: any, callback?: () => void) => void;
}>();

export interface LogItem {
  id: number;
  type: "message" | "upload";
  user: string;
  content: string;
  timestamp: string;
}

const notes = ref("");
const logList = ref<LogItem[]>([
  // {
  //   id: 1,
  //   type: "message",
  //   user: "陈经理",
  //   content: "11",
  //   timestamp: "2026/2/5 15:39:03"
  // },
  // {
  //   id: 2,
  //   type: "upload",
  //   user: "陈经理",
  //   content: "上传了 1 个文件：壁纸.png",
  //   timestamp: "2026/2/5 15:22:43"
  // },
  // {
  //   id: 3,
  //   type: "message",
  //   user: "陈经理",
  //   content: "11",
  //   timestamp: "2026/2/5 15:22:31"
  // },
  // {
  //   id: 4,
  //   type: "message",
  //   user: "陈经理",
  //   content: "11",
  //   timestamp: "2026/2/5 15:22:29"
  // }
]);

const addNote = () => {
  if (notes.value.trim()) {
    const newLog: LogItem = {
      id: logList.value.length + 1,
      type: "message",
      user: USER_INFO?.username || "",
      content: notes.value,
      timestamp: new Date().toLocaleString("zh-CN")
    };
    const newLogList = [newLog, ...logList.value];
    props.newRecordFn(
      {
        ...props.recordDetail,
        requestId: props.taskDetail.id,
        createdAt: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
        userName: USER_INFO?.username || "",
        userId: USER_INFO?.id || null,
        content: JSON.stringify({
          ...props.recordDetail.content
        }),
        descriptionExt: JSON.stringify({
          ...props.recordDetail.descriptionExt,
          logList: newLogList
        })
      },
      () => {
        notes.value = "";
      }
    );
  }
};

watch(
  () => props.recordDetail,
  newValue => {
    if (newValue.descriptionExt?.logList) {
      logList.value = newValue.descriptionExt?.logList;
    } else {
      logList.value = [];
    }
  }
);
</script>

<template>
  <div class="mt-4">
    <el-card style="border-radius: 10px">
      <div class="flex items-center gap-2 mb-8">
        <el-icon size="24">
          <RiChat4Line />
        </el-icon>
        <span class="font-semibold text-lg">任务日志</span>
      </div>

      <div class="space-y-4">
        <div class="space-y-2">
          <el-input
            v-model="notes"
            type="textarea"
            :rows="3"
            placeholder="添加备注或进度说明..."
          />
          <el-button
            type="primary"
            @click="addNote"
            :disabled="!notes.trim()"
            class="w-full"
          >
            <el-icon size="16" class="mr-2">
              <LucideSend />
            </el-icon>
            添加备注
          </el-button>
        </div>

        <div class="space-y-3 max-h-[400px] overflow-y-auto">
          <div v-for="log in logList" :key="log.id" class="flex gap-3">
            <div
              class="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0"
              :class="{
                'bg-blue-100 text-blue-600': log.type === 'message',
                'bg-purple-100 text-purple-600': log.type === 'upload'
              }"
            >
              <RiChat4Line v-if="log.type === 'message'" class="w-4 h-4" />
              <Upload v-else class="w-4 h-4" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm font-medium">{{ log.user }}</span>
                <span class="text-xs text-muted-foreground">{{
                  log.timestamp
                }}</span>
              </div>
              <p class="text-sm text-muted-foreground">{{ log.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
