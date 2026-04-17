<script setup lang="ts">
import HeaderCard from "./components/headerCard/index.vue";
import BasicInfoCard from "./components/basicInfoCard/index.vue";
import WorkInfoCard from "./components/workInfoCard/index.vue";
import DescriptionCard from "./components/descriptionCard/index.vue";
import ModuleTabs from "./components/moduleTabs/index.vue";
import TaskManagementCard from "./components/taskManagementCard/index.vue";
import { useRoute } from "vue-router";
import {
  getPmDesignRequestsDetail,
  postPmDesignRequestsUpdate,
  getPmDesignRecordsDetail,
  postPmDesignRecordNew,
  getPmDesignersPage
} from "@/api/design";
import { ElMessage } from "element-plus";
import { inject, onMounted, ref, watch } from "vue";
import { DESIGN_ENUM_OPTIONS } from "@/constants/design";

// 从父组件注入获取需求列表的方法
const synchronousUpdate = inject<() => Promise<void>>("fetchDesignTaskList");

const props = defineProps({
  resquestId: {
    type: String,
    required: true
  }
});

const designers = ref([]);

const taskDetail = ref(
  // {
  //   id: 1,
  //   title: "618大促主视觉设计",
  //   basicInfo: {
  //     designType: "产品视觉设计",
  //     subType: "新品包装",
  //     deadline: "2024/2/15",
  //     usageScenario: "S2 对外品牌",
  //     impactRange: "I3 多项目",
  //     submitter: "产品部王经理",
  //     priority: "极高",
  //     status: "进行中",
  //     statusSource: "IN_PROGRESS",
  //     createAt: "2024/1/15"
  //   },
  //   workInfo: {
  //     assignee: "尤俊力",
  //     estimatedHours: 80,
  //     actualHours: 24,
  //     startTime: "2024/1/15 17:00:00",
  //     endTime: "2024/1/15 23:00:00"
  //   },
  //   description: "新品系列从0-1的包装设计，含结构和视觉，覆盖多个SKU"
  // },
  {
    id: null,
    title: "",
    basicInfo: {
      designType: "",
      subType: "",
      deadline: "",
      usageScenario: "",
      impactRange: "",
      submitter: "",
      priority: "",
      status: "",
      statusSource: "",
      createAt: ""
    },
    workInfo: {
      assignedId: "",
      assignee: "",
      estimatedHours: null,
      actualHours: null,
      startTime: "",
      endTime: ""
    },
    description: ""
  }
);
const recordDetail = ref({
  // content: "",
  // createdAt: "",
  // descriptionExt: "",
  // endTime: "",
  // id: null,
  // requestId: null,
  // startTime: "",
  // userId: null,
  // userName: ""
});

//#region 请求相关
const fetchTaskDetail = () => {
  if (!props.resquestId) {
    return;
  }
  getPmDesignRequestsDetail({
    requestId: props.resquestId
  })
    .then((res: any) => {
      if (res?.code === 200) {
        // console.log("获取任务详情:", res);
        const resData = res?.data || {};

        taskDetail.value = {
          id: resData.id,
          title: resData.title,
          basicInfo: {
            designType: resData.category,
            subType: resData.taskType,
            deadline: resData.deadline,
            usageScenario:
              DESIGN_ENUM_OPTIONS.USAGE_SCENARIO_MAP.find(
                item => item.value === resData.usageScenario
              )?.label || resData.usageScenario,
            impactRange:
              DESIGN_ENUM_OPTIONS.IMPACT_RANGE_MAP.find(
                item => item.value === resData.impactRange
              )?.label || resData.impactRange,
            submitter: resData.createUserName,
            priority:
              DESIGN_ENUM_OPTIONS.PRIORITY.find(
                item => item.value === resData.priority
              )?.label || resData.priority,
            status:
              DESIGN_ENUM_OPTIONS.TASK_STATUS.find(
                item => item.value === resData.status
              )?.label || resData.status,
            statusSource: resData.status,
            createAt: resData.createAt
          },
          workInfo: {
            assignedId: resData.assignedTo,
            assignee: resData.assignedToName,
            estimatedHours: resData.estimatedHours,
            actualHours: resData.actualHours || 0,
            startTime: resData.startAt,
            endTime: resData.endAt
          },
          description: resData.description
        };

        // console.log("任务详情:", taskDetail.value);
      } else {
        ElMessage.error("获取任务详情失败:" + res?.msg);
      }
    })
    .catch(error => {
      ElMessage.error("获取任务详情失败:" + error.message);
    });
};

