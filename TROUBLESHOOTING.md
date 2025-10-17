# 🔧 GitHub Pages 部署問題排查

## 錯誤：404 Not Found - Creating Pages deployment failed

### 錯誤訊息

```
Error: Creating Pages deployment failed
Error: HttpError: Not Found
Ensure GitHub Pages has been enabled
```

### 原因分析

這個錯誤表示 GitHub Pages 尚未正確啟用或配置。404 錯誤通常由以下原因造成：

1. ❌ GitHub Pages 功能未啟用
2. ❌ Source 設定不正確
3. ❌ 倉庫權限問題
4. ❌ 倉庫是私有的（免費帳號不支援私有倉庫的 Pages）

## ✅ 解決步驟

配置 Source 有效


### 步驟 1：確認倉庫可見性

**GitHub Pages 要求**：
- 免費帳號：倉庫必須是 **Public**（公開）
- Pro/Enterprise 帳號：可以使用私有倉庫

**檢查方法**：
1. 前往倉庫首頁
2. 查看倉庫名稱旁邊是否有 "Public" 標籤
3. 如果是 "Private"，需要改為 Public：
   - Settings → General
   - 滾動到最下方 "Danger Zone"
   - 點擊 "Change repository visibility"
   - 選擇 "Make public"

### 步驟 2：啟用 GitHub Pages

1. **前往 Settings**
   ```
   https://github.com/samzhu/dual-photo-composer/settings/pages
   ```

2. **配置 Source**
   - 在 "Build and deployment" 區域
   - **Source** 下拉選單選擇 **"GitHub Actions"**（重要！）
   - **不要**選擇 "Deploy from a branch"
   - 點擊 Save（如果有）

   ![正確設定](https://i.imgur.com/example.png)

3. **等待幾秒鐘**
   - GitHub 需要時間初始化 Pages 環境

### 步驟 3：重新觸發 Workflow

有兩種方式：

#### 方式 A：手動觸發（推薦）

1. 前往 Actions 頁面
   ```
   https://github.com/samzhu/dual-photo-composer/actions
   ```

2. 選擇左側的 "Deploy to GitHub Pages" workflow

3. 點擊右上角的 "Run workflow" 按鈕

4. 選擇 `main` 分支

5. 點擊綠色的 "Run workflow" 按鈕

#### 方式 B：推送新的 Commit

```bash
# 建立一個空的 commit
git commit --allow-empty -m "Trigger GitHub Pages deployment"

# 推送到 GitHub
git push origin main
```

### 步驟 4：驗證部署

1. 前往 Actions 頁面查看執行狀態

2. 等待 workflow 完成（綠色勾選 ✓）

3. 前往 Settings → Pages 查看網站 URL

4. 訪問網站：
   ```
   https://samzhu.github.io/dual-photo-composer/
   ```

## 🔍 進階排查

### 檢查 Workflow 權限

確認 workflow 有正確的權限：

1. 前往 Settings → Actions → General

2. 滾動到 "Workflow permissions" 區域

3. 確認選擇了：
   - ✅ **Read and write permissions**

   或

   - ✅ **Read repository contents and packages permissions** +
   - ✅ **Allow GitHub Actions to create and approve pull requests**

4. 點擊 Save

### 檢查 Pages 環境

1. 前往 Settings → Environments

2. 應該看到一個名為 `github-pages` 的環境

3. 如果沒有，說明 Pages 尚未正確初始化

4. 重新執行「步驟 2：啟用 GitHub Pages」

### 檢查部署日誌

1. 前往 Actions 頁面

2. 點擊失敗的 workflow 執行

3. 展開 "deploy" job

4. 查看 "Deploy to GitHub Pages" 步驟的詳細日誌

5. 尋找其他錯誤訊息

## 📋 完整檢查清單

在重新部署之前，確認以下所有項目：

- [ ] 倉庫是 **Public**（公開）
- [ ] Settings → Pages 已啟用
- [ ] Source 設定為 **"GitHub Actions"**
- [ ] Workflow permissions 設定為 **"Read and write permissions"**
- [ ] `.github/workflows/deploy.yml` 檔案存在
- [ ] `vite.config.js` 中有正確的 `base` 配置
- [ ] 已等待至少 1 分鐘讓 GitHub 初始化

## 🎯 常見錯誤情境

### 情境 1：剛建立倉庫

**問題**：第一次推送就執行 workflow

**解決**：
1. 先手動啟用 Pages（Settings → Pages）
2. 等待 1-2 分鐘
3. 重新執行 workflow

### 情境 2：私有倉庫

**問題**：倉庫是 Private

**解決**：
- 免費帳號：將倉庫改為 Public
- 付費帳號：確認 Pages 已啟用私有倉庫支援

### 情境 3：Fork 的倉庫

**問題**：從別人的倉庫 fork 過來

**解決**：
1. 在你自己的倉庫中啟用 Pages
2. 確認 workflow 檔案中的權限設定
3. 可能需要重新建立 workflow

## 🆘 仍然無法解決？

如果按照以上步驟仍然失敗，請提供以下資訊：

1. **倉庫 URL**：https://github.com/samzhu/dual-photo-composer

2. **倉庫可見性**：Public / Private

3. **GitHub 帳號類型**：Free / Pro / Enterprise

4. **完整的錯誤日誌**：
   - 前往 Actions 頁面
   - 複製完整的錯誤訊息

5. **Pages 設定截圖**：
   - Settings → Pages 的畫面

6. **Environments 狀態**：
   - Settings → Environments 是否有 `github-pages`

## 📚 相關資源

- [GitHub Pages 官方文檔](https://docs.github.com/en/pages)
- [GitHub Actions 權限說明](https://docs.github.com/en/actions/security-guides/automatic-token-authentication#permissions-for-the-github_token)
- [部署到 GitHub Pages 的完整指南](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site#publishing-with-a-custom-github-actions-workflow)

## 💡 快速解決方案

最常見的解決方法：

```bash
# 1. 確認倉庫是 Public
# 2. 前往 Settings → Pages
# 3. Source 選擇 "GitHub Actions"
# 4. 等待 1 分鐘
# 5. 執行以下指令

git commit --allow-empty -m "Retry GitHub Pages deployment"
git push origin main

# 6. 前往 Actions 頁面查看結果
```

---

**記住**：GitHub Pages 的啟用可能需要幾分鐘時間，請耐心等待！
