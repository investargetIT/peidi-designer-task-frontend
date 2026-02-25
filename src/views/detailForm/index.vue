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
  postPmDesignRecordNew
} from "@/api/design";
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";
import { DESIGN_ENUM } from "@/constants/design";

const route = useRoute();
const requestId: string = route.query.requestId as string;

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
  //     statusSource: "IN_PROGRESS"
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
      statusSource: ""
    },
    workInfo: {
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
  if (!requestId) {
    return;
  }
  getPmDesignRequestsDetail({
    requestId: requestId
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
              resData.usageScenario +
              " " +
              DESIGN_ENUM.USAGE_SCENARIO_MAP[resData.usageScenario],
            impactRange:
              resData.impactRange +
              " " +
              DESIGN_ENUM.IMPACT_RANGE_MAP[resData.impactRange],
            submitter: resData.createUserName,
            priority: DESIGN_ENUM.PRIORITY[resData.priority],
            status: DESIGN_ENUM.TASK_STATUS[resData.status],
            statusSource: resData.status
          },
          workInfo: {
            assignee: resData.assignedToName,
            estimatedHours: resData.estimatedHours,
            actualHours: 0,
            startTime: "2000/1/1 00:00:00",
            endTime: "2000/1/1 00:00:00"
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
  if (!requestId) {
    return;
  }
  getPmDesignRecordsDetail({
    requestId: requestId
  })
    .then((res: any) => {
      if (res?.code === 200) {
        // console.log("获取任务记录:", res);
        if (res?.data && res?.data?.length > 0) {
          const detail = res?.data?.[res?.data?.length - 1];
          // console.log("任务记录:", detail);
          recordDetail.value = {
            content: detail.content,
            createdAt: detail.createdAt,
            descriptionExt: JSON.parse(detail.descriptionExt || "{}"),
            endTime: detail.endTime,
            id: detail.id,
            requestId: detail.requestId,
            startTime: detail.startTime,
            userId: detail.userId,
            userName: detail.userName
          };
        }
      } else {
        ElMessage.error("获取任务记录失败:" + res?.msg);
      }
    })
    .catch(error => {
      ElMessage.error("获取任务记录失败:" + error.message);
    });
};

const fetchUpdateTaskDetail = (data: any) => {
  postPmDesignRequestsUpdate({
    ...data
  })
    .then((res: any) => {
      if (res?.code === 200) {
        // console.log("更新任务详情:", res);
        ElMessage.success("更新任务详情成功");
        fetchTaskDetail();
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
        // callback?.();
        fetchRecordsDetail();
      } else {
        ElMessage.error("创建任务记录失败:" + res?.msg);
      }
    })
    .catch(error => {
      ElMessage.error("创建任务记录失败:" + error.message);
    });
};

onMounted(() => {
  fetchTaskDetail();
  fetchRecordsDetail();
});
</script>

<template>
  <div>
    <div v-if="requestId">
      <div>
        <HeaderCard :taskDetail="taskDetail" />
      </div>

      <div class="py-8">
        <div class="grid gap-6 lg:grid-cols-3">
          <!-- Left Column - Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Info Cards Grid -->
            <div class="grid gap-6 md:grid-cols-2">
              <BasicInfoCard :info="taskDetail.basicInfo" />
              <WorkInfoCard
                :info="taskDetail.workInfo"
                :recordDetail="recordDetail"
              />
              <DescriptionCard
                :description="taskDetail.description"
                class="md:col-span-2"
              />
            </div>

            <!-- Tabs Section -->
            <ModuleTabs
              :recordDetail="recordDetail"
              :newRecordFn="fetchNewRecordDetail"
            />
          </div>

          <!-- Right Column - Task Management -->
          <div>
            <TaskManagementCard
              :taskDetail="taskDetail"
              :recordDetail="recordDetail"
              :updateFn="fetchUpdateTaskDetail"
              :newRecordFn="fetchNewRecordDetail"
            />
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div class="text-center py-12">
        <p class="text-gray-500 text-lg">暂无任务详情，请从需求看板查看</p>
      </div>
    </div>
  </div>
</template>
