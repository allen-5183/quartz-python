/**
 * Sidebar Resize — Obsidian-style draggable sidebar widths for Quartz.
 *
 * This script adds drag-to-resize functionality to the left and right sidebars.
 * It persists widths via localStorage and restores them on page load.
 *
 * Loaded as a static script in <head> to apply saved widths before first paint
 * (avoiding flash of default width), then attaches drag handlers after DOM ready.
 */

;(function () {
  "use strict"

  // -- Configuration ----------------------------------------------------------
  var DEFAULT_WIDTH = 320
  var MIN_WIDTH = 150
  var MAX_WIDTH = 500
  var LS_KEY_LEFT = "leftSidebarWidth"
  var LS_KEY_RIGHT = "rightSidebarWidth"
  var CSS_VAR_LEFT = "--left-sidebar-width"
  var CSS_VAR_RIGHT = "--right-sidebar-width"
  var MOBILE_BREAKPOINT = 800

  // -- Early restore (runs before DOMContentLoaded) ---------------------------
  var root = document.documentElement
  try {
    var savedLeft = localStorage.getItem(LS_KEY_LEFT)
    var savedRight = localStorage.getItem(LS_KEY_RIGHT)
    if (savedLeft) root.style.setProperty(CSS_VAR_LEFT, savedLeft)
    if (savedRight) root.style.setProperty(CSS_VAR_RIGHT, savedRight)
  } catch (_) {
    // localStorage unavailable (e.g. private browsing in some browsers)
  }

  // -- Drag logic (deferred until DOM is ready) -------------------------------

  function initResizeHandles() {
    var handles = document.querySelectorAll(".sidebar-resize-handle")
    if (!handles.length) return

    handles.forEach(function (handle) {
      var side = handle.getAttribute("data-side")
      if (side !== "left" && side !== "right") return

      var cssVar = side === "left" ? CSS_VAR_LEFT : CSS_VAR_RIGHT
      var lsKey = side === "left" ? LS_KEY_LEFT : LS_KEY_RIGHT

      // ---- Mouse / pointer events ----
      handle.addEventListener("mousedown", onDragStart)
      handle.addEventListener("touchstart", onDragStart, { passive: false })

      // ---- Double-click to reset ----
      handle.addEventListener("dblclick", function () {
        root.style.setProperty(cssVar, DEFAULT_WIDTH + "px")
        try {
          localStorage.removeItem(lsKey)
        } catch (_) {}
      })

      function onDragStart(e) {
        // Only process on desktop widths
        if (window.innerWidth <= MOBILE_BREAKPOINT) return

        e.preventDefault()
        e.stopPropagation()

        var startX = getClientX(e)
        var sidebar = handle.closest(".sidebar")
        if (!sidebar) return

        var startWidth = sidebar.getBoundingClientRect().width

        handle.classList.add("is-dragging")
        document.body.classList.add("sidebar-resizing")

        function onDragMove(moveEvent) {
          moveEvent.preventDefault()
          var currentX = getClientX(moveEvent)
          var delta = currentX - startX

          var newWidth
          if (side === "left") {
            newWidth = startWidth + delta
          } else {
            // Right sidebar: dragging left = wider, dragging right = narrower
            newWidth = startWidth - delta
          }

          // Clamp
          newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth))

          root.style.setProperty(cssVar, newWidth + "px")
        }

        function onDragEnd() {
          handle.classList.remove("is-dragging")
          document.body.classList.remove("sidebar-resizing")

          document.removeEventListener("mousemove", onDragMove)
          document.removeEventListener("mouseup", onDragEnd)
          document.removeEventListener("touchmove", onDragMove)
          document.removeEventListener("touchend", onDragEnd)
          document.removeEventListener("touchcancel", onDragEnd)

          // Persist
          var finalWidth = root.style.getPropertyValue(cssVar)
          if (finalWidth) {
            try {
              localStorage.setItem(lsKey, finalWidth)
            } catch (_) {}
          }
        }

        document.addEventListener("mousemove", onDragMove)
        document.addEventListener("mouseup", onDragEnd)
        document.addEventListener("touchmove", onDragMove, { passive: false })
        document.addEventListener("touchend", onDragEnd)
        document.addEventListener("touchcancel", onDragEnd)
      }
    })
  }

  function getClientX(e) {
    if (e.touches && e.touches.length > 0) {
      return e.touches[0].clientX
    }
    return e.clientX
  }

  // -- Initialization ---------------------------------------------------------
  // Run once on initial load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initResizeHandles)
  } else {
    initResizeHandles()
  }

  // Re-initialize after SPA navigation (Quartz dispatches a "nav" event)
  document.addEventListener("nav", function () {
    // Small delay to let the DOM settle after navigation
    requestAnimationFrame(function () {
      initResizeHandles()
    })
  })
})()