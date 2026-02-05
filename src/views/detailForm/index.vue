<script setup lang="ts">
import HeaderCard from "./components/headerCard/index.vue";
import BasicInfoCard from "./components/basicInfoCard/index.vue";
import WorkInfoCard from "./components/workInfoCard/index.vue";
import DescriptionCard from "./components/descriptionCard/index.vue";
import ModuleTabs from "./components/moduleTabs/index.vue";
import TaskManagementCard from "./components/taskManagementCard/index.vue";

interface TaskDetail {
  id: number;
  title: string;
  basicInfo: {
    designType: string;
    subType: string;
    deadline: string;
    usageScenario: string;
    impactRange: string;
    submitter: string;
  };
  workInfo: {
    assignee: string;
    estimatedHours: number;
    actualHours: number;
    startTime: string;
    endTime: string;
  };
  description: string;
}

const taskDetail: TaskDetail = {
  id: 1,
  title: "618大促主视觉设计",
  basicInfo: {
    designType: "产品视觉设计",
    subType: "新品包装",
    deadline: "2024/2/15",
    usageScenario: "S2 对外品牌",
    impactRange: "I3 多项目",
    submitter: "产品部王经理"
  },
  workInfo: {
    assignee: "尤俊力",
    estimatedHours: 80,
    actualHours: 24,
    startTime: "2024/1/15 17:00:00",
    endTime: "2024/1/15 23:00:00"
  },
  description: "新品系列从0-1的包装设计，含结构和视觉，覆盖多个SKU"
};
</script>

<template>
  <div>
    <div>
      <HeaderCard :title="taskDetail.title" />
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
          <ModuleTabs />
        </div>

        <!-- Right Column - Task Management -->
        <div>
          <TaskManagementCard
            :task-info="taskDetail"
            :work-info="taskDetail.workInfo"
          />
        </div>
      </div>
    </div>
  </div>
</template>
