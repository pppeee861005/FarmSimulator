# 豪力的小農場 (Haoli's Small Farm)

這是一個模擬農場經營的遊戲，玩家可以種植作物、養殖動物、製作產品並在市場上銷售。

## 遊戲演示

你可以在這裡體驗遊戲：[豪力的小農場](https://你的GitHub用戶名.github.io/farm-simulator/)

## 功能特色

- 種植多種作物（小麥、胡蘿蔔、玉米、番茄）
- 養殖動物（雞、牛、羊）並收集產品
- 製作加工商品（麵包、起司、紗線、番茄湯）
- 在市場上銷售產品賺取金錢
- 管理體力和時間系統
- 動態天氣系統，影響作物生長、動物產出和體力消耗

## 技術棧

- React 18
- TypeScript
- Tailwind CSS
- Vite

## 安裝與運行

1. 安裝依賴：

```bash
npm install
```

2. 啟動開發服務器：

```bash
npm run dev
```

3. 構建生產版本：

```bash
npm run build
```

4. 預覽生產版本：

```bash
npm run preview
```

## 部署到 GitHub Pages

這個項目已經配置好了 GitHub Actions 工作流程，可以自動部署到 GitHub Pages。

1. 在 GitHub 上創建一個新的倉庫
2. 將本地倉庫推送到 GitHub：

```bash
git remote add origin https://github.com/你的GitHub用戶名/farm-simulator.git
git branch -M main
git push -u origin main
```

3. 在 GitHub 倉庫設置中啟用 GitHub Pages，選擇 "GitHub Actions" 作為來源
4. 推送代碼到 main 分支後，GitHub Actions 會自動構建並部署網站

## 遊戲玩法

- 使用頂部的開始/暫停按鈕控制遊戲時間
- 調整遊戲速度（0.5x - 3x）
- 在農場頁面種植和收穫作物
- 在動物頁面購買和照顧動物
- 在製作頁面將原材料加工成高價值商品
- 在市場頁面銷售產品賺取金錢
- 在庫存頁面查看所有擁有的物品
- 適應不同天氣條件：
  - 晴天：作物生長加速，照顧動物效果加倍，有機會獲得額外收穫
  - 雨天：作物生長稍快，但動物產出稍慢
  - 多雲：一切正常
  - 暴風雨：作物生長和動物產出減慢，體力消耗增加
  - 乾旱：作物生長非常慢，體力消耗增加

## 開發者

豪力
