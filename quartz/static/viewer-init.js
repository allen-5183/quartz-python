document.addEventListener("DOMContentLoaded", () => {
  if (typeof Viewer === "undefined") return

  const article = document.querySelector("article")
  if (!article) return

  new Viewer(article, {
    toolbar: true,
    navbar: false,
    title: false,
    movable: true,
    zoomable: true,
    rotatable: true,
    scalable: true,
  })
})