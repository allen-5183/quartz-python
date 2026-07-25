# Obsidian 撰寫規則（Quartz 相容）

> 本文說明在 Obsidian 撰寫筆記時，哪些寫法會在 Quartz 網站上跑版或顯示異常，以及正確的替代寫法。

---

## 核心觀念

| 工具 | Markdown 解析器 | 特性 |
|------|----------------|------|
| Obsidian | 自訂（寬鬆） | 容忍縮排不一致、非標準語法 |
| Quartz | **CommonMark** 標準 | 嚴格遵守縮排與語法規則 |

Obsidian 顯示正常 ≠ Quartz 一定正常。  
撰寫時以 **CommonMark 標準**為準，就能兩端同時相容。

---

## 規則一：編號清單 + 程式碼區塊

### ❌ 跑版寫法（在兩者之間加空行）

```markdown
1. '.vscode/settings.json'

   ```json
   { ... }
   ```
```

**問題**：CommonMark 規定空行會中斷列表，程式碼區塊變成頂層獨立區塊，脫離清單。

---

### ✅ 正確寫法（不加空行，直接縮排接續）

```markdown
1. `.vscode/settings.json`
   ```json
   { ... }
   ```

2. `.vscode/tasks.json`
   ```json
   { ... }
   ```
```

**規則**：
- 清單項目文字與程式碼區塊之間 **不要有空白行**
- 程式碼區塊縮排 **3 個空格**（對齊 `1. ` 後的內容起點）

---

## 規則二：編號清單 + 圖片

### ❌ 跑版寫法

```markdown
1. 開啟命令面板

   ![[assets/screenshot.png]]

2. 選擇允許
```

### ✅ 正確寫法

```markdown
1. 開啟命令面板
   ![[assets/screenshot.png]]

2. 選擇允許
```

---

## 規則三：Frontmatter 的 title 欄位

### ❌ 網站標題少了編號

```yaml
---
title: 在 Visual Studio Code IDE 自動開啟專案環境設置
---
```

**問題**：Quartz 優先使用 `title` 顯示頁面標題，而非檔案名稱。

### ✅ 正確寫法（title 要與檔案名稱一致，含編號前綴）

```yaml
---
title: "1. 在 Visual Studio Code IDE 自動開啟專案環境設置"
---
```

---

## 規則四：巢狀清單的縮排

### ❌ 容易跑版的縮排（使用 Tab 或空格不一致）

```markdown
1. 主項目
	- 子項目（Tab 縮排）
```

### ✅ 正確寫法（統一用 3 個空格）

```markdown
1. 主項目
   - 子項目（3 空格縮排）
   - 另一子項目
```

---

## 規則五：Callout（提示框）語法

Obsidian 與 Quartz 兩者都支援 Callout，語法相同，可安心使用：

```markdown
> [!NOTE]
> 這是一個筆記提示框。

> [!TIP]
> 這是一個技巧提示框。

> [!WARNING]
> 這是一個警告提示框。

> [!IMPORTANT]
> 這是一個重要提示框。
```

> [!NOTE]
> Quartz 也支援 Obsidian 風格的 `[!example]`、`[!info]` 等 Callout 類型，無需修改。

---

## 規則六：圖片語法

Obsidian 的 Wikilink 圖片語法（`![[檔名.png|500]]`）在 Quartz 中通常可正常顯示，但建議確認：

| 用途 | Obsidian 寫法 | Quartz 是否支援 |
|------|--------------|----------------|
| 一般圖片 | `![[image.png]]` | ✅ 支援 |
| 指定寬度 | `![[image.png\|500]]` | ✅ 支援（Quartz 有設定解析） |
| 標準 Markdown 圖片 | `![alt](path/to/image.png)` | ✅ 最相容 |

---

## 快速檢查清單

在推送到 Quartz 網站前，請確認每個 Markdown 檔案：

- [ ] **Frontmatter** 的 `title` 包含正確的編號前綴（如 `"1. ..."` ）
- [ ] **編號清單**中，項目文字與程式碼區塊/圖片之間 **沒有空白行**
- [ ] **程式碼區塊**在清單內縮排 **3 個空格**（不是 Tab）
- [ ] **巢狀清單**使用 **3 個空格**縮排，不混用 Tab

---

*參考標準：[CommonMark Spec](https://spec.commonmark.org/)*
