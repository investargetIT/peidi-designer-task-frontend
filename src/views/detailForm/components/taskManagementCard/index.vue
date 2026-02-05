<script setup lang="ts">
import { computed, ref } from "vue";
import LsiconSettingOutline from "~icons/lsicon/setting-outline";
import BiClock from "~icons/bi/clock";

interface TaskInfo {
  title: string;
  // ... other properties
}

interface WorkInfo {
  assignee: string;
  estimatedHours: number;
  actualHours: number;
  startTime: string;
  endTime?: string;
  // ... other properties
}

const props = defineProps<{
  taskInfo: TaskInfo;
  workInfo: WorkInfo;
}>();

const status = ref("进行中");
const estimatedHours = ref(props.workInfo.estimatedHours);
const actualHours = ref(props.workInfo.actualHours);

const statusOptions = [
  { value: "待补充", label: "待补充", colorClass: "bg-yellow-400" },
  { value: "普通队列", label: "普通队列", colorClass: "bg-blue-300" },
  { value: "插单待处理", label: "插单待处理", colorClass: "bg-orange-400" },
  { value: "进行中", label: "进行中", colorClass: "bg-green-300" },
  { value: "已完成", label: "已完成", colorClass: "bg-gray-300" },
  { value: "已外包", label: "已外包", colorClass: "bg-purple-300" }
];

// 计算属性控制按钮显示逻辑
const showStartButton = computed(() => status.value === "普通队列");
const showCompleteButton = computed(() => status.value === "进行中");

const getCurrentStatusColor = () => {
  const currentOption = statusOptions.find(
    option => option.value === status.value
  );
  return currentOption ? currentOption.colorClass : "";
};

const handleSave = () => {
  // 保存逻辑
  console.log("保存更改");
};
</script>

<template>
  <div class="bg-white flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
    <div class="px-6">
      <h3 class="font-semibold text-lg flex items-center gap-2 text-gray-800">
        <el-icon size="24">
          <LsiconSettingOutline />
        </el-icon>
        任务管理
      </h3>
    </div>

    <div class="px-6 space-y-2">
      <el-button type="primary" class="w-full" v-if="showStartButton">
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-play"
          >
            <polygon points="6 3 20 12 6 21 6 3"></polygon>
          </svg>
        </template>
        开始工作
      </el-button>

      <el-button type="primary" class="w-full" v-if="showCompleteButton">
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-circle-check-big"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <path d="m9 11 3 3L22 4"></path>
          </svg>
        </template>
        标记完成
      </el-button>
    </div>

    <div class="px-6 space-y-4">
      <!-- 当前负责人 -->
      <div class="p-3 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-600 mb-1">当前负责人</p>
        <div class="flex items-center gap-2">
          <div
            class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center"
          >
            <span class="text-sm font-medium text-blue-600">
              {{ workInfo.assignee.charAt(0) }}
            </span>
          </div>
          <div>
            <p class="font-medium">{{ workInfo.assignee }}</p>
            <el-tag type="primary">主职任务</el-tag>
          </div>
        </div>
      </div>

      <!-- 需求状态 -->
      <div class="space-y-2">
        <label
          class="flex items-center gap-2 text-sm font-medium text-gray-700"
        >
          需求状态
        </label>
        <el-select v-model="status" placeholder="请选择状态" class="w-full">
          <template #prefix>
            <div
              v-if="status"
              class="h-2 w-2 rounded-full ml-1"
              :class="getCurrentStatusColor()"
            ></div>
          </template>
          <el-option
            v-for="option in statusOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          >
            <div class="flex items-center gap-2">
              <div
                class="h-2 w-2 rounded-full"
                :class="option.colorClass"
              ></div>
              {{ option.label }}
            </div>
          </el-option>
        </el-select>
      </div>

      <!-- 预计工时 -->
      <div class="space-y-2">
        <label
          class="flex items-center gap-2 text-sm font-medium text-gray-700"
        >
          <el-icon size="14">
            <BiClock />
          </el-icon>
          预计工时（小时）
        </label>
        <el-input-number
          v-model="estimatedHours"
          :min="0"
          :max="999"
          placeholder="输入预计工时"
          class="w-full"
        />
      </div>

      <!-- 实际工时 -->
      <div class="space-y-2">
        <label
          class="flex items-center gap-2 text-sm font-medium text-gray-700"
        >
          <el-icon size="14">
            <BiClock />
          </el-icon>
          实际工时（小时）
        </label>
        <el-input-number
          v-model="actualHours"
          :min="0"
          :max="999"
          placeholder="输入实际工时"
          class="w-full"
        />
      </div>

      <!-- 时间信息 -->
      <div class="p-3 bg-gray-100 rounded-lg space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-600">开始时间</span>
          <span>{{ workInfo.startTime }}</span>
        </div>
        <div v-if="workInfo.endTime" class="flex justify-between">
          <span class="text-gray-600">完成时间</span>
          <span>{{ workInfo.endTime }}</span>
        </div>
      </div>

      <!-- 保存按钮 -->
      <el-button type="primary" plain class="w-full" @click="handleSave">
        保存更改
      </el-button>
    </div>
  </div>
</template>
