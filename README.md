# 📸 Dual Photo Composer

一個簡單易用的網頁照片拼貼工具，可以將兩張照片合併成精美的拼貼圖片。

## ✨ 功能特色

- 🎨 **精確尺寸輸出**：生成 1179 × 2556 像素的拼貼圖（長寬比 9.5:9）
- 📱 **響應式設計**：支援桌面和行動裝置
- 🖼️ **智能圖片適配**：自動調整圖片大小以完美填滿區域
- 💾 **便捷儲存**：
  - 電腦版：直接下載 JPG 檔案
  - 手機版：開啟新頁面，可長按儲存到相簿
- 🕐 **自動命名**：檔名使用日期時間，避免覆蓋
- 👁️ **即時預覽**：上傳圖片後立即看到拼貼效果

## 🎯 使用方式

1. **上傳第一張圖片**：點擊「上傳圖片」按鈕（上方淺藍區）
2. **上傳第二張圖片**：點擊「上傳圖片」按鈕（下方黑色框）
3. **查看預覽**：畫布會即時顯示拼貼效果
4. **下載圖片**：
   - 💻 電腦：點擊「下載拼貼圖」直接下載
   - 📱 手機：點擊後會開啟新頁面，長按圖片選擇「儲存圖片」
5. **重新開始**：點擊「重置」按鈕清除所有圖片

## 📐 拼貼布局

```
┌─────────────────────────────┐
│                             │
│      第一張圖片區域          │
│    (淺藍色背景)             │
│    佔據約 89% 高度           │
│                             │
│                             │
│                             │
│                             │
├─────────────────────────────┤
│     ┌─────────────┐         │
│     │  第二張圖   │         │
│     │  (黑色背景) │         │
│     └─────────────┘         │
└─────────────────────────────┘
```

- **第一張圖片**：佔據大部分畫布（89% 高度，淺藍色背景）
- **第二張圖片**：位於底部中央的小框（45% 寬度，黑色背景，上下左右留白）

## 🛠️ 技術實作

### 核心技術棧

- **React 18.3.1**：使用 Hooks 進行狀態管理
- **Vite 6.0**：現代化的建置工具，提供極速的開發體驗
- **HTML5 Canvas**：處理圖片合成與渲染
- **Tailwind CSS 3.4**：現代化的 UI 設計
- **Lucide React 0.546**：精美的圖示庫（超過 1000+ 圖示）

### 專案結構

```
dual-photo-composer/
├── src/
│   ├── components/
│   │   └── PhotoCollageApp.jsx    # 主要組件
│   ├── main.jsx                    # 應用程式入口
│   └── index.css                   # 全域樣式
├── public/                         # 靜態資源
├── index.html                      # HTML 模板
├── package.json                    # 專案配置
├── vite.config.js                 # Vite 配置
├── tailwind.config.js             # Tailwind CSS 配置
├── postcss.config.js              # PostCSS 配置
└── README.md                       # 說明文件
```

### 關鍵實作說明

#### 1. 圖片上傳與載入

```javascript
const handleImageUpload = (e, imageNumber) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // 儲存圖片到 state
        if (imageNumber === 1) {
          setImage1(img);
        } else {
          setImage2(img);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
};
```

**說明**：
- 使用 `FileReader` 讀取用戶上傳的圖片檔案
- 將檔案轉換為 Data URL 格式
- 創建 `Image` 物件並載入圖片
- 載入完成後儲存到 React state

#### 2. Canvas 拼貼生成

```javascript
const generateCollage = () => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');

  // 設定畫布尺寸
  canvas.width = 1179;
  canvas.height = 2556;

  // 繪製第一張圖片區域
  const area1Height = CANVAS_HEIGHT * 0.89;
  ctx.fillStyle = '#ADD8E6';
  ctx.fillRect(0, 0, CANVAS_WIDTH, area1Height);

  if (image1) {
    drawImageFit(ctx, image1, 0, 0, CANVAS_WIDTH, area1Height);
  }

  // 繪製第二張圖片區域
  const area2Y = area1Height + 20;
  const area2Height = CANVAS_HEIGHT - area2Y - 20;
  const area2Width = CANVAS_WIDTH * 0.45;
  const area2X = (CANVAS_WIDTH - area2Width) / 2;

  ctx.fillStyle = '#000000';
  ctx.fillRect(area2X, area2Y, area2Width, area2Height);

  if (image2) {
    drawImageFit(ctx, image2, area2X, area2Y, area2Width, area2Height);
  }
};
```

**說明**：
- 設定固定的畫布尺寸（1179 × 2556）
- 計算兩個圖片區域的位置和大小
- 先繪製背景色，再繪製圖片
- 第二張圖片置中顯示，四周留白

#### 3. 智能圖片縮放適配

```javascript
const drawImageFit = (ctx, img, x, y, width, height) => {
  const imgRatio = img.width / img.height;
  const areaRatio = width / height;

  let drawWidth, drawHeight, offsetX, offsetY;

  if (imgRatio > areaRatio) {
    // 圖片較寬，以高度為準
    drawHeight = height;
    drawWidth = height * imgRatio;
    offsetX = (width - drawWidth) / 2;
    offsetY = 0;
  } else {
    // 圖片較高，以寬度為準
    drawWidth = width;
    drawHeight = width / imgRatio;
    offsetX = 0;
    offsetY = (height - drawHeight) / 2;
  }

  ctx.drawImage(img, x + offsetX, y + offsetY, drawWidth, drawHeight);
};
```

