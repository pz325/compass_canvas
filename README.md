# CompassCanvas

**CompassCanvas** is a lightweight, browser-based straightedge-and-compass construction workspace. It provides an interactive SVG canvas for setting a compass radius, drawing arcs and circles, aligning a ruler through two points, and turning construction guides into final geometry.

[中文说明](#中文说明)

## Features

- Select or create reusable points on the canvas.
- Choose between two methods for drawing segments and two methods for drawing arcs (see below).
- Draw a circle in two clicks: choose its center, then a point to set the radius (`O`).
- Construct perpendicular bisectors, perpendiculars through a point, and internal angle bisectors, or prioritize the exact intersections of two objects.
- Keep a compass radius for repeated arcs, enter a custom radius, or switch to full-circle drawing.
- Split segments, arcs, and circles at their intersections into independently selectable pieces. Intersections, endpoints, and centers remain reusable for construction.
- Keep new pieces as light guides; use **Emphasize** (`B`) to toggle a piece between a guide and a bold final result, or select it to change its color.
- Pan with `Space + drag`, zoom with the mouse wheel or view controls, undo with `Ctrl/⌘ + Z`, and cancel the current step with `Esc`.
- Switch the interface between Chinese and English. Chinese is the default language.
- Name and save multiple local projects; import or export the complete construction process as JSON, or export the drawing as SVG.
- Review the construction timeline with step controls, a progress slider, and playback from 0.25× to 4×.
- Browse **Classic cases** to load the starting diagram and task description for 143 Euclidea constructions, then continue drawing manually. Cases are independent tasks and intentionally have no scoring or automatic completion checks.

## Drawing methods

Click a tool, then follow the current-step prompt. Every step accepts existing points or a new position on the canvas; there is no need to switch to the point tool first.

| Tool | Key | Click sequence |
| --- | --- | --- |
| Two-point line | `D` | Click the start, then the end. The segment is completed on the second click. |
| Align and trim segment | `L` | Click two points to set a supporting line. A dashed line appears; click the actual segment start and end on that guide. The alignment points do not need to be its endpoints. |
| Draw circle | `O` | Click the center, move to preview the circle, then click a second point to set its radius and finish the full circle. |
| Center–start–end arc | `A` | Click the center, then the arc start to set its radius. A full-circle guide appears; click the end direction to complete the arc. |
| Set radius and draw arc | `R` | Click two points to set the compass radius, then click a center. A full-circle guide appears; click the arc start and end. |

Both arc methods draw the shorter arc between the chosen start and end. The end click is projected onto the circle, so it chooses an end direction while the radius stays exact. The three-click arc (`A`) uses its own radius and does not replace the radius held by the compass.

The two-click circle (`O`) also uses its own radius. Its center and radius point are recorded in the construction history; **Use last arc’s radius** can reuse this circle’s radius for later constructions. The tool stays active to draw more circles, and `Esc` cancels an unfinished circle.

After completing a fixed-radius arc, the compass stays ready to draw another one: click a new center, start, and end. Use **Use current radius** (`C`) to return to the held radius, or **Set radius and draw arc** (`R`) to measure a new radius. The right-hand compass panel also lets you enter a radius and switch between arcs and full circles.

**Use last arc’s radius** copies the radius of the most recently completed arc or circle, including a three-click arc. The radius source is shown below the current value and recorded in the construction process: a direct value, two measured points, or a radius reused from an earlier construction.

Use **Select / add point** (`V`) to create independent points or select a completed piece. Only points that are not on any completed segment, arc, or circle remain visible; hidden endpoints and intersections still snap and can be reused. A circle or arc center remains visible unless another object passes through it.

## Quick constructions

| Tool | Key | Click sequence and result |
| --- | --- | --- |
| Perpendicular bisector | `M` | Pick two distinct points, A and B. Draws a perpendicular segment centered at the midpoint of AB, with total length 2 × AB. |
| Perpendicular through a point | `P` | Pick a point P, then an existing segment. Draws from P to the foot on the segment's supporting line; the foot may lie on its extension. If P is already on that line, draws a perpendicular segment through P. |
| Angle bisector | `G` | Pick a point A on one side, the vertex V, then a point B on the other side. Draws the internal angle bisector from V beyond AB, with a length of twice the longer of VA and VB. Use three distinct, non-collinear points. |
| Exact intersections | `I` | Select two drawn objects. Temporarily marks their intersections and gives those points priority within the normal snapping distance. |

These tools create finite segments. Their results start as auxiliary geometry and can be selected, split at intersections, emphasized, or recolored just like other drawn segments.

The perpendicular tool uses the **original drawn segment** when you click any of its split pieces. Exact intersections similarly selects the **original segment, arc, or circle**. For example, selecting two circles finds both of their intersections even if earlier crossings have divided the circles into arcs. The selected objects are highlighted so you can confirm the choice.

Prioritized intersections remain available when you switch to another drawing tool. They stay marked until you press `Esc` or select a new pair of objects. All quick construction actions and their point or object choices are recorded in the construction history, saved with the project, and included in playback.

## Edit individual pieces

When segments and arcs intersect, each intersection divides the original geometry into separate pieces. This applies to segment–segment, segment–arc, and arc–arc intersections, including circles. A shape with no interior intersections stays as one piece.

Choose **Emphasize** (`B`), then click any piece to make only that piece bold. Click it again to restore its light construction style. The tool stays active so you can mark several pieces in succession. You can also use **Select / add point** (`V`) to select a piece and use the emphasis button in the inspector.

The inspector's **Piece color** control changes only the selected piece; **Reset** restores its default color. Emphasis and color are independent properties. If a later construction splits a styled piece, its new pieces inherit that emphasis and color, and you can then edit each one separately. Use `Ctrl/⌘ + Z` to undo drawing, emphasis, or color changes.

## Save, share, and replay

Edit the project name above the canvas. **New**, **Save**, and **Projects / export** let you keep several named projects and reopen them later. Changes are automatically saved in the current browser; the status beside the project name shows the save state.

Open **Projects / export** to export the complete project as JSON or import a saved JSON file. The JSON contains the geometry, construction steps, radius sources, and piece styles, so it can be moved to another browser or shared for continued editing and playback. **Export drawing (SVG)** creates a vector image of the drawing.

The **Construction history** panel below the canvas lists the recorded steps. Click a step or drag the progress slider to inspect that point in the process, use the previous/next controls to move one step at a time, or play the sequence at **0.25×, 0.5×, 1×, 2×, or 4×**. **Return to drawing** stops playback and restores the latest editable construction; playback also returns automatically when it finishes. Collapse the history panel to give the canvas more room.

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
classic-cases.js  Searchable classic-case catalogue and initial diagrams
project-store.js   Named-project storage and portable project data
history.js   Project controls, construction timeline, playback, and exports
outputs/     Standalone copies of the browser-ready deliverables
```

## Euclidea puzzle catalogue

The repository also includes a catalogue extracted from Euclidea's public game resources: [searchable HTML catalogue](euclidea-levels.html) and [complete JSON data](euclidea-levels.json). It contains 15 chapters, 151 configured levels, 3 additional tutorial pages, localized source descriptions, rewards and tool limits, and each level's original `.gmt` construction script and source URL. The catalogue was extracted on 2026-10-02 and retains attribution to Euclidea / HIL.

The application is intentionally dependency-free and uses SVG for the geometry board, so it can be hosted as a static GitHub Pages site.

The **Classic cases** dialog uses the same public catalogue to provide searchable case cards, chapter filters, initial geometry, bilingual interface labels, and source links. Loading a case resets the current editable task and keeps its case metadata with local project saves and JSON exports.

## 中文说明

**CompassCanvas** 是一个轻量的在线尺规作图工作台。它使用可缩放的 SVG 画布，支持用圆规确定半径、绘制圆弧和圆，也支持用直尺通过两点对齐并截取真正的线段。

### 功能

- 在画布上创建和重复使用可交互点。
- 画线段有两种方法，画圆弧也有两种方法，具体步骤见下表。
- 两点直接画圆：先选圆心，再选一点确认半径（`O`）。
- 快捷绘制两点垂直中分线、过点垂线和角平分线，也可以优先吸附两个对象的精确交点。
- 保持圆规半径连续作图，也可以直接输入半径或切换整圆模式。
- 线段、圆和圆弧在交点处自动分割成可独立选择的片段；交点、端点和圆心都可以继续用于作图。
- 新片段先作为浅色辅助线显示；使用「加粗」（`B`）逐段切换辅助线与最终结果，也可以选中某一段改变颜色。
- `Space + 拖动` 平移，滚轮或视图按钮缩放，`Ctrl/⌘ + Z` 撤销，`Esc` 取消当前步骤。
- 界面支持中文和英文切换，默认使用中文。
- 多个本地项目可命名、保存和打开；支持用 JSON 导入、导出完整作图过程，也可以导出 SVG 图片。
- 支持逐步查看作图过程、拖动进度，并以 0.25× 至 4× 速度回放。
- 「经典案例」提供 143 道 Euclidea 常规作图题。选择案例后会载入初始图形和任务说明，可以继续手动作图；这是独立于普通自由作图的功能，不包含评分或自动判断完成。

### 画图方法

选择工具后，按照「当前步骤」的提示依次点击。每一步都可以选择已有点，也可以点击画布上的新位置，不需要先切换到添加点工具。

| 工具 | 快捷键 | 点击顺序 |
| --- | --- | --- |
| 两点画直线 | `D` | 点起点，再点终点，第二次点击直接完成线段。 |
| 定向截取线段 | `L` | 先点两个点确定直线方向，出现虚线辅助线；再在辅助线上点取实际线段的起点和终点。用于定向的两个点不必是最终线段端点。 |
| 画圆 | `O` | 先点圆心，移动鼠标预览，再点击第二个点确认半径，直接完成整圆。 |
| 三点画弧 | `A` | 点圆心，再点圆弧起点确定半径，出现整圆辅助线；第三次点击选择终点方向，完成圆弧。 |
| 定半径画弧 | `R` | 先点两个点，以两点距离设定圆规半径；再点圆心，出现整圆辅助线；最后点圆弧起点和终点。 |

两种画弧方法默认绘制起点与终点间的短弧。终点会沿圆心方向投影到圆周，确保半径准确。三点画弧（`A`）的半径独立计算，不会覆盖圆规已保持的半径。

两点画圆（`O`）同样使用独立半径，作图过程会记录圆心与确定半径的第二点。可通过「沿用上一圆弧半径」继续使用这个圆的半径。画完后工具保持激活，可连续画圆；`Esc` 取消未完成的圆。

定半径的圆弧完成后，会自动保持半径继续作图：再次点击圆心、起点、终点即可。点击右侧「使用当前半径」（`C`）可以回到当前圆规半径；重新选择「定半径画弧」（`R`）可测量新的半径。右侧圆规面板也支持直接输入半径，以及在画弧与整圆间切换。

「沿用上一圆弧半径」可以复制最近画好的圆弧或整圆的半径，也包括三点画弧的半径。当前半径下方显示其来源，作图过程也会记录它来自直接输入、两点测量，还是某一步已画圆弧的半径。

「选择 / 添加点」（`V`）可以创建孤立点或选中已画好的片段。只有没有落在已画线段、圆弧或圆上的孤立点才显示；隐藏的端点和交点仍可吸附、选择和继续作图。圆或圆弧的圆心在没有其他对象经过时保持显示。

### 快捷作图

| 工具 | 快捷键 | 点击顺序与结果 |
| --- | --- | --- |
| 两点垂直中分线 | `M` | 依次选择两个不同的点 A、B。以 AB 中点为中心绘制垂直线段，总长度为 AB 长度的 2 倍。 |
| 过点作垂线 | `P` | 先选点 P，再选已有线段。绘制 P 到该线段所在直线的垂足之间的线段，垂足可以落在延长线上；如果 P 已在该直线上，则绘制经过 P 的垂直线段。 |
| 角平分线 | `G` | 依次选择一边上的点 A、顶点 V、另一边上的点 B。从 V 沿内角平分方向延长到 AB 之外，长度为 VA、VB 中较长者的 2 倍。三个点应不同且不共线。 |
| 精确选交点 | `I` | 依次选择两个已画对象，临时标出它们的交点；在通常的吸附距离内优先吸附这些精确交点。 |

快捷作图生成的是有限线段，默认作为辅助线显示。与其他已画线段一样，它们可以被选中、在交点处分割、加粗或改变颜色。

过点作垂线时，点击任意一个分割后的线段，会选择它所属的**原始线段**；精确选交点同样使用片段所属的**原始线段、圆弧或整圆**。例如，两个圆即使已经被其他交点分割为圆弧，仍可选出这两个原始圆的全部交点。所选对象会高亮，方便确认。

切换到其他作图工具后，优先交点仍可使用；按 `Esc` 或重新选择一对对象会清除原来的临时交点标记。所有快捷作图动作及其取点、选对象过程都会记录到作图历史中，随项目保存，并参与回放。

### 分段选择、加粗和颜色

线段与线段、线段与圆弧、圆弧与圆弧相交时，会在每一个交点处分割为独立片段；整圆也参与分割。没有内部交点的线段或圆弧仍保持为一段。

选择「加粗」（`B`），点击某一段即可单独加粗为最终结果；再次点击同一段，恢复浅色辅助线。加粗工具会保持开启，可以连续点击不同片段。也可以使用「选择 / 添加点」（`V`）选中片段，通过右侧按钮切换加粗状态。

右侧的「线段颜色」只改变当前选中片段的颜色，「默认」恢复默认颜色；颜色与加粗状态互不影响。后续新作图再次分割已有片段时，分割后的各段继承原片段的加粗状态和颜色，然后可以分别修改。`Ctrl/⌘ + Z` 可以撤销作图、加粗和颜色修改。

### Euclidea 题目目录

仓库同时附带从 Euclidea 公开游戏资源整理的[可搜索 HTML 题目目录](euclidea-levels.html)和[完整 JSON 数据](euclidea-levels.json)。目录包含 15 个章节、151 个配置关卡、3 个独立教程页、题目描述、奖励步数、工具限制，以及每道题的原始 `.gmt` 构造脚本和来源链接。数据提取时间为 2026-10-02，并保留 Euclidea / HIL 的来源标注。

「经典案例」对这些题目提供可搜索的案例卡片和章节筛选。载入案例后，初始图形会作为可继续使用的辅助几何显示，案例名称、说明和来源会随项目保存、导出；应用不会复制 Euclidea 的评分、星级或解题判断逻辑。

### 保存、分享与回放

在画布上方编辑项目名称，通过「新建」「保存」「项目」管理多个项目并随时重新打开。改动会自动保存在当前浏览器中，项目名称旁显示保存状态。

打开「项目」后，可以导出完整项目 JSON，或导入已有的 JSON 文件。JSON 包含几何图形、作图步骤、半径来源和各片段样式，可以用于迁移到其他浏览器、分享、继续编辑和回放。「导出 SVG 图片」则生成作图结果的矢量图片。

画布下方的「作图过程」列出已记录的步骤。点击某一步或拖动进度条可以查看对应状态，也可以使用上一步、下一步逐步查看，或以 **0.25×、0.5×、1×、2×、4×** 速度播放。「返回编辑」会停止回放，并恢复到最新的可编辑作图状态。收起作图过程面板，可以为画布腾出更多空间。

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
