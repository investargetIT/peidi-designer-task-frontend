<script setup lang="ts">
import { onMounted, ref } from "vue";
import ContentForm from "./components/contentForm/index.vue";
import {
  type DesignTaskCreateParams,
  getPmDesignCategoryPage,
  postPmDesignAllocationCheck,
  postPmDesignRequestsNew,
  postPmDesignRequestsResolve,
  postPmDesignRecordNew
} from "@/api/design";
import { storageLocal } from "@pureadmin/utils";
import { ElMessage } from "element-plus";
import ErrorDialog from "./components/resultDialog/error.vue";
import ResultDialog from "./components/resultDialog/index.vue";
import dayjs from "dayjs";

const USER_INFO: any = storageLocal().getItem("dataSource");

// 基础信息
const baseInfoConfig = ref({
  submitter: {
    name: "",
    department: ""
  },
  designTypes: [
    // {
    //   firstCategory: "产品视觉设计",
    //   secondCategories: [
    //     { name: "套版设计", description: "3天·多口味延展" },
    //     { name: "新品包装", description: "10天·从0-1" },
    //     { name: "年度重点包装", description: "14天·给销售带来重大转化" },
    //     { name: "老包装改版", description: "5天·不含结构大改" },
    //     { name: "渠道包装礼盒", description: "9天·含组合逻辑" },
    //     { name: "产品视觉物料", description: "5天·新品推广海报" }
    //   ]
    // },
    // {
    //   firstCategory: "社媒设计",
    //   secondCategories: [
    //     { name: "小红书单篇", description: "1天·封面图+基础排版" },
    //     { name: "小红书多图", description: "1.5天·含封面+3-6图" },
    //     { name: "公众号整篇", description: "1天·已有模块调整" },
    //     { name: "公众号整篇（含海报）", description: "2天·含海报图+内页" },
    //     { name: "社媒活动专题", description: "3天·含红书、公众号、小程序" },
    //     { name: "小程序商城", description: "1天·banner图" }
    //   ]
    // },
    // {
    //   firstCategory: "品牌设计",
    //   secondCategories: [
    //     { name: "品牌海报", description: "3天·单张主视觉" },
    //     { name: "线下活动视觉", description: "5天·主视觉含延展" },
    //     { name: "线下物料", description: "2天·易拉宝/KT" },
    //     { name: "品牌辅助品设计", description: "5天·设计不含打样" },
    //     { name: "品牌辅助品开发", description: "7天·含结构&打样" },
    //     { name: "品牌手册简版", description: "3天·新品新增" },
    //     { name: "品牌手册升级", description: "10天·视觉升级版" }
    //   ]
    // },
    // {
    //   firstCategory: "集团设计",
    //   secondCategories: [
    //     { name: "集团对外宣传物料", description: "3天·对外口径" },
    //     { name: "人力招聘设计（简）", description: "2天·JD/海报" },
    //     { name: "人力招聘设计（繁）", description: "5天·期刊" },
    //     { name: "行政简易需求", description: "0.5天·单张海报/简易排版" },
    //     { name: "集团小型年会活动", description: "3天·主视觉" },
    //     { name: "集团空间文化墙设计", description: "7天·含平面和落地说明" },
    //     { name: "集团大型年会活动", description: "10天·主视觉+延展" }
    //   ]
    // },
    // {
    //   firstCategory: "品牌VI设计",
    //   secondCategories: [
    //     { name: "品牌 VI 设计原则", description: "7天·核心规范" },
    //     { name: "视觉标准模板输出", description: "5天·PPT/KV模板" },
    //     { name: "VI 局部升级", description: "5天·非重构" }
    //   ]
    // }
  ],
  // 只传S1~S4
  usageScenarios: [
    {
      value: "S1",
      label: "S1 销售转化 （直接影响销售、转化、GMV 的设计）"
    },
    {
      value: "S2",
      label: "S2 对外品牌 （影响品牌形象、认知，但不直接转化）"
    },
    {
      value: "S3",
      label: "S3 内部支持 （支持公司内部运作，不直接面对用户）"
    },
    { value: "S4", label: "S4 长期资产 （偏体系、标准、长期使用）" }
  ],
  // 只传I1~I4
  impactRanges: [
    {
      value: "I1",
      label: "I1 单一 （仅影响一个具体内容或一次性使用场景，不复用、不扩散）"
    },
    {
      value: "I2",
      label: "I2 项目 （影响一个完整项目或活动周期，但范围有限）"
    },
    {
      value: "I3",
      label: "I3 多项目 （影响多个项目、多个渠道或多个产品，存在复用或联动）"
    },
    {
      value: "I4",
      label: "I4 公司级 （影响公司或品牌整体形象，具有长期、系统性影响）"
    }
  ]
});
const designCategoryList = ref([]);

//#region 请求相关
const fetchDesignCategory = () => {
  return getPmDesignCategoryPage()
    .then((res: any) => {
      if (res?.code === 200) {
        // console.log("获取任务类型列表:", res.data);
        designCategoryList.value = res.data || [];
      } else {
        ElMessage.error("获取任务类型列表失败:" + res?.msg);
      }
    })
    .catch((error: any) => {
      ElMessage.error("获取任务类型列表失败:" + error?.message);
    });
};

