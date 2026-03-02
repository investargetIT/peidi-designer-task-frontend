<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { getPmDesignersPage, getPmDesignRequestsPage } from "@/api/design";
import dayjs from "dayjs";
import { DESIGN_ENUM_OPTIONS } from "@/constants/design";
import BxDetail from "~icons/bx/detail";
import DialogCard from "./components/dialogCard/index.vue";
import { useRoute } from "vue-router"; // 引入 useRoute

const route = useRoute(); // 使用 useRoute 获取当前路由信息

// 获取 URL 查询参数并设置到搜索表单中
const initSearchParamsFromUrl = () => {
  const { priority, timePeriod } = route.query;

  if (priority !== undefined) {
    searchForm.priority = Number(priority);
  }

  if (timePeriod === "week") {
    // 如果 timePeriod 是 week，则设置时间为本周
    searchForm.createAtRange = [
      dayjs().startOf("week").format("YYYY-MM-DD"),
      dayjs().endOf("week").format("YYYY-MM-DD")
    ];
  }

  // 如果两个参数都存在则触发搜索
  if (priority !== undefined && timePeriod !== undefined) {
    fetchDesignTaskList();
  }
};

const detailTableData = ref([]);
const pagination = ref({
  pageNo: 1,
  pageSize: 15,
  pageTotal: 0
});

//#region 搜索相关
// 负责人列表
const designers = ref([]);
const searchFormRef = ref<FormInstance>();
const searchForm: any = reactive({
  createAtRange: [
    dayjs().startOf("month").format("YYYY-MM-DD"),
    dayjs().endOf("month").format("YYYY-MM-DD")
  ],
  assignedToName: "",
  status: "",
  priority: "",
  usageScenario: "",
  impactRange: ""
});
const formatSearchStr = () => {
  const searchStr = [];
  if (searchForm.createAtRange && searchForm.createAtRange.length !== 0) {
    searchStr.push({
      searchName: "createAt",
      searchType: "betweenStr",
      searchValue: [
        dayjs(searchForm.createAtRange[0]).format("YYYY-MM-DDT00:00:00"),
        dayjs(searchForm.createAtRange[1]).format("YYYY-MM-DDT23:59:59")
      ].join(",")
    });
  }
  if (searchForm.assignedToName) {
    searchStr.push({
      searchName: "assignedToName",
      searchType: "equals",
      searchValue: `\"${searchForm.assignedToName}\"`
    });
  }
  if (searchForm.status) {
    searchStr.push({
      searchName: "status",
      searchType: "equals",
      searchValue: `\"${searchForm.status}\"`
    });
  }
  if (searchForm.priority) {
    searchStr.push({
      searchName: "priority",
      searchType: "equals",
      searchValue: `\"${searchForm.priority}\"`
    });
  }
  if (searchForm.usageScenario) {
    searchStr.push({
      searchName: "usageScenario",
      searchType: "equals",
      searchValue: `\"${searchForm.usageScenario}\"`
    });
  }
  if (searchForm.impactRange) {
    searchStr.push({
      searchName: "impactRange",
      searchType: "equals",
      searchValue: `\"${searchForm.impactRange}\"`
    });
  }

  return JSON.stringify(searchStr);
};
//#endregion

const handleReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl?.resetFields();
  fetchDesignTaskList();
};

//#region 请求相关
// 获取需求列表
const fetchDesignTaskList = () => {
  return getPmDesignRequestsPage({
    pageNo: pagination.value.pageNo,
    pageSize: pagination.value.pageSize,
    searchStr: formatSearchStr()
  })
    .then((res: any) => {
      if (res?.code === 200) {
        // console.log("获取需求列表:", res?.data);

        // 如果当前页大于总页数，重置为最后一页 排除总页数为0的情况
        if (res.data?.current > res.data?.pages && res.data?.total !== 0) {
          pagination.value.pageNo = res.data?.pages;
          return;
        }

        // 更新总页数
        pagination.value.pageTotal = res.data?.total || 0;

        detailTableData.value = res.data?.records || [];
      } else {
        ElMessage.error("获取需求列表失败:" + res?.msg);
      }
    })
    .catch(error => {
      ElMessage.error("获取需求列表失败:" + error.message);
    });
};

const fetchDesignerWorkloads = () => {
  return getPmDesignersPage({
    pageNo: 1,
    pageSize: 10e3,
    searchStr: JSON.stringify({
      searchName: "status",
      searchType: "equals",
      searchValue: '"active"'
    })
  })
    .then((res: any) => {
      if (res?.code === 200) {
        // console.log("获取设计师工作负载:", res?.data?.records || []);

        const records = res?.data?.records || [];
        designers.value = records.map(item => ({
          label: item.designerName,
          value: item.userId
        }));
      } else {
        console.error("获取设计师工作负载失败:", res?.msg);
      }
    })
    .catch(error => {
      console.error("获取设计师工作负载失败:", error.message);
    });
};
//#endregion

