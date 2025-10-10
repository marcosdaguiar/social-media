start cmd.exe /k "cd C:\Program Files\MongoDB\Server\8.0\bin && mongod.exe"
start cmd.exe /k "cd %~dp0\backend && npm install && npm start"
start cmd.exe /k "cd %~dp0\frontend && npm install && npm run dev"
