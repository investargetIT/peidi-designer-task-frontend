<template>
  <el-dialog
    v-model="visible"
    title="一键处理任务"
    width="1000px"
    append-to-body
    :close-on-click-modal="false"
  >
    <div class="mb-[12px] flex items-center justify-between">
      <p class="text-sm text-gray-500">
        当前展示：所有「进行中」且负责人为我的任务，可多选后一键置为「已完成」
      </p>
      <el-input-number
        v-model="actualHours"
        :min="0"
        placeholder="统一填写实际工时（可选）"
        class="!w-[220px]"
        controls-position="right"
      />
    </div>

    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      size="small"
      :header-cell-style="{ color: '#0a0a0a' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column prop="title" label="需求标题" show-overflow-tooltip />
      <el-table-column prop="status" label="任务状态" width="100">
        <template #default>
          <span class="text-green-500">进行中</span>
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="优先级" width="100" />
      <el-table-column prop="deadline" label="截止日期" width="120" />
      <el-table-column prop="assignedToName" label="负责人" width="100" />
      <el-table-column prop="createUserName" label="提交人" width="100" />
    </el-table>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button
        type="primary"
        :loading="submitting"
        :disabled="selectedRows.length === 0"
        @click="handleCompleteAll"
      >
        一键已完成（{{ selectedRows.length }}）
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
import {
  getPmDesignRequestsPage,
  postPmDesignRequestsUpdate
} from "@/api/design";
import { storageLocal } from "@pureadmin/utils";

const emit = defineEmits(["refresh"]);

const USER_INFO: any = storageLocal().getItem("dataSource");

const visible = ref(false);
const loading = ref(false);
const submitting = ref(false);
const tableData = ref([]);
const selectedRows = ref([]);
const actualHours = ref<number | undefined>(undefined);

/** 组装搜索条件：负责人=当前登录人 且 状态=进行中 */
const formatSearchStr = () => {
  const searchStr = [];
  if (USER_INFO?.username) {
    searchStr.push({
      searchName: "assignedToName",
      searchType: "equals",
      searchValue: `"${USER_INFO.username}"`
    });
  }
  searchStr.push({
    searchName: "status",
    searchType: "equals",
    searchValue: '"IN_PROGRESS"'
  });
  return JSON.stringify(searchStr);
};

/** 拉取当前登录人中「进行中」的任务 */
const fetchList = () => {
  loading.value = true;
  return getPmDesignRequestsPage({
    pageNo: 1,
    pageSize: 1000,
    searchStr: formatSearchStr()
  })
    .then((res: any) => {
      if (res?.code === 200) {
        tableData.value = res.data?.records || [];
      } else {
        ElMessage.error("获取任务列表失败:" + res?.msg);
      }
    })
    .catch(error => {
      ElMessage.error("获取任务列表失败:" + error.message);
    })
    .finally(() => {
      loading.value = false;
    });
};

const init = () => {
  visible.value = true;
  selectedRows.value = [];
  actualHours.value = undefined;
  fetchList();
};

const handleSelectionChange = (rows: any) => {
  selectedRows.value = rows;
};

/** 批量将选中的「进行中」任务置为「已完成」 */
const handleCompleteAll = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning("请先勾选需要处理的任务");
    return;
  }
  submitting.value = true;
  try {
    const payload = selectedRows.value.map((row: any) => ({
      id: row.id,
      status: "COMPLETED",
      deadline: row.deadline,
      createUserId: row.createUserId,
      assignedTo: row.assignedTo ?? row.assignedToName,
      ...(actualHours.value !== undefined && actualHours.value !== null
        ? { actualHours: actualHours.value }
        : {}),
      endAt: dayjs().format("YYYY-MM-DDTHH:mm:ss")
    }));

    const results = await Promise.all(
      payload.map(item => postPmDesignRequestsUpdate(item))
    );
    const allSuccess = results.every((res: any) => res?.code === 200);

    if (allSuccess) {
      ElMessage.success(`已成功处理 ${results.length} 个任务`);
      visible.value = false;
      emit("refresh");
    } else {
      ElMessage.error("部分任务处理失败，请重新查看");
    }
  } catch (error: any) {
    ElMessage.error("批量处理失败:" + error.message);
  } finally {
    submitting.value = false;
  }
};

defineExpose({ init });
</script>
