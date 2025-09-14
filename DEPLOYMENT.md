# GitHub Pages 部署指南

## 项目已准备就绪

✅ 项目已成功构建，生成了 `build` 文件夹  
✅ 已安装 `gh-pages` 部署工具  
✅ 已配置 `package.json` 中的 `homepage` 和部署脚本  

## 部署步骤

### 方法一：使用 GitHub Actions（推荐）

1. 将项目推送到 GitHub 仓库
2. 在仓库根目录创建 `.github/workflows/deploy.yml` 文件：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci --legacy-peer-deps
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./build
```

3. 在 GitHub 仓库设置中启用 GitHub Pages，选择 "GitHub Actions" 作为源

### 方法二：手动部署

1. 确保系统已安装 Git
2. 配置 Git 用户信息：
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```
3. 初始化 Git 仓库（如果还没有）：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
4. 添加 GitHub 远程仓库：
   ```bash
   git remote add origin https://github.com/yourusername/timezone-converter.git
   ```
5. 运行部署命令：
   ```bash
   npm run deploy
   ```

### 方法三：手动上传 build 文件夹

1. 在 GitHub 创建新仓库 `timezone-converter`
2. 创建 `gh-pages` 分支
3. 将 `build` 文件夹中的所有文件上传到 `gh-pages` 分支
4. 在仓库设置中启用 GitHub Pages，选择 `gh-pages` 分支

## 注意事项

- 请将 `package.json` 中的 `homepage` 字段更新为你的实际 GitHub 用户名
- 确保仓库名称与 `homepage` 中的路径匹配
- 部署后，网站将在 `https://yourusername.github.io/timezone-converter` 可访问

## 当前构建信息

- 构建时间：刚刚完成
- 构建文件大小：
  - JavaScript: 141.46 kB (gzipped)
  - CSS: 3.99 kB (gzipped)
  - 其他: 1.77 kB (gzipped)
- 构建文件夹：`build/`