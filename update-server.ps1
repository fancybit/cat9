# 玄玉项目 - 服务器更新脚本
# PowerShell版本

# 强制设置所有编码为UTF-8
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[System.Console]::InputEncoding = [System.Text.Encoding]::UTF8

# 设置变量
$SERVER_DOMAIN = "www.metajade.online"
$SSH_USER = "root"
$PRIVATE_KEY = Join-Path -Path $PSScriptRoot -ChildPath "id_rsa"
$PROJECT_PATH = "/www/wwwroot/cat9/"
$GIT_REMOTE = "origin"
$GIT_BRANCH = "main"

Write-Host "========================================"
Write-Host "玄玉项目 - 服务器更新脚本"
Write-Host "========================================"
Write-Host

# 1. 检查本地Git状态
Write-Host "1. 检查本地Git状态"
git status

Write-Host

# 2. 提交本地修改
Write-Host "2. 提交本地修改"
$COMMIT_MSG = Read-Host -Prompt "请输入提交信息 (默认为'Update from local')"
if ([string]::IsNullOrEmpty($COMMIT_MSG)) {
    $COMMIT_MSG = "Update from local"
}

git add .
git commit -m "$COMMIT_MSG"

Write-Host

# 3. 推送代码到远程仓库
Write-Host "3. 推送代码到远程仓库"
git push $GIT_REMOTE $GIT_BRANCH

Write-Host

# 4. 连接服务器并更新代码
Write-Host "4. 连接服务器并更新代码"
Write-Host "正在连接到服务器 $SERVER_DOMAIN..."

$sshCommand = "cd $PROJECT_PATH && echo '=== 更新Git代码 ===' && git pull && echo '=== 更新子模块 ===' && git submodule update --remote --init --recursive && echo '=== 重新构建前端 ===' && npm run build && echo '=== 重启PM2服务 ===' && pm2 restart all"

ssh -i "$PRIVATE_KEY" "$SSH_USER@$SERVER_DOMAIN" "$sshCommand"

Write-Host
Write-Host "========================================"
Write-Host "服务器更新成功！"
Write-Host "========================================"
Read-Host -Prompt "按任意键继续..."