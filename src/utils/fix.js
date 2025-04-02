// structuredClone 兼容性实现
(function () {
  if (typeof window.structuredClone !== "function") {
    window.structuredClone = function (obj) {
      // 备用方案
      return JSON.parse(JSON.stringify(obj))
    }
  }
})();
