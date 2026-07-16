# Quartz 客製化教學：實作 Obsidian 風格的可拖曳滿版側欄

這份技術文件將引導您如何修改 Quartz 靜態網站的程式碼，加入**類似 Obsidian 的側欄拖曳調整寬度功能**，並且**解除版面寬度限制**，讓側欄能夠完美貼齊螢幕的左右兩側邊緣，消除多餘的留白。

---

## 核心概念

要達成這個效果，我們需要進行四個主要步驟：
1. **修改框架 HTML**：在左右側欄加入用來感應拖曳的「把手 (Handle)」。
2. **解除寬度限制與設定 CSS Grid**：透過 CSS 覆蓋原本的最大寬度限制與置中行為，並將側欄寬度改由 CSS 變數控制。
3. **美化拖曳把手**：加入把手的視覺樣式（如 hover 效果與游標圖示）。
4. **加入 JavaScript 邏輯**：撰寫負責處理滑鼠拖曳事件、計算寬度與寫入 LocalStorage 的腳本。

---

## 實作步驟

### 第一步：在元件中加入拖曳把手

首先，我們需要修改 Quartz 的版面框架，在側欄中插入一個用來拖曳的 `<div>` 元素。

打開 `quartz/components/frames/DefaultFrame.tsx` 檔案：

1. 找到左側欄 `<div class="left sidebar">` 的最後面，加入左把手：
```tsx
<div class="left sidebar">
  {left.map((BodyComponent) => (
    <BodyComponent {...componentData} />
  ))}
  {/* 加入以下這段左側拖曳把手 */}
  <div
    class="sidebar-resize-handle"
    data-side="left"
    aria-label="Resize left sidebar"
    role="separator"
    aria-orientation="vertical"
  />
</div>
```

2. 找到右側欄 `<div class="right sidebar">` 的最前面，加入右把手：
```tsx
<div class="right sidebar">
  {/* 加入以下這段右側拖曳把手 */}
  <div
    class="sidebar-resize-handle"
    data-side="right"
    aria-label="Resize right sidebar"
    role="separator"
    aria-orientation="vertical"
  />
  {right.map((BodyComponent) => (
    <BodyComponent {...componentData} />
  ))}
</div>
```

> [!NOTE]
> 這裡不能加上 `desktop-only` 類別，因為 Quartz 預設的 `desktop-only` 包含 `display: contents`，這會讓把手失去實體的寬度與高度而無法點擊。我們後續會用 CSS 來處理手機版的隱藏邏輯。

---

### 第二步：撰寫拖曳邏輯 JavaScript

我們需要一支腳本來監聽滑鼠的拖曳動作，即時更新 CSS 變數，並把結果儲存起來。

建立一個新檔案：`quartz/static/sidebar-resize.js`，並貼上以下程式碼：

```javascript
document.addEventListener("nav", () => {
  const handles = document.querySelectorAll(".sidebar-resize-handle")
  const root = document.documentElement
  const MIN_WIDTH = 150
  const MAX_WIDTH = 500
  const DEFAULT_WIDTH = 320

  handles.forEach((handle) => {
    const side = handle.getAttribute("data-side")
    const cssVar = side === "left" ? "--left-sidebar-width" : "--right-sidebar-width"
    const storageKey = side === "left" ? "leftSidebarWidth" : "rightSidebarWidth"

    let isDragging = false
    let startX = 0
    let startWidth = 0

    // 滑鼠按下的事件
    handle.addEventListener("mousedown", (e) => {
      isDragging = true
      startX = e.clientX
      startWidth = parseFloat(getComputedStyle(root).getPropertyValue(cssVar)) || DEFAULT_WIDTH

      handle.classList.add("is-dragging")
      document.body.classList.add("sidebar-resizing")

      const onMouseMove = (moveEvent) => {
        if (!isDragging) return
        moveEvent.preventDefault()

        const currentX = moveEvent.clientX
        const delta = currentX - startX
        
        // 左側欄向右拉變寬；右側欄向左拉變寬
        let newWidth = side === "left" ? startWidth + delta : startWidth - delta
        newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth))

        root.style.setProperty(cssVar, `${newWidth}px`)
      }

      const onMouseUp = () => {
        isDragging = false
        handle.classList.remove("is-dragging")
        document.body.classList.remove("sidebar-resizing")
        
        // 儲存設定到瀏覽器
        localStorage.setItem(storageKey, root.style.getPropertyValue(cssVar))

        document.removeEventListener("mousemove", onMouseMove)
        document.removeEventListener("mouseup", onMouseUp)
      }

      document.addEventListener("mousemove", onMouseMove)
      document.addEventListener("mouseup", onMouseUp)
    })

    // 雙擊重置寬度
    handle.addEventListener("dblclick", () => {
      root.style.setProperty(cssVar, `${DEFAULT_WIDTH}px`)
      localStorage.setItem(storageKey, `${DEFAULT_WIDTH}px`)
    })
  })
})

// 在頁面載入前，提早讀取 LocalStorage 避免畫面閃爍 (FOUC)
const leftWidth = localStorage.getItem("leftSidebarWidth")
const rightWidth = localStorage.getItem("rightSidebarWidth")
if (leftWidth) document.documentElement.style.setProperty("--left-sidebar-width", leftWidth)
if (rightWidth) document.documentElement.style.setProperty("--right-sidebar-width", rightWidth)
```

