// src/constants/design.ts - 设计配置常量
export const DESIGN_ENUM = {
  PRIORITY: {
    1: "常规处理",
    2: "计划处理",
    3: "快速处理",
    4: "立即处理"
  },
  ALLOCATION_STATUS: {
    ALLOCATABLE: "可直接分配",
    ALLOCATABLE_SUPPORT: "可支援分配",
    PENDING_FIELDS: "待补充字段",
    NO_DESIGNER: "无匹配设计师",
    NEEDS_RESOLUTION: "需要插单处理"
  },
  TASK_STATUS: {
    DRAFT: "草稿",
    PENDING: "待分配",
    IN_PROGRESS: "进行中",
    COMPLETED: "已完成",
    OUTSOURCED: "已外包",
    RUSH: "插单处理"
  },
  // usageScenario - 解释名词 对应表
  USAGE_SCENARIO_MAP: {
    S1: "销售转化",
    S2: "对外品牌",
    S3: "内部支持",
    S4: "长期资产"
  },
  // impactRange - 解释名词 对应表
  IMPACT_RANGE_MAP: {
    I1: "单一",
    I2: "项目",
    I3: "多项目",
    I4: "公司级"
  }
};

// 设计配置枚举量 下拉框等使用
export const DESIGN_ENUM_OPTIONS = {
  PRIORITY: [
    {
      label: "常规处理",
      value: 1,
      colorClass: "bg-blue-200"
    },
    {
      label: "计划处理",
      value: 2,
      colorClass: "bg-yellow-300"
    },
    {
      label: "快速处理",
      value: 3,
      colorClass: "bg-orange-400"
    },
    {
      label: "立即处理",
      value: 4,
      colorClass: "bg-red-500"
    }
  ],
  TASK_STATUS: [
    {
      label: "草稿",
      value: "DRAFT",
      colorClass: "bg-yellow-400"
    },
    {
      label: "待分配",
      value: "PENDING",
      colorClass: "bg-blue-300"
    },
    {
      label: "待审核",
      value: "REVIEW",
      colorClass: "bg-blue-400"
    },
    {
      label: "进行中",
      value: "IN_PROGRESS",
      colorClass: "bg-green-300"
    },
    {
      label: "已外包",
      value: "OUTSOURCED",
      colorClass: "bg-purple-300"
    },
    {
      label: "插单处理",
      value: "RUSH",
      colorClass: "bg-orange-400"
    },
    {
      label: "已完成待审核",
      value: "COMPLETED_REVIEW",
      colorClass: "bg-indigo-300"
    },
    {
      label: "已完成",
      value: "COMPLETED",
      colorClass: "bg-gray-300"
    },
    {
      label: "已关闭",
      value: "CLOSE",
      colorClass: "bg-red-400"
    }
  ],
  USAGE_SCENARIO_MAP: [
    {
      label: "S1 销售转化",
      value: "S1"
    },
    {
      label: "S2 对外品牌",
      value: "S2"
    },
    {
      label: "S3 内部支持",
      value: "S3"
    },
    {
      label: "S4 长期资产",
      value: "S4"
    }
  ],
  IMPACT_RANGE_MAP: [
    {
      label: "I1 单一",
      value: "I1"
    },
    {
      label: "I2 项目",
      value: "I2"
    },
    {
      label: "I3 多项目",
      value: "I3"
    },
    {
      label: "I4 公司级",
      value: "I4"
    }
  ]
};

// 映射表：二级类型 -> 使用场景 & 影响范围
export const DESIGN_SECOND_CATEGORY_MAPPING: Record<
  string,
  { usageScenario: string; impactRange: string }
> = {
  // S1 产品视觉设计
  套版设计: { usageScenario: "S1", impactRange: "I2" },
  新品包装: { usageScenario: "S1", impactRange: "I3" },
  年度重点包装: { usageScenario: "S1", impactRange: "I4" },
  老包装改版: { usageScenario: "S1", impactRange: "I3" },
  渠道包装礼盒: { usageScenario: "S1", impactRange: "I2" },
  产品视觉物料: { usageScenario: "S1", impactRange: "I1" },

  // S2 社媒与品牌设计
  小红书单篇: { usageScenario: "S2", impactRange: "I1" },
  小红书多图: { usageScenario: "S2", impactRange: "I1" },
  公众号整篇: { usageScenario: "S2", impactRange: "I1" },
  社媒活动专题: { usageScenario: "S2", impactRange: "I2" },
  小程序商城: { usageScenario: "S2", impactRange: "I1" },
  品牌海报: { usageScenario: "S2", impactRange: "I1" },
  线下活动视觉: { usageScenario: "S2", impactRange: "I2" },
  线下物料: { usageScenario: "S2", impactRange: "I1" },
  品牌辅销品设计: { usageScenario: "S2", impactRange: "I2" },
  品牌辅销品开发: { usageScenario: "S2", impactRange: "I2" },
  品牌手册简版: { usageScenario: "S2", impactRange: "I3" },
  品牌手册升级: { usageScenario: "S2", impactRange: "I3" },

  // S3 集团设计
  集团对外宣发物料: { usageScenario: "S3", impactRange: "I4" },
  "人力招聘设计（简）": { usageScenario: "S3", impactRange: "I1" },
  "人力招聘设计（繁）": { usageScenario: "S3", impactRange: "I1" },
  行政简易需求: { usageScenario: "S3", impactRange: "I1" },
  集团小型年会活动: { usageScenario: "S3", impactRange: "I1" },
  集团空间文化墙设计: { usageScenario: "S3", impactRange: "I1" },
  集团大型年会活动: { usageScenario: "S3", impactRange: "I3" },

  // S4 品牌VI设计
  "品牌 VI 设计原则": { usageScenario: "S4", impactRange: "I4" },
  视觉标准模板输出: { usageScenario: "S4", impactRange: "I4" },
  "VI 局部升级": { usageScenario: "S4", impactRange: "I3" }
};
