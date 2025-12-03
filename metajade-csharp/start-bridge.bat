@echo off

REM 启动 C# gRPC 服务的批处理脚本

echo 正在启动 C# 版玄玉区块链核心库桥接服务...

REM 进入 gRPC 服务目录
cd /d %~dp0dotnet/MetaJadeBridge

REM 确保 LibMetaJade 目录存在，如果不存在则克隆
if not exist ..\LibMetaJade (
    echo 正在克隆 C# 核心库...
    git clone https://github.com/fancybit/MetaJade.git ..\LibMetaJade
    echo 克隆完成
)

REM 生成 gRPC 代码
echo 正在生成 gRPC 代码...
dotnet build
if %ERRORLEVEL% neq 0 (
    echo 生成 gRPC 代码失败
    pause
    exit /b %ERRORLEVEL%
)

echo 生成完成

REM 启动 gRPC 服务
echo 正在启动 gRPC 服务...
dotnet run
if %ERRORLEVEL% neq 0 (
    echo 启动 gRPC 服务失败
    pause
    exit /b %ERRORLEVEL%
)

pause
