// src/constants/design.ts - 设计配置常量
export const DESIGN_ENUM = {
  PRIORITY: {
    1: "低",
    2: "中",
    3: "高",
    4: "极高"
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
      label: "低",
      value: 1,
      colorClass: "bg-blue-200"
    },
    {
      label: "中",
      value: 2,
      colorClass: "bg-yellow-300"
    },
    {
      label: "高",
      value: 3,
      colorClass: "bg-orange-400"
    },
    {
      label: "极高",
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
