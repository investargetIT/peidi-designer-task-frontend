<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { User } from "@element-plus/icons-vue";
import type { FormRules } from "element-plus";
import RiStackLine from "~icons/ri/stack-line";
import TablerTarget from "~icons/tabler/target";

interface SecondCategory {
  name: string;
  description: string;
}

interface DesignCategory {
  firstCategory: string;
  secondCategories: SecondCategory[];
}

interface FormData {
  submitter: {
    name: string;
    department: string;
  };
  designTypes: DesignCategory[];
  usageScenarios: Array<{ value: string; label: string }>;
  impactRanges: Array<{ value: string; label: string }>;
}

// 表单数据
const formModel = reactive({
  firstDesignType: "", // 一级分类
  secondDesignType: "", // 二级分类
  title: "",
  description: "",
  estimatedHours: 8,
  deadline: "",
  usageScenario: "",
  impactRange: ""
});

// 表单验证规则
const formRules: FormRules = {
  firstDesignType: [
    { required: true, message: "请选择一级设计类型", trigger: "change" }
  ],
  secondDesignType: [
    { required: true, message: "请选择二级设计类型", trigger: "change" }
  ],
  title: [{ required: true, message: "请输入需求标题", trigger: "blur" }],
  description: [{ required: true, message: "请输入需求描述", trigger: "blur" }],
  estimatedHours: [
    { required: true, message: "请输入预估工时", trigger: "blur" },
    {
      type: "number",
      min: 1,
      max: 200,
      message: "工时应在1-200小时之间",
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

const formRef = ref();

// 计算属性：根据一级分类获取对应的二级分类选项
const secondCategoryOptions = computed(() => {
  if (!formModel.firstDesignType) return [];

  const category = formData.designTypes.find(
    item => item.firstCategory === formModel.firstDesignType
  );

  return category ? category.secondCategories : [];
});

// 监听一级分类变化，重置二级分类
watch(
  () => formModel.firstDesignType,
  newVal => {
    if (newVal) {
      formModel.secondDesignType = "";
    }
  }
);

const formData: FormData = {
  submitter: {
    name: "陈经理",
    department: "市场部"
  },
  designTypes: [
    {
      firstCategory: "产品视觉设计",
      secondCategories: [
        { name: "套版设计", description: "3天·多口味延展" },
        { name: "新品包装", description: "10天·从0-1" },
        { name: "年度重点包装", description: "14天·给销售带来重大转化" },
        { name: "老包装改版", description: "5天·不含结构大改" },
        { name: "渠道包装礼盒", description: "9天·含组合逻辑" },
        { name: "产品视觉物料", description: "5天·新品推广海报" }
      ]
    },
    {
      firstCategory: "社媒设计",
      secondCategories: [
        { name: "小红书单篇", description: "1天·封面图+基础排版" },
        { name: "小红书多图", description: "1.5天·含封面+3-6图" },
        { name: "公众号整篇", description: "1天·已有模块调整" },
        { name: "公众号整篇（含海报）", description: "2天·含海报图+内页" },
        { name: "社媒活动专题", description: "3天·含红书、公众号、小程序" },
        { name: "小程序商城", description: "1天·banner图" }
      ]
    },
    {
      firstCategory: "品牌设计",
      secondCategories: [
        { name: "品牌海报", description: "3天·单张主视觉" },
        { name: "线下活动视觉", description: "5天·主视觉含延展" },
        { name: "线下物料", description: "2天·易拉宝/KT" },
        { name: "品牌辅助品设计", description: "5天·设计不含打样" },
        { name: "品牌辅助品开发", description: "7天·含结构&打样" },
        { name: "品牌手册简版", description: "3天·新品新增" },
        { name: "品牌手册升级", description: "10天·视觉升级版" }
      ]
    },
    {
      firstCategory: "集团设计",
      secondCategories: [
        { name: "集团对外宣传物料", description: "3天·对外口径" },
        { name: "人力招聘设计（简）", description: "2天·JD/海报" },
        { name: "人力招聘设计（繁）", description: "5天·期刊" },
        { name: "行政简易需求", description: "0.5天·单张海报/简易排版" },
        { name: "集团小型年会活动", description: "3天·主视觉" },
        { name: "集团空间文化墙设计", description: "7天·含平面和落地说明" },
        { name: "集团大型年会活动", description: "10天·主视觉+延展" }
      ]
    },
    {
      firstCategory: "品牌VI设计",
      secondCategories: [
        { name: "品牌 VI 设计原则", description: "7天·核心规范" },
        { name: "视觉标准模板输出", description: "5天·PPT/KV模板" },
        { name: "VI 局部升级", description: "5天·非重构" }
      ]
    }
  ],
  usageScenarios: [
    {
      value: "sales_conversion",
      label: "S1 销售转化直接影响销售、转化、GMV 的设计"
    },
    {
      value: "external_brand",
      label: "S2 对外品牌影响品牌形象、认知，但不直接转化"
    },
    {
      value: "internal_support",
      label: "S3 内部支持支持公司内部运作，不直接面对用户"
    },
    { value: "long_term_asset", label: "S4 长期资产偏体系、标准、长期使用" }
  ],
  impactRanges: [
    {
      value: "single",
      label: "I1 单一 仅影响一个具体内容或一次性使用场景，不复用、不扩散"
    },
    {
      value: "project",
      label: "I2 项目 影响一个完整项目或活动周期，但范围有限"
    },
    {
      value: "multi_project",
      label: "I3 多项目 影响多个项目、多个渠道或多个产品，存在复用或联动"
    },
    {
      value: "company_level",
      label: "I4 公司级 影响公司或品牌整体形象，具有长期、系统性影响"
    }
  ]
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      console.log("表单提交数据:", formModel);
      // 这里处理表单提交逻辑
    }
  });
};