const fetchCheckAllocation = (
  params: DesignTaskCreateParams,
  callback?: (result: any, sourceData: any) => void
) => {
  // console.log("检查分配可行性:", params);
  // return;
  return postPmDesignAllocationCheck(params)
    .then((res: any) => {
      if (res?.code === 200) {
        ElMessage.success("检查分配可行性成功");
        callback?.(res.data, { ...params });
      } else {
        ElMessage.error("检查分配可行性失败:" + res?.msg);
      }
    })
    .catch((error: any) => {
      ElMessage.error("检查分配可行性失败:" + error?.message);
    });
};

const fetchAddDesignTask = (
  params: DesignTaskCreateParams,
  callback?: (requestId: number | string | null) => void
) => {
  // console.log("添加设计需求:", params);
  // return;
  return postPmDesignRequestsNew({
    ...params,
    createUserId: USER_INFO?.id || null
  })
    .then((res: any) => {
      if (res?.code === 200) {
        ElMessage.success("添加设计需求成功");
        const requestId = res.data?.requestId || null;
        // 创建任务记录
        postPmDesignRecordNew({
          requestId: requestId,
          createdAt: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
          startTime: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
          endTime: null,
          userId: USER_INFO?.id || null,
          userName: USER_INFO?.username || null
        })
          .then((res: any) => {
            if (res?.code === 200) {
              // ElMessage.success("创建任务记录成功");
            } else {
              ElMessage.error("创建任务记录失败:" + res?.msg);
            }
            callback?.(requestId);
          })
          .catch((error: any) => {
            ElMessage.error("创建任务记录失败:" + error?.message);
          });
      } else {
        ElMessage.error("添加设计需求失败:" + res?.msg);
      }
    })
    .catch((error: any) => {
      ElMessage.error("添加设计需求失败:" + error?.message);
    });
};

// 处理插单解决方案
const fetchRushDesignTask = (params: any, callback?: () => void) => {
  // console.log("处理插单解决方案:", params);
  // return;
  return postPmDesignRequestsResolve({
    ...params
  })
    .then((res: any) => {
      if (res?.code === 200) {
        ElMessage.success("插单成功");
        callback?.();
      } else {
        ElMessage.error("插单失败:" + res?.msg);
      }
    })
    .catch((error: any) => {
      ElMessage.error("插单失败:" + error?.message);
    });
};
//#endregion

//#region 结果弹窗相关
const resultDialogRef = ref();
const errorDialogRef = ref();
const handleInitDialog = (initData: any, sourceData: any) => {
  // console.log("结果弹窗:", initData, sourceData);
  // return;
  if (initData?.status === "NEEDS_RESOLUTION") {
    errorDialogRef.value?.initDialog(sourceData);
    return;
  }
  resultDialogRef.value?.initDialog(initData, sourceData);
};
//#endregion

const initBaseInfoConfig = () => {
  // 设计任务类型树
  function buildCategoryTree(categories: any[]) {
    const tree = [];
    const categoryMap = new Map();

    // 按一级分类分组
    categories.forEach(item => {
      const firstCategory = item.category;
      const secondItem = {
        name: item.taskType,
        description: `${item.standardPeriod}天·${item.remark}`
      };

      if (categoryMap.has(firstCategory)) {
        // 如果已存在该一级分类，添加到对应的二级分类数组
        categoryMap.get(firstCategory).secondCategories.push(secondItem);
      } else {
        // 如果不存在该一级分类，创建新的分类对象
        const newCategory = {
          firstCategory: firstCategory,
          secondCategories: [secondItem]
        };
        categoryMap.set(firstCategory, newCategory);
        tree.push(newCategory);
      }
    });

    return tree;
  }
  // 构建设计类型树并赋值
  const categoryTree = buildCategoryTree(designCategoryList.value);

  baseInfoConfig.value = {
    ...baseInfoConfig.value,
    submitter: {
      name: USER_INFO?.username || "",
      department: USER_INFO?.deptId || "暂无部门ID"
    },
    designTypes: categoryTree
  };
};

onMounted(async () => {
  await fetchDesignCategory();
  initBaseInfoConfig();
});
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2 text-gray-800">提交设计需求</h1>
      <p class="text-gray-600">
        填写需求信息后，系统将自动判断资源情况并分配到相应队列
      </p>
    </div>

    <div>
      <ContentForm
        :addFn="fetchAddDesignTask"
        :checkFn="fetchCheckAllocation"
        :baseInfoConfig="baseInfoConfig"
        :initDialogFn="handleInitDialog"
      />
    </div>

    <div>
      <ResultDialog ref="resultDialogRef" :addFn="fetchAddDesignTask" />
    </div>

    <div>
      <ErrorDialog
        ref="errorDialogRef"
        :addFn="fetchAddDesignTask"
        :rushFn="fetchRushDesignTask"
      />
    </div>
  </div>
</template>
