self.onmessage = async function (event) {
  const { fnStr, args } = event.data;
  try {
    const fn = new Function("return " + fnStr)();
    const result = await fn(...args);
    self.postMessage({ result });
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};
