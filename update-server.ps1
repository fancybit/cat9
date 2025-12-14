# 玄玉项目 - 服务器更新脚本
# PowerShell版本

# 设置编码
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
try {
    git status
} catch {
    Write-Host "Git命令执行失败，请确保已安装Git"
    Read-Host -Prompt "按任意键继续..."
    exit 1
}

Write-Host

# 2. 提交本地修改
Write-Host "2. 提交本地修改"
$COMMIT_MSG = Read-Host -Prompt "请输入提交信息 (默认为'Update from local')"
if ([string]::IsNullOrEmpty($COMMIT_MSG)) {
    $COMMIT_MSG = "Update from local"
}

Write-Host "正在添加文件..."
try {
    git add .
} catch {
    Write-Host "Git add 失败"
    Read-Host -Prompt "按任意键继续..."
    exit 1
}

Write-Host "正在提交修改..."
try {
    git commit -m "$COMMIT_MSG"
} catch {
    Write-Host "Git commit 失败，可能没有需要提交的修改"
    Write-Host "继续推送..."
}

Write-Host

# 3. 推送代码到远程仓库
Write-Host "3. 推送代码到远程仓库"
Write-Host "正在推送代码..."
try {
    git push $GIT_REMOTE $GIT_BRANCH
} catch {
    Write-Host "推送失败，请检查网络连接和Git权限"
    Read-Host -Prompt "按任意键继续..."
    exit 1
}

Write-Host

# 4. 连接服务器并更新代码
Write-Host "4. 连接服务器并更新代码"
Write-Host "正在连接到服务器 $SERVER_DOMAIN..."

$sshCommand = "cd $PROJECT_PATH && echo '=== 更新Git代码 ===' && git pull && echo '=== 更新子模块 ===' && git submodule update --remote --init --recursive && echo '=== 重新构建前端 ===' && npm run build && echo '=== 重启PM2服务 ===' && pm2 restart all"

try {
    ssh -i "$PRIVATE_KEY" "$SSH_USER@$SERVER_DOMAIN" "$sshCommand"
} catch {
    Write-Host "服务器更新失败: $_"
    Read-Host -Prompt "按任意键继续..."
    exit 1
}

Write-Host
Write-Host "========================================"
Write-Host "服务器更新成功！"
Write-Host "========================================"
Read-Host -Prompt "按任意键继续..."