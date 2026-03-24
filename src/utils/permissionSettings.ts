import { Roles } from "@/views/manageBoard/config/permission";

// 权限设置相关的工具函数

// 管理员 id
const ADMIN_USER_IDS = [
  // 廖佳晨
  "1874741663670775810"
];

// 开发人员 id
export const DEV_USER_IDS = [
  // 沈皓钰
  "1926449443739600965",
  // 王家琦
  "1887377779519434753",
  // 张思宇
  "1850741012504838145",
  // Summer
  "1846392647319093250",
  ...ADMIN_USER_IDS
];

/**
 * 权限配置对象
 * 每个模块对应一个权限ID数组
 */
export const permissionSettings = {
  // 管理看板 模块权限
  manageBoard: [...Roles.R1, ...Roles.R2, ...Roles.R3, ...DEV_USER_IDS],
  // 设计师工作负载 模块权限
  workload: [...Roles.R1, ...DEV_USER_IDS]
};

/**
 * 检查用户是否拥有指定模块的权限
 * @param userId 用户ID
 * @param module 模块名称
 * @returns 是否拥有权限
 */
export function hasPermission(userId: string, module: string): boolean {
  const modulePermissions =
    permissionSettings[module as keyof typeof permissionSettings];
  if (!modulePermissions) {
    return false;
  }
  return modulePermissions.includes(userId);
}
