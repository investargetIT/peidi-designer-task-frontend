<script setup lang="ts">
import StatisticsCard from "./components/statisticsCard/index.vue";
import PersonCard from "./components/personCard/index.vue";
import InfoCard from "./components/infoCard/index.vue";
import { getPmDesignersPage } from "@/api/design";
import { onMounted, ref } from "vue";
import dayjs from "dayjs";

const statisticsInfo = ref({
  onDutyPeople: 0,
  primaryPeople: 0,
  supportFullPeople: 0,
  primaryTotalHours: 0,
  supportTotalHours: 0,
  totalHours: 0,
  maxHours: 0
});
const designers = ref([
  // {
  //   id: 1,
  //   name: "黄文文",
  //   department: "设计中心",
  //   avatarText: "黄",
  //   skills: [
  //     { type: "primary", label: "社媒设计" },
  //     { type: "support", label: "品牌设计" },
  //     { type: "support", label: "集团设计" }
  //   ],
  //   workloads: [
  //     { title: "主职能工时", current: 24, max: 176 },
  //     { title: "支援工时", current: 0, max: 44 }
  //   ],
  //   stats: [
  //     { value: 1, label: "主职责任务" },
  //     { value: 0, label: "支援任务" },
  //     { value: "24h", label: "本月总工时" }
  //   ],
  //   // 累计相关参数 统计
  //   cumulative: {
  //     primaryTotal: 0,
  //     supportTotal: 0,
  //     maxTotal: 0
  //   }
  // }
]);

//#region 请求相关
const fetchDesignerWorkloads = () => {
  return getPmDesignersPage({
    pageNo: 1,
    pageSize: 10e3,
    searchStr: JSON.stringify({
      searchName: "status",
      searchType: "equals",
      searchValue: '"active"'
    }),
    year: dayjs().year(),
    month: dayjs().month() + 1
  })
    .then((res: any) => {
      if (res?.code === 200) {
        // console.log("获取设计师工作负载:", res?.data?.records || []);

        const records = res?.data?.records || [];
        // 数据处理
        const designersTemp = [];
        const statisticsInfoTemp = {
          onDutyPeople: 0,
          primaryPeople: 0,
          supportFullPeople: 0,
          primaryTotalHours: 0,
          supportTotalHours: 0,
          totalHours: 0,
          maxHours: 0
        };

        records.forEach(item => {
          statisticsInfoTemp.onDutyPeople++;
          if (item.ongoingPrimaryProjects > 0) {
            statisticsInfoTemp.primaryPeople++;
          }
          if (item.isSupportFull) {
            statisticsInfoTemp.supportFullPeople++;
          }

          statisticsInfoTemp.primaryTotalHours += item.primaryHours;
          statisticsInfoTemp.supportTotalHours += item.supportHours;
          statisticsInfoTemp.totalHours += item.totalHours;
          statisticsInfoTemp.maxHours += item.totalLimit;

          designersTemp.push({
            id: item.designerId,
            name: item.designerName,
            department: item?.department || "暂无部门ID",
            avatarText: item.designerName?.[0] || "",
            skills: [],
            workloads: [
              {
                title: "主职能工时",
                current: item.primaryUsed,
                max: item.primaryLimit
              },
              {
                title: "支援工时",
                current: item.supportUsed,
                max: item.supportLimit
              }
            ],
            stats: [
              { value: item.ongoingPrimaryProjects, label: "主职责任务" },
              { value: item.ongoingSupportProjects, label: "支援任务" },
              { value: `${item.totalHours}h`, label: "本月总工时" }
            ],
            cumulative: {
              primaryTotal: item.primaryHours,
              supportTotal: item.supportHours,
              maxTotal: (item.primaryHours || 0) + (item.supportHours || 0)
            }
          });
        });

        statisticsInfo.value = statisticsInfoTemp;
        designers.value = designersTemp;
      } else {
        console.error("获取设计师工作负载失败:", res?.msg);
      }
    })
    .catch(error => {
      console.error("获取设计师工作负载失败:", error.message);
    });
};
//#endregion

onMounted(() => {
  fetchDesignerWorkloads();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Statistics Card -->
    <div>
      <StatisticsCard :statisticsInfo="statisticsInfo" />
    </div>

    <!-- Designer Cards Grid -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <PersonCard
        v-for="designer in designers"
        :key="designer.id"
        :designer="designer"
      />
    </div>

    <!-- Info Card -->
    <div class="mt-6">
      <InfoCard />
    </div>
  </div>
</template>
