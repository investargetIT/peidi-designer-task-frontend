// import { formatToken, getToken } from "@/utils/auth";
import { http } from "@/utils/http";

export const commonUrlApi = (url: string) =>
  `${"http://12.18.1.12:8087"}${url}`;
// `${"https://api.peidigroup.cn"}${url}`;

interface PageConfig {
  pageNo: number;
  pageSize: number;
  searchStr?: string;
  sortStr?: string;
}

//#region 创建需求
export interface DesignTaskCreateParams {
  /** 分配给的用户ID */
  assignedTo: number;
  /** 分配给的用户名 */
  assignedToName: string;
  /** 任务分类 */
  category: string; // 一级类型
  /** ✅截止日期 */
  deadline: string;
  /** ✅任务描述 */
  description: string;
  /** ✅预估工时 */
  estimatedHours: number;
  /** ✅影响范围 */
  impactRange: string;
  /** 是否为支持类任务 */
  isSupport: boolean;
  /** 优先级 */
  priority: number;
  /** 备注信息 */
  remark: string;
  /** 任务状态 */
  status: string;
  /** 任务类型 */
  taskType: string; // 二级类型
  /** ✅任务标题 */
  title: string;
  /** ✅使用场景 */
  usageScenario: string;
}
export const postPmDesignRequestsNew = (data: DesignTaskCreateParams) => {
  return http.request("post", commonUrlApi("/pm/design/requests/new"), {
    data
  });
};
//#endregion

/** 获取任务类型列表 */
export const getPmDesignCategoryPage = () => {
  return http.request("get", commonUrlApi("/pm/design/category"), {});
};

/** 检查分配可行性 */
export const postPmDesignAllocationCheck = (data: DesignTaskCreateParams) => {
  return http.request("post", commonUrlApi("/pm/design/allocation/check"), {
    data
  });
};

//#region 获取需求列表
export interface DesignTaskRequest {
  /** 任务唯一标识符 */
  id: number;
  /** 任务标题 */
  title: string;
  /** 任务分类（一级类型）*/
  category: string;
  /** 任务类型（二级类型）*/
  taskType: string;
  /** 使用场景 */
  usageScenario: string;
  /** 影响范围 */
  impactRange: string;
  /** 优先级（数值越大优先级越高）*/
  priority: number;
  /** 任务状态 */
  status: string;
  /** 截止日期（ISO格式时间字符串）*/
  deadline: string;
  /** 预估工时（小时）*/
  estimatedHours: number;
  /** 分配给的用户ID */
  assignedTo: number;
  /** 是否为支持类任务 */
  isSupport: boolean;
  /** 备注信息（可为空）*/
  remark: string | null;
  /** 任务详细描述 */
  description: string;
  /** 分配给的用户名（可为空）*/
  assignedToName: string | null;
}
export const getPmDesignRequestsPage = (params: PageConfig) => {
  return http.request("get", commonUrlApi("/pm/design/requests/page"), {
    params
  });
};
//#endregion

//#region 获取设计师工作负载
export interface DesignerWorkload {
  /** 设计师ID */
  designerId: number;
  /** 设计师姓名 */
  designerName: string;
  /** 主力项目已用工时 */
  primaryUsed: number;
  /** 主力项目工时限制 */
  primaryLimit: number;
  /** 支持项目已用工时 */
  supportUsed: number;
  /** 支持项目工时限制 */
  supportLimit: number;
  /** 总已用工时 */
  totalUsed: number;
  /** 总工时限制 */
  totalLimit: number;
  /** 主力项目利用率 (%) */
  primaryUtilization: number;
  /** 支持项目利用率 (%) */
  supportUtilization: number;
  /** 总体利用率 (%) */
  totalUtilization: number;
  /** 进行中的主力项目数量 */
  ongoingPrimaryProjects: number;
  /** 主力项目是否已满载 */
  isPrimaryFull: boolean;
  /** 支持项目是否已满载 */
  isSupportFull: boolean;
}
export const getPmDesignersPage = (
  params: PageConfig & {
    month?: string;
    year?: string;
  }
) => {
  return http.request("get", commonUrlApi("/pm/design/designers/page"), {
    params
  });
};
//#endregion
