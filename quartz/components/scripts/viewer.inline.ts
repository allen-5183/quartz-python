document.addEventListener("DOMContentLoaded", initViewer)
document.addEventListener("nav", initViewer)

function initViewer() {
  const article = document.querySelector("article")

  if (!article) return

  const oldViewer = (article as any)._viewer

  if (oldViewer) {
    oldViewer.destroy()
  }

  ;(article as any)._viewer = new (window as any).Viewer(article, {
    toolbar: true,
    navbar: false,
    title: false,
    movable: true,
    zoomable: true,
    rotatable: true,
    scalable: true,
  })
}