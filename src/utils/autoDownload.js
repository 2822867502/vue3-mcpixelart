export function downloadFile(url, fname='') {
  const link = document.createElement("a")
  link.href = url
  if (fname !== '') link.download = fname
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}