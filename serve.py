import http.server
import socketserver
import webbrowser
import os

# 設定端口
PORT = 8082

# 設定處理程序
Handler = http.server.SimpleHTTPRequestHandler

# 創建服務器
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"服務器運行在 http://localhost:{PORT}")
    
    # 自動在瀏覽器中打開
    webbrowser.open(f"http://localhost:{PORT}")
    
    # 啟動服務器
    print("按 Ctrl+C 停止服務器")
    httpd.serve_forever()