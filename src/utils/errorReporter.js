import { apiErrorReport } from '../api/error'

export function setupErrorHandling(app) {
  // JS 运行时错误
  window.onerror = (msg, url, lineNo, columnNo, error) => {
    apiErrorReport({
      type: 'je',
      message: msg,
      url,
      line: lineNo,
      column: columnNo,
      stack: error?.stack || '',
      time: new Date().toISOString(),
    })
  }

  // Promise 未处理异常
  // window.onunhandledrejection = (event) => {
  //   apiErrorReport({
  //     type: 'pe',
  //     message: event.reason?.message || String(event.reason),
  //     stack: event.reason?.stack || '',
  //     time: new Date().toISOString(),
  //   })
  // }

  // Vue 异常
  app.config.errorHandler = (err, instance, info) => {
    apiErrorReport({
      type: 've',
      message: err.message,
      stack: err.stack,
      info,
      time: new Date().toISOString(),
    })
  }
}