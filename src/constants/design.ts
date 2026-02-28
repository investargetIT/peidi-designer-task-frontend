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
      value: 1
    },
    {
      label: "中",
      value: 2
    },
    {
      label: "高",
      value: 3
    },
    {
      label: "极高",
      value: 4
    }
  ],
  TASK_STATUS: [
    {
      label: "草稿",
      value: "DRAFT"
    },
    {
      label: "待分配",
      value: "PENDING"
    },
    {
      label: "进行中",
      value: "IN_PROGRESS"
    },
    {
      label: "已完成",
      value: "COMPLETED"
    },
    {
      label: "已完成待审核",
      value: "COMPLETED_REVIEW"
    },
    {
      label: "已外包",
      value: "OUTSOURCED"
    },
    {
      label: "插单处理",
      value: "RUSH"
    },
    {
      label: "待审核",
      value: "REVIEW"
    },
    {
      label: "已关闭",
      value: "CLOSE"
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