**說明**：
- 計算圖片和區域的長寬比
- 根據比例決定以寬度或高度為基準縮放
- 確保圖片完整顯示且填滿區域
- 居中對齊，多餘部分會被裁切

#### 4. 圖片下載功能

```javascript
const downloadCollage = () => {
  // 生成日期時間檔名
  const now = new Date();
  const filename = `collage_${year}${month}${day}_${hours}${minutes}${seconds}.jpg`;

  // 生成 JPG 格式
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
  }, 'image/jpeg', 0.95);
};
```

**說明**：
- 使用 `canvas.toBlob()` 轉換為 JPEG 格式（品質 95%）
- 自動觸發下載
- 檔名使用時間戳記避免重複

#### 5. 自動更新機制

```javascript
React.useEffect(() => {
  if (image1 || image2) {
    generateCollage();
  }
}, [image1, image2]);
```

**說明**：
- 使用 `useEffect` 監聽圖片狀態變化
- 當任一圖片更新時，自動重新生成拼貼圖
- 提供即時預覽效果

## 🔧 本地開發

### 環境需求

- Node.js 18+ (推薦使用 Node.js 20+)
- npm 或 yarn 或 pnpm

### 安裝與執行

```bash
# 複製專案
git clone https://github.com/samzhu/dual-photo-composer.git

# 進入目錄
cd dual-photo-composer

# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

開發伺服器會自動在 http://localhost:3000 開啟

### 可用指令

```bash
# 開發模式
npm run dev

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview

# 程式碼檢查
npm run lint
```

### 打包部署

```bash
# 建置生產版本
npm run build

# dist 目錄會包含所有靜態檔案
# 可以部署到任何靜態網站託管服務
```

### 推薦的部署平台

- [Vercel](https://vercel.com) - 零配置，自動部署
- [Netlify](https://netlify.com) - 簡單易用，免費方案
- [GitHub Pages](https://pages.github.com) - 免費，適合開源專案
- [Cloudflare Pages](https://pages.cloudflare.com) - 快速，全球 CDN

## 🎨 自訂配置

### 修改畫布尺寸

在 `src/components/PhotoCollageApp.jsx` 中修改常數：

```javascript
const CANVAS_WIDTH = 1179;   // 調整寬度
const CANVAS_HEIGHT = 2556;  // 調整高度
```

### 調整區域配置

修改 `generateCollage` 函數中的比例：

```javascript
const area1Height = CANVAS_HEIGHT * 0.89;  // 第一區域高度比例
const area2Width = CANVAS_WIDTH * 0.45;    // 第二區域寬度比例
```

### 更改背景顏色

```javascript
ctx.fillStyle = '#ADD8E6';  // 第一區域背景色（淺藍）
ctx.fillStyle = '#000000';  // 第二區域背景色（黑色，可改為 #FFFFFF 白色）
```

### 調整圖片品質

在 `downloadCollage` 函數中修改：

```javascript
canvas.toBlob((blob) => {
  // ...
}, 'image/jpeg', 0.95);  // 0.0 到 1.0，數值越高品質越好
```

## 📱 行動裝置使用提示

在 iPhone 或 Android 手機上使用時：

1. 點擊「下載拼貼圖」按鈕
2. 圖片會自動下載到手機
3. 在瀏覽器的下載列表中找到圖片
4. 點擊圖片即可儲存到相簿

## 📝 使用案例

- 📷 社群媒體貼文拼貼
- 🎂 活動紀念照片組合
- 📱 手機桌布製作
- 🎨 創意圖片設計
- 💼 產品展示圖製作
- 🎁 客製化禮物卡片

## 🐛 已知限制

- 圖片大小建議不超過 10MB，以確保流暢運作
- 在舊版瀏覽器（IE11 以下）可能不支援部分功能
- 建議使用現代瀏覽器：Chrome、Firefox、Safari、Edge

## 🔒 隱私說明

- 所有圖片處理完全在瀏覽器本地進行
- 不會上傳任何圖片到伺服器
- 不會收集或儲存用戶資料
- 完全尊重用戶隱私

## 🤝 貢獻

歡迎貢獻！如果你有任何改進建議或發現問題：

1. Fork 這個專案
2. 建立你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟一個 Pull Request

## 📄 授權

本專案採用 MIT License - 詳見 [LICENSE](LICENSE) 檔案

## 🙏 致謝

- [React](https://reactjs.org/) - UI 框架
- [Vite](https://vitejs.dev/) - 建置工具
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Lucide](https://lucide.dev/) - 圖示庫

## 📧 聯絡方式

如有任何問題或建議，歡迎：
- 開啟 [Issue](https://github.com/samzhu/dual-photo-composer/issues)
- 發送 Pull Request

---

Made with ❤️ by Sam Zhu
