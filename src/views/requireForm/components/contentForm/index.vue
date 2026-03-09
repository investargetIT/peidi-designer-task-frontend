<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from "vue";
import { User } from "@element-plus/icons-vue";
import { ElMessage, type FormRules } from "element-plus";
import RiStackLine from "~icons/ri/stack-line";
import TablerTarget from "~icons/tabler/target";
import GrommetIconsInfo from "~icons/grommet-icons/info";
import MingcuteNotificationLine from "~icons/mingcute/notification-line";
import RiUser3Line from "~icons/ri/user-3-line";
import LetsIconsUpload from "~icons/lets-icons/upload";
import dd from "dingtalk-jsapi";
import { SYSTEM_CONFIG, DESIGN_SECOND_CATEGORY_MAPPING } from "@/constants";
import { ddAuthFun } from "../../utils/ddAuth";
import Upload from "./upload.vue";

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
  estimatedHours: null,
  deadline: "",
  usageScenario: "",
  impactRange: "",
  attentionUsers: "",
  attentionUsersName: "",
  uploadedFiles: []
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
  // estimatedHours: [
  //   { required: true, message: "请输入预估工时", trigger: "blur" },
  //   {
  //     type: "number",
  //     min: 0,
  //     message: "工时应大于等于0",
  //     trigger: "blur"
  //   }
  // ],
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

// 监听二级类型变化
watch(
  () => formModel.taskType,
  newVal => {
    if (!newVal) return;

    const mapping = DESIGN_SECOND_CATEGORY_MAPPING[newVal];
    if (mapping) {
      formModel.usageScenario = mapping.usageScenario;
      formModel.impactRange = mapping.impactRange;
      ElMessage.info(
        `已根据【${newVal}】自动设置使用场景为 ${mapping.usageScenario}，影响范围为 ${mapping.impactRange}`
      );
    }
  }
);

// 标准工时自动填充
const handleTaskTypeChange = (val: any) => {
  secondCategoryOptions.value.forEach(item => {
    if (item.name === val) {
      formModel.estimatedHours = item.standardPeriod * 8;
    }
  });
};

// 提交表单
const handleSubmit = async () => {
  // console.log("提交表单:", formModel);
  // return;
  if (!formRef.value) return;
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      const remark = JSON.stringify({
        attentionUsers: formModel.attentionUsers,
        attentionUsersName: formModel.attentionUsersName
      });
      props.checkFn(
        { ...formModel, remark },
        (result: any, sourceData: any) => {
          props.initDialogFn(result, sourceData);
        }
      );
    }
  });
};

// 重置表单
const handleCancel = () => {
  formRef.value?.resetFields();
  // 手动重置没有prop属性的字段
  formModel.attentionUsersName = "";
};

//#region 相关人逻辑 调用钉钉工具
// 相关人提示文字 计算属性
const attentionTip = computed(() => {
  if (formModel.attentionUsers.length > 0) {
    const attentionUsersList = formModel.attentionUsers.split(",");
    // console.log("accessControlList", accessControlList);
    return `已选择 ${attentionUsersList.length} 位相关人`;
  }
  return "点击选择相关人";
});

// 处理添加相关人操作
const handleAttentionUsers = () => {
  // 判断是否在钉钉环境下
  if (!navigator.userAgent.includes("DingTalk")) {
    ElMessage({
      message: "当前环境不是钉钉，无法添加相关人",
      type: "error"
    });
    return;
  }
  // 在钉钉环境下调用钉钉工具
  try {
    dd.ready(() => {
      dd.biz.contact.choose({
        multiple: true, //是否多选：true多选 false单选； 默认true
        users: formModel.attentionUsers.split(","), //默认选中的用户列表，员工userid；成功回调中应包含该信息
        corpId: SYSTEM_CONFIG.DINGTALK_CORP_ID, //企业id
        max: 1500, //人数限制，当multiple为true才生效，可选范围1-1500
        onSuccess: function (data) {
          console.log("data", data);
          /*
          data结构
          [
            {
              name: "张三", //姓名
              avatar: "http://g.alicdn.com/avatar/zhangsan.png ", //头像图片url，可能为空
              emplId: "0573" //员工userid
            }
          ];
          */
          // 处理选择的用户，将emplId拼接为逗号分隔的字符串
          if (data.length > 0) {
            formModel.attentionUsers = data.map(item => item.emplId).join(",");
            formModel.attentionUsersName = data
              .map(item => item.name)
              .join(",");
          }
          // alert("dd successs: " + JSON.stringify(data));
        },
        onFail: function (err) {
          // alert("添加访问控制失败: " + err);
        }
      });
    });
  } catch (error) {
    // alert("添加访问控制失败: " + error);
  }
};
//#endregion