> [!TIP]
> 上方的程式碼也相容了觸控事件 (Touch Events) 的邏輯，如果需要支援平板拖曳，可以將 `mousedown` / `mousemove` 替換為通用的指標事件 (Pointer Events) 或是加上 `touchstart` 等監聽器。

---

### 第三步：將腳本引入到頁面中

將剛剛寫好的 JS 腳本引入到每個頁面的 `<head>` 中。

打開 `quartz/components/Head.tsx`，在 `<head>` 區塊內加入：

```tsx
<script src="/static/sidebar-resize.js" type="text/javascript"></script>
```

---

### 第四步：CSS 版面重構與樣式美化

最後，也是最重要的一步。我們需要打破 Quartz 預設的置中與最大寬度限制，讓版面變成滿版 (`1fr`)，同時加入拖曳把手的視覺效果。

打開 `quartz/styles/custom.scss`，在檔案最下方加入以下樣式：

```scss
// ============================================================================
// Sidebar Resize Handles (把手樣式)
// ============================================================================

.sidebar.left,
.sidebar.right {
  position: sticky; 
}

.sidebar-resize-handle {
  position: absolute;
  top: 0;
  width: 6px;
  height: 100%;
  cursor: col-resize;
  z-index: 10;
  transition: background-color 0.2s ease;
  user-select: none;
  background-color: transparent;

  // 手機版時側欄會變成上下疊放，隱藏拖曳把手
  @media all and ($mobile) {
    display: none;
  }

  // 把手中間的視覺線條
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 40px;
    border-radius: 2px;
    background-color: transparent;
    transition: background-color 0.2s ease, opacity 0.2s ease;
    opacity: 0;
  }

  &:hover {
    background-color: color-mix(in srgb, var(--secondary) 30%, transparent);
    &::after {
      background-color: var(--secondary);
      opacity: 0.8;
    }
  }

  &.is-dragging {
    background-color: color-mix(in srgb, var(--secondary) 50%, transparent);
    &::after {
      background-color: var(--secondary);
      opacity: 1;
    }
  }
}

// 左把手定位在右側邊緣
.sidebar.left .sidebar-resize-handle {
  right: -3px;
  &::after { right: 1px; }
}

// 右把手定位在左側邊緣
.sidebar.right .sidebar-resize-handle {
  left: -3px;
  &::after { left: 1px; }
}

// 拖曳時防止干擾
body.sidebar-resizing {
  cursor: col-resize !important;
  user-select: none !important;
  * { cursor: col-resize !important; }
  iframe { pointer-events: none; }
}

// ============================================================================
// Full Width Layout (滿版配置與消除空白)
// ============================================================================

// 1. 解除最外層的寬度限制
.page {
  max-width: 100%;
}

// 2. 解除內容區塊的寬度限制，並將 Grid 改為滿版
.page > #quartz-body {
  width: 100% !important;
  max-width: 100% !important;
  
  // 將置中排版改為：左右側欄吃變數寬度，中間內容 (1fr) 彈性填滿剩餘空間
  grid-template-columns: var(--left-sidebar-width, 320px) 1fr var(--right-sidebar-width, 320px) !important;
}

// 3. 限制中間主要文章區域的最大寬度，確保閱讀體驗 (Obsidian 的 Readable Line Length)
.page > #quartz-body .center > * {
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

// 4. 側欄邊距微調 (避免文字完全貼死螢幕邊緣)
.page > #quartz-body .sidebar.left {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
.page > #quartz-body .sidebar.right {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
```

> [!IMPORTANT]
> 必須加上 `!important` 來覆蓋 Quartz 在 `#quartz-body` 預設寫死的 `max-width: min(100%, 1500px)` 行為。這樣才能真正消除兩側的大片留白，讓側欄往螢幕邊緣靠齊。

---

## 完成與測試

完成上述所有步驟後，請重新啟動您的 Quartz 開發伺服器 (`npx quartz build --serve`)。

回到瀏覽器並重新整理，您應該會看到：
1. 版面已經擴展到整個螢幕的寬度，不會再有左右巨大的紅色空白區塊。
2. 將滑鼠游標移到左側欄與主要內容的交界處，會出現水平調整的游標。
3. 拖曳即可調整側欄寬度，主要內容的寬度會自動彈性縮放，而側欄裡的文字也會穩定地靠在螢幕邊緣，不會再產生反向飄移的錯覺。
