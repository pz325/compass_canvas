# CompassCanvas

**CompassCanvas** is a lightweight, browser-based straightedge-and-compass construction workspace. It provides an interactive SVG canvas for setting a compass radius, drawing arcs and circles, aligning a ruler through two points, and turning construction guides into final geometry.

[中文说明](#中文说明)

## Features

- Select or create reusable points on the canvas.
- Choose between two methods for drawing segments and two methods for drawing arcs (see below).
- Keep a compass radius for repeated arcs, enter a custom radius, or switch to full-circle drawing.
- Detect intersections between line, circle, and arc geometry. Intersections, endpoints, and centers remain interactive.
- Keep newly constructed geometry as light guides until it is selected and confirmed as a final result.
- Pan with `Space + drag`, zoom with the mouse wheel or view controls, undo with `Ctrl/⌘ + Z`, and cancel the current step with `Esc`.
- Switch the interface between Chinese and English. Chinese is the default language.

## Four drawing methods

Click a tool, then follow the current-step prompt. Every step accepts existing points or a new position on the canvas; there is no need to switch to the point tool first.

| Tool | Key | Click sequence |
| --- | --- | --- |
| Two-point line | `D` | Click the start, then the end. The segment is completed on the second click. |
| Align and trim segment | `L` | Click two points to set a supporting line. A dashed line appears; click the actual segment start and end on that guide. The alignment points do not need to be its endpoints. |
| Center–start–end arc | `A` | Click the center, then the arc start to set its radius. A full-circle guide appears; click the end direction to complete the arc. |
| Set radius and draw arc | `R` | Click two points to set the compass radius, then click a center. A full-circle guide appears; click the arc start and end. |

Both arc methods draw the shorter arc between the chosen start and end. The end click is projected onto the circle, so it chooses an end direction while the radius stays exact. The three-click arc (`A`) uses its own radius and does not replace the radius held by the compass.

After completing a fixed-radius arc, the compass stays ready to draw another one: click a new center, start, and end. Use **Use current radius** (`C`) to return to the held radius, or **Set radius and draw arc** (`R`) to measure a new radius. The right-hand compass panel also lets you enter a radius and switch between arcs and full circles.

Use **Select / add point** (`V`) to create independent points or select completed geometry. Newly drawn segments and arcs are light construction guides; select one and choose **Make final result** to emphasize it. Only points that are not on any completed segment, arc, or circle remain visible; hidden endpoints and intersections still snap and can be reused. A circle or arc center remains visible unless another object passes through it.

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
- 画线段有两种方法，画圆弧也有两种方法，具体步骤见下表。
- 保持圆规半径连续作图，也可以直接输入半径或切换整圆模式。
- 自动计算线段、圆和圆弧的交点；交点、端点和圆心都可以继续用于作图。
- 新对象先作为浅色辅助线显示，选中后可确认并加粗为最终结果。
- `Space + 拖动` 平移，滚轮或视图按钮缩放，`Ctrl/⌘ + Z` 撤销，`Esc` 取消当前步骤。
- 界面支持中文和英文切换，默认使用中文。

### 四种画图方法

选择工具后，按照「当前步骤」的提示依次点击。每一步都可以选择已有点，也可以点击画布上的新位置，不需要先切换到添加点工具。

| 工具 | 快捷键 | 点击顺序 |
| --- | --- | --- |
| 两点画直线 | `D` | 点起点，再点终点，第二次点击直接完成线段。 |
| 定向截取线段 | `L` | 先点两个点确定直线方向，出现虚线辅助线；再在辅助线上点取实际线段的起点和终点。用于定向的两个点不必是最终线段端点。 |
| 三点画弧 | `A` | 点圆心，再点圆弧起点确定半径，出现整圆辅助线；第三次点击选择终点方向，完成圆弧。 |
| 定半径画弧 | `R` | 先点两个点，以两点距离设定圆规半径；再点圆心，出现整圆辅助线；最后点圆弧起点和终点。 |

两种画弧方法默认绘制起点与终点间的短弧。终点会沿圆心方向投影到圆周，确保半径准确。三点画弧（`A`）的半径独立计算，不会覆盖圆规已保持的半径。

定半径的圆弧完成后，会自动保持半径继续作图：再次点击圆心、起点、终点即可。点击右侧「使用当前半径」（`C`）可以回到当前圆规半径；重新选择「定半径画弧」（`R`）可测量新的半径。右侧圆规面板也支持直接输入半径，以及在画弧与整圆间切换。

「选择 / 添加点」（`V`）可以创建孤立点或选中已画好的对象。新画的线段和圆弧作为浅色辅助线显示，选中后点击「加粗为最终结果」即可突出显示。只有没有落在已画线段、圆弧或圆上的孤立点才显示；隐藏的端点和交点仍可吸附、选择和继续作图。圆或圆弧的圆心在没有其他对象经过时保持显示。

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
