@echo off
echo Starting Charity Events Project...

:: 启动后端 API (端口 3001)
start cmd /k "cd usernameA2-api && npm install && npm run dev"

:: 启动前端 (端口 3000)
start cmd /k "cd usernameA2-clientside && npx http-server -p 3000"

echo Both servers are starting...
