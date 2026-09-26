# CompassCanvas

**CompassCanvas** is a lightweight, browser-based straightedge-and-compass construction workspace. It provides an interactive SVG canvas for setting a compass radius, drawing arcs and circles, aligning a ruler through two points, and turning construction guides into final geometry.

[中文说明](#中文说明)

## Features

- Select or create reusable points on the canvas.
- Set a compass radius from two points, or enter a custom value.
- Draw a full circle or an arc with a persistent, visible radius preview.
- Align a ruler through two points, then choose the actual start and end points of the segment on the guide line.
- Detect intersections between line, circle, and arc geometry. Intersections, endpoints, and centers remain interactive.
- Keep newly constructed geometry as light guides until it is selected and confirmed as a final result.
- Pan with `Space + drag`, zoom with the mouse wheel or view controls, undo with `Ctrl/⌘ + Z`, and cancel the current step with `Esc`.
- Switch the interface between Chinese and English. Chinese is the default language.

## Run locally

No build step or package manager is required. Start any static file server from the repository root:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000/> in a browser. Opening `index.html` directly also works in modern browsers, although a local server gives the most predictable behavior.

## Project layout

```text
index.html   Application shell and accessible UI labels
styles.css   Layout, theme, responsive styles, and SVG appearance
app.js       Geometry model, interaction state, rendering, and language switching
outputs/     Standalone copies of the browser-ready deliverables
```

The application is intentionally dependency-free and uses SVG for the geometry board, so it can be hosted as a static GitHub Pages site.

## 中文说明

**CompassCanvas** 是一个轻量的在线尺规作图工作台。它使用可缩放的 SVG 画布，支持用圆规确定半径、绘制圆弧和圆，也支持用直尺通过两点对齐并截取真正的线段。

### 功能

- 在画布上创建和重复使用可交互点。
- 通过图上两点确定圆规半径，也可以直接输入半径。
- 绘制整圆或圆弧，并持续显示清晰的半径参考线。
- 先用两点确定直尺方向，再在线性辅助线上选择最终线段的起点和终点。
- 自动计算线段、圆和圆弧的交点；交点、端点和圆心都可以继续用于作图。
- 新对象先作为浅色辅助线显示，选中后可确认并加粗为最终结果。
- `Space + 拖动` 平移，滚轮或视图按钮缩放，`Ctrl/⌘ + Z` 撤销，`Esc` 取消当前步骤。
- 界面支持中文和英文切换，默认使用中文。

### 本地运行

项目无需构建工具或依赖安装。在仓库根目录启动静态服务器：

```bash
python3 -m http.server 8000
```

然后访问 <http://localhost:8000/>。现代浏览器也可以直接打开 `index.html`，但使用本地服务器时行为更加稳定。

### GitHub Pages

将仓库推送到 GitHub 后，可以在仓库设置的 **Pages** 中选择默认分支的根目录作为发布源。由于项目是纯静态文件，它可以直接部署，无需额外构建命令。

## License

Released under the [MIT License](LICENSE).
