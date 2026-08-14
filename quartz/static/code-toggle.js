/**
 * code-toggle.js
 * 全域程式碼範例切換按鈕 + 權限驗證機制
 */
;(function () {
  "use strict"

  // ============================================================================
  // 設定：存取驗證密碼（可在此自由修改）
  // ============================================================================
  const CORRECT_PASSWORD = "1234"
  const AUTH_STORAGE_KEY = "code-toggle-authed"
  const TOGGLE_STORAGE_KEY = "code-toggle-collapsed"

  // SVG Icons
  const ICON_LOCK =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'
  const ICON_CODE_SHOW =
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>'
  const ICON_CODE_HIDE =
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>'

  /**
   * 檢查是否已通過權限驗證
   */
  function isAuthenticated() {
    try {
      return sessionStorage.getItem(AUTH_STORAGE_KEY) === "true"
    } catch (e) {
      return false
    }
  }

  /**
   * 設定已驗證狀態
   */
  function setAuthenticated() {
    try {
      sessionStorage.setItem(AUTH_STORAGE_KEY, "true")
    } catch (e) {}
  }

  /**
   * 取得頁面上所有的 example callout
   */
  function getExampleCallouts() {
    return document.querySelectorAll('.callout[data-callout="example"]')
  }

  /**
   * 依目前驗證狀態，將鎖定/已授權樣式 class 同步到每個 callout 上
   */
  function updateCalloutLockState(callouts) {
    var authed = isAuthenticated()
    for (var i = 0; i < callouts.length; i++) {
      if (authed) {
        callouts[i].classList.remove("is-code-locked")
        callouts[i].classList.add("is-code-authed")
      } else {
        callouts[i].classList.remove("is-code-authed")
        callouts[i].classList.add("is-code-locked")
      }
    }
  }

  /**
   * 判斷目前大部分 callout 是否為折疊狀態
   */
  function areMostCollapsed(callouts) {
    if (!callouts.length) return true
    var collapsedCount = 0
    for (var i = 0; i < callouts.length; i++) {
      if (callouts[i].classList.contains("is-collapsed")) collapsedCount++
    }
    return collapsedCount >= callouts.length / 2
  }

  /**
   * 設定所有 callouts 的展開/收合狀態
   */
  function setAllCallouts(callouts, shouldCollapse) {
    for (var i = 0; i < callouts.length; i++) {
      if (shouldCollapse) {
        callouts[i].classList.add("is-collapsed")
        callouts[i].removeAttribute("open")
      } else {
        callouts[i].classList.remove("is-collapsed")
        callouts[i].setAttribute("open", "")
      }
    }
  }

  /**
   * 讀取儲存的展開/收合偏好
   */
  function getSavedPreference() {
    try {
      var val = localStorage.getItem(TOGGLE_STORAGE_KEY)
      if (val === "true") return true
      if (val === "false") return false
      return null
    } catch (e) {
      return null
    }
  }

  /**
   * 儲存偏好
   */
  function savePreference(isCollapsed) {
    try {
      localStorage.setItem(TOGGLE_STORAGE_KEY, String(isCollapsed))
    } catch (e) {}
  }

  /**
   * 更新按鈕外觀與狀態
   */
  function updateButton(btn, isCollapsed) {
    var authed = isAuthenticated()
    var labelText = isCollapsed ? "展開程式碼" : "收合程式碼"

    if (!authed) {
      labelText += " 🔒"
    }

    if (isCollapsed) {
      btn.innerHTML = ICON_CODE_SHOW
      btn.title = authed ? "展開所有程式碼" : "權限驗證：解鎖程式碼切換功能"
      btn.setAttribute("aria-label", btn.title)
      btn.classList.remove("code-toggle-btn--expanded")
      btn.classList.add("code-toggle-btn--collapsed")
    } else {
      btn.innerHTML = ICON_CODE_HIDE
      btn.title = authed ? "收合所有程式碼" : "權限驗證：解鎖程式碼切換功能"
      btn.setAttribute("aria-label", btn.title)
      btn.classList.remove("code-toggle-btn--collapsed")
      btn.classList.add("code-toggle-btn--expanded")
    }

    var label = document.createElement("span")
    label.className = "code-toggle-label"
    label.textContent = labelText
    btn.appendChild(label)

    if (!authed) {
      btn.classList.add("code-toggle-btn--locked")
    } else {
      btn.classList.remove("code-toggle-btn--locked")
    }
  }

  /**
   * 顯示密碼驗證彈出視窗 Modal
   */
  function showAuthModal(onSuccess) {
    var existingModal = document.getElementById("code-toggle-auth-modal")
    if (existingModal) existingModal.remove()

    var overlay = document.createElement("div")
    overlay.id = "code-toggle-auth-modal"
    overlay.className = "code-toggle-modal-overlay"

    overlay.innerHTML =
      '<div class="code-toggle-modal">' +
      '  <div class="code-toggle-modal-header">' +
      '    <div class="code-toggle-modal-icon">' +
      ICON_LOCK +
      "</div>" +
      '    <h3 class="code-toggle-modal-title">權限驗證</h3>' +
      "  </div>" +
      '  <p class="code-toggle-modal-desc">請輸入授權密碼以啟用程式碼切換功能：</p>' +
      '  <div class="code-toggle-modal-input-wrap">' +
      '    <input type="password" id="code-toggle-pwd-input" class="code-toggle-modal-input" placeholder="請輸入密碼" autofocus />' +
      '    <div id="code-toggle-error-msg" class="code-toggle-modal-error"></div>' +
      "  </div>" +
      '  <div class="code-toggle-modal-actions">' +
      '    <button type="button" id="code-toggle-btn-cancel" class="code-toggle-modal-btn code-toggle-modal-btn--secondary">取消</button>' +
      '    <button type="button" id="code-toggle-btn-submit" class="code-toggle-modal-btn code-toggle-modal-btn--primary">驗證並解鎖</button>' +
      "  </div>" +
      "</div>"

    document.body.appendChild(overlay)

    // 動態加入開啟級別動畫
    requestAnimationFrame(function () {
      overlay.classList.add("is-visible")
    })

    var input = document.getElementById("code-toggle-pwd-input")
    var errorMsg = document.getElementById("code-toggle-error-msg")
    var btnCancel = document.getElementById("code-toggle-btn-cancel")
    var btnSubmit = document.getElementById("code-toggle-btn-submit")

    function closeModal() {
      overlay.classList.remove("is-visible")
      setTimeout(function () {
        overlay.remove()
      }, 200)
    }

    function doVerify() {
      var pwd = input.value
      if (pwd === CORRECT_PASSWORD) {
        setAuthenticated()
        closeModal()
        if (typeof onSuccess === "function") {
          onSuccess()
        }
      } else {
        errorMsg.textContent = "❌ 密碼錯誤，請重新輸入！"
        input.value = ""
        input.focus()
        input.classList.add("shake")
        setTimeout(function () {
          input.classList.remove("shake")
        }, 500)
      }
    }

    btnCancel.addEventListener("click", closeModal)
    btnSubmit.addEventListener("click", doVerify)

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal()
    })

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault()
        doVerify()
      } else if (e.key === "Escape") {
        closeModal()
      }
    })

    setTimeout(function () {
      input.focus()
    }, 100)
  }

  /**
   * 執行實際的展開/收合切換
   */
  function toggleCallouts(btn) {
    var currentCallouts = getExampleCallouts()
    var currentlyCollapsed = areMostCollapsed(currentCallouts)

    if (currentlyCollapsed) {
      setAllCallouts(currentCallouts, false)
      updateButton(btn, false)
      savePreference(false)
    } else {
      setAllCallouts(currentCallouts, true)
      updateButton(btn, true)
      savePreference(true)
    }
  }

  /**
   * 初始化切換按鈕
   */
  function init() {
    var existing = document.getElementById("code-toggle-btn")
    if (existing) existing.remove()

    var callouts = getExampleCallouts()
    if (!callouts.length) return

    updateCalloutLockState(callouts)

    // 檢查是否有儲存偏好（僅限已驗證使用者套用）
    if (isAuthenticated()) {
      var savedPref = getSavedPreference()
      if (savedPref !== null) {
        setAllCallouts(callouts, savedPref)
      }
    }

    var isCollapsed = areMostCollapsed(callouts)
    var btn = document.createElement("button")
    btn.id = "code-toggle-btn"
    btn.className = "code-toggle-btn"
    btn.type = "button"
    updateButton(btn, isCollapsed)

    btn.addEventListener("click", function () {
      if (!isAuthenticated()) {
        showAuthModal(function () {
          // 驗證成功後，先同步鎖定狀態樣式，再執行切換
          updateCalloutLockState(callouts)
          updateButton(btn, isCollapsed)
          toggleCallouts(btn)
        })
      } else {
        toggleCallouts(btn)
      }
    })

    document.body.appendChild(btn)
  }

  // DOM 載入完成後執行
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init)
  } else {
    init()
  }

  // 監聽 Quartz SPA 導航事件
  document.addEventListener("nav", function () {
    setTimeout(init, 100)
  })
})()
