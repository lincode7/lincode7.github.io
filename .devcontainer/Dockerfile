FROM golang:1.25-alpine 

# 安装 protoc 编译器
RUN apk add --no-cache curl unzip && \
    curl -L https://github.com/protocolbuffers/protobuf/releases/download/v21.12/protoc-21.12-linux-x86_64.zip -o protoc.zip && \
    unzip protoc.zip -d protoc && \
    mv protoc/bin/protoc /usr/local/bin/ && \
    rm -rf protoc.zip protoc

# 安装 Go 语言支持插件
RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@latest && \
    go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest && \
    go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway@latest && \
    go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2@latest

RUN go install github.com/uudashr/gopkgs/v2/cmd/gopkgs@latest && \
    go install golang.org/x/tools/gopls@latest && \
    go install github.com/ramya-rao-a/go-outline@latest && \
    go install github.com/cweill/gotests/gotests@latest && \
    go install github.com/fatih/gomodifytags@latest && \
    go install github.com/josharian/impl@latest && \
    go install honnef.co/go/tools/cmd/staticcheck@latest && \
    go install golang.org/x/tools/cmd/goimports@latest && \
    go install github.com/go-delve/delve/cmd/dlv@latest

# 安装前端开发工具
RUN apk add --no-cache nodejs npm && \
    npm install -g yarn

# 安装git
RUN apk add --no-cache git

# 设置工作目录
WORKDIR /app

# 默认命令
CMD ["bash"]