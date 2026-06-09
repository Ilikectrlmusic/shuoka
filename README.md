# 小白说卡

大陆人的美股导航。一个适合部署在 GitHub Pages 的纯静态教程汇总网站。

## 目录结构

```text
index.html              # 页面入口
css/styles.css          # 样式
js/app.js               # 路由、目录、搜索等交互逻辑
articles/               # 每篇文章的独立正文文件
assets/images/          # 文章图片目录
```

## 写文章

每篇文章都是独立 HTML 片段，直接编辑对应文件即可：

- 港卡：`articles/hk-card/`
- 券商：`articles/broker/`
- 跨境汇款：`articles/remit/`

文章文件里不需要写完整 HTML 结构，只写正文，例如：

```html
<h2>准备清单</h2>
<p>这里写正文。</p>
```

## 插入图片

建议把图片放到：

```text
assets/images/板块ID/文章slug/图片文件名.png
```

文章中这样引用：

```html
<figure>
  <img src="assets/images/hk-card/materials/example.png" alt="资料准备示例图">
  <figcaption>资料准备示例图</figcaption>
</figure>
```

## 本地预览

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

打开：`http://127.0.0.1:8000/`

## 部署到 GitHub Pages

1. 将本目录推送到 GitHub 仓库。
2. 进入仓库 Settings → Pages。
3. Source 选择 `Deploy from a branch`，Branch 选择 `main` 和根目录 `/`。
4. 保存后等待 GitHub Pages 构建完成。
