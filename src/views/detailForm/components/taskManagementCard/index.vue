<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { DESIGN_ENUM_OPTIONS } from "@/constants/design";
import ExplanationDialog from "@/views/explanationDialog/index.vue";
import LsiconSettingOutline from "~icons/lsicon/setting-outline";
import BiClock from "~icons/bi/clock";
import { QuestionFilled } from "@element-plus/icons-vue";
import dayjs from "dayjs";

const props = defineProps<{
  taskDetail: any;
  recordDetail: any;
  designers: any;
  updateFn: (data: any) => void;
  newRecordFn: (data: any, callback?: () => void) => void;
}>();

const explanationDialogRef = ref(null);
const dataSource = JSON.parse(localStorage.getItem("dataSource") || "{}");

const status = ref();
const estimatedHours = ref(0);
const actualHours = ref(0);
const assignedTo = ref(""); // 负责人ID

/**
 * 【模式开关】
 * true  = 仅三态流转模式：状态只展示「待分配 / 进行中 / 已完成」，且仅在这三者之间流转
 * false = 完整流转模式：展示全部状态，走完整状态流转链路（后续如需改回，只需设为 false）
 */
const USE_THREE_STATE_MODE = true;

// 三态模式下仅展示的状态（待分配 / 进行中 / 已完成）
const VISIBLE_STATUSES = ["PENDING", "IN_PROGRESS", "COMPLETED"];

// 筛选后状态下拉选项：
// 三态模式：只保留指定 3 个状态；若当前任务状态不在其中，强制追加展示（保证显示正确）
// 完整模式：展示全部状态
const filteredStatusOptions = computed(() => {
  // ========== 完整模式原逻辑（保留备用，可随时切回） ==========
  if (!USE_THREE_STATE_MODE) {
    return DESIGN_ENUM_OPTIONS.TASK_STATUS;
  }
  // ==========================================================
  const options = DESIGN_ENUM_OPTIONS.TASK_STATUS.filter(option =>
    VISIBLE_STATUSES.includes(option.value)
  );
  const currentStatus = status.value;
  if (
    currentStatus &&
    !VISIBLE_STATUSES.includes(currentStatus) &&
    !options.some(option => option.value === currentStatus)
  ) {
    const currentOption = DESIGN_ENUM_OPTIONS.TASK_STATUS.find(
      option => option.value === currentStatus
    );
    if (currentOption) {
      options.unshift(currentOption);
    }
  }
  return options;
});

// 只有这些用户可以修改负责人
const ALLOWED_USER_IDS = ["1874741663670775810", "1926449443739600965"];
const isAssigneeEditable = computed(() => {
  const currentUserId = dataSource?.id;
  // 只有允许的用户才能修改负责人，不限制任务状态
  return ALLOWED_USER_IDS.includes(currentUserId);
});

// 计算属性控制按钮显示逻辑
// const showStartButton = computed(() => status.value === "PENDING");
// const showCompleteButton = computed(() => status.value === "IN_PROGRESS");

//#region 判断选项是否应该被禁用的函数
/*
  1. 草稿-待分配-待确认-进行中-已完成待审核-已完成
  2. 草稿-待分配-待确认-已外包-已完成待审核-已完成
  3. 草稿-待分配-待确认-插单处理-已完成待审核-已完成
  4. 已关闭一直禁用，有额外的操作按钮
 */
