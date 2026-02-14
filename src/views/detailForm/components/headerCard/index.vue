<script setup lang="ts">
const props = defineProps({
  taskDetail: {
    type: Object,
    required: true
  }
});

const getBadgeClass = (type: "status" | "priority" | "assignee") => {
  const classes = {
    status: "bg-green-100 text-green-800 border-green-300",
    priority: "bg-red-100 text-red-800",
    assignee: "bg-gray-100 text-gray-700"
  };
  return `inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium ${classes[type]}`;
};
</script>

<template>
  <div class="flex-1">
    <div class="flex items-start justify-between gap-4 mb-3">
      <div>
        <h1 class="text-2xl font-bold mb-2 text-gray-800">
          {{ props.taskDetail.title }}
        </h1>
        <p class="text-gray-600">
          {{ props.taskDetail.basicInfo.designType }} ·
          {{ props.taskDetail.basicInfo.subType }}
        </p>
      </div>
      <div class="flex gap-2">
        <el-button type="primary" plain size="small">
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
              ></path>
              <path
                d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"
              ></path>
            </svg>
          </template>
          编辑
        </el-button>

        <el-button type="danger" plain size="small">
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              <line x1="10" x2="10" y1="11" y2="17"></line>
              <line x1="14" x2="14" y1="11" y2="17"></line>
            </svg>
          </template>
          删除
        </el-button>
      </div>
    </div>

    <div class="flex flex-wrap gap-2">
      <span :class="getBadgeClass('status')">{{
        props.taskDetail.basicInfo.status
      }}</span>
      <span :class="getBadgeClass('priority')">
        优先级：{{ props.taskDetail.basicInfo.priority }}
      </span>
      <span :class="getBadgeClass('assignee')">
        负责人：{{ props.taskDetail.workInfo.assignee }}
      </span>
    </div>
  </div>
</template>
