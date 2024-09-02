# clean-and-build.ps1

# 删除 dist 目录
if (Test-Path -Path .\dist) {
    Remove-Item -Recurse -Force .\dist
}

# 删除 obfuscated 目录
if (Test-Path -Path .\obfuscated) {
    Remove-Item -Recurse -Force .\obfuscated
}

# 创建 obfuscated 目录
New-Item -ItemType Directory -Path .\obfuscated

# 复制 main.js 到 src 目录
Copy-Item -Path .\main.js -Destination .\src\

# 运行代码混淆工具
node obfuscate.js

# 将混淆后的 main.js 移回根目录
Move-Item -Path .\obfuscated\src\main.js -Destination .\obfuscated\main.js

# 删除src下的 main.js
Remove-Item -Path .\src\main.js

# 复制 package.json 到 obfuscated 目录
Copy-Item -Path .\release\package.json -Destination .\obfuscated\

# 复制 config 目录到 obfuscated 目录
Copy-Item -Path .\config -Destination .\obfuscated\ -Recurse

# 复制 public 目录到 obfuscated 目录
Copy-Item -Path .\public -Destination .\obfuscated\ -Recurse

# 运行打包命令
electron-builder -c ./electron-builder.json

# 复制 config.json 到 dist 目录
Copy-Item -Path .\config\config.json -Destination .\dist\

# 删除 obfuscated 目录
if (Test-Path -Path .\obfuscated) {
    Remove-Item -Recurse -Force .\obfuscated
}
