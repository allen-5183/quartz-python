# Quartz Python Q&A

## Q1:
為何 網站上沒有顯示出項目數字的編號，例如: 1. 在 Visual Studio Code IDE 自動開啟專案環境設置

## A1: 
根本原因：`Frontmatter` 的 `title` 設定。

```yaml
---
title: 在 Visual Studio Code IDE 自動開啟專案環境設置  ← 沒有 "1." 前綴！
draft: false
...
---

```

`Quartz` 渲染網頁標題時，優先使用 `title` 欄位的值，而不是檔案名稱。由於你的 `title` 沒有包含 `1.`，所以網站上顯示時就沒有編號。

**解決方案**:

只需在每個 `Markdown` 檔案的 `title frontmatter` 加上對應的數字前綴：

1. 在 Visual Studio Code IDE 自動開啟專案環境設置.md：