const fetchRecordsDetail = () => {
  if (!props.resquestId) {
    return;
  }
  getPmDesignRecordsDetail({
    requestId: props.resquestId
  })
    .then((res: any) => {
      if (res?.code === 200) {
        // console.log("获取任务记录:", res);
        if (res?.data && res?.data?.length > 0) {
          const detail = res?.data?.[res?.data?.length - 1];
          // console.log("任务记录:", detail);
          recordDetail.value = {
            content: JSON.parse(detail.content || "{}"),
            createdAt: detail.createdAt,
            descriptionExt: JSON.parse(detail.descriptionExt || "{}"),
            endTime: detail.endTime,
            id: detail.id,
            requestId: detail.requestId,
            startTime: detail.startTime,
            userId: detail.userId,
            userName: detail.userName
          };
        } else {
          recordDetail.value = {};
        }
      } else {
        ElMessage.error("获取任务记录失败:" + res?.msg);
      }
    })
    .catch(error => {
      ElMessage.error("获取任务记录失败:" + error.message);
    });
};

const fetchUpdateTaskDetail = (data: any, callback?: () => void) => {
  postPmDesignRequestsUpdate({
    ...data
  })
    .then((res: any) => {
      if (res?.code === 200) {
        // console.log("更新任务详情:", res);
        ElMessage.success("更新任务详情成功");
        callback?.();
        fetchTaskDetail();
        synchronousUpdate();
      } else {
        ElMessage.error("更新任务详情失败:" + res?.msg);
      }
    })
    .catch(error => {
      ElMessage.error("更新任务详情失败:" + error.message);
    });
};

const fetchNewRecordDetail = (data: any, callback?: () => void) => {
  postPmDesignRecordNew({
    ...data
  })
    .then((res: any) => {
      if (res?.code === 200) {
        ElMessage.success("创建任务记录成功");
        callback?.();
        fetchRecordsDetail();
      } else {
        ElMessage.error("创建任务记录失败:" + res?.msg);
      }
    })
    .catch(error => {
      ElMessage.error("创建任务记录失败:" + error.message);
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

watch(
  () => props.resquestId,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      fetchTaskDetail();
      fetchRecordsDetail();
    }
  },
  {
    immediate: true
  }
);

onMounted(() => {
  fetchDesignerWorkloads();
});
</script>

<template>
  <div>
    <div v-if="props.resquestId">
      <div>
        <HeaderCard
          :taskDetail="taskDetail"
          :recordDetail="recordDetail"
          :updateFn="fetchUpdateTaskDetail"
          :newRecordFn="fetchNewRecordDetail"
        />
      </div>

      <div class="py-8">
        <div class="grid gap-6 lg:grid-cols-3">
          <!-- Left Column - Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Info Cards Grid -->
            <div class="grid gap-6 md:grid-cols-2">
              <BasicInfoCard :info="taskDetail.basicInfo" />
              <WorkInfoCard :info="taskDetail.workInfo" />
              <DescriptionCard
                :description="taskDetail.description"
                class="md:col-span-2"
              />
            </div>

            <!-- Tabs Section -->
            <ModuleTabs
              :taskDetail="taskDetail"
              :recordDetail="recordDetail"
              :newRecordFn="fetchNewRecordDetail"
            />
          </div>

          <!-- Right Column - Task Management -->
          <div>
            <TaskManagementCard
              :taskDetail="taskDetail"
              :recordDetail="recordDetail"
              :designers="designers"
              :updateFn="fetchUpdateTaskDetail"
              :newRecordFn="fetchNewRecordDetail"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div class="text-center py-12">
        <p class="text-gray-500 text-lg">暂无任务详情，请从任务列表查看</p>
      </div>
    </div>
  </div>
</template>
