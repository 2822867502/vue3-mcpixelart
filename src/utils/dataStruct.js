export class Counter{
  list = {}
  set(k) {
    if (this.list[k]) {
      this.list[k]++
    } else {
      this.list[k] = 1
    }
  }
  *[Symbol.iterator]() {
    // 按照值从大到小排序
    const sortedEntries = Object.entries(this.list).sort(([, a], [, b]) => b - a)
    for (const [k, v] of sortedEntries) {
      yield {
        name: k,
        count: v
      }
    }
  }
}