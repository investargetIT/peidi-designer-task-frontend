<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { dayjs, ElMessage } from "element-plus";
import { storageLocal } from "@pureadmin/utils";

const USER_INFO: any = storageLocal().getItem("dataSource");

const WAY_OPTIONS = [
  {
    label: "调整截止时间",
    description: "延长截止时间，需求方自行承担延期影响",
    type: "delay"
  },
  {
    label: "启用外包资源",
    description: "使用外包资源完成，不占用内部设计师工时",
    type: "outsource"
  },
  {
    label: "强制插单",
    description: "占用内部资源，进入插单流程（需说明原因和负面影响）",
    type: "rush"
  }
];

// 描述信息
const WAY_DESCRIPTION = {
  delay:
    "请关闭弹窗，在 【提交设计需求】详情页调整 截止时间 后重新提交需求；或点击 【提交待分配】按钮提交没有负责人的任务",
  outsource: "",
  rush: ""
};

const props = defineProps({
  addFn: {
    type: Function,
    required: true
  },
  rushFn: {
    type: Function,
    required: true
  },
  recordFn: {
    type: Function,
    required: true
  }
});

const visible = ref(false);
const sourceFormData = ref(null);

const formRef = ref();
const formModal = reactive({
  way: "",
  reason: "",
  rushReason: "",
  negativeImpact: ""
});
const rules = ref({
  reason: [
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (formModal.way === "outsource" && !value) {
          callback(new Error("请输入外包原因"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  rushReason: [
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (formModal.way === "rush" && !value) {
          callback(new Error("请输入插单原因"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  negativeImpact: [
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (formModal.way === "rush" && !value) {
          callback(new Error("请输入负面影响"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});

// 计算属性 -判断是否可以点击确认
const canConfirm = computed(() => {
  if (formModal.way == "outsource" || formModal.way == "rush") {
    return true;
  }
  return false;
});

const initDialog = (sourceData: any) => {
  sourceFormData.value = sourceData;
  visible.value = true;
};

defineExpose({
  initDialog
});

const handleConfirm = async () => {
  if (!formRef.value) return;
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      if (!sourceFormData.value) {
        ElMessage.error("表单数据信息错误");
        return;
      }
      props.addFn(
        {
          ...sourceFormData.value
        },
        (id, newFileList) => {
          if (id) {
            props.rushFn(
              {
                requestId: id,
                resolution: formModal.way,
                ...formModal
              },
              () => {
                visible.value = false;
              }
            );
            // 添加任务必定是首次添加记录，不需要向前兼容
            props.recordFn(
              {
                requestId: id,
                createdAt: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
                userName: USER_INFO?.username || "",
                userId: USER_INFO?.id || null,
                descriptionExt: JSON.stringify({
                  isRush: true
                }),
                content: JSON.stringify({
                  fileList: newFileList
                })
              },
              () => {}
            );
          }
        }
      );
    }
  });
};

const handleSubmit = () => {
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
</script>

<template>
  <div>
    <el-dialog
      v-model="visible"
      title="无匹配设计师"
      width="500"
      append-to-body
      :close-on-click-modal="false"
    >
      <div>
        <div class="text-lg text-red-700">原因：所有设计师容量不足</div>
        <div class="text-md text-gray-600 mt-4 mb-4">您可以选择以下方式：</div>
        <el-form
          :model="formModal"
          label-position="top"
          :rules="rules"
          ref="formRef"
        >
          <el-form-item label="方式" prop="way">
            <el-select v-model="formModal.way" placeholder="请选择方式">
              <el-option
                v-for="way in WAY_OPTIONS"
                :key="way.type"
                :label="way.label + '：' + way.description"
                :value="way.type"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="外包原因"
            prop="reason"
            v-if="formModal.way == 'outsource'"
          >
            <el-input
              v-model="formModal.reason"
              placeholder="请输入外包原因"
              type="textarea"
              :rows="4"
            />
          </el-form-item>
          <el-form-item
            label="插单原因"
            prop="rushReason"
            v-if="formModal.way == 'rush'"
          >
            <el-input
              v-model="formModal.rushReason"
              placeholder="请输入插单原因"
              type="textarea"
              :rows="4"
            />
          </el-form-item>
          <el-form-item
            label="负面影响"
            prop="negativeImpact"
            v-if="formModal.way == 'rush'"
          >
            <el-input
              v-model="formModal.negativeImpact"
              placeholder="请输入负面影响"
              type="textarea"
              :rows="4"
            />
          </el-form-item>
        </el-form>
        <div class="text-md text-gray-600 mt-4">
          {{ WAY_DESCRIPTION[formModal.way] || "" }}
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="visible = false"> 取消 </el-button>
          <el-button type="primary" @click="handleConfirm" v-if="canConfirm">
            确认
          </el-button>
          <el-button
            type="danger"
            @click="handleSubmit"
            v-if="formModal.way === 'delay'"
          >
            提交待分配
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-form-item__label) {
  color: #0a0a0a;
}
</style>
