#!/bin/bash

echo "Setting up development environment..."

# 安装后端依赖
cd server
if [ -f "go.mod" ]; then
    go mod tidy
    go mod download
fi

# 安装前端依赖
cd ../web
if [ -f "package.json" ]; then
    if [ -f "yarn.lock" ]; then
        yarn install
    elif [ -f "package-lock.json" ]; then
        npm install
    else
        npm install
    fi
fi

echo "Setup complete!"
echo "Backend: cd server && air (for hot reload)"
echo "Frontend: cd web && npm run dev"