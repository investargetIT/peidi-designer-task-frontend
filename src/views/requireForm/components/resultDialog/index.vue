<script setup lang="ts">
import { computed, ref } from "vue";
import { User } from "@element-plus/icons-vue";
import { DESIGN_ENUM } from "@/constants/design";
import { ElMessage } from "element-plus";

const props = defineProps({
  addFn: {
    type: Function,
    required: true
  }
});

const visible = ref(false);
const infoData = ref({
  designerName: "",
  priority: null
});
const sourceFormData = ref(null);

// 计算属性：根据优先级返回对应的样式类
const priorityStyle = computed(() => {
  const priority = infoData.value.priority;

  switch (priority) {
    case 1: // 低
      return {
        bgClass: "bg-green-100",
        textClass: "text-green-700",
        borderClass: "border-green-200"
      };
    case 2: // 中
      return {
        bgClass: "bg-blue-100",
        textClass: "text-blue-700",
        borderClass: "border-blue-200"
      };
    case 3: // 高
      return {
        bgClass: "bg-orange-100",
        textClass: "text-orange-700",
        borderClass: "border-orange-200"
      };
    case 4: // 极高
      return {
        bgClass: "bg-red-100",
        textClass: "text-red-700",
        borderClass: "border-red-200"
      };
    default:
      return {
        bgClass: "bg-gray-100",
        textClass: "text-gray-700",
        borderClass: "border-gray-200"
      };
  }
});

const initDialog = (initData: any, sourceData: any) => {
  // console.log("初始化表单", initData, sourceData);
  infoData.value = {
    designerName: initData?.designerName || "",
    priority: initData?.priority || null
  };
  sourceFormData.value = sourceData;
  visible.value = true;
};

defineExpose({
  initDialog
});

const handleConfirm = () => {
  if (!sourceFormData.value) {
    ElMessage.error("表单数据信息错误");
    return;
  }
  props.addFn(
    {
      ...sourceFormData.value
    },
    () => {
      visible.value = false;
    }
  );
};

const handleBeforeClose = () => {
  sourceFormData.value = null;
};
</script>

<template>
  <div>
    <el-dialog
      v-model="visible"
      title="设计师匹配结果"
      width="500"
      append-to-body
      :close-on-click-modal="false"
      @closed="handleBeforeClose"
    >
      <div>
        <div
          class="designer-info-alert mt-4 p-4 rounded-lg border-2 border-blue-200 bg-blue-50 text-blue-800 flex items-start gap-3"
        >
          <el-icon :size="20" class="text-blue-600">
            <User />
          </el-icon>

          <div class="flex-1">
            <div class="font-medium text-blue-900 mb-1">
              主职能设计师：<span class="text-blue-700">{{
                infoData.designerName
              }}</span>
            </div>
            <div class="text-sm text-gray-500">
              系统将优先分配给该设计师处理您的设计需求
            </div>
          </div>
        </div>

        <div
          class="priority-display mt-4 p-4 rounded-lg border-2 border-dashed bg-blue-50 border-blue-200 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-600">系统自动计算优先级：</span>
            <span
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="[priorityStyle.bgClass, priorityStyle.textClass]"
            >
              {{ DESIGN_ENUM.PRIORITY[infoData.priority] }}
            </span>
          </div>
          <p class="text-xs text-gray-500">基于优先级矩阵自动判定</p>
        </div>
      </div>

      <div class="mt-4 text-lg text-red-700">
        是否确认分配给 {{ infoData.designerName }} 处理？
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="visible = false"> 取消 </el-button>
          <el-button type="primary" @click="handleConfirm"> 确认 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
