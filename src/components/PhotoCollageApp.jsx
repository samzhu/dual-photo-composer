import React, { useState, useRef } from 'react';
import { Camera, Download, Upload, RefreshCw } from 'lucide-react';

export default function PhotoCollageApp() {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const canvasRef = useRef(null);
  const fileInput1Ref = useRef(null);
  const fileInput2Ref = useRef(null);

  const CANVAS_WIDTH = 1700;
  const CANVAS_HEIGHT = 2556;

  const handleImageUpload = (e, imageNumber) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
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

  const generateCollage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    // 清空畫布
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 第一張圖片區域 (淺藍色背景) - 大部分畫布
    const area1Height = CANVAS_HEIGHT * 0.89;
    ctx.fillStyle = '#ADD8E6';
    ctx.fillRect(0, 0, CANVAS_WIDTH, area1Height);

    if (image1) {
      drawImageFit(ctx, image1, 0, 0, CANVAS_WIDTH, area1Height);
    }

    // 第二張圖片區域 (黑色框框) - 底部較小區域，左右有留白
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

  const downloadCollage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('Canvas not found');
      return;
    }

    try {
      // 確保 canvas 有內容
      if (canvas.width === 0 || canvas.height === 0) {
        console.log('Canvas has no size');
        return;
      }

      // 生成日期時間檔名
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const filename = `collage_${year}${month}${day}_${hours}${minutes}${seconds}.jpg`;

      // 檢測是否為行動裝置且支援 Web Share API
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const supportsShare = navigator.share && navigator.canShare;

      if (isMobile && supportsShare) {
        // iOS/Android: 使用 Web Share API（可以存到相簿）
        try {
          // 將 canvas 轉換為 blob
          const blob = await new Promise((resolve) => {
            canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.95);
          });

          if (!blob) {
            throw new Error('無法生成圖片');
          }

          // 建立檔案物件
          const file = new File([blob], filename, { type: 'image/jpeg' });

          // 檢查是否可以分享檔案
          if (navigator.canShare({ files: [file] })) {
            // 開啟系統分享介面
            await navigator.share({
              files: [file],
              title: '照片拼貼',
              text: '我的照片拼貼作品'
            });
            console.log('分享成功');
          } else {
            // 降級方案：開啟新視窗
            openImageInNewWindow(canvas, filename);
          }
        } catch (error) {
          if (error.name === 'AbortError') {
            // 使用者取消分享
            console.log('使用者取消分享');
          } else {
            console.error('分享失敗:', error);
            // 降級方案：開啟新視窗
            openImageInNewWindow(canvas, filename);
          }
        }
      } else {
        // 桌面版：直接下載
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = filename;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        }, 'image/jpeg', 0.95);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('下載失敗，請稍後再試');
    }
  };

  // 降級方案：在新視窗開啟圖片（供使用者長按儲存）
  const openImageInNewWindow = (canvas, filename) => {
    try {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      const newWindow = window.open('', '_blank');

      if (newWindow) {
        newWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${filename}</title>
              <style>
                body {
                  margin: 0;
                  padding: 20px;
                  background: #f0f0f0;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                }
                .instructions {
                  background: white;
                  padding: 15px 20px;
                  border-radius: 10px;
                  margin-bottom: 20px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                  text-align: center;
                  max-width: 90%;
                }
                .instructions h3 {
                  margin: 0 0 10px 0;
                  color: #333;
                  font-size: 18px;
                }
                .instructions p {
                  margin: 5px 0;
                  color: #666;
                  font-size: 14px;
                }
                .instructions .highlight {
                  color: #007AFF;
                  font-weight: 600;
                }
                img {
                  max-width: 90%;
                  height: auto;
                  border-radius: 10px;
                  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                }
              </style>
            </head>
            <body>
              <div class="instructions">
                <h3>📱 如何儲存到相簿</h3>
                <p><span class="highlight">長按圖片</span> → 選擇「<span class="highlight">儲存圖片</span>」</p>
                <p>圖片就會存到你的照片相簿中 ✨</p>
              </div>
              <img src="${dataUrl}" alt="${filename}">
            </body>
          </html>
        `);
        newWindow.document.close();
      } else {
        alert('請允許彈出視窗以下載圖片');
      }
    } catch (error) {
      console.error('Open image error:', error);
      alert('無法開啟圖片，請稍後再試');
    }
  };

  const resetAll = () => {
    setImage1(null);
    setImage2(null);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  React.useEffect(() => {
    if (image1 || image2) {
      generateCollage();
    }
  }, [image1, image2]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Camera className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-800">照片拼貼工具</h1>
          </div>
          <p className="text-gray-600">上傳兩張照片，創建精美拼貼圖片 (1700 × 2556)</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* 第一張圖片上傳區 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">第一張圖片 (上方淺藍區)</h3>
            <input
              ref={fileInput1Ref}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 1)}
              className="hidden"
            />
            <button
              onClick={() => fileInput1Ref.current?.click()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Upload className="w-5 h-5" />
              {image1 ? '更換圖片' : '上傳圖片'}
            </button>
            {image1 && (
              <div className="mt-4 border-2 border-blue-200 rounded-lg overflow-hidden">
                <img src={image1.src} alt="Preview 1" className="w-full h-48 object-cover" />
              </div>
            )}
          </div>

          {/* 第二張圖片上傳區 */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">第二張圖片 (下方白色區)</h3>
            <input
              ref={fileInput2Ref}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 2)}
              className="hidden"
            />
            <button
              onClick={() => fileInput2Ref.current?.click()}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Upload className="w-5 h-5" />
              {image2 ? '更換圖片' : '上傳圖片'}
            </button>
            {image2 && (
              <div className="mt-4 border-2 border-purple-200 rounded-lg overflow-hidden">
                <img src={image2.src} alt="Preview 2" className="w-full h-48 object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* 操作按鈕 */}
        <div className="flex gap-4 mb-6 justify-center">
          <button
            onClick={downloadCollage}
            disabled={!image1 && !image2}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-5 h-5" />
            下載拼貼圖
          </button>
          <button
            onClick={resetAll}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            重置
          </button>
        </div>

        {/* 畫布預覽 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 text-center">預覽拼貼效果</h3>
          <div className="flex justify-center overflow-auto">
            <canvas
              ref={canvasRef}
              className="border-2 border-gray-300 rounded-lg max-w-full h-auto"
              style={{ maxHeight: '600px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