onMounted(() => {
  // 初始化钉钉权限
  if (navigator.userAgent.includes("DingTalk")) {
    ddAuthFun();
  }
});
</script>

<template>
  <div class="max-w-full mx-auto">
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

        <!-- Two Column Layout -->
        <el-row :gutter="24">
          <!-- Left Column -->
          <el-col :xs="24" :sm="24" :lg="8" class="mb-2">
            <!-- Design Type Selection -->
            <el-card shadow="never" class="border mb-6">
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
                  @change="handleTaskTypeChange"
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
                  >
                    <div>
                      <p>{{ scenario.label }}</p>
                      <p
                        v-if="scenario.description"
                        style="
                          color: var(--el-text-color-secondary);
                          font-size: 13px;
                        "
                      >
                        {{ scenario.description }}
                      </p>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>

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
                  >
                    <div>
                      <p>{{ range.label }}</p>
                      <p
                        v-if="range.description"
                        style="
                          color: var(--el-text-color-secondary);
                          font-size: 13px;
                        "
                      >
                        {{ range.description }}
                      </p>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-card>
          </el-col>

          <!-- Middle Column -->
          <el-col :xs="24" :sm="24" :lg="8" class="mb-2">
            <el-card shadow="never" class="border">
              <div
                class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4"
              >
                <el-icon :size="16">
                  <GrommetIconsInfo />
                </el-icon>
                基础信息
              </div>

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

              <el-form-item label="标准工时（小时）" prop="estimatedHours">
                <div>
                  <el-alert
                    type="info"
                    show-icon
                    :closable="false"
                    title="该类型有需求标准工时设定，系统用于判断 紧急度和可排期性。"
                  />

                  <el-input
                    v-model="formModel.estimatedHours"
                    class="w-full mt-2"
                    disabled
                  />
                  <div class="text-xs text-gray-500 mt-1">
                    根据任务类型自动填充标准工时，可根据实际情况调整，如需超出标准工时，可在需求描述中说明原因，系统转交设计主管审核。
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
            </el-card>
          </el-col>

          <!-- Right Column -->
          <el-col :xs="24" :sm="24" :lg="8" class="mb-2">
            <el-card shadow="never" class="border mb-6">
              <div
                class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4"
              >
                <el-icon :size="16">
                  <MingcuteNotificationLine />
                </el-icon>
                多选人关注
              </div>

              <div class="mb-2">
                <el-alert
                  type="info"
                  show-icon
                  :closable="false"
                  title="这部分不参与分配逻辑，只用来在任务移动状态时抄送消息。在管理上会省很多口头同步。"
                />
              </div>

              <el-form-item label="相关人（通知用）" prop="attentionUsers">
                <div
                  class="w-[100%] flex items-center text-[#000] border border-[#71717a35] rounded-[5px] px-[10px] py-[5px] cursor-pointer hover:bg-[#71717a15]"
                  @click="handleAttentionUsers"
                >
                  <IconifyIconOffline :icon="RiUser3Line" />
                  <div class="ml-[5px]">添加相关人</div>
                </div>
                <div class="w-[100%] text-[12px] text-[#71717a]">
                  {{ attentionTip }}
                </div>
                <div
                  v-show="formModel.attentionUsersName.length > 0"
                  class="w-[100%] text-[12px] text-[#71717a]"
                >
                  已选择相关人: {{ formModel.attentionUsersName }}
                </div>
              </el-form-item>
            </el-card>

            <!-- 文件上传 -->
            <el-card shadow="never" class="border">
              <div
                class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-4"
              >
                <el-icon :size="16">
                  <LetsIconsUpload />
                </el-icon>
                文件上传
              </div>
              <el-form-item label="需求文件" prop="uploadedFiles">
                <Upload v-model="formModel.uploadedFiles" />
              </el-form-item>
            </el-card>
          </el-col>
        </el-row>

        <!-- System Alert -->
        <el-alert
          title="提交后，系统将根据「使用场景 × 影响范围」计算重要性，并结合截止时间与标准工时计算紧急度，自动归入四象限。若主职能设计师资源不足，系统将按规则依次尝试支援分配；资源完全不足时，引导需求方选择延期或外包。"
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

<style>
.el-select-dropdown__item {
  height: auto;
}
</style>
