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
  }
};
