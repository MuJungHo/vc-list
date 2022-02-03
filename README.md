# vc-list
Virtual currency list from CoinGecko.

## 專案執行說明
1. 在專案的根目錄下輸入 ```npm install ``` 。（環境需求 node js，expo cli）
2. 安裝完成後再輸入 ```npm start``` 。
3. 啟動 Android/iOS 的模擬機，並在模擬機中安裝 Expo Cient App（或是使用實體機安裝）。
4. Expo Cient App 選擇執行中的專案。

## 專案功能說明
### 加密貨幣列表
1. 讀取 CoinGecko 之加密貨幣列表，必須包含貨幣名稱、即時幣價與即時交易量
2. 預設顯示市值排名前 25 之加密貨幣，滑動到列表尾端時載入更多
3. 能使用貨幣名稱、即時幣價、或即時交易量來排序
