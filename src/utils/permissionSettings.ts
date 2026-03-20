// 权限设置相关的工具函数

// 管理员 id
const ADMIN_USER_IDS = [
  //#region 经委会
  // Nikki
  "1926449443739601215",
  // 杨杰
  "1926449443739598912",
  // 任琪琳
  "1870023775338692610",
  // 李胤
  "1871107779173351425",
  //#endregion
  // 陈董
  "1926449443739598857",
  // Lucy 廖丽萍
  "1869688287188811777",
  // Selina 黄琳艳
  "1926449443739598850",
  // HR 董思萍
  "1901573877226057730",
  // 廖佳晨
  "1874741663670775810"
];

// 开发人员 id
const DEV_USER_IDS = [
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
  manageBoard: [...DEV_USER_IDS]
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
