Write-Host "========================================"
Write-Host "MetaJade Project - Server Update Script"
Write-Host "========================================"
Write-Host

# Check local Git status
Write-Host "1. Checking local Git status"
git status
Write-Host

# Commit local changes
Write-Host "2. Committing local changes"
$COMMIT_MSG = Read-Host -Prompt "Enter commit message (default: 'Update from local')"
if ([string]::IsNullOrEmpty($COMMIT_MSG)) { $COMMIT_MSG = "Update from local" }
git add .
git commit -m "$COMMIT_MSG"
Write-Host

# Push code to remote repository
Write-Host "3. Pushing code to remote repository"
git push origin main
Write-Host

# Connect to server and update code
Write-Host "4. Connecting to server and updating code"
Write-Host "Connecting to server www.metajade.online..."
ssh -i "$PSScriptRoot/id_rsa" root@www.metajade.online "cd /www/wwwroot/cat9 && echo '=== Updating Git code ===' && git pull && echo '=== Updating submodules ===' && git submodule update --remote --init --recursive && echo '=== Rebuilding frontend ===' && npm run build && echo '=== Restarting PM2 services ===' && pm2 restart all"

Write-Host
Write-Host "========================================"
Write-Host "Server update completed successfully!"
Write-Host "========================================"
Read-Host -Prompt "Press any key to continue..."