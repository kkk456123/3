# Harvey 个人作品集

这是一个使用 React + Vite 构建的个人作品集基础版本，面向视觉设计、AI 设计和品牌设计展示。页面使用深色视觉系统、视频 Hero、真实作品素材、项目筛选、作品详情弹窗和联系方式收尾页。

## 本地运行

建议使用 Node.js 20.19+ 或 22.12+。

```bash
npm install
npm run dev
```

开发服务器默认地址为 `http://localhost:5173/`。生产构建和本地预览：

```bash
npm run build
npm run preview
```

项目不需要后端服务。联系按钮使用 `mailto:`、`tel:` 和站酷外链。

## 部署到 GitHub Pages

项目已包含 `.github/workflows/deploy.yml`。将项目根目录中的所有文件推送到 GitHub 仓库的 `main` 分支后，工作流会自动安装依赖、构建并发布 `dist/`。Vite 会根据仓库名自动设置 Pages 子路径，也支持名为 `用户名.github.io` 的用户站点。

首次部署步骤：

1. 在 GitHub 创建一个仓库，建议使用公开仓库，并将本项目根目录的所有文件上传到仓库根目录。请保留 `.github/workflows/deploy.yml`。
2. 打开仓库的 **Settings → Pages**，将 **Build and deployment → Source** 设为 **GitHub Actions**。
3. 推送到 `main` 分支，或在仓库的 **Actions** 页面手动运行 **Deploy to GitHub Pages** 工作流。
4. 工作流成功后，在 **Settings → Pages** 查看访问地址。项目仓库通常为 `https://用户名.github.io/仓库名/`；用户站点仓库通常为 `https://用户名.github.io/`。

后续每次推送到 `main` 都会自动重新部署。若默认分支不是 `main`，请同步修改 `.github/workflows/deploy.yml` 中的触发分支。

## 目录说明

- `src/data.js`：姓名、联系方式、经历、项目和能力卡片文案。
- `src/App.jsx`：页面结构、导航、项目筛选、弹窗和交互逻辑。
- `src/design.css`：版式、色彩、响应式布局和动效。
- `src/fonts.css`：随项目打包的本地字体声明。
- `public/assets/`：视频、头像、作品封面、完整作品长图和简历 PDF。

## 素材

页面中的头像、视频、项目图和简历均来自提供的个人简历及其作品素材。项目数量、工作经历和能力描述按简历信息整理，没有额外虚构项目或商业数据。替换图片时，先更新 `public/assets/`，再在 `src/data.js` 中修改对应路径即可。

## 当前内容

页面包含全屏视频首页、个人介绍和经历、4 组精选作品、作品分类筛选、完整作品弹窗、能力卡片以及全屏联系方式收尾。后续可继续替换文案、增加项目，或根据参考网站调整动效和版式。
