#!/bin/bash

# Radio.net 电台服务启动脚本

# 加载环境变量（如果存在）
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# 检查依赖
if ! python3 -c "import flask" 2>/dev/null; then
    echo "错误: 未安装依赖包，请先运行: pip install -r requirements.txt"
    exit 1
fi

# 启动服务
echo "正在启动 Radio.net 电台音频流服务..."
python3 app.py
