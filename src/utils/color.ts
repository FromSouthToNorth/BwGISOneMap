const colorMap = [
  {
    set: new Set<string>(['A', '重大风险', '红', '运输中', '已装车', '已采', '重点']),
    color: '#ed0000',
  },
  {
    set: new Set<string>(['B', '较大风险', '橙', ' 高', '交接中', '待采', '限制']),
    color: '#fa7837',
  },
  {
    set: new Set<string>(['C', '一般风险', '黄', '中']),
    color: '#eefa08',
  },
  {
    set: new Set<string>(['DE', '低风险', '蓝', '低', '普通']),
    color: '#050dfa',
  },
  {
    set: new Set<string>(['交接中', '绿', '正在采', '井上']),
    color: '#52c41a',
  },
]

/**
 * 风险管控预警
 *
 * @param level
 */
export function getColor(level: string): string {
  for (const { set, color } of colorMap) {
    if (set.has(level)) {
      return color
    }
  }
  for (const { set, color } of colorMap) {
    for (const key of set) {
      if (level.includes(key)) {
        return color
      }
    }
  }
  return 'default'
}
