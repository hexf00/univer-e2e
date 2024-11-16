# 获取 git diff 的输出并提取唯一的一级目录，转换为包名格式
filters=$(git diff --diff-filter=d --name-only --cached --relative | 
    awk -F'/' '{ print $1"/"$2 }' | 
    sort -u | 
    sed 's/src\///' | 
    sed 's/^/--filter=.\//' | 
    tr '\n' ' ')

if [ -z "$filters" ]; then
    echo "No changes detected"
    exit 0
fi

# 构建命令
echo "Building packages: $filters"
pnpm turbo build --no-cache $filters

if [ $? -eq 0 ]; then
    echo "✅ Successfully built all packages"
else
    echo "❌ Build failed"
    exit 1
fi