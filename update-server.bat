@echo off

:: MetaJade Project - Server Update Script
:: Batch Version
:: Simple version to avoid encoding issues

:: Set variables
set "SERVER_DOMAIN=www.metajade.online"
set "SSH_USER=root"
set "PRIVATE_KEY=%~dp0id_rsa"
set "PROJECT_PATH=/www/wwwroot/cat9/"
set "GIT_REMOTE=origin"
set "GIT_BRANCH=main"

:: Output header
echo ========================================
echo MetaJade Project - Server Update Script
echo ========================================
echo.

:: 1. Check local Git status
echo 1. Checking local Git status
git status
echo.

:: 2. Commit local changes
echo 2. Committing local changes
set /p "COMMIT_MSG=Enter commit message (default: 'Update from local'): "
if "%COMMIT_MSG%"=="" set "COMMIT_MSG=Update from local"

echo Adding all changes...
git add .

echo Committing changes...
git commit -m "%COMMIT_MSG%"
echo.

:: 3. Push code to remote repository
echo 3. Pushing code to remote repository
git push %GIT_REMOTE% %GIT_BRANCH%
echo.

:: 4. Connect to server and update code
echo 4. Connecting to server and updating code
echo Connecting to server %SERVER_DOMAIN%...

:: Execute SSH command
ssh -i "%PRIVATE_KEY%" %SSH_USER%@%SERVER_DOMAIN%
    "cd %PROJECT_PATH% && ^
    echo '=== Updating Git code ===' && ^
    git pull && ^
    echo '=== Updating submodules ===' && ^
    git submodule update --remote --init --recursive && ^
    echo '=== Rebuilding frontend ===' && ^
    npm run build && ^
    echo '=== Restarting PM2 services ===' && ^
    pm2 restart all"

echo.
echo ========================================
echo Server update completed successfully!
echo ========================================
pause