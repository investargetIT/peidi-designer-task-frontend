<script setup lang="ts">
import { dayjs, FormRules } from "element-plus";
import { reactive, ref } from "vue";
import { storageLocal } from "@pureadmin/utils";
import { LogItem } from "../moduleTabs/notesSection.vue";

const USER_INFO: any = storageLocal().getItem("dataSource");

const props = defineProps({
  recordDetail: {
    type: Object,
    required: true
  },
  updateFn: {
    type: Function,
    required: true
  },
  newRecordFn: {
    type: Function,
    required: true
  }
});

const visible = ref(false);

// 表单数据
const formRef = ref();
const formModel = reactive({
  id: "",
  reason: ""
});

// 表单验证规则
const formRules: FormRules = {
  reason: [{ required: true, message: "请输入作废原因", trigger: "blur" }]
};

const handleConfirm = async () => {
  // 验证表单
  const valid = await formRef.value?.validate();
  if (!valid) return;

  // 提交表单
  console.log("提交表单:", formModel);

  if (formModel.id) {
    props.updateFn(
      {
        id: formModel.id,
        status: "CLOSE"
      },
      () => {
        handleCancel();
      }
    );

    let logList: LogItem[] = [];
    if (props.recordDetail.descriptionExt?.logList) {
      logList = props.recordDetail.descriptionExt?.logList;
    }
    const newLog: LogItem = {
      id: logList.length + 1,
      type: "message",
      user: USER_INFO?.username || "",
      content: `作废原因：${formModel.reason}`,
      timestamp: new Date().toLocaleString("zh-CN")
    };
    const newLogList = [newLog, ...logList];
    props.newRecordFn({
      ...props.recordDetail,
      requestId: formModel.id,
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
    });
  }
};

const handleCancel = () => {
  visible.value = false;
  formRef.value?.resetFields();
};

const initDialog = (id: any) => {
  console.log("作废任务:", id);
  visible.value = true;
  formModel.id = id;
};

defineExpose({ initDialog });
</script>

<template>
  <div>
    <el-dialog
      v-model="visible"
      :title="'作废任务'"
      width="600"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form
        ref="formRef"
        :model="formModel"
        :rules="formRules"
        label-position="top"
        class="space-y-6"
      >
        <el-form-item label="作废原因" prop="reason">
          <el-input
            type="textarea"
            v-model="formModel.reason"
            placeholder="请输入作废原因"
            :rows="4"
          />
          <!-- 快捷输入 -->
          <div class="flex justify-end gap-2 mt-2">
            <el-button @click="formModel.reason = '需求取消'">
              需求取消
            </el-button>
            <el-button @click="formModel.reason = '内容大幅调整'">
              内容大幅调整
            </el-button>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel"> 取消 </el-button>
          <el-button type="danger" @click="handleConfirm"> 确认作废 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