// 取消操作
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
                {{ formData.submitter.name }}
              </p>
              <p class="text-xs text-gray-600">
                {{ formData.submitter.department }}
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
          <el-form-item label="一级类型" prop="firstDesignType">
            <el-select
              v-model="formModel.firstDesignType"
              placeholder="请选择一级设计类型"
              class="w-full"
            >
              <el-option
                v-for="category in formData.designTypes"
                :key="category.firstCategory"
                :label="category.firstCategory"
                :value="category.firstCategory"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            label="二级类型 "
            prop="secondDesignType"
            :disabled="!formModel.firstDesignType"
          >
            <el-select
              v-model="formModel.secondDesignType"
              placeholder="请先选择一级类型"
              :disabled="!formModel.firstDesignType"
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

          <div
            v-if="formModel.secondDesignType"
            class="designer-info-alert mt-4 p-4 rounded-lg border-2 border-blue-200 bg-blue-50 text-blue-800 flex items-start gap-3"
          >
            <el-icon :size="20" class="text-blue-600">
              <User />
            </el-icon>

            <div class="flex-1">
              <div class="font-medium text-blue-900 mb-1">
                主职能设计师：<span class="text-blue-700">夏筠</span>
              </div>
              <div class="text-sm text-blue-700">
                系统将优先分配给该设计师处理您的设计需求
              </div>
              <div class="text-xs text-blue-600 mt-2">
                当前选择：{{ formModel.firstDesignType }} →
                {{ formModel.secondDesignType }}
              </div>
            </div>
          </div>
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
                :min="1"
                :max="200"
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
                type="date"
                placeholder="请选择截止时间"
                value-format="YYYY-MM-DD"
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
                    v-for="scenario in formData.usageScenarios"
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
                    v-for="range in formData.impactRanges"
                    :key="range.value"
                    :label="range.label"
                    :value="range.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 优先级显示区域 - 条件显示 -->
          <transition name="fade">
            <div
              v-if="formModel.usageScenario && formModel.impactRange"
              class="priority-display mt-4 p-4 rounded-lg border-2 border-dashed bg-blue-50 border-blue-200 flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <span class="text-sm text-gray-600">系统自动计算优先级：</span>
                <span
                  class="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700"
                  >极高</span
                >
              </div>
              <p class="text-xs text-gray-500">基于优先级矩阵自动判定</p>
            </div>
          </transition>
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
