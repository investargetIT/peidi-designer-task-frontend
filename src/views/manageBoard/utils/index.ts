/**
 * 计算百分比并保留指定小数位
 * @param value 当前值
 * @param total 总值
 * @param decimalPlaces 保留小数位数，默认为2位
 * @param options 配置选项
 * @returns 计算后的百分比数值
 */
export const calculatePercentage = (
  value: number,
  total: number,
  decimalPlaces: number = 2,
  options?: {
    /** 是否返回字符串格式 */
    returnAsString?: boolean;
    /** 当total为0时的默认返回值 */
    defaultValue?: number;
  }
): number | string => {
  // 参数验证
  if (typeof value !== "number" || typeof total !== "number") {
    throw new TypeError("value and total must be numbers");
  }

  if (decimalPlaces < 0) {
    throw new Error("decimalPlaces must be non-negative");
  }

  // 处理边界情况
  if (total === 0) {
    const defaultValue = options?.defaultValue ?? 0;
    return options?.returnAsString ? defaultValue.toString() : defaultValue;
  }

  // 计算百分比
  const percentage = (value / total) * 100;

  // 格式化结果
  const result = Number(percentage.toFixed(decimalPlaces));

  // 根据配置决定返回格式
  return options?.returnAsString ? result.toString() : result;
};
