<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { User } from "@element-plus/icons-vue";
import type { FormRules } from "element-plus";
import RiStackLine from "~icons/ri/stack-line";
import TablerTarget from "~icons/tabler/target";

const props = defineProps({
  addFn: {
    type: Function,
    required: true
  },
  baseInfoConfig: {
    type: Object,
    required: true
  },
  checkFn: {
    type: Function,
    required: true
  },
  initDialogFn: {
    type: Function,
    required: true
  }
});

const formRef = ref();
// 表单数据
const formModel = reactive({
  category: "", // 一级分类
  taskType: "", // 二级分类
  title: "",
  description: "",
  estimatedHours: 8,
  deadline: "",
  usageScenario: "",
  impactRange: ""
});

// 表单验证规则
const formRules: FormRules = {
  category: [
    { required: true, message: "请选择一级设计类型", trigger: "change" }
  ],
  taskType: [
    { required: true, message: "请选择二级设计类型", trigger: "change" }
  ],
  title: [{ required: true, message: "请输入需求标题", trigger: "blur" }],
  description: [{ required: true, message: "请输入需求描述", trigger: "blur" }],
  estimatedHours: [
    { required: true, message: "请输入预估工时", trigger: "blur" },
    {
      type: "number",
      min: 0,
      message: "工时应大于等于0",
      trigger: "blur"
    }
  ],
  deadline: [{ required: true, message: "请选择截止时间", trigger: "change" }],
  usageScenario: [
    { required: true, message: "请选择使用场景", trigger: "change" }
  ],
  impactRange: [
    { required: true, message: "请选择影响范围", trigger: "change" }
  ]
};

// 计算属性：根据一级分类获取对应的二级分类选项
const secondCategoryOptions = computed(() => {
  if (!formModel.category) return [];

  const category = props.baseInfoConfig.designTypes.find(
    item => item.firstCategory === formModel.category
  );

  return category ? category.secondCategories : [];
});

// 监听一级分类变化，重置二级分类
watch(
  () => formModel.category,
  newVal => {
    if (newVal) {
      formModel.taskType = "";
    }
  }
);

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      props.checkFn(formModel, (result: any, sourceData: any) => {
        props.initDialogFn(result, sourceData);
      });
    }
  });
};

// 重置表单
const handleCancel = () => {
  formRef.value?.resetFields();
};
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <el-card class="rounded-lg shadow-sm">
      <!-- Header -->
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-gray-800">提交设计需求</h2>
        <p class="text-sm text-gray-600 mt-1">
          选择设计类型后，系统将根据主职能设计师的资源情况自动判断是否能按时完成
        </p>
      </div>

      <!-- Content -->
      <el-form
        ref="formRef"
        :model="formModel"
        :rules="formRules"
        label-position="top"
        class="space-y-6"
      >
        <!-- Submitter Info -->
        <el-card
          shadow="never"
          class="border rounded-lg"
          style="background-color: #f9fafb"
        >
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100"
            >
              <el-icon :size="20" class="text-blue-600">
                <User />
              </el-icon>
            </div>
            <div>
              <p class="text-sm text-gray-600">提交人（自动绑定）</p>
              <p class="font-medium text-gray-800">
                {{ props.baseInfoConfig.submitter.name }}
              </p>
              <p class="text-xs text-gray-600">
                {{ props.baseInfoConfig.submitter.department }}
              </p>
            </div>
          </div>
        </el-card>

        <!-- Design Type Selection -->
        <el-card shadow="never" class="border">
          <div
            class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4"
          >
            <el-icon :size="16">
              <RiStackLine />
            </el-icon>
            设计类型选择
          </div>
          <el-form-item label="一级类型" prop="category">
            <el-select
              v-model="formModel.category"
              placeholder="请选择一级设计类型"
              class="w-full"
            >
              <el-option
                v-for="category in props.baseInfoConfig.designTypes"
                :key="category.firstCategory"
                :label="category.firstCategory"
                :value="category.firstCategory"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            label="二级类型 "
            prop="taskType"
            :disabled="!formModel.category"
          >
            <el-select
              v-model="formModel.taskType"
              placeholder="请先选择一级类型"
              :disabled="!formModel.category"
              class="w-full"
            >
              <el-option
                v-for="subcategory in secondCategoryOptions"
                :key="subcategory.name"
                :label="`${subcategory.name} (${subcategory.description})`"
                :value="subcategory.name"
              />
            </el-select>
          </el-form-item>
        </el-card>

        <!-- Form Fields -->
        <div class="space-y-4">
          <el-form-item label="需求标题" prop="title">
            <el-input
              v-model="formModel.title"
              placeholder="例：品牌官网首页设计"
              clearable
            />
          </el-form-item>

          <el-form-item label="需求描述" prop="description">
            <el-input
              v-model="formModel.description"
              type="textarea"
              placeholder="详细描述设计需求的具体内容和要求"
              :rows="4"
              resize="vertical"
            />
          </el-form-item>

          <el-form-item label="预估工时（小时）" prop="estimatedHours">
            <div>
              <el-input-number
                v-model="formModel.estimatedHours"
                :min="0"
                controls-position="right"
                class="w-full"
              />
              <div class="text-xs text-gray-500 mt-1">
                根据任务类型自动填充标准工时，可根据实际情况调整
              </div>
            </div>
          </el-form-item>

          <el-form-item label="截止时间（客观事实字段）" prop="deadline">
            <div>
              <el-date-picker
                v-model="formModel.deadline"
                type="datetime"
                placeholder="请选择截止时间"
                value-format="YYYY-MM-DDTHH:mm:ss"
                class="w-full"
              />
              <div class="text-xs text-gray-500 mt-1">
                明确的交付节点，不填写无法提交
              </div>
            </div>
          </el-form-item>
        </div>

        <!-- Priority Section -->
        <el-card shadow="never" class="border">
          <div
            class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4"
          >
            <el-icon :size="16">
              <TablerTarget />
            </el-icon>
            优先级判定（客观事实字段）
          </div>
          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="使用场景 *" prop="usageScenario">
                <el-select
                  v-model="formModel.usageScenario"
                  placeholder="请选择使用场景"
                  class="w-full"
                >
                  <el-option
                    v-for="scenario in props.baseInfoConfig.usageScenarios"
                    :key="scenario.value"
                    :label="scenario.label"
                    :value="scenario.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="影响范围 *" prop="impactRange">
                <el-select
                  v-model="formModel.impactRange"
                  placeholder="请选择影响范围"
                  class="w-full"
                >
                  <el-option
                    v-for="range in props.baseInfoConfig.impactRanges"
                    :key="range.value"
                    :label="range.label"
                    :value="range.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>

        <!-- System Alert -->
        <el-alert
          title="系统自动判断：提交后系统将根据主职能设计师的当前资源情况自动判断是否能按时完成。如主设计师资源不足，系统会自动检查支援设计师（需满足：支援工时不超25%、主职责优先）。"
          type="success"
          :closable="false"
          show-icon
        />

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-4">
          <el-button type="primary" class="flex-1" @click="handleSubmit">
            提交需求
          </el-button>
          <el-button @click="handleCancel"> 重置 </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-card__header) {
  padding: 1.5rem 1.5rem 0;
}

:deep(.el-card__body) {
  padding: 1.5rem;
}

:deep(.el-form-item__label) {
  color: #374151;
  font-weight: 500;
}

:deep(.el-alert__content) {
  line-height: 1.5;
}
</style>
