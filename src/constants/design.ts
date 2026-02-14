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
