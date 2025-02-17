/**
 * 格式化为非负整数
 * @param {*} v 字符串、数字
 * @returns {number}
 */
export function formatInt(v) {
  switch (typeof v) {
    case 'string':
      const reg = /\d+/gm
      const mt = v.match(reg)
      if (mt) {
        return parseInt(mt.join(''))
      } else {
        return null
      }
      break
    case 'number':
      return parseInt(v)
    case 'boolean':
      return v ? 1 : 0
    case 'function':
      return formatInt(v())
    case 'undefined':
      return 0
    default:
      return 0
  }
}