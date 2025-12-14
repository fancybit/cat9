#!/bin/bash

# 读取服务器信息
SERVER_INFO=$(cat server-info.txt)

# 解析服务器信息
HOST="www.metajade.online"
USER="root"
PROJECT_PATH="/www/wwwroot/cat9/"
KEY_PATH="./id_rsa"

# 确保密钥文件权限正确
chmod 600 $KEY_PATH

# 执行部署步骤
echo "开始部署到服务器 $HOST..."
echo "1. 执行 git pull 更新代码"
ssh -i $KEY_PATH $USER@$HOST "cd $PROJECT_PATH && git pull"

echo "\n2. 执行 npm install 安装依赖"
ssh -i $KEY_PATH $USER@$HOST "cd $PROJECT_PATH && npm install"

echo "\n3. 重启 PM2 服务"
ssh -i $KEY_PATH $USER@$HOST "pm2 restart all"

echo "\n部署完成！"