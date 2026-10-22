/**
 * 工作负载页 - 工时 / 任务显示名配置
 *
 * 背景：
 *   常规设计师的展示文案为：
 *     - 工时区块：主职能工时 / 支援工时
 *     - 任务统计：主职责任务 / 支援任务
 *   「外包设计」是一个特殊人员，其工时口径不同：
 *     - 主职能 → 产品视觉设计
 *     - 支援   → 社媒设计
 *   因此其卡片上的工时区块与任务统计文案都需要替换。
 *
 * 维护说明：
 *   后续若还有其他特殊人员需要更换显示名，直接在下方 map 中新增即可（键为设计师姓名，精确匹配），
 *   视图层无需改动。
 */
export interface WorkloadLabels {
  /** 主职能工时区块显示名 */
  primary: string;
  /** 支援工时区块显示名 */
  support: string;
  /** 主职责任务统计显示名 */
  primaryTask: string;
  /** 支援任务统计显示名 */
  supportTask: string;
}

/** 默认显示名 */
export const DEFAULT_WORKLOAD_LABELS: WorkloadLabels = {
  primary: "主职能工时",
  support: "支援工时",
  primaryTask: "主职责任务",
  supportTask: "支援任务"
};

/** 特殊人员（按姓名精确匹配）对应的显示名 */
export const WORKLOAD_LABEL_BY_NAME: Record<string, WorkloadLabels> = {
  外包设计: {
    primary: "产品视觉设计工时",
    support: "社媒设计工时",
    primaryTask: "产品视觉设计",
    supportTask: "社媒设计"
  }
};

/** 按设计师姓名获取显示名（精确匹配，未命中回退默认值） */
export const resolveWorkloadLabels = (name?: string): WorkloadLabels =>
  (name && WORKLOAD_LABEL_BY_NAME[name]) || DEFAULT_WORKLOAD_LABELS;