const isOptionDisabled = (optionValue: string) => {
  const currentStatus = props.taskDetail?.basicInfo?.statusSource;

  // 如果当前没有状态或选择的是自己，则不禁用
  if (!currentStatus || currentStatus === optionValue) {
    return false;
  }

  // ====== 三态模式流转规则（待分配 → 进行中 → 已完成） ======
  // 仅在三态模式下使用；如需允许从「进行中」回退到「待分配」，可在下方数组中加入 "PENDING"
  const threeStateTransitionRules: Record<string, string[]> = {
    // 待分配
    PENDING: ["IN_PROGRESS"],
    // 进行中
    IN_PROGRESS: ["COMPLETED"],
    // 已完成
    COMPLETED: []
  };
  // ===========================================================

  // ========== 完整模式流转规则（原逻辑保留备用，可随时切回） ==========
  const statusTransitionRules: Record<string, string[]> = {
    // 草稿
    DRAFT: ["PENDING"],
    // 待分配
    PENDING: ["REVIEW"],
    // 待确认
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
  // =================================================================

  // 按模式选择流转规则
  const transitionRules = USE_THREE_STATE_MODE
    ? threeStateTransitionRules
    : statusTransitionRules;

  // 获取允许转换的状态列表
  const allowedTransitions = transitionRules[currentStatus] || [];

  // 如果目标状态不在允许列表中，则禁用
  if (!allowedTransitions.includes(optionValue)) {
    return true;
  }

  // 特殊权限检查：只有特定负责人（固定ID）才能从「待分配」状态流转任务（开启任务）
  // 说明：三态模式与完整模式均生效。如需对所有用户放开，去掉下方 if 即可
  const ALLOWED_USER_IDS = ["1874741663670775810", "1926449443739600965"]; // 请根据实际需求修改这些ID
  const currentUserId = dataSource?.id;

  if (
    currentStatus === "PENDING" &&
    !ALLOWED_USER_IDS.includes(currentUserId)
  ) {
    return true;
  }

  return false;
};
//#endregion
const getCurrentStatusColor = () => {
  const currentOption = DESIGN_ENUM_OPTIONS.TASK_STATUS.find(
    option => option.value === status.value
  );
  return currentOption ? currentOption.colorClass : "";
};

// 状态流转提示：根据当前状态实时告诉用户「下一步能流转到什么」，避免误解为 bug
const statusTip = computed(() => {
  const currentStatus = status.value;
  // ====== 三态模式提示文案 ======
  if (USE_THREE_STATE_MODE) {
    const tipMap: Record<string, string> = {
      PENDING: "当前为「待分配」，只能流转到：进行中（开启任务需负责人权限）",
      IN_PROGRESS: "当前为「进行中」，只能流转到：已完成",
      COMPLETED: "当前为「已完成」，已是最终状态，不能再流转",
      REVIEW: "当前为「待确认」，需先流转到「进行中」后才能继续",
      DRAFT: "当前为「草稿」，尚未进入分配流程",
      OUTSOURCED: "当前为「已外包」，请按外包流程跟进",
      RUSH: "当前为「插单处理」，请按插单流程跟进",
      COMPLETED_REVIEW: "当前为「已完成待审核」，需流转到「已完成」",
      CLOSE: "当前为「已关闭」，不可操作"
    };
    return tipMap[currentStatus] || "";
  }
  // ========== 完整模式提示文案（原逻辑保留备用） ==========
  const fullTipMap: Record<string, string> = {
    DRAFT: "当前为「草稿」，可流转到：待分配",
    PENDING: "当前为「待分配」，可流转到：待确认（需负责人权限）",
    REVIEW: "当前为「待确认」，可流转到：进行中",
    IN_PROGRESS: "当前为「进行中」，可流转到：已完成待审核",
    OUTSOURCED: "当前为「已外包」，可流转到：已完成待审核",
    RUSH: "当前为「插单处理」，可流转到：已完成待审核",
    COMPLETED_REVIEW: "当前为「已完成待审核」，可流转到：已完成",
    COMPLETED: "当前为「已完成」，已是最终状态，不能再流转",
    CLOSE: "当前为「已关闭」，不可操作"
  };
  return fullTipMap[currentStatus] || "";
});

const handleSave = () => {
  // 保存逻辑
  if (props.taskDetail?.id) {
    // console.log("更新任务", props.taskDetail, props.recordDetail);

    // if 前一个为 待分配 后一个为 进行中，则传当前时间给startAt
    // if 前一个为 进行中 后一个为 已完成，则传当前时间给endAt
    if (USE_THREE_STATE_MODE) {
      if (
        props.taskDetail?.basicInfo?.statusSource === "PENDING" &&
        status.value === "IN_PROGRESS"
      ) {
        props.updateFn({
          id: props.taskDetail.id,
          actualHours: actualHours.value,
          status: status.value,
          assignedTo: assignedTo.value,
          createUserId: props.taskDetail.basicInfo.createUserId,
          deadline: props.taskDetail.basicInfo.deadline,
          startAt: dayjs().format("YYYY-MM-DDTHH:mm:ss")
        });
      } else if (
        props.taskDetail?.basicInfo?.statusSource === "IN_PROGRESS" &&
        status.value === "COMPLETED"
      ) {
        props.updateFn({
          id: props.taskDetail.id,
          actualHours: actualHours.value,
          status: status.value,
          assignedTo: assignedTo.value,
          createUserId: props.taskDetail.basicInfo.createUserId,
          deadline: props.taskDetail.basicInfo.deadline,
          endAt: dayjs().format("YYYY-MM-DDTHH:mm:ss")
        });
      } else {
        props.updateFn({
          id: props.taskDetail.id,
          actualHours: actualHours.value,
          status: status.value,
          assignedTo: assignedTo.value,
          createUserId: props.taskDetail.basicInfo.createUserId,
          deadline: props.taskDetail.basicInfo.deadline
        });
      }
      return;
    }

    // ================== 以下为原完整流转模式逻辑（保留备用，可随时切回） ==================
    // 如果是从 待确认 变到 进行中，则传当前时间给startAt
    // 如果是从 已完成待审核 变到 已完成，则传当前时间给endAt
    if (
      props.taskDetail?.basicInfo?.statusSource === "REVIEW" &&
      status.value === "IN_PROGRESS"
    ) {
      props.updateFn({
        id: props.taskDetail.id,
        actualHours: actualHours.value,
        status: status.value,
        assignedTo: assignedTo.value,
        createUserId: props.taskDetail.basicInfo.createUserId,
        deadline: props.taskDetail.basicInfo.deadline,
        startAt: dayjs().format("YYYY-MM-DDTHH:mm:ss")
      });
    } else if (
      props.taskDetail?.basicInfo?.statusSource === "COMPLETED_REVIEW" &&
      status.value === "COMPLETED"
    ) {
      props.updateFn({
        id: props.taskDetail.id,
        actualHours: actualHours.value,
        status: status.value,
        assignedTo: assignedTo.value,
        createUserId: props.taskDetail.basicInfo.createUserId,
        deadline: props.taskDetail.basicInfo.deadline,
        endAt: dayjs().format("YYYY-MM-DDTHH:mm:ss")
      });
    } else {
      props.updateFn({
        id: props.taskDetail.id,
        actualHours: actualHours.value,
        status: status.value,
        assignedTo: assignedTo.value,
        createUserId: props.taskDetail.basicInfo.createUserId,
        deadline: props.taskDetail.basicInfo.deadline
      });
    }
    // ====================================================================================
  }
};

watch(
  () => [props.taskDetail, props.recordDetail],
  ([taskDetail, recordDetail]) => {
    estimatedHours.value = taskDetail?.workInfo?.estimatedHours ?? 0;
    actualHours.value = taskDetail.workInfo?.actualHours ?? 0;
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
          :disabled="!isAssigneeEditable"
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
            />
          </template>
          <el-option
            v-for="option in filteredStatusOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
            :disabled="isOptionDisabled(option.value)"
          >
            <div class="flex items-center gap-2">
              <div class="h-2 w-2 rounded-full" :class="option.colorClass" />
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
        <!-- 状态流转提示：告诉用户当前状态能选择什么 -->
        <p
          v-if="statusTip"
          class="text-xs text-gray-400 flex items-center gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-3.5 h-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          {{ statusTip }}
        </p>
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
