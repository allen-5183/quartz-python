/**
 * tableCopy.inline.ts
 * 為每個 Markdown 渲染後的表格（.table-container > table）
 * 動態加上「複製表格」按鈕，點擊後將表格內容複製為 Markdown 表格語法。
 *
 * 監聽 Quartz 的 nav 事件，確保 SPA 導航後也能正確掛載。
 */

// SVG icon：複製圖示（Lucide Copy icon）
const COPY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`

// SVG icon：成功複製圖示（Lucide Check icon）
const CHECK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`

/**
 * 將 <table> 元素的內容序列化為 Markdown 表格語法。
 * 例：
 *   | 欄A | 欄B |
 *   | --- | --- |
 *   | 值1 | 值2 |
 */
function tableToMarkdown(table: HTMLTableElement): string {
  const rows = Array.from(table.querySelectorAll("tr"))
  if (rows.length === 0) return ""

  const parsed = rows.map((row) =>
    Array.from(row.querySelectorAll("th, td")).map((cell) =>
      (cell as HTMLElement).innerText.trim().replace(/\|/g, "\\|"),
    ),
  )

  const colCount = Math.max(...parsed.map((r) => r.length))

  // 補齊欄數不足的列
  const normalized = parsed.map((r) => {
    while (r.length < colCount) r.push("")
    return r
  })

  const lines: string[] = []

  // 第一列（表頭）
  lines.push("| " + normalized[0].join(" | ") + " |")

  // 分隔線
  lines.push("| " + Array(colCount).fill("---").join(" | ") + " |")

  // 其餘資料列
  for (let i = 1; i < normalized.length; i++) {
    lines.push("| " + normalized[i].join(" | ") + " |")
  }

  return lines.join("\n")
}

/**
 * 在每個 .table-container 中加入複製按鈕。
 * 若按鈕已存在則跳過（避免重複掛載）。
 */
function addCopyButtons(): void {
  const containers = document.querySelectorAll<HTMLElement>(".table-container")

  for (const container of containers) {
    // 避免重複掛載
    if (container.querySelector(".table-copy-btn")) continue

    const table = container.querySelector<HTMLTableElement>("table")
    if (!table) continue

    const btn = document.createElement("button")
    btn.className = "table-copy-btn"
    btn.title = "複製表格"
    btn.setAttribute("aria-label", "複製表格內容")
    btn.innerHTML = COPY_SVG

    let resetTimer: ReturnType<typeof setTimeout> | null = null

    btn.addEventListener("click", async () => {
      const md = tableToMarkdown(table)
      try {
        await navigator.clipboard.writeText(md)

        // 顯示成功狀態
        btn.innerHTML = CHECK_SVG
        btn.classList.add("table-copy-btn--success")

        if (resetTimer) clearTimeout(resetTimer)
        resetTimer = setTimeout(() => {
          btn.innerHTML = COPY_SVG
          btn.classList.remove("table-copy-btn--success")
          resetTimer = null
        }, 2000)
      } catch {
        // fallback：使用舊式 execCommand
        const textarea = document.createElement("textarea")
        textarea.value = md
        textarea.style.position = "fixed"
        textarea.style.opacity = "0"
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand("copy")
        document.body.removeChild(textarea)

        btn.innerHTML = CHECK_SVG
        btn.classList.add("table-copy-btn--success")
        if (resetTimer) clearTimeout(resetTimer)
        resetTimer = setTimeout(() => {
          btn.innerHTML = COPY_SVG
          btn.classList.remove("table-copy-btn--success")
          resetTimer = null
        }, 2000)
      }
    })

    // 將按鈕加入 container（作為 container 的直接子元素，絕對定位）
    container.appendChild(btn)
  }
}

// 初次載入與 SPA 導航後都掛載
document.addEventListener("nav", () => {
  addCopyButtons()
})
