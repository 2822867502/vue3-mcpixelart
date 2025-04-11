// structuredClone 兼容性实现
(function () {
  if (typeof window.structuredClone !== "function") {
    window.structuredClone = function (obj) {
      // 备用方案
      return JSON.parse(JSON.stringify(obj))
    }
  }
})();

// hash模式重定向为history模式
(function() {
  if (location.hash.startsWith('#/')) {
    const newPath = location.hash.slice(1) // 去掉 `#`
    location.replace(newPath)
  }
})();