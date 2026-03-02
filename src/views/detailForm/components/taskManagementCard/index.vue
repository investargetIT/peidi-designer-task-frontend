<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { DESIGN_ENUM_OPTIONS } from "@/constants/design";
import ExplanationDialog from "@/views/explanationDialog/index.vue";
import LsiconSettingOutline from "~icons/lsicon/setting-outline";
import BiClock from "~icons/bi/clock";
import { QuestionFilled } from "@element-plus/icons-vue";

const props = defineProps<{
  taskDetail: any;
  recordDetail: any;
  designers: any;
  updateFn: (data: any) => void;
  newRecordFn: (data: any, callback?: () => void) => void;
}>();

const explanationDialogRef = ref(null);

const status = ref();
const estimatedHours = ref(0);
const actualHours = ref(0);
const assignedTo = ref(""); // 负责人ID

// 计算属性控制按钮显示逻辑
// const showStartButton = computed(() => status.value === "PENDING");
// const showCompleteButton = computed(() => status.value === "IN_PROGRESS");

//#region 判断选项是否应该被禁用的函数
/* 
  1. 草稿-待分配-待审核-进行中-已完成待审核-已完成
  2. 草稿-待分配-待审核-已外包-已完成待审核-已完成
  3. 草稿-待分配-待审核-插单处理-已完成待审核-已完成
  4. 已关闭一直禁用，有额外的操作按钮
 */
const isOptionDisabled = (optionValue: string) => {
  const currentStatus = props.taskDetail?.basicInfo?.statusSource;

  // 如果当前没有状态或选择的是自己，则不禁用
  if (!currentStatus || currentStatus === optionValue) {
    return false;
  }

  // 定义状态转换规则
  const statusTransitionRules: Record<string, string[]> = {
    // 草稿
    DRAFT: ["PENDING"],
    // 待分配
    PENDING: ["REVIEW"],
    // 待审核
    REVIEW: ["IN_PROGRESS"],
    // 进行中
    IN_PROGRESS: ["COMPLETED_REVIEW"],
    // 已外包
    OUTSOURCED: ["COMPLETED_REVIEW"],
    // 插单处理
    RUSH: ["COMPLETED_REVIEW"],
    // 已完成待审核
    COMPLETED_REVIEW: ["COMPLETED"],
    // 已完成
    COMPLETED: [],
    // 已关闭
    CLOSE: []
  };

  // 获取允许转换的状态列表
  const allowedTransitions = statusTransitionRules[currentStatus] || [];

  // 如果目标状态不在允许列表中，则禁用
  return !allowedTransitions.includes(optionValue);
};
//#endregion

const getCurrentStatusColor = () => {
  const currentOption = DESIGN_ENUM_OPTIONS.TASK_STATUS.find(
    option => option.value === status.value
  );
  return currentOption ? currentOption.colorClass : "";
};

const handleSave = () => {
  // 保存逻辑
  if (props.taskDetail?.id) {
    // console.log("更新任务", props.taskDetail, props.recordDetail);
    props.updateFn({
      id: props.taskDetail.id,
      actualHours: actualHours.value,
      status: status.value,
      assignedTo: assignedTo.value
    });
  }
};

watch(
  () => [props.taskDetail, props.recordDetail],
  ([taskDetail, recordDetail]) => {
    estimatedHours.value = taskDetail?.workInfo?.estimatedHours ?? 0;
    actualHours.value = taskDetail.workInfo?.actualHours || 0;
    status.value = taskDetail?.basicInfo?.statusSource;
    assignedTo.value = taskDetail?.workInfo?.assignedId || "";
  },
  {
    immediate: true,
    deep: true
  }
);
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

    <!-- <div class="px-6 space-y-2" v-if="false">
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
    </div> -->

    <div class="px-6 space-y-4">
      <!-- 当前负责人 -->
      <div class="p-3 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-600 mb-1">当前负责人</p>
        <div class="flex items-center gap-2">
          <div
            class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center"
          >
            <span class="text-sm font-medium text-blue-600">
              {{ props.taskDetail?.workInfo?.assignee?.charAt(0) }}
            </span>
          </div>
          <div>
            <p class="font-medium">
              {{ props.taskDetail?.workInfo?.assignee }}
            </p>
            <el-tag type="primary">主职任务</el-tag>
          </div>
        </div>
      </div>

      <!-- 负责人 -->
      <div class="space-y-2">
        <label
          class="flex items-center gap-2 text-sm font-medium text-gray-700"
        >
          负责人
        </label>
        <el-select
          v-model="assignedTo"
          placeholder="请选择负责人"
          class="w-full"
        >
          <el-option
            v-for="option in props.designers"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </div>

      <!-- 需求状态 -->
      <div class="space-y-2">
        <label
          class="flex items-center gap-2 text-sm font-medium text-gray-700"
        >
          需求状态
          <el-icon
            class="cursor-pointer"
            size="16"
            @click="explanationDialogRef?.show('task_need_staus')"
          >
            <QuestionFilled />
          </el-icon>
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
            v-for="option in DESIGN_ENUM_OPTIONS.TASK_STATUS"
            :key="option.value"
            :label="option.label"
            :value="option.value"
            :disabled="isOptionDisabled(option.value)"
          >
            <div class="flex items-center gap-2">
              <div
                class="h-2 w-2 rounded-full"
                :class="option.colorClass"
              ></div>
              {{ option.label }}
              <!-- 显示禁用提示 -->
              <span
                v-if="isOptionDisabled(option.value)"
                class="ml-2 text-xs text-gray-400"
              >
                (不可选)
              </span>
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
          placeholder="输入预计工时"
          class="w-full"
          disabled
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
          placeholder="输入实际工时"
          class="w-full"
        />
      </div>

      <!-- 时间信息 -->
      <!-- <div class="p-3 bg-gray-100 rounded-lg space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-600">开始时间</span>
          <span>{{ props.recordDetail.startTime }}</span>
        </div>
        <div v-if="props.recordDetail.endTime" class="flex justify-between">
          <span class="text-gray-600">完成时间</span>
          <span>{{ props.recordDetail.endTime }}</span>
        </div>
      </div> -->

      <!-- 保存按钮 -->
      <el-button type="primary" plain class="w-full" @click="handleSave">
        保存更改
      </el-button>
    </div>

    <ExplanationDialog ref="explanationDialogRef" />
  </div>
</template>
