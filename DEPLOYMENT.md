# 🚀 部署指南

本文檔詳細說明如何將 Dual Photo Composer 部署到 GitHub Pages。

## 📋 前置要求

- GitHub 帳號
- Git 已安裝並配置
- 專案已推送到 GitHub 倉庫

## 🎯 快速開始

### 步驟 1：啟用 GitHub Pages

1. 前往你的 GitHub 倉庫頁面
2. 點擊 **Settings**（設定）
3. 在左側選單中點擊 **Pages**
4. 在 **Source** 下拉選單中選擇 **GitHub Actions**
5. 點擊 **Save**（保存）

![GitHub Pages Settings](https://docs.github.com/assets/cb-47267/mw-1440/images/help/pages/publishing-source-drop-down.webp)

### 步驟 2：推送程式碼

如果你還沒有推送程式碼到 GitHub：

```bash
# 初始化 Git（如果尚未初始化）
git init

# 添加所有檔案
git add .

# 提交變更
git commit -m "Initial commit: Add photo collage app"

# 添加遠端倉庫（替換成你的倉庫 URL）
git remote add origin https://github.com/samzhu/dual-photo-composer.git

# 推送到 main 分支
git push -u origin main
```

### 步驟 3：等待部署完成

1. 前往你的倉庫的 **Actions** 頁面
2. 你會看到 "Deploy to GitHub Pages" workflow 正在執行
3. 等待約 1-2 分鐘，直到顯示綠色勾選標記 ✓
4. 部署完成後，訪問：`https://samzhu.github.io/dual-photo-composer/`

## 🔄 後續更新流程

每次你修改程式碼後，只需：

```bash
# 1. 添加變更
git add .

# 2. 提交變更
git commit -m "描述你的變更"

# 3. 推送到 GitHub
git push origin main
```

GitHub Actions 會自動：
- 安裝依賴
- 建置專案
- 部署到 GitHub Pages

## 🛠️ GitHub Actions 工作流程

本專案使用以下 GitHub Actions 工作流程（`.github/workflows/deploy.yml`）：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    - 安裝 Node.js 20
    - 安裝依賴 (npm ci)
    - 建置專案 (npm run build)
    - 上傳建置產物

  deploy:
    - 部署到 GitHub Pages
```

### 工作流程特點

1. **自動觸發**：每次推送到 `main` 分支時自動執行
2. **手動觸發**：可在 Actions 頁面手動執行
3. **快速建置**：使用 Node.js 20 和 npm ci 加速安裝
4. **安全部署**：使用官方 GitHub Pages 部署動作

## 🔍 監控部署狀態

### 方式 1：Actions 頁面

1. 前往倉庫的 **Actions** 頁面
2. 查看最新的 workflow 執行狀態
3. 點擊進入可查看詳細日誌

### 方式 2：Environments 頁面

1. 前往倉庫的 **Settings** → **Environments**
2. 點擊 **github-pages**
3. 查看部署歷史和當前網站 URL

### 方式 3：徽章顯示

在 README 中添加部署狀態徽章：

```markdown
![Deploy Status](https://github.com/samzhu/dual-photo-composer/actions/workflows/deploy.yml/badge.svg)
```

## ⚙️ 配置說明

### Vite 配置

在 `vite.config.js` 中，我們設定了 `base` 路徑：

```javascript
export default defineConfig({
  base: '/dual-photo-composer/',
  // ...
})
```

**重要**：`base` 必須與你的 GitHub 倉庫名稱一致！

### Workflow 權限

workflow 需要以下權限（已在 `deploy.yml` 中配置）：

```yaml
permissions:
  contents: read      # 讀取倉庫內容
  pages: write       # 寫入 Pages
  id-token: write    # 身份驗證
```

## 🐛 常見問題

### 問題 1：部署後頁面顯示 404

**原因**：`base` 配置不正確

**解決方案**：
1. 檢查 `vite.config.js` 中的 `base` 是否與倉庫名稱一致
2. 重新建置並推送：
   ```bash
   npm run build
   git add .
   git commit -m "Fix base URL"
   git push origin main
   ```

### 問題 2：CSS 或 JS 檔案無法載入

**原因**：資源路徑錯誤

**解決方案**：
1. 確保 `vite.config.js` 中有正確的 `base` 配置
2. 檢查 `index.html` 中的資源引用是否使用相對路徑

### 問題 3：Actions 執行失敗

**可能原因**：
- Node.js 版本不相容
- 依賴安裝失敗
- 建置錯誤

**解決方案**：
1. 查看 Actions 日誌找出具體錯誤
2. 在本地執行 `npm run build` 確認可以成功建置
3. 確保 `package.json` 中的依賴版本正確

### 問題 4：Pages 沒有啟用

**解決方案**：
1. 前往 Settings → Pages
2. 確保 Source 設為 "GitHub Actions"
3. 如果看不到此選項，確認倉庫是公開的

## 🌐 自訂網域

如果你想使用自訂網域：

1. **添加 CNAME 檔案**

   在 `public/` 目錄下創建 `CNAME` 檔案：
   ```
   your-domain.com
   ```

2. **配置 DNS**

   在你的網域註冊商設定 DNS：
   ```
   Type: CNAME
   Name: www (或 @)
   Value: samzhu.github.io
   ```

3. **在 GitHub 設定自訂網域**

   Settings → Pages → Custom domain

4. **更新 Vite 配置**

   ```javascript
   export default defineConfig({
     base: '/',  // 使用自訂網域時改為根路徑
     // ...
   })
   ```

## 📊 效能優化

### 建置優化

已在 `vite.config.js` 中配置：

```javascript
build: {
  outDir: 'dist',
  sourcemap: true,  // 生產環境可設為 false
}
```

### GitHub Actions 優化

使用 `npm ci` 而非 `npm install`，更快且更可靠：

```yaml
- name: Install dependencies
  run: npm ci
```

使用 Node.js 快取加速：

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
```

## 🔐 安全性

### Secrets 管理

如果需要使用私密資訊（API keys 等）：

1. 前往 Settings → Secrets and variables → Actions
2. 添加 secrets
3. 在 workflow 中使用：
   ```yaml
   env:
     API_KEY: ${{ secrets.API_KEY }}
   ```

### 依賴掃描

GitHub 會自動掃描依賴的安全漏洞：
- 前往 Security → Dependabot alerts
- 定期更新依賴以修復漏洞

## 📈 部署歷史

GitHub Pages 會保留部署歷史，你可以：
- 查看每次部署的時間
- 查看每次部署對應的 commit
- 在需要時回滾到先前版本

## 🎉 完成

現在你的照片拼貼工具已成功部署到 GitHub Pages！

- **網站 URL**：https://samzhu.github.io/dual-photo-composer/
- **倉庫 URL**：https://github.com/samzhu/dual-photo-composer

## 📚 延伸閱讀

- [GitHub Pages 官方文檔](https://docs.github.com/en/pages)
- [GitHub Actions 官方文檔](https://docs.github.com/en/actions)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [Vite GitHub Pages 部署](https://vitejs.dev/guide/static-deploy.html#github-pages)

## 💡 小技巧

### 預覽生產建置

在推送之前，可以本地預覽生產版本：

```bash
npm run build
npm run preview
```

### 測試 Base URL

測試 base URL 是否正確：

```bash
# 建置
npm run build

# 使用 serve 測試（需先安裝：npm i -g serve）
serve -s dist -l 3000 -b /dual-photo-composer/
```

### 加速後續部署

使用淺層克隆加速：

```yaml
- name: Checkout
  uses: actions/checkout@v4
  with:
    fetch-depth: 1
```

---

如有任何問題，歡迎在 [Issues](https://github.com/samzhu/dual-photo-composer/issues) 中提問！