watch(
  () => [pagination.value.pageNo, pagination.value.pageSize],
  () => {
    fetchDesignTaskList();
  },
  {
    immediate: true
  }
);

//#region 展示处理相关逻辑
// 处理需求状态展示
const getStatusInfo = (status: string) => {
  const statusItem = DESIGN_ENUM_OPTIONS.TASK_STATUS.find(
    item => item.value === status
  );
  return {
    text: statusItem?.label || status,
    color: statusItem?.colorClass
  };
};
// 处理优先级展示
const getPriorityInfo = (priority: number) => {
  const priorityItem = DESIGN_ENUM_OPTIONS.PRIORITY.find(
    item => item.value === priority
  );
  return {
    text: priorityItem?.label || priority
  };
};
//#endregion

//#region 任务详情相关
const dialogCardRef = ref();
const handleOpenDetailDialog = (id: string | number) => {
  if (id) {
    dialogCardRef.value?.initDialog(id.toString());
  }
};
//#endregion

onMounted(() => {
  fetchDesignerWorkloads();

  nextTick(() => {
    initSearchParamsFromUrl();
  });
});
</script>

<template>
  <div>
    <el-card
      shadow="never"
      style="margin-bottom: 12px; border-radius: 10px"
      class="search-card"
    >
      <el-form
        ref="searchFormRef"
        :inline="true"
        :model="searchForm"
        class="demo-form-inline"
      >
        <el-form-item label="创建时间" prop="createAtRange">
          <el-date-picker
            v-model="searchForm.createAtRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="负责人" prop="assignedToName">
          <el-select
            v-model="searchForm.assignedToName"
            placeholder="请选择负责人"
            clearable
          >
            <el-option
              v-for="item in designers"
              :key="item.value"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="需求状态" prop="status">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择需求状态"
            clearable
          >
            <el-option
              v-for="item in DESIGN_ENUM_OPTIONS.TASK_STATUS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="优先级" prop="priority">
          <el-select
            v-model="searchForm.priority"
            placeholder="请选择优先级"
            clearable
          >
            <el-option
              v-for="item in DESIGN_ENUM_OPTIONS.PRIORITY"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="使用场景" prop="usageScenario">
          <el-select
            v-model="searchForm.usageScenario"
            placeholder="请选择使用场景"
            clearable
          >
            <el-option
              v-for="item in DESIGN_ENUM_OPTIONS.USAGE_SCENARIO_MAP"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="影响范围" prop="impactRange">
          <el-select
            v-model="searchForm.impactRange"
            placeholder="请选择影响范围"
            clearable
          >
            <el-option
              v-for="item in DESIGN_ENUM_OPTIONS.IMPACT_RANGE_MAP"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button @click="handleReset(searchFormRef)">重置</el-button>
          <el-button type="primary" @click="fetchDesignTaskList"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never" style="border-radius: 10px">
      <el-table
        :data="detailTableData"
        style="width: 100%"
        size="small"
        :header-cell-style="{ color: '#0a0a0a' }"
      >
        <el-table-column
          prop="title"
          label="需求标题"
          show-overflow-tooltip
          width="200"
        >
          <template #default="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="需求状态">
          <template #default="scope">
            <div
              class="inline-block px-2 py-1 rounded text-[#0a0a0a] text-xs font-medium text-center min-w-[50px]"
              :class="getStatusInfo(scope.row.status).color"
            >
              {{ getStatusInfo(scope.row.status).text }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="priority" label="优先级">
          <template #default="scope">
            {{ getPriorityInfo(scope.row.priority).text }}
          </template>
        </el-table-column>
        <el-table-column prop="usageScenario" label="使用场景" />
        <el-table-column prop="impactRange" label="影响范围" />
        <el-table-column prop="deadline" label="截止日期" />
        <el-table-column prop="createUserName" label="提交人" />
        <el-table-column prop="assignedToName" label="负责人" />

        <el-table-column label="操作" width="50" :fixed="'right'">
          <template #default="scope">
            <el-tooltip
              class="box-item"
              effect="dark"
              content="点击查看详情"
              placement="top"
              :show-after="300"
            >
              <el-button
                link
                type="primary"
                size="small"
                @click="handleOpenDetailDialog(scope.row.id)"
              >
                <BxDetail />
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-[16px] flex justify-end">
        <el-pagination
          v-model:current-page="pagination.pageNo"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[15, 50, 100]"
          size="small"
          background
          layout="total, sizes, prev, pager, next"
          :total="pagination.pageTotal"
        />
      </div>
    </el-card>

    <DialogCard ref="dialogCardRef" />
  </div>
</template>

<style lang="scss" scoped>
.demo-form-inline .el-input {
  --el-input-width: 220px;
}

.demo-form-inline .el-select {
  --el-select-width: 220px;
}

:deep(.search-card .el-card__body) {
  padding-bottom: 0;
}
</style>
