/* Compass & straightedge playground.  The geometry lives in world coordinates;
 * the SVG viewport only applies a pan/zoom transform. */

const SVG_NS = "http://www.w3.org/2000/svg";
const WIDTH = 1200;
const HEIGHT = 760;
const EPS = 1e-7;
const LANG_KEY = "compasscanvas-language";

const translations = {
  zh: {
    documentTitle: "CompassCanvas · 尺规作图工作台",
    "brand.subtitle": "尺规作图工作台", clear: "清空画布", undo: "撤销（⌘/Ctrl Z）", tools: "工具", currentStep: "当前步骤",
    panHint: "按住 <kbd>Space</kbd> + 拖动平移；滚轮缩放", autosave: "本地自动保存", escCancel: "Esc 取消当前步骤",
    untitled: "未命名作图", newDoc: "/ 新建", zoomOut: "缩小", zoomIn: "放大", resetView: "重置视图", noSelection: "未选中点",
    wheelZoom: "<kbd>滚轮</kbd> 缩放", spacePan: "<kbd>Space</kbd> + 拖动 平移", snapHint: "交点自动吸附 · 所有点可继续作图",
    compassStatus: "圆规状态", currentRadius: "当前半径", freeRadius: "自由设定", apply: "应用", currentMode: "当前模式：", switch: "切换 ↔",
    compassNote: "两点确定半径后，圆规会持续保持这个长度；切换直尺或重新定半径时，状态会同步更新。",
    canvasStats: "画布统计", objects: "个对象", completed: "已完成", points: "点", interactivePoints: "可交互点",
    selectionHelp: "交点之间的每一段都可单独选中、加粗或改颜色。", finalize: "加粗为最终结果", restoreAux: "取消加粗", shortcuts: "快捷键",
    "tool.bold.title": "加粗", "tool.bold.desc": "点击一段加粗，再点取消", helperBold: "点击一段线段或圆弧加粗；再次点击恢复为辅助线。交点之间的各段可分别操作。",
    segmentColor: "线段颜色", resetSegmentColor: "默认", statusRestoredAux: "这一段已恢复为辅助线。", statusColorChanged: "这一段的颜色已更新。", statusColorReset: "这一段已恢复默认颜色。", statusBoldMiss: "请点击要加粗或取消加粗的线段、圆弧。", pieceInteractiveTitle: "可单独选中和加粗的线段 / 弧段",
    "tool.select.title": "选择 / 添加点", "tool.select.desc": "点击画布创建可交互点", "tool.radius.title": "定半径画弧", "tool.radius.desc": "两点量半径，再选圆心和弧端点",
    "tool.compass.title": "画弧 / 画圆", "tool.compass.desc": "圆心 → 起点 → 终点", "tool.line.title": "定向截取线段", "tool.line.desc": "两点定向，再取线段端点", "tool.line.short": "对齐两点",
    "tool.lineQuick.title": "两点画直线", "tool.lineQuick.desc": "依次点击两个点", "tool.arcThreePoint.title": "三点画弧", "tool.arcThreePoint.desc": "圆心 → 起点 → 终点",
    emptyTitle: "从一个点开始", emptyDesc: "选择左侧工具，然后在画布上点取位置", emptyHint: "<kbd>D</kbd> 两点画线 <i></i> <kbd>A</kbd> 三点画弧",
    stateIdle: "圆规待设定", stateSetting: "重新取半径", stateReady: "圆规已就绪", stateHeld: "圆规半径保持", stateRuler: "直尺作图中",
    stateIdleHint: "先用“定半径”点取两点，或直接输入半径。", stateSettingHint: "依次点击两个点，新的距离会替换当前半径。",
    stateReadyHint: "当前保持 {radius} px；点击圆心开始作图。", stateHeldHint: "当前半径 {radius} px，切换回圆规即可继续。", stateRulerHint: "圆规半径仍保持 {radius} px，切回画弧 / 圆即可继续。",
    liveIdle: "待设定", liveSetting: "设定中", liveReady: "已就绪", liveHeld: "保持中", liveRuler: "直尺中",
    statusInitial: "准备就绪：从左侧选择工具，或点击画布添加一个点。", statusSelect: "选择模式：点击空白处创建点，点击已有点可选中。", statusRadius: "设定半径：请依次点击两个点。",
    statusLine: "直尺模式：请点击第一个对齐点。", statusLineQuick: "两点直线模式：请点击第一个点。", statusCompassCircle: "整圆模式：请点击圆心。", statusCompassArc: "圆弧模式：请点击圆心。", statusArcThreePoint: "三点画弧：请点击圆心。",
    statusEntityDone: "{entity}已完成；交点已自动生成，可继续点取。", statusSelectedPoint: "已选中点 ({x}, {y})。可切换工具继续作图。",
    statusRadiusFirst: "已记录第一个点，请点击第二个点确定半径。", statusTooClose: "两点距离太近，请换两个不同的点。",
    statusRadiusAuto: "半径已设为 {radius} px。已自动切换到圆规作图，请点击圆心。", statusLineFirst: "已记录第一个对齐点，请点击第二个对齐点确定直线方向。",
    statusLineNear: "两个对齐点太近，请换一个点确定方向。", statusLineQuickSecond: "已记录第一个点，请点击第二个点完成直线。", statusLineDirection: "直线方向已确定，请在线上点击线段起点。",
    statusLineStart: "已记录线段起点，请在线上点击线段终点。", statusLineTooClose: "线段起点和终点太近，请在线上选择另一个点。",
    statusCircleCenter: "已记录圆心，点击画布完成整圆。", statusArcCenter: "已记录圆心，请点击圆周上的起点。", statusArcSame: "起点不能和圆心重合，请点在圆周方向上。",
    statusArcStart: "已记录弧起点，请点击圆周上的结束方向。", statusArcThreeStart: "已记录圆心和弧起点，请点击弧终点。", statusArcTooClose: "起点和终点方向太近，请点击另一个方向。",
    statusEntityFinal: "已选中加粗的这一段，可取消加粗或更改颜色。", statusEntityAux: "已选中这一段，可加粗或更改颜色。", statusNoUndo: "没有可撤销的步骤。",
    statusUndo: "已撤销上一步作图。", statusClear: "画布已清空。", statusFinalized: "已将选中的辅助线段 / 弧线段加粗为最终结果。",
    statusRadiusMin: "半径至少为 10 px。", statusRadiusApplied: "半径已设为 {radius} px。", statusCanceled: "已取消当前操作，临时点也已移除。",
    entityLine: "直线段", entityCircle: "圆", entityArc: "圆弧", modeCircle: "整圆模式：请点击圆心。", modeArc: "圆弧模式：请点击圆心。",
    selectedFinal: "已是最终结果", arcCircle: "整圆", arcDraw: "画弧", pointIntersectionTitle: "交点 · 可继续点取", pointInteractiveTitle: "可交互点",
    helperSelect: "点击线段或弧段可修改这一段的属性；点击空白处添加点。", helperRadius: "依次点击两个点，以两点距离作为圆规半径。也可以在右侧输入框直接设定。",
    helperLine: "先点取两个对齐点确定直线方向，再在线上点取线段起点和终点。", helperCompass: "先点圆心，再点圆周上的起点和终点。弧线会严格保持当前半径。", helperCompassArc: "依次点击圆心、圆周上的起点和终点，按当前半径画出对应圆弧。", helperCompassCircle: "点击圆心，再点击确认整圆；使用右侧切换按钮可改为画弧。", helperLineQuick: "依次点击两个点，立即画出经过这两个点的线段。", helperArcThreePoint: "依次点击圆心、弧起点和弧终点；半径由圆心到起点的距离决定。",
    noCompassRadius: "尚未设定圆规半径。", languageToggle: "切换语言", selectedAux: "已选中辅助对象", selectedPoint: "已选点 ({x}, {y})",
    toolGroupLines: "直线", toolGroupArcs: "圆弧", reuseRadius: "使用当前半径（C）", reuseRadiusShortcut: "使用当前半径",
    statusArcThreeCenter: "已记录圆心，请点击弧起点，同时确定半径。",
    stateQuickArc: "三点画弧中", stateQuickArcHint: "第二点确定本次圆弧半径；终点吸附到该圆周。",
    stateQuickArcRadiusHint: "本次圆弧半径 {radius} px；请选择圆周上的终点。",
    heldRadius: "保留的圆规半径", quickArcRadius: "本次圆弧半径", selectedArcRadius: "所选圆 / 弧的半径",
    editActions: "编辑操作", workspace: "尺规作图工作区", toolRail: "作图工具", toolToolbar: "选择作图工具", canvasSurface: "几何作图画布", canvasBoard: "尺规作图画布", inspector: "作图信息", radiusSlider: "半径滑块",
  },
  en: {
    documentTitle: "CompassCanvas · Straightedge & Compass Studio",
    "brand.subtitle": "Straightedge & compass studio", clear: "Clear canvas", undo: "Undo (⌘/Ctrl Z)", tools: "Tools", currentStep: "Current step",
    panHint: "Hold <kbd>Space</kbd> + drag to pan; use the wheel to zoom", autosave: "Saved locally", escCancel: "Esc cancels the current step",
    untitled: "Untitled construction", newDoc: "/ New", zoomOut: "Zoom out", zoomIn: "Zoom in", resetView: "Reset view", noSelection: "No selection",
    wheelZoom: "<kbd>Wheel</kbd> zoom", spacePan: "<kbd>Space</kbd> + drag to pan", snapHint: "Intersections snap automatically · every point can be reused",
    compassStatus: "Compass status", currentRadius: "Current radius", freeRadius: "Set freely", apply: "Apply", currentMode: "Mode: ", switch: "Switch ↔",
    compassNote: "The compass keeps this radius across tools. Choose Transfer radius & arc to measure again, or reuse the held radius.",
    canvasStats: "Canvas stats", objects: "objects", completed: "completed", points: "points", interactivePoints: "interactive",
    selectionHelp: "Select each piece between intersections to change its emphasis or color.", finalize: "Make final result", restoreAux: "Remove emphasis", shortcuts: "Shortcuts",
    "tool.bold.title": "Emphasize", "tool.bold.desc": "Click a piece to toggle emphasis", helperBold: "Click a segment or arc to emphasize it; click again to restore a guide. Each piece between intersections is independent.",
    segmentColor: "Piece color", resetSegmentColor: "Reset", statusRestoredAux: "This piece is a construction guide again.", statusColorChanged: "This piece’s color has been updated.", statusColorReset: "This piece’s default color has been restored.", statusBoldMiss: "Click a segment or arc to toggle its emphasis.", pieceInteractiveTitle: "Individually selectable segment or arc",
    "tool.select.title": "Select / add point", "tool.select.desc": "Click the canvas to create a point", "tool.radius.title": "Transfer radius & arc", "tool.radius.desc": "Measure two points, then center & ends",
    "tool.compass.title": "Draw arc / circle", "tool.compass.desc": "Center → start → end", "tool.line.title": "Align & trim a line", "tool.line.desc": "Set direction, then choose segment ends", "tool.line.short": "Align two points",
    "tool.lineQuick.title": "Two-point line", "tool.lineQuick.desc": "Click two points in order", "tool.arcThreePoint.title": "Center–start–end arc", "tool.arcThreePoint.desc": "Center → start → end",
    emptyTitle: "Start with a point", emptyDesc: "Choose a tool, then click on the canvas", emptyHint: "<kbd>D</kbd> two-point line <i></i> <kbd>A</kbd> center–start–end arc",
    stateIdle: "Compass not set", stateSetting: "Choosing a new radius", stateReady: "Compass ready", stateHeld: "Compass radius held", stateRuler: "Straightedge active",
    stateIdleHint: "Set a radius with two points or enter a value directly.", stateSettingHint: "Pick two points; their distance will replace the current radius.",
    stateReadyHint: "Holding {radius} px; click a center to begin.", stateHeldHint: "Current radius: {radius} px. Switch back to the compass to continue.", stateRulerHint: "The compass keeps {radius} px. Switch back to draw an arc or circle.",
    liveIdle: "Not set", liveSetting: "Setting", liveReady: "Ready", liveHeld: "Held", liveRuler: "Ruler",
    statusInitial: "Ready: choose a tool or click the canvas to add a point.", statusSelect: "Select mode: click empty space to add a point, or click an existing point.", statusRadius: "Radius mode: click two points in order.",
    statusLine: "Straightedge mode: click the first alignment point.", statusLineQuick: "Two-point line mode: click the first point.", statusCompassCircle: "Circle mode: click the center.", statusCompassArc: "Arc mode: click the center.", statusArcThreePoint: "Three-point arc: click the center.",
    statusEntityDone: "{entity} completed; intersections are ready to reuse.", statusSelectedPoint: "Selected point ({x}, {y}). Switch tools to continue.",
    statusRadiusFirst: "First point recorded. Click the second point to set the radius.", statusTooClose: "Those points are too close. Choose two different points.",
    statusRadiusAuto: "Radius set to {radius} px. Switched to compass drawing; click a center.", statusLineFirst: "First alignment point recorded. Click the second point to set the direction.",
    statusLineNear: "Those alignment points are too close. Choose another point.", statusLineQuickSecond: "First point recorded. Click the second point to draw the line.", statusLineDirection: "Direction set. Click the segment start on the guide line.",
    statusLineStart: "Segment start recorded. Click the segment end on the guide line.", statusLineTooClose: "The segment is too short. Choose another point on the guide line.",
    statusCircleCenter: "Center recorded. Click the canvas to complete the circle.", statusArcCenter: "Center recorded. Click the start direction on the circle.", statusArcSame: "The start cannot overlap the center. Click toward the circle.",
    statusArcStart: "Arc start recorded. Click the end direction on the circle.", statusArcThreeStart: "Center and arc start recorded. Click the arc end.", statusArcTooClose: "Start and end directions are too close. Choose another direction.",
    statusEntityFinal: "Emphasized piece selected. Remove emphasis or change its color.", statusEntityAux: "Guide piece selected. Change its emphasis or color.", statusNoUndo: "There is nothing to undo.",
    statusUndo: "Last construction undone.", statusClear: "Canvas cleared.", statusFinalized: "Selected guide is now a final result.",
    statusRadiusMin: "Radius must be at least 10 px.", statusRadiusApplied: "Radius set to {radius} px.", statusCanceled: "Current operation canceled; temporary points were removed.",
    entityLine: "Segment", entityCircle: "Circle", entityArc: "Arc", modeCircle: "Circle mode: click the center.", modeArc: "Arc mode: click the center.",
    selectedFinal: "Already final", arcCircle: "Circle", arcDraw: "Draw arc", pointIntersectionTitle: "Intersection · ready to reuse", pointInteractiveTitle: "Interactive point",
    helperSelect: "Click a segment or arc to edit that piece, or click empty space to add a point.", helperRadius: "Pick two points in order to use their distance as the compass radius, or enter a value on the right.",
    helperLine: "Pick two alignment points to set the direction, then choose the segment start and end on the guide line.", helperCompass: "Pick a center, then the start and end directions on the circle. The arc keeps the current radius.", helperCompassArc: "Click the center, then the start and end points on the circle to draw the arc at the current radius.", helperCompassCircle: "Click the center, then click again to confirm a full circle. Use the switch to draw an arc.", helperLineQuick: "Click two points in order to immediately draw the segment between them.", helperArcThreePoint: "Click the center, arc start, and arc end; the radius comes from the center to the start.",
    noCompassRadius: "The compass radius is not set.", languageToggle: "Switch language", selectedAux: "Auxiliary object selected", selectedPoint: "Point selected ({x}, {y})",
    toolGroupLines: "Lines", toolGroupArcs: "Arcs", reuseRadius: "Use held radius (C)", reuseRadiusShortcut: "Use held radius",
    statusArcThreeCenter: "Center recorded. Click the arc start to set its radius.",
    stateQuickArc: "Center–start–end arc", stateQuickArcHint: "The second point sets this arc’s radius; the end snaps to that circle.",
    stateQuickArcRadiusHint: "Arc radius: {radius} px. Choose the end on the circle.",
    heldRadius: "Held compass radius", quickArcRadius: "This arc’s radius", selectedArcRadius: "Selected circle / arc radius",
    editActions: "Edit actions", workspace: "Straightedge and compass workspace", toolRail: "Construction tools", toolToolbar: "Choose a construction tool", canvasSurface: "Geometry construction canvas", canvasBoard: "Straightedge and compass canvas", inspector: "Construction details", radiusSlider: "Radius slider",
  },
};

Object.assign(translations.zh, {
  toolGroupQuick: "快捷作图",
  "tool.bisector.title": "垂直中分线", "tool.bisector.desc": "两点确定垂直中分线",
  "tool.perpendicular.title": "过点作垂线", "tool.perpendicular.desc": "先选点，再选线段",
  "tool.angleBisector.title": "角平分线", "tool.angleBisector.desc": "边上一点 → 顶点 → 另一边点",
  "tool.intersections.title": "精确选交点", "tool.intersections.desc": "选两个对象，优先吸附交点",
  statusBisector: "垂直中分线：请选择第一个点。", statusBisectorSecond: "请选择第二个点，直接生成垂直中分线。",
  statusPerpendicular: "过点作垂线：先选择要经过的点。", statusPerpendicularLine: "点击一条线段，将选定点连接到垂足；支持线段的延长线。",
  statusPerpendicularMiss: "请选择一条直线段。", statusPerpendicularExtended: "垂线已完成，垂足位于所选线段的延长线上。",
  statusAngleFirst: "角平分线：先选择一条边上的点。", statusAngleVertex: "请选择角的顶点（第二个点）。", statusAngleLast: "请选择另一条边上的点，完成内角平分线。",
  statusAngleInvalid: "这三个点不能确定一个角，请选择不同且不共线的点。",
  statusIntersectionFirst: "点击第一个线段或圆弧；点击任一分段会选中原始对象。", statusIntersectionSecond: "第一个对象已高亮，请点击第二个对象。",
  statusIntersectionMiss: "请点击线段或圆弧。", statusIntersectionSame: "请选择另一个对象；同一次作图的分段属于同一对象。",
  statusIntersectionNone: "两个对象没有独立交点，请换一个对象；重合部分不作为交点。",
  statusIntersectionReady: "已高亮 {count} 个交点。切换作图工具后，附近取点会优先吸附；Esc 取消高亮。",
  helperIntersectionReady: "交点已高亮，可切换工具继续取点。点击新对象可重新选择一对；Esc 清除高亮。",
});
Object.assign(translations.en, {
  toolGroupQuick: "Quick constructions",
  "tool.bisector.title": "Perpendicular bisector", "tool.bisector.desc": "Pick two points to bisect",
  "tool.perpendicular.title": "Perpendicular through point", "tool.perpendicular.desc": "Pick a point, then a segment",
  "tool.angleBisector.title": "Angle bisector", "tool.angleBisector.desc": "Side point → vertex → other side",
  "tool.intersections.title": "Find intersections", "tool.intersections.desc": "Pick two objects to prioritize hits",
  statusBisector: "Perpendicular bisector: choose the first point.", statusBisectorSecond: "Choose the second point to draw the perpendicular bisector.",
  statusPerpendicular: "Perpendicular: choose the point to pass through.", statusPerpendicularLine: "Click a segment to connect the point to its perpendicular foot, including on its extension.",
  statusPerpendicularMiss: "Choose a straight segment.", statusPerpendicularExtended: "Perpendicular drawn. Its foot is on the selected segment’s extension.",
  statusAngleFirst: "Angle bisector: choose a point on the first side.", statusAngleVertex: "Choose the vertex of the angle (the second point).", statusAngleLast: "Choose a point on the other side to draw the internal angle bisector.",
  statusAngleInvalid: "Choose three distinct, non-collinear points to define an angle.",
  statusIntersectionFirst: "Click the first segment or arc; any split piece selects the original object.", statusIntersectionSecond: "First object highlighted. Click the second object.",
  statusIntersectionMiss: "Click a segment or arc.", statusIntersectionSame: "Choose a different object; pieces from one construction belong to the same object.",
  statusIntersectionNone: "No isolated intersections. Choose another object; overlapping portions do not count as points.",
  statusIntersectionReady: "Highlighted {count} intersections. Switch tools to snap to them first when nearby; Esc clears highlights.",
  helperIntersectionReady: "Intersections highlighted. Switch tools to use them, click a new object to choose another pair, or press Esc to clear.",
});

function t(key, vars = {}) {
  const lang = state?.language || "zh";
  let text = translations[lang]?.[key] ?? translations.zh[key] ?? key;
  for (const [name, value] of Object.entries(vars)) text = text.replaceAll(`{${name}}`, String(value));
  return text;
}

const initialLanguage = (() => {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    return saved && translations[saved] ? saved : "zh";
  } catch (_) {
    return "zh";
  }
})();

const board = document.querySelector("#board");
const world = document.querySelector("#world");
const geometryLayer = document.querySelector("#geometryLayer");
const referenceLayer = document.querySelector("#referenceLayer");
const quickOverlayLayer = document.querySelector("#quickOverlayLayer");
const pointLayer = document.querySelector("#pointLayer");
const cursorLayer = document.querySelector("#cursorLayer");
const statusLine = document.querySelector("#statusLine");
const helperLine = document.querySelector("#helperLine");
const radiusInput = document.querySelector("#radiusInput");
const radiusSlider = document.querySelector("#radiusSlider");
const entityCount = document.querySelector("#entityCount");
const pointCount = document.querySelector("#pointCount");
const zoomReadout = document.querySelector("#zoomReadout");
const selectionReadout = document.querySelector("#selectionReadout");
const emptyState = document.querySelector("#emptyState");
const languageToggle = document.querySelector("#languageToggle");
const compassStateCard = document.querySelector("#compassStateCard");
const compassStateLabel = document.querySelector("#compassStateLabel");
const compassStateHint = document.querySelector("#compassStateHint");
const compassLiveBadge = document.querySelector("#compassLiveBadge");
const compassLiveLabel = document.querySelector("#compassLiveLabel");
const finalizeBtn = document.querySelector("#finalizeBtn");
const segmentColor = document.querySelector("#segmentColor");
const resetSegmentColor = document.querySelector("#resetSegmentColor");
let constructionHistory = null;
let radiusSourceSequence = 0;
let radiusSliderEditing = false;

function recordConstruction(kind, data = {}) {
  constructionHistory?.record(kind, data);
}

function radiusSource(kind, radius, points = [], method = "manual") {
  return { kind, radius, points: points.map((point) => constructionHistory?.pointReference(point) || clonePoint(point)), method,
    sourceId: constructionHistory?.nextSourceId() || `radius-${++radiusSourceSequence}` };
}

function editingBlocked() { return Boolean(constructionHistory?.playback.active); }

const state = {
  language: initialLanguage,
  mode: "select",
  status: { key: "statusInitial", vars: {} },
  arcMode: "arc",
  radius: 150,
  radiusReady: false,
  radiusSource: { kind: "free", radius: 150, points: [], method: "default", sourceId: "initial" },
  quickRadiusSource: null,
  pendingOrigins: [],
  lastArc: null,
  radiusPicking: false,
  entities: [],
  freePoints: [],
  pending: [],
  intersectionSelection: [],
  priorityIntersections: [],
  // Ruler uses two explicit phases: choose two points for a supporting line,
  // then choose the actual segment's start and end points on that line.
  lineGuide: null,
  selectedPoint: null,
  selectedEntity: null,
  operationPoints: [],
  previewPoint: null,
  panX: 0,
  panY: 0,
  scale: 1,
  pointer: { x: 0, y: 0, inside: false },
  isPanning: false,
  panMoved: false,
  panStart: null,
  history: [],
  spacePressed: false,
};

const toolCopy = {
  bisector: { titleKey: "tool.bisector.title", helperKey: "statusBisector" },
  perpendicular: { titleKey: "tool.perpendicular.title", helperKey: "statusPerpendicular" },
  angleBisector: { titleKey: "tool.angleBisector.title", helperKey: "statusAngleFirst" },
  intersections: { titleKey: "tool.intersections.title", helperKey: "statusIntersectionFirst" },
  select: {
    titleKey: "tool.select.title",
    helperKey: "helperSelect",
  },
  bold: {
    titleKey: "tool.bold.title",
    helperKey: "helperBold",
  },
  radius: {
    titleKey: "tool.radius.title",
    helperKey: "helperRadius",
  },
  line: {
    titleKey: "tool.line.title",
    helperKey: "helperLine",
  },
  compass: {
    titleKey: "tool.radius.title",
    helperKey: "helperCompass",
  },
  lineQuick: {
    titleKey: "tool.lineQuick.title",
    helperKey: "helperLineQuick",
  },
  arcThreePoint: {
    titleKey: "tool.arcThreePoint.title",
    helperKey: "helperArcThreePoint",
  },
};

function el(tag, attrs = {}, text = null) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  if (text != null) node.textContent = text;
  return node;
}

function clonePoint(p) {
  return { x: p.x, y: p.y };
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function normalizeAngle(a) {
  const tau = Math.PI * 2;
  let value = a % tau;
  if (value < 0) value += tau;
  return value;
}

function angleOf(center, point) {
  return normalizeAngle(Math.atan2(point.y - center.y, point.x - center.x));
}

function angleDelta(a0, a1, sweep) {
  const tau = Math.PI * 2;
  return sweep ? normalizeAngle(a1 - a0) : normalizeAngle(a0 - a1);
}

function angleOnArc(angle, arc) {
  const total = angleDelta(arc.a0, arc.a1, arc.sweep);
  const travelled = angleDelta(arc.a0, normalizeAngle(angle), arc.sweep);
  const tolerance = 1e-6 / Math.max(arc.radius, 1);
  return travelled <= total + tolerance || Math.PI * 2 - travelled <= tolerance;
}

function polar(center, radius, angle) {
  return { x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle) };
}

function makePointKey(p) {
  return `${Math.round(p.x * 1000) / 1000}|${Math.round(p.y * 1000) / 1000}`;
}

function uniquePoints(points) {
  const result = [];
  const keys = new Set();
  for (const point of points) {
    if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) continue;
    const key = makePointKey(point);
    if (!keys.has(key)) {
      keys.add(key);
      result.push(clonePoint(point));
    }
  }
  return result;
}

function pointNear(a, b, tolerance = 0.01) {
  return distance(a, b) <= tolerance;
}

function distanceToSegment(point, a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared < EPS) return distance(point, a);
  const t = Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / lengthSquared));
  return distance(point, { x: a.x + t * dx, y: a.y + t * dy });
}

function pointOnEntity(point, entity, tolerance) {
  if (entity.type === "line") return distanceToSegment(point, entity.p1, entity.p2) <= tolerance;
  if (entity.type === "circle") return Math.abs(distance(point, entity.center) - entity.radius) <= tolerance;
  if (entity.type === "arc") {
    return Math.abs(distance(point, entity.center) - entity.radius) <= tolerance
      && angleOnArc(angleOf(entity.center, point), entity);
  }
  return false;
}

function lineIntersection(a, b, c, d) {
  const r = { x: b.x - a.x, y: b.y - a.y };
  const s = { x: d.x - c.x, y: d.y - c.y };
  const denom = r.x * s.y - r.y * s.x;
  if (Math.abs(denom) < EPS) return null;
  const qmp = { x: c.x - a.x, y: c.y - a.y };
  const t = (qmp.x * s.y - qmp.y * s.x) / denom;
  const u = (qmp.x * r.y - qmp.y * r.x) / denom;
  if (t < -EPS || t > 1 + EPS || u < -EPS || u > 1 + EPS) return null;
  return { x: a.x + t * r.x, y: a.y + t * r.y };
}

function segmentCircleIntersections(p1, p2, center, radius) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const fx = p1.x - center.x;
  const fy = p1.y - center.y;
  const a = dx * dx + dy * dy;
  if (a < EPS) return [];
  const b = 2 * (fx * dx + fy * dy);
  const c = fx * fx + fy * fy - radius * radius;
  const discriminant = b * b - 4 * a * c;
  if (discriminant < -EPS) return [];
  const roots = discriminant < 0 ? [(-b) / (2 * a)] : [(-b - Math.sqrt(discriminant)) / (2 * a), (-b + Math.sqrt(discriminant)) / (2 * a)];
  return roots
    .filter((t) => t >= -EPS && t <= 1 + EPS)
    .map((t) => ({ x: p1.x + t * dx, y: p1.y + t * dy }));
}

function circleIntersections(c0, r0, c1, r1) {
  const dx = c1.x - c0.x;
  const dy = c1.y - c0.y;
  const d = Math.hypot(dx, dy);
  if (d < EPS || d > r0 + r1 + EPS || d < Math.abs(r0 - r1) - EPS) return [];
  const a = (r0 * r0 - r1 * r1 + d * d) / (2 * d);
  const h2 = r0 * r0 - a * a;
  if (h2 < -EPS) return [];
  const base = { x: c0.x + (a * dx) / d, y: c0.y + (a * dy) / d };
  if (h2 <= EPS) return [base];
  const h = Math.sqrt(h2);
  const ox = (-dy * h) / d;
  const oy = (dx * h) / d;
  return [{ x: base.x + ox, y: base.y + oy }, { x: base.x - ox, y: base.y - oy }];
}

function entityCircle(entity) {
  if (entity.type === "circle") return { center: entity.center, radius: entity.radius };
  if (entity.type === "arc") return { center: entity.center, radius: entity.radius };
  return null;
}

function intersectionsForPair(a, b) {
  const hits = [];
  const tolerance = 1e-6;
  if (a.type === "line" && b.type === "line") {
    const hit = lineIntersection(a.p1, a.p2, b.p1, b.p2);
    if (hit) hits.push(hit);
    else {
      // Collinear overlaps have no single crossing; their boundaries still
      // divide each segment into separately editable pieces.
      for (const point of [a.p1, a.p2, b.p1, b.p2]) {
        if (pointOnEntity(point, a, tolerance) && pointOnEntity(point, b, tolerance)) hits.push(point);
      }
    }
  } else if (a.type === "line" || b.type === "line") {
    const line = a.type === "line" ? a : b;
    const circular = a.type === "line" ? b : a;
    for (const hit of segmentCircleIntersections(line.p1, line.p2, circular.center, circular.radius)) {
      if (circular.type === "circle" || angleOnArc(angleOf(circular.center, hit), circular)) hits.push(hit);
    }
  } else {
    const ca = entityCircle(a);
    const cb = entityCircle(b);
    if (!ca || !cb) return [];
    if (distance(ca.center, cb.center) <= tolerance && Math.abs(ca.radius - cb.radius) <= tolerance) {
      const endpoints = [a, b].flatMap((entity) => entity.type === "arc"
        ? [polar(entity.center, entity.radius, entity.a0), polar(entity.center, entity.radius, entity.a1)]
        : []);
      for (const point of endpoints) {
        if (pointOnEntity(point, a, tolerance) && pointOnEntity(point, b, tolerance)) hits.push(point);
      }
    } else {
      for (const hit of circleIntersections(ca.center, ca.radius, cb.center, cb.radius)) {
        if ((a.type === "circle" || angleOnArc(angleOf(a.center, hit), a)) && (b.type === "circle" || angleOnArc(angleOf(b.center, hit), b))) hits.push(hit);
      }
    }
  }
  return hits.filter((hit, index) => hits.findIndex((other) => distance(hit, other) <= tolerance) === index);
}

function splitEntityAtPoints(entity, points) {
  const tolerance = 1e-6;
  if (entity.type === "line") {
    const dx = entity.p2.x - entity.p1.x;
    const dy = entity.p2.y - entity.p1.y;
    const length = Math.hypot(dx, dy);
    if (length <= tolerance) return [entity];
    const cuts = points
      .filter((point) => pointOnEntity(point, entity, tolerance))
      .map((point) => ((point.x - entity.p1.x) * dx + (point.y - entity.p1.y) * dy) / (length * length))
      .filter((position) => position * length > tolerance && (1 - position) * length > tolerance)
      .sort((a, b) => a - b);
    const boundaries = [0];
    for (const position of cuts) {
      if ((position - boundaries[boundaries.length - 1]) * length > tolerance) boundaries.push(position);
    }
    if (boundaries.length === 1) return [entity];
    boundaries.push(1);
    const at = (position) => ({ x: entity.p1.x + position * dx, y: entity.p1.y + position * dy });
    return boundaries.slice(0, -1).map((position, index) => ({
      ...entity, p1: at(position), p2: at(boundaries[index + 1]),
    }));
  }

  if ((entity.type !== "arc" && entity.type !== "circle") || entity.radius <= tolerance) return [entity];
  const angularTolerance = tolerance / entity.radius;
  const angles = points
    .filter((point) => pointOnEntity(point, entity, tolerance))
    .map((point) => angleOf(entity.center, point));
  const makeArc = (a0, a1, sweep, start, end) => ({
    ...entity,
    ...(entity.type === "circle" ? { colorFamily: "circle" } : {}),
    type: "arc",
    center: clonePoint(entity.center),
    a0, a1, sweep,
    start: start ? clonePoint(start) : polar(entity.center, entity.radius, a0),
    end: end ? clonePoint(end) : polar(entity.center, entity.radius, a1),
  });

  if (entity.type === "circle") {
    const boundaries = [];
    for (const angle of angles.sort((a, b) => a - b)) {
      if (!boundaries.length || angle - boundaries[boundaries.length - 1] > angularTolerance) boundaries.push(angle);
    }
    if (boundaries.length > 1 && Math.PI * 2 - boundaries[boundaries.length - 1] + boundaries[0] <= angularTolerance) boundaries.pop();
    // A single contact has not partitioned a closed circle into separate spans.
    if (boundaries.length < 2) return [entity];
    return boundaries.map((angle, index) => makeArc(angle, boundaries[(index + 1) % boundaries.length], 1));
  }

  const total = angleDelta(entity.a0, entity.a1, entity.sweep);
  const cuts = angles
    .map((angle) => angleDelta(entity.a0, angle, entity.sweep))
    .filter((position) => position > angularTolerance && total - position > angularTolerance)
    .sort((a, b) => a - b);
  const boundaries = [0];
  for (const position of cuts) {
    if (position - boundaries[boundaries.length - 1] > angularTolerance) boundaries.push(position);
  }
  if (boundaries.length === 1) return [entity];
  boundaries.push(total);
  const direction = entity.sweep ? 1 : -1;
  return boundaries.slice(0, -1).map((position, index) => makeArc(
    index === 0 ? entity.a0 : normalizeAngle(entity.a0 + direction * position),
    index === boundaries.length - 2 ? entity.a1 : normalizeAngle(entity.a0 + direction * boundaries[index + 1]),
    entity.sweep,
    index === 0 ? entity.start : null,
    index === boundaries.length - 2 ? entity.end : null,
  ));
}

function splitEntitiesAtIntersections(entities) {
  const cuts = entities.map(() => []);
  for (let i = 0; i < entities.length; i += 1) {
    for (let j = i + 1; j < entities.length; j += 1) {
      const hits = intersectionsForPair(entities[i], entities[j]);
      cuts[i].push(...hits);
      cuts[j].push(...hits);
    }
  }
  return entities.flatMap((entity, index) => splitEntityAtPoints(entity, cuts[index]));
}

function allIntersections(entities = state.entities) {
  const hits = [];
  for (let i = 0; i < entities.length; i += 1) {
    for (let j = i + 1; j < entities.length; j += 1) hits.push(...intersectionsForPair(entities[i], entities[j]));
  }
  return uniquePoints(hits);
}

function allPoints() {
  const points = [...state.freePoints];
  for (const item of state.entities) {
    if (item.type === "line") points.push(item.p1, item.p2);
    if (item.type === "circle") points.push(item.center);
    if (item.type === "arc") points.push(item.center, item.start, item.end);
  }
  return uniquePoints(points);
}

function entityPoints() {
  const points = [];
  for (const item of state.entities) {
    if (item.type === "line") points.push(item.p1, item.p2);
    if (item.type === "circle") points.push(item.center);
    if (item.type === "arc") points.push(item.center, item.start, item.end);
  }
  return uniquePoints(points);
}

function pointKinds() {
  const intersections = allIntersections();
  const points = allPoints();
  const derived = entityPoints();
  const geometryTolerance = 6 / state.scale;
  const merged = [...points, ...intersections];
  const unique = uniquePoints(merged);
  return unique.map((point) => {
    const isIntersection = intersections.some((p) => pointNear(p, point, 0.02));
    const isArcCenter = state.entities.some((entity) => entity.type === "arc" && pointNear(entity.center, point, 0.02));
    const isOnGeometry = derived.some((p) => pointNear(p, point, 0.02))
      || state.entities.some((entity) => pointOnEntity(point, entity, geometryTolerance));
    // An arc center is useful as an independent construction point. Keep it
    // visible unless another drawn segment/arc actually passes through it.
    const isVisibleArcCenter = isArcCenter
      && !state.entities.some((entity) => pointOnEntity(point, entity, geometryTolerance));
    return {
      point,
      isIntersection,
      isStandalone: !isIntersection && (isVisibleArcCenter || !isOnGeometry),
    };
  });
}

function screenToSvg(evt) {
  if (typeof board.createSVGPoint === "function" && typeof board.getScreenCTM === "function") {
    const point = board.createSVGPoint();
    point.x = evt.clientX;
    point.y = evt.clientY;
    const matrix = board.getScreenCTM();
    if (matrix) {
      const local = point.matrixTransform(matrix.inverse());
      return { x: local.x, y: local.y };
    }
  }
  const rect = board.getBoundingClientRect();
  return { x: ((evt.clientX - rect.left) / rect.width) * WIDTH, y: ((evt.clientY - rect.top) / rect.height) * HEIGHT };
}

function svgToWorld(svgPoint) {
  return { x: (svgPoint.x - state.panX) / state.scale, y: (svgPoint.y - state.panY) / state.scale };
}

function eventToWorld(evt) {
  return svgToWorld(screenToSvg(evt));
}

function worldToSvg(point) {
  return { x: point.x * state.scale + state.panX, y: point.y * state.scale + state.panY };
}

function updateTransform() {
  world.setAttribute("transform", `translate(${state.panX} ${state.panY}) scale(${state.scale})`);
  zoomReadout.textContent = `${Math.round(state.scale * 100)}%`;
}

function applyLanguage() {
  const lang = translations[state.language] ? state.language : "zh";
  state.language = lang;
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.body.dataset.language = lang;
  document.title = t("documentTitle");
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (key) node.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-html]").forEach((node) => {
    const key = node.dataset.i18nHtml;
    if (key) node.innerHTML = t(key);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
    const key = node.dataset.i18nAria;
    if (key) node.setAttribute("aria-label", t(key));
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
    const key = node.dataset.i18nAriaLabel;
    if (key) node.setAttribute("aria-label", t(key));
  });
  document.querySelectorAll("[data-i18n-title]").forEach((node) => {
    const key = node.dataset.i18nTitle;
    if (key) node.setAttribute("title", t(key));
  });
  if (languageToggle) {
    languageToggle.textContent = lang === "zh" ? "EN" : "中文";
    languageToggle.setAttribute("aria-label", t("languageToggle"));
  }
  refreshDynamicLabels();
}

// Dynamic labels are rendered by the geometry state, so refresh them together
// with the static data-i18n nodes whenever the language changes.
function refreshDynamicLabels() {
  updateToolCopy();
  syncRadiusControls();
  render();
  updateStatus();
}

function setStatus(key, vars = {}) {
  state.status = { key, vars };
  updateStatus();
}

function updateStatus() {
  const { key, vars } = state.status;
  statusLine.textContent = t(key, vars.entityKey ? { ...vars, entity: t(vars.entityKey) } : vars);
}

function currentStep() {
  const n = state.pending.length;
  if (state.mode === "bisector") return { key: n ? "statusBisectorSecond" : "statusBisector", number: n + 1, total: 2 };
  if (state.mode === "perpendicular") return { key: n ? "statusPerpendicularLine" : "statusPerpendicular", number: n + 1, total: 2 };
  if (state.mode === "angleBisector") return { key: ["statusAngleFirst", "statusAngleVertex", "statusAngleLast"][n], number: n + 1, total: 3 };
  if (state.mode === "intersections") return { key: state.intersectionSelection.length ? "statusIntersectionSecond" : state.priorityIntersections.length ? "helperIntersectionReady" : "statusIntersectionFirst", number: state.intersectionSelection.length || state.priorityIntersections.length ? 2 : 1, total: 2 };
  if (state.mode === "bold") return { key: "helperBold", number: 1, total: 1 };
  if (state.mode === "lineQuick") return { key: n ? "statusLineQuickSecond" : "statusLineQuick", number: n + 1, total: 2 };
  if (state.mode === "arcThreePoint") return { key: ["statusArcThreePoint", "statusArcThreeCenter", "statusArcThreeStart"][n], number: n + 1, total: 3 };
  if (state.mode === "line") return { key: ["statusLine", "statusLineFirst", "statusLineDirection", "statusLineStart"][n], number: n + 1, total: 4 };
  if (state.mode === "radius") return { key: n ? "statusRadiusFirst" : "statusRadius", number: n + 1, total: state.arcMode === "circle" ? 4 : 5 };
  if (state.mode === "compass") {
    const keys = state.arcMode === "circle" ? ["statusCompassCircle", "statusCircleCenter"] : ["statusCompassArc", "statusArcCenter", "statusArcStart"];
    return { key: keys[n], number: n + 3, total: state.arcMode === "circle" ? 4 : 5 };
  }
  return { key: "helperSelect", number: 1, total: 1 };
}

function updateToolCopy() {
  const copy = toolCopy[state.mode];
  if (!copy) return;
  const step = currentStep();
  board.setAttribute("data-mode", state.mode);
  helperLine.textContent = t(step.key);
  document.querySelector("#stepNumber").textContent = `${step.number}/${step.total}`;
  document.querySelector("#toolTitle").textContent = t(copy.titleKey);
  document.querySelectorAll("[data-mode]").forEach((button) => {
    const active = button.dataset.mode === (state.mode === "compass" ? "radius" : state.mode);
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.querySelector("#arcModeToggle").classList.toggle("active", state.arcMode === "circle");
  document.querySelector("#arcModeLabel").textContent = t(state.arcMode === "circle" ? "arcCircle" : "arcDraw");
  document.querySelector("#arcModeToggle").disabled = state.mode === "arcThreePoint";
  updateCompassStateUI();
}

function updateCompassStateUI() {
  if (!compassStateCard) return;
  let cardState = "idle";
  let label = t("stateIdle");
  let hint = t("stateIdleHint");
  let live = t("liveIdle");
  if (state.mode === "arcThreePoint") {
    cardState = state.pending.length === 2 ? "ready" : "setting";
    label = t("stateQuickArc");
    hint = state.pending.length === 2
      ? t("stateQuickArcRadiusHint", { radius: Math.round(distance(state.pending[0], state.pending[1]) * 10) / 10 })
      : t("stateQuickArcHint");
    live = t(state.pending.length === 2 ? "liveReady" : "liveSetting");
  } else if (state.mode === "radius" && state.radiusPicking) {
    cardState = "setting";
    label = t("stateSetting");
    hint = t("stateSettingHint");
    live = t("liveSetting");
  } else if (["line", "lineQuick", "bisector", "perpendicular", "angleBisector"].includes(state.mode)) {
    cardState = state.radiusReady ? "held" : "idle";
    label = t("stateRuler");
    hint = state.radiusReady ? t("stateRulerHint", { radius: Math.round(state.radius) }) : t("noCompassRadius");
    live = t("liveRuler");
  } else if (state.radiusReady) {
    cardState = state.mode === "compass" ? "ready" : "held";
    label = state.mode === "compass" ? t("stateReady") : t("stateHeld");
    hint = state.mode === "compass" ? t("stateReadyHint", { radius: Math.round(state.radius) }) : t("stateHeldHint", { radius: Math.round(state.radius) });
    live = state.mode === "compass" ? t("liveReady") : t("liveHeld");
  }
  compassStateCard.dataset.state = cardState;
  compassStateLabel.textContent = label;
  compassStateHint.textContent = hint;
  compassLiveBadge.dataset.state = cardState;
  compassLiveLabel.textContent = live;
}

function syncRadiusControls() {
  radiusInput.value = Math.round(state.radius * 10) / 10;
  radiusSlider.value = Math.max(20, Math.min(300, state.radius));
  const quickRadius = state.mode === "arcThreePoint" && state.pending.length === 2
    ? distance(state.pending[0], state.pending[1]) : null;
  const selectedRadius = state.selectedEntity?.radius ?? null;
  document.querySelector("#radiusReadout").textContent = `${Math.round((quickRadius ?? selectedRadius ?? state.radius) * 10) / 10} px`;
  document.querySelector(".radius-unit").textContent = t(quickRadius !== null ? "quickArcRadius" : selectedRadius !== null ? "selectedArcRadius" : state.mode === "arcThreePoint" ? "heldRadius" : "currentRadius");
  updateCompassStateUI();
}

function addFreePoint(point) {
  if (!state.freePoints.some((p) => pointNear(p, point, 0.01))) state.freePoints.push(clonePoint(point));
}

function addOperationPoint(point) {
  const existed = state.freePoints.some((p) => pointNear(p, point, 0.01));
  addFreePoint(point);
  if (!existed && !state.operationPoints.some((p) => pointNear(p, point, 0.01))) state.operationPoints.push(clonePoint(point));
}

function clearOperationPoints() {
  if (state.operationPoints.length) {
    state.freePoints = state.freePoints.filter((point) => !state.operationPoints.some((pending) => pointNear(point, pending, 0.01)));
  }
  state.operationPoints = [];
}

function prioritySnap(point, eligible = () => true) {
  let closest = null;
  let best = 14 / state.scale;
  for (const candidate of state.priorityIntersections) {
    const d = distance(point, candidate);
    if (eligible(candidate) && d < best) { best = d; closest = candidate; }
  }
  return closest ? clonePoint(closest) : null;
}

function getSnap(point) {
  const priority = prioritySnap(point);
  if (priority) return priority;
  const tolerance = 14 / state.scale;
  let closest = null;
  let best = tolerance;
  for (const item of pointKinds()) {
    const d = distance(point, item.point);
    if (d < best) {
      best = d;
      closest = item.point;
    }
  }
  return closest ? clonePoint(closest) : clonePoint(point);
}

function setMode(mode, record = true) {
  if (editingBlocked()) return;
  // Keep intentionally added standalone points; discard incomplete geometry.
  if (state.mode !== "select") clearOperationPoints();
  if (mode === "radius") state.arcMode = "arc";
  if (mode === "compass") state.radiusReady = true;
  state.mode = mode;
  state.radiusPicking = mode === "radius";
  state.pending = [];
  state.intersectionSelection = [];
  if (mode === "intersections") state.priorityIntersections = [];
  state.lineGuide = null;
  state.previewPoint = null;
  state.selectedPoint = null;
  state.selectedEntity = null;
  state.operationPoints = [];
  state.quickRadiusSource = null;
  state.pendingOrigins = [];
  updateToolCopy();
  render();
  setStatus(currentStep().key);
  if (record) recordConstruction("tool", { tool: mode });
}

function pushHistory() {
  const committedPoints = state.mode === "select" ? state.freePoints
    : state.freePoints.filter((point) => !state.operationPoints.some((temporary) => pointNear(point, temporary, 0.01)));
  state.history.push({ entities: JSON.parse(JSON.stringify(state.entities)), freePoints: JSON.parse(JSON.stringify(committedPoints)), radius: state.radius, radiusReady: state.radiusReady,
    radiusSource: JSON.parse(JSON.stringify(state.radiusSource)), lastArc: JSON.parse(JSON.stringify(state.lastArc)) });
  if (state.history.length > 30) state.history.shift();
}

function commitEntity(entity, construction = null) {
  pushHistory();
  const method = state.mode;
  const alignment = method === "line" ? state.pending.slice(0, 2).map(clonePoint) : [];
  entity.constructionId = constructionHistory?.nextStepId() || `drawing-${state.history.length}`;
  if (entity.type !== "line") {
    const source = method === "arcThreePoint" ? state.quickRadiusSource : state.radiusSource;
    const origin = source?.kind === "reuse" ? source.origin : source;
    const previousUse = constructionHistory?.project.steps.findLast((step) => step.kind === "draw" && step.data.geometry?.radiusSource?.sourceId === source?.sourceId);
    const previousArcStep = state.lastArc?.source?.sourceId === source?.sourceId ? state.lastArc.stepId : previousUse?.id;
    entity.radiusSource = JSON.parse(JSON.stringify(source || radiusSource("free", entity.radius)));
    if (method !== "arcThreePoint" && previousArcStep) {
      entity.radiusSource = { kind: "reuse", radius: entity.radius, sourceId: source.sourceId, fromStepId: previousArcStep, origin };
    }
    state.lastArc = { stepId: entity.constructionId, radius: entity.radius, source: JSON.parse(JSON.stringify(entity.radiusSource)) };
  }
  entity.final = false;
  state.entities.push(entity);
  state.entities = splitEntitiesAtIntersections(state.entities);
  state.pending = [];
  state.lineGuide = null;
  state.previewPoint = null;
  state.operationPoints = [];
  state.selectedEntity = null;
  state.quickRadiusSource = null;
  state.pendingOrigins = [];
  render();
  const entityKey = entity.type === "line" ? "entityLine" : entity.type === "circle" ? "entityCircle" : "entityArc";
  setStatus("statusEntityDone", { entityKey });
  recordConstruction("draw", { tool: method, geometry: entity, alignment, ...(construction ? { construction } : {}) });
}

function pointOnRadius(center, clickPoint, radius = state.radius) {
  const vector = { x: clickPoint.x - center.x, y: clickPoint.y - center.y };
  const len = Math.hypot(vector.x, vector.y);
  if (len < EPS) return null;
  return { x: center.x + (vector.x / len) * radius, y: center.y + (vector.y / len) * radius };
}

function makeLineGuide(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy);
  if (length < EPS) return null;
  return {
    p1: clonePoint(a),
    p2: clonePoint(b),
    unit: { x: dx / length, y: dy / length },
  };
}

function projectToLine(point, guide) {
  if (!guide) return clonePoint(point);
  const vx = point.x - guide.p1.x;
  const vy = point.y - guide.p1.y;
  const t = vx * guide.unit.x + vy * guide.unit.y;
  return {
    x: guide.p1.x + guide.unit.x * t,
    y: guide.p1.y + guide.unit.y * t,
  };
}

function lineGuidePoint(rawPoint) {
  const projected = projectToLine(rawPoint, state.lineGuide);
  const priority = prioritySnap(projected, (point) => distance(point, projectToLine(point, state.lineGuide)) <= 1e-5);
  if (priority) return priority;
  const tolerance = 14 / state.scale;
  let closest = null;
  let best = tolerance;
  for (const item of pointKinds()) {
    const onGuide = projectToLine(item.point, state.lineGuide);
    if (distance(item.point, onGuide) > 1e-5) continue;
    const d = distance(projected, item.point);
    if (d < best) {
      best = d;
      closest = item.point;
    }
  }
  return closest ? clonePoint(closest) : projected;
}

function bisectorGeometry(a, b) {
  if (distance(a, b) < 4) return null;
  const midpoint = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const offset = { x: a.y - b.y, y: b.x - a.x };
  return { type: "line", p1: { x: midpoint.x - offset.x, y: midpoint.y - offset.y }, p2: { x: midpoint.x + offset.x, y: midpoint.y + offset.y } };
}

function perpendicularGeometry(point, line) {
  const guide = makeLineGuide(line.p1, line.p2);
  if (!guide) return null;
  const foot = projectToLine(point, guide);
  const length = distance(line.p1, line.p2);
  const offset = { x: -guide.unit.y * length / 2, y: guide.unit.x * length / 2 };
  const geometry = distance(point, foot) > 1e-6
    ? { type: "line", p1: clonePoint(point), p2: foot }
    : { type: "line", p1: { x: point.x - offset.x, y: point.y - offset.y }, p2: { x: point.x + offset.x, y: point.y + offset.y } };
  return { geometry, foot, extended: distanceToSegment(foot, line.p1, line.p2) > 1e-6 };
}

function angleBisectorGeometry(a, vertex, b) {
  const left = distance(a, vertex), right = distance(b, vertex);
  if (left < 4 || right < 4) return null;
  const cross = (a.x - vertex.x) * (b.y - vertex.y) - (a.y - vertex.y) * (b.x - vertex.x);
  if (Math.abs(cross) / (left * right) < 1e-6) return null;
  // Equal unit vectors bisect the angle; extend beyond the opposite side
  // with a length of twice the longer selected arm.
  const direction = { x: (a.x - vertex.x) / left + (b.x - vertex.x) / right, y: (a.y - vertex.y) / left + (b.y - vertex.y) / right };
  const extent = 2 * Math.max(left, right) / Math.hypot(direction.x, direction.y);
  const end = { x: vertex.x + direction.x * extent, y: vertex.y + direction.y * extent };
  return { type: "line", p1: clonePoint(vertex), p2: end };
}

function originalConstruction(entity) {
  if (!entity) return null;
  const original = entity.constructionId && constructionHistory?.project.steps.find((step) => step.kind === "draw" && step.data.geometry?.constructionId === entity.constructionId)?.data.geometry;
  return original || entity;
}

function sameConstruction(a, b) {
  if (!a || !b) return false;
  if (a.constructionId && b.constructionId) return a.constructionId === b.constructionId;
  return JSON.stringify(a) === JSON.stringify(b);
}

function isolatedIntersections(a, b) {
  if (a.type === "line" && b.type === "line") {
    const guide = makeLineGuide(a.p1, a.p2);
    if (guide && [b.p1, b.p2].every((p) => distance(p, projectToLine(p, guide)) < 1e-6)) {
      const along = (p) => (p.x - a.p1.x) * guide.unit.x + (p.y - a.p1.y) * guide.unit.y;
      const overlap = Math.min(distance(a.p1, a.p2), Math.max(along(b.p1), along(b.p2))) - Math.max(0, Math.min(along(b.p1), along(b.p2)));
      if (overlap > 1e-6) return [];
    }
  } else if (a.type !== "line" && b.type !== "line" && distance(a.center, b.center) < 1e-6 && Math.abs(a.radius - b.radius) < 1e-6) {
    const intervals = (entity) => {
      if (entity.type === "circle") return [[0, Math.PI * 2]];
      const start = normalizeAngle(entity.sweep ? entity.a0 : entity.a1);
      const end = start + angleDelta(entity.a0, entity.a1, entity.sweep);
      return end > Math.PI * 2 ? [[start, Math.PI * 2], [0, end - Math.PI * 2]] : [[start, end]];
    };
    if (intervals(a).some(([start, end]) => intervals(b).some(([otherStart, otherEnd]) => Math.min(end, otherEnd) - Math.max(start, otherStart) > 1e-8))) return [];
  }
  return uniquePoints(intersectionsForPair(a, b));
}

function chooseIntersectionObject(entity) {
  if (!entity) { setStatus("statusIntersectionMiss"); return; }
  const object = originalConstruction(entity);
  const first = state.intersectionSelection[0];
  if (!first) {
    state.priorityIntersections = [];
    state.intersectionSelection = [JSON.parse(JSON.stringify(object))];
    state.selectedPoint = null;
    state.selectedEntity = null;
    render();
    setStatus("statusIntersectionSecond");
    recordConstruction("objectPick", { tool: "intersections", geometry: object });
    return;
  }
  if (sameConstruction(first, object)) { setStatus("statusIntersectionSame"); return; }
  const points = isolatedIntersections(first, object);
  if (!points.length) { setStatus("statusIntersectionNone"); return; }
  state.priorityIntersections = points;
  state.intersectionSelection = [];
  render();
  setStatus("statusIntersectionReady", { count: points.length });
  recordConstruction("intersection", { tool: "intersections", objects: [first, object], points });
}

function choosePerpendicularLine(entity) {
  if (!entity || entity.type !== "line") { setStatus("statusPerpendicularMiss"); return; }
  const line = originalConstruction(entity);
  const point = state.pending[0];
  const result = perpendicularGeometry(point, line);
  if (!result) { setStatus("statusPerpendicularMiss"); return; }
  commitEntity(result.geometry, { kind: "perpendicular", points: [clonePoint(point)], objects: [line] });
  if (result.extended) setStatus("statusPerpendicularExtended");
}

function handleCanvasClick(rawPoint) {
  if (editingBlocked()) return;
  const tool = state.mode;
  const stage = state.pending.length + 1;
  const count = constructionHistory?.project.steps.length;
  const before = JSON.stringify([state.freePoints, state.pending, state.radius, state.mode]);
  performCanvasClick(rawPoint);
  if (constructionHistory && count === constructionHistory.project.steps.length
      && before !== JSON.stringify([state.freePoints, state.pending, state.radius, state.mode])) {
    recordConstruction(tool === "select" ? "point" : "pick", { tool, stage, point: state.pending.at(-1) || state.selectedPoint || state.previewPoint, radiusSource: state.quickRadiusSource });
  }
}

function performCanvasClick(rawPoint) {
  let point = getSnap(rawPoint);
  state.previewPoint = point;
  state.pointer = { ...rawPoint, inside: true };
  if (state.mode === "intersections") {
    const first = state.intersectionSelection[0];
    const candidate = nearestEntity(rawPoint, (entity) => !sameConstruction(first, originalConstruction(entity)));
    chooseIntersectionObject(candidate || nearestEntity(rawPoint));
    return;
  }
  if (state.mode === "perpendicular" && state.pending.length) {
    choosePerpendicularLine(nearestEntity(rawPoint, (entity) => entity.type === "line"));
    return;
  }
  if (["bisector", "perpendicular", "angleBisector"].includes(state.mode)) {
    const points = [...state.pending, point];
    const needed = state.mode === "bisector" ? 2 : 3;
    if (state.mode === "perpendicular" || points.length < needed) {
      if (state.pending.length && distance(state.pending[0], point) < 4) { setStatus("statusTooClose"); return; }
      state.pending.push(clonePoint(point));
      addOperationPoint(point);
      state.selectedPoint = clonePoint(point);
      render();
      setStatus(currentStep().key);
    } else {
      const geometry = state.mode === "bisector" ? bisectorGeometry(...points) : angleBisectorGeometry(...points);
      if (!geometry) { setStatus(state.mode === "bisector" ? "statusTooClose" : "statusAngleInvalid"); return; }
      addOperationPoint(point);
      commitEntity(geometry, { kind: state.mode, points: points.map(clonePoint), objects: [] });
    }
    return;
  }
  if (state.mode === "bold" || state.mode === "select") {
    const entity = nearestEntity(rawPoint);
    const priority = state.mode === "select" && prioritySnap(rawPoint);
    const standalone = state.mode === "select" && pointKinds().find((item) => item.isStandalone
      && distance(rawPoint, item.point) <= 6 / state.scale
      && (!entity || distance(rawPoint, item.point) < distanceToEntity(rawPoint, entity)));
    if (standalone && !priority) point = clonePoint(standalone.point);
    if (entity && !standalone && !priority) {
      selectEntity(entity);
      return;
    }
    if (state.mode === "bold") {
      state.selectedEntity = null;
      state.selectedPoint = null;
      render();
      setStatus("statusBoldMiss");
      return;
    }
  }
  if (state.mode === "select") {
    addOperationPoint(point);
    state.selectedPoint = point;
    state.selectedEntity = null;
    render();
    setStatus("statusSelectedPoint", { x: Math.round(point.x), y: Math.round(point.y) });
    return;
  }

  if (state.mode === "radius") {
    if (state.pending.length === 0) {
      state.pending = [point];
      addOperationPoint(point);
      setStatus("statusRadiusFirst");
    } else {
      const first = state.pending[0];
      const radius = distance(first, point);
      if (radius < 4) {
        setStatus("statusTooClose");
        return;
      }
      pushHistory();
      state.radius = radius;
      state.radiusReady = true;
      state.radiusSource = radiusSource("points", radius, [first, point], "measure");
      addOperationPoint(point);
      state.mode = "compass";
      state.radiusPicking = false;
      state.pending = [];
      state.lineGuide = null;
      state.operationPoints = [];
      updateToolCopy();
      syncRadiusControls();
      setStatus("statusRadiusAuto", { radius: Math.round(radius * 10) / 10 });
      recordConstruction("radius", { radiusSource: state.radiusSource });
    }
    render();
    return;
  }

  if (state.mode === "line") {
    if (state.pending.length === 0) {
      state.pending = [point];
      addOperationPoint(point);
      setStatus("statusLineFirst");
    } else if (!state.lineGuide) {
      const first = state.pending[0];
      if (distance(first, point) < 4) {
        setStatus("statusLineNear");
        return;
      }
      addOperationPoint(point);
      state.pending.push(point);
      state.lineGuide = makeLineGuide(first, point);
      setStatus("statusLineDirection");
    } else if (state.pending.length === 2) {
      const start = lineGuidePoint(rawPoint);
      state.pending.push(start);
      addOperationPoint(start);
      setStatus("statusLineStart");
    } else {
      const start = state.pending[2];
      const end = lineGuidePoint(rawPoint);
      if (distance(start, end) < 4) {
        setStatus("statusLineTooClose");
        return;
      }
      addOperationPoint(end);
      commitEntity({ type: "line", p1: clonePoint(start), p2: clonePoint(end) });
    }
    render();
    return;
  }

  if (state.mode === "lineQuick") {
    if (state.pending.length === 0) {
      state.pending = [point];
      addOperationPoint(point);
      setStatus("statusLineQuickSecond");
    } else {
      const first = state.pending[0];
      if (distance(first, point) < 4) {
        setStatus("statusLineTooClose");
        return;
      }
      addOperationPoint(point);
      commitEntity({ type: "line", p1: clonePoint(first), p2: clonePoint(point) });
    }
    render();
    return;
  }

  if (state.mode === "arcThreePoint") {
    if (state.pending.length === 0) {
      state.pendingOrigins = [pointKinds().some((item) => pointNear(item.point, point))];
      state.pending = [point];
      addOperationPoint(point);
      setStatus("statusArcThreeCenter");
    } else if (state.pending.length === 1) {
      const center = state.pending[0];
      const radius = distance(center, point);
      if (radius < 4) {
        setStatus("statusArcSame");
        return;
      }
      const existingStart = pointKinds().some((item) => pointNear(item.point, point));
      state.quickRadiusSource = radiusSource(state.pendingOrigins[0] && existingStart ? "points" : "free", radius, [center, point], "center-start");
      state.pending.push(point);
      addOperationPoint(point);
      setStatus("statusArcThreeStart");
    } else {
      const center = state.pending[0];
      const start = state.pending[1];
      const radius = distance(center, start);
      const end = pointOnRadius(center, point, radius);
      if (!end) {
        setStatus("statusArcSame");
        return;
      }
      const a0 = angleOf(center, start);
      const a1 = angleOf(center, end);
      if (Math.min(normalizeAngle(a1 - a0), normalizeAngle(a0 - a1)) < 0.02) {
        setStatus("statusArcTooClose");
        return;
      }
      const sweep = normalizeAngle(a1 - a0) <= Math.PI ? 1 : 0;
      addOperationPoint(end);
      commitEntity({ type: "arc", center: clonePoint(center), radius, start: clonePoint(start), end: clonePoint(end), a0, a1, sweep });
    }
    render();
    return;
  }

  if (state.mode === "compass") {
    if (state.pending.length === 0) {
      state.pending = [point];
      addOperationPoint(point);
      setStatus(state.arcMode === "circle" ? "statusCircleCenter" : "statusArcCenter");
    } else if (state.arcMode === "circle") {
      const center = state.pending[0];
      commitEntity({ type: "circle", center: clonePoint(center), radius: state.radius });
    } else if (state.pending.length === 1) {
      const start = pointOnRadius(state.pending[0], point);
      if (!start) {
        setStatus("statusArcSame");
        return;
      }
      state.pending.push(start);
      addOperationPoint(start);
      setStatus("statusArcStart");
    } else {
      const center = state.pending[0];
      const start = state.pending[1];
      const end = pointOnRadius(center, point);
      if (!end) return;
      const a0 = angleOf(center, start);
      const a1 = angleOf(center, end);
      const sweep = normalizeAngle(a1 - a0) <= Math.PI ? 1 : 0;
      if (Math.min(normalizeAngle(a1 - a0), normalizeAngle(a0 - a1)) < 0.02) {
        setStatus("statusArcTooClose");
        return;
      }
      addOperationPoint(end);
      commitEntity({ type: "arc", center: clonePoint(center), radius: state.radius, start: clonePoint(start), end: clonePoint(end), a0, a1, sweep });
    }
    render();
  }
}

function entityClass(entity, baseClass) {
  return `${baseClass} ${entity.final ? "final-geometry" : "auxiliary-geometry"} ${state.selectedEntity === entity ? "selected-geometry" : ""}`;
}

function distanceToEntity(point, entity) {
  if (entity.type === "line") return distanceToSegment(point, entity.p1, entity.p2);
  if (entity.type === "circle" || angleOnArc(angleOf(entity.center, point), entity)) {
    return Math.abs(distance(point, entity.center) - entity.radius);
  }
  return Math.min(distance(point, entity.start), distance(point, entity.end));
}

function nearestEntity(point, eligible = () => true) {
  let nearest = null;
  let best = 10 / state.scale;
  for (const entity of state.entities) {
    if (!eligible(entity)) continue;
    const d = distanceToEntity(point, entity);
    if (d < best) {
      nearest = entity;
      best = d;
    }
  }
  return nearest;
}

function selectEntity(entity) {
  if (editingBlocked()) return;
  state.selectedEntity = entity;
  state.selectedPoint = null;
  if (state.mode === "bold") {
    finalizeSelectedEntity();
  } else {
    render();
    setStatus(entity.final ? "statusEntityFinal" : "statusEntityAux");
  }
}

function renderGeometryPiece(entity, node, hit, layer) {
  const group = el("g", { class: "geometry-piece", tabindex: "0", role: "button", "aria-label": t("pieceInteractiveTitle"), "aria-pressed": String(Boolean(entity.final)) });
  if (entity.color) group.setAttribute("style", `--geometry-color: ${entity.color}`);
  group.appendChild(node);
  group.appendChild(hit);
  group.appendChild(el("title", {}, t("pieceInteractiveTitle")));
  // Pointer events bubble to the board, which picks the nearest visible piece.
  // This also keeps pan gestures working when they start on a line or a point.
  group.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    if (!editingBlocked() && (state.mode === "intersections" || (state.mode === "perpendicular" && state.pending.length))) {
      event.preventDefault();
      event.stopPropagation();
      if (state.mode === "intersections") chooseIntersectionObject(entity);
      else choosePerpendicularLine(entity);
      return;
    }
    if (state.mode !== "select" && state.mode !== "bold") return;
    event.preventDefault();
    event.stopPropagation();
    selectEntity(entity);
  });
  layer.appendChild(group);
}

function renderLine(entity, layer) {
  const node = el("line", { x1: entity.p1.x, y1: entity.p1.y, x2: entity.p2.x, y2: entity.p2.y, class: entityClass(entity, "geometry-line") });
  const hit = el("line", { x1: entity.p1.x, y1: entity.p1.y, x2: entity.p2.x, y2: entity.p2.y, class: "geometry-hit-area" });
  renderGeometryPiece(entity, node, hit, layer);
}

function renderCircle(entity, layer) {
  const node = el("circle", { cx: entity.center.x, cy: entity.center.y, r: entity.radius, class: entityClass(entity, "geometry-circle") });
  const hit = el("circle", { cx: entity.center.x, cy: entity.center.y, r: entity.radius, class: "geometry-hit-area" });
  renderGeometryPiece(entity, node, hit, layer);
}

function arcPath(entity) {
  const start = polar(entity.center, entity.radius, entity.a0);
  const end = polar(entity.center, entity.radius, entity.a1);
  const large = angleDelta(entity.a0, entity.a1, entity.sweep) > Math.PI ? 1 : 0;
  return `M ${start.x} ${start.y} A ${entity.radius} ${entity.radius} 0 ${large} ${entity.sweep} ${end.x} ${end.y}`;
}

function renderArc(entity, layer) {
  const node = el("path", { d: arcPath(entity), class: entityClass(entity, entity.colorFamily === "circle" ? "geometry-circle" : "geometry-arc") });
  const hit = el("path", { d: arcPath(entity), class: "geometry-hit-area" });
  renderGeometryPiece(entity, node, hit, layer);
}

function renderQuickObject(entity, className = "quick-object-highlight") {
  if (!entity) return;
  let node;
  if (entity.type === "line") node = el("line", { x1: entity.p1.x, y1: entity.p1.y, x2: entity.p2.x, y2: entity.p2.y, class: className });
  else if (entity.type === "circle") node = el("circle", { cx: entity.center.x, cy: entity.center.y, r: entity.radius, class: className });
  else node = el("path", { d: arcPath(entity), class: className });
  quickOverlayLayer.appendChild(node);
}

function renderQuickPreview() {
  const pending = state.pending;
  const cursor = state.pointer.inside ? state.previewPoint : null;
  if (state.mode === "intersections") {
    const first = state.intersectionSelection[0];
    renderQuickObject(first);
    const hovered = state.pointer.inside && nearestEntity(state.pointer, (entity) => !sameConstruction(first, originalConstruction(entity)));
    if (hovered) renderQuickObject(originalConstruction(hovered));
    return true;
  }
  if (!["bisector", "perpendicular", "angleBisector"].includes(state.mode)) return false;
  let geometry = null;
  if (state.mode === "bisector" && pending.length && cursor) {
    renderQuickObject({ type: "line", p1: pending[0], p2: cursor }, "reference-line");
    geometry = bisectorGeometry(pending[0], cursor);
  }
  if (state.mode === "perpendicular" && pending.length && cursor) {
    const line = originalConstruction(nearestEntity(state.pointer, (entity) => entity.type === "line"));
    if (line) {
      renderQuickObject(line);
      const result = perpendicularGeometry(pending[0], line);
      geometry = result?.geometry;
      if (result) {
        quickOverlayLayer.appendChild(el("circle", { cx: result.foot.x, cy: result.foot.y, r: 5 / state.scale, class: "reference-point" }));
        if (result.extended) renderQuickObject({ type: "line", p1: distance(line.p1, result.foot) < distance(line.p2, result.foot) ? line.p1 : line.p2, p2: result.foot }, "reference-line");
      }
    }
  }
  if (state.mode === "angleBisector" && pending.length) {
    if (pending.length === 1 && cursor) renderQuickObject({ type: "line", p1: pending[0], p2: cursor }, "reference-line");
    if (pending.length === 2) {
      renderQuickObject({ type: "line", p1: pending[0], p2: pending[1] }, "reference-line");
      if (cursor) {
        renderQuickObject({ type: "line", p1: pending[1], p2: cursor }, "reference-line");
        geometry = angleBisectorGeometry(pending[0], pending[1], cursor);
      }
    }
  }
  if (geometry) renderQuickObject(geometry, "quick-construction-preview");
  return true;
}

function renderPreview() {
  referenceLayer.replaceChildren();
  quickOverlayLayer.replaceChildren();
  if (renderQuickPreview()) return;
  const pending = state.pending;
  if (state.mode === "lineQuick") {
    if (state.pointer.inside && state.previewPoint && pending.length === 1) {
      referenceLayer.appendChild(el("line", {
        x1: pending[0].x,
        y1: pending[0].y,
        x2: state.previewPoint.x,
        y2: state.previewPoint.y,
        class: "reference-line ruler-direction-preview",
      }));
    }
    return;
  }
  if (state.mode === "arcThreePoint" && pending.length) {
    const center = pending[0];
    const cursor = state.pointer.inside ? state.previewPoint : null;
    if (pending.length === 1 && cursor) {
      const radius = distance(center, cursor);
      if (radius >= 4) renderCircularPreview(center, radius, null, cursor);
    } else if (pending.length === 2) {
      renderCircularPreview(center, distance(center, pending[1]), pending[1], cursor);
    }
    return;
  }
  if (state.mode === "line") {
    if (state.lineGuide) {
      // Keep the supporting line visible after the two alignment points have
      // been selected. It intentionally extends beyond the selected points so
      // the user can choose a shorter segment on either side.
      const extent = 5000;
      const { p1, unit } = state.lineGuide;
      referenceLayer.appendChild(el("line", {
        x1: p1.x - unit.x * extent,
        y1: p1.y - unit.y * extent,
        x2: p1.x + unit.x * extent,
        y2: p1.y + unit.y * extent,
        class: "reference-line ruler-guide",
      }));
      if (state.pointer.inside && pending.length === 2) {
        const candidate = lineGuidePoint(state.pointer);
        referenceLayer.appendChild(el("circle", { cx: candidate.x, cy: candidate.y, r: 7, class: "reference-point ruler-preview-point" }));
      }
      if (state.pointer.inside && pending.length === 3) {
        const candidate = lineGuidePoint(state.pointer);
        referenceLayer.appendChild(el("line", {
          x1: pending[2].x,
          y1: pending[2].y,
          x2: candidate.x,
          y2: candidate.y,
          class: "reference-line ruler-segment-preview",
        }));
        referenceLayer.appendChild(el("circle", { cx: candidate.x, cy: candidate.y, r: 7, class: "reference-point ruler-preview-point" }));
      }
      return;
    }
    if (!state.pointer.inside || !state.previewPoint) return;
    const cursor = state.previewPoint;
    if (pending.length === 1) {
      referenceLayer.appendChild(el("line", { x1: pending[0].x, y1: pending[0].y, x2: cursor.x, y2: cursor.y, class: "reference-line ruler-direction-preview" }));
    }
    return;
  }
  const cursor = state.pointer.inside ? state.previewPoint : null;
  if (state.mode === "radius" && pending.length === 1 && cursor) {
    referenceLayer.appendChild(el("line", { x1: pending[0].x, y1: pending[0].y, x2: cursor.x, y2: cursor.y, class: "reference-line" }));
    referenceLayer.appendChild(el("text", { x: cursor.x + 12, y: cursor.y - 12, class: "reference-label" }, `${Math.round(distance(pending[0], cursor))} px`));
  }
  if (state.mode === "compass" && pending.length >= 1) {
    renderCircularPreview(pending[0], state.radius, state.arcMode === "arc" ? pending[1] : null, cursor);
  }
}

function renderCircularPreview(center, radius, start, cursor) {
  referenceLayer.appendChild(el("circle", { cx: center.x, cy: center.y, r: radius, class: "reference-circle" }));
  if (start) referenceLayer.appendChild(el("circle", { cx: start.x, cy: start.y, r: 6, class: "reference-point" }));
  const end = cursor && pointOnRadius(center, cursor, radius);
  if (!end) return;
  referenceLayer.appendChild(el("line", { x1: center.x, y1: center.y, x2: end.x, y2: end.y, class: "reference-line" }));
  referenceLayer.appendChild(el("circle", { cx: end.x, cy: end.y, r: 7, class: "reference-point" }));
  if (start) {
    const a0 = angleOf(center, start);
    const a1 = angleOf(center, end);
    const preview = { center, radius, a0, a1, sweep: normalizeAngle(a1 - a0) <= Math.PI ? 1 : 0 };
    referenceLayer.appendChild(el("path", { d: arcPath(preview), class: "reference-arc" }));
  }
}

function renderPoints() {
  pointLayer.replaceChildren();
  for (const { point, isIntersection, isStandalone } of pointKinds()) {
    const selected = state.selectedPoint && pointNear(state.selectedPoint, point, 0.02);
    const pointKind = isIntersection ? "intersection-point" : isStandalone ? "standalone-point" : "derived-point";
    const node = el("g", { class: `point-node ${pointKind} ${selected ? "selected-point" : ""}`, tabindex: "0" });
    node.appendChild(el("circle", { cx: point.x, cy: point.y, r: isIntersection ? 3.5 : 3, class: "point-visual" }));
    node.appendChild(el("circle", { cx: point.x, cy: point.y, r: 11, class: "point-hover-ring" }));
    if (!isStandalone) node.appendChild(el("circle", { cx: point.x, cy: point.y, r: 11, class: "point-hit-area" }));
    const label = el("title", {}, isIntersection ? t("pointIntersectionTitle") : t("pointInteractiveTitle"));
    node.appendChild(label);
    node.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      event.stopPropagation();
      handleCanvasClick(point);
    });
    pointLayer.appendChild(node);
  }
  state.priorityIntersections.forEach((point, index) => {
    pointLayer.appendChild(el("circle", { cx: point.x, cy: point.y, r: 7 / state.scale, class: "priority-intersection" }));
    pointLayer.appendChild(el("text", { x: point.x + 11 / state.scale, y: point.y - 11 / state.scale, "font-size": 12 / state.scale, class: "priority-intersection-label" }, `I${index + 1}`));
  });
  pointCount.innerHTML = `${pointKinds().length} <span>${t("points")}</span>`;
}

function render() {
  updateToolCopy();
  syncRadiusControls();
  geometryLayer.replaceChildren();
  for (const entity of state.entities) {
    if (entity.type === "line") renderLine(entity, geometryLayer);
    if (entity.type === "circle") renderCircle(entity, geometryLayer);
    if (entity.type === "arc") renderArc(entity, geometryLayer);
  }
  renderPoints();
  renderPreview();
  entityCount.innerHTML = `${state.entities.length} <span>${t("objects")}</span>`;
  emptyState.classList.toggle("is-hidden", state.entities.length > 0 || state.freePoints.length > 0);
  if (state.selectedEntity) {
    selectionReadout.textContent = state.selectedEntity.final ? t("statusEntityFinal") : t("selectedAux");
  } else {
    selectionReadout.textContent = state.selectedPoint ? t("selectedPoint", { x: Math.round(state.selectedPoint.x), y: Math.round(state.selectedPoint.y) }) : t("noSelection");
  }
  if (finalizeBtn) {
    finalizeBtn.disabled = !state.selectedEntity;
    finalizeBtn.textContent = state.selectedEntity?.final ? t("restoreAux") : t("finalize");
    finalizeBtn.setAttribute("aria-pressed", String(Boolean(state.selectedEntity?.final)));
  }
  segmentColor.disabled = !state.selectedEntity;
  segmentColor.value = state.selectedEntity?.color || defaultGeometryColor(state.selectedEntity);
  resetSegmentColor.disabled = !state.selectedEntity?.color;
  updateTransform();
  constructionHistory?.refresh();
  if (editingBlocked()) constructionHistory.drawAnnotation(constructionHistory.project.steps[constructionHistory.playback.index - 1]);
}

function resetView() {
  state.panX = 0;
  state.panY = 0;
  state.scale = 1;
  updateTransform();
  renderPoints();
  renderPreview();
  if (editingBlocked()) constructionHistory.drawAnnotation(constructionHistory.project.steps[constructionHistory.playback.index - 1]);
  constructionHistory?.viewChanged();
}

function undo() {
  if (editingBlocked()) return;
  const before = constructionHistory?.captureScene();
  const previous = state.history.pop();
  if (!previous) {
    setStatus("statusNoUndo");
    return;
  }
  state.entities = previous.entities;
  state.freePoints = previous.freePoints;
  state.radius = previous.radius;
  state.radiusReady = previous.radiusReady ?? state.radiusReady;
  state.radiusSource = previous.radiusSource || radiusSource("free", state.radius);
  state.lastArc = previous.lastArc || null;
  state.quickRadiusSource = null;
  state.pendingOrigins = [];
  state.intersectionSelection = [];
  state.priorityIntersections = [];
  state.radiusPicking = state.mode === "radius" && !state.radiusReady;
  state.pending = [];
  state.lineGuide = null;
  state.operationPoints = [];
  state.selectedPoint = null;
  state.selectedEntity = null;
  syncRadiusControls();
  render();
  setStatus("statusUndo");
  recordConstruction("undo", before ? { before } : {});
}

function clearBoard() {
  if (editingBlocked()) return;
  if (!state.entities.length && !state.freePoints.length) return;
  pushHistory();
  state.entities = [];
  state.freePoints = [];
  state.pending = [];
  state.lineGuide = null;
  state.selectedPoint = null;
  state.selectedEntity = null;
  state.operationPoints = [];
  state.quickRadiusSource = null;
  state.pendingOrigins = [];
  state.intersectionSelection = [];
  state.priorityIntersections = [];
  render();
  setStatus("statusClear");
  recordConstruction("clear");
}

function finalizeSelectedEntity() {
  if (editingBlocked() || !state.selectedEntity) return;
  pushHistory();
  state.selectedEntity.final = !state.selectedEntity.final;
  render();
  setStatus(state.selectedEntity.final ? "statusFinalized" : "statusRestoredAux");
  recordConstruction("style", { property: "final", value: state.selectedEntity.final, geometry: state.selectedEntity });
}

function defaultGeometryColor(entity) {
  if (entity?.type === "arc" && entity.colorFamily !== "circle") return entity.final ? "#7d542a" : "#b19a78";
  return entity?.final ? "#263d51" : "#9aa7b2";
}

segmentColor.addEventListener("change", () => {
  if (editingBlocked() || !state.selectedEntity || !/^#[0-9a-f]{6}$/i.test(segmentColor.value)) return;
  if (state.selectedEntity.color === segmentColor.value) return;
  pushHistory();
  state.selectedEntity.color = segmentColor.value;
  render();
  setStatus("statusColorChanged");
  recordConstruction("style", { property: "color", value: state.selectedEntity.color, geometry: state.selectedEntity });
});
resetSegmentColor.addEventListener("click", () => {
  if (editingBlocked() || !state.selectedEntity?.color) return;
  pushHistory();
  delete state.selectedEntity.color;
  render();
  setStatus("statusColorReset");
  recordConstruction("style", { property: "color", value: null, geometry: state.selectedEntity });
});

document.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => setMode(button.dataset.mode)));
document.querySelector("#reuseRadiusBtn").addEventListener("click", () => setMode("compass"));
if (languageToggle) languageToggle.addEventListener("click", () => {
  state.language = state.language === "zh" ? "en" : "zh";
  try { localStorage.setItem(LANG_KEY, state.language); } catch (_) { /* storage may be unavailable for file URLs */ }
  applyLanguage();
});
document.querySelector("#arcModeToggle").addEventListener("click", () => {
  if (editingBlocked() || state.mode === "arcThreePoint") return;
  if (state.mode !== "select") clearOperationPoints();
  state.arcMode = state.arcMode === "arc" ? "circle" : "arc";
  state.pending = [];
  state.lineGuide = null;
  setMode("compass");
});
document.querySelector("#applyRadius").addEventListener("click", () => {
  if (editingBlocked()) return;
  const value = Number(radiusInput.value);
  if (!Number.isFinite(value) || value < 10) {
    setStatus("statusRadiusMin");
    return;
  }
  pushHistory();
  if (state.mode !== "select") clearOperationPoints();
  state.radius = Math.min(1000, value);
  state.radiusReady = true;
  state.radiusSource = radiusSource("free", state.radius, [], "manual");
  state.radiusPicking = false;
  setMode("compass", false);
  setStatus("statusRadiusApplied", { radius: Math.round(state.radius * 10) / 10 });
  recordConstruction("radius", { radiusSource: state.radiusSource });
});
radiusSlider.addEventListener("input", () => {
  if (editingBlocked()) return;
  if (!radiusSliderEditing) pushHistory();
  radiusSliderEditing = true;
  if (state.mode !== "select") clearOperationPoints();
  state.radius = Number(radiusSlider.value);
  state.radiusReady = true;
  state.radiusSource = radiusSource("free", state.radius, [], "slider");
  state.radiusPicking = false;
  setMode("compass", false);
});
radiusSlider.addEventListener("change", () => {
  if (!radiusSliderEditing || editingBlocked()) return;
  radiusSliderEditing = false;
  recordConstruction("radius", { radiusSource: state.radiusSource });
});
document.querySelector("#undoBtn").addEventListener("click", undo);
document.querySelector("#clearBtn").addEventListener("click", clearBoard);
if (finalizeBtn) finalizeBtn.addEventListener("click", finalizeSelectedEntity);
document.querySelector("#resetViewBtn").addEventListener("click", resetView);
document.querySelector("#zoomInBtn").addEventListener("click", () => {
  state.scale = Math.min(3.5, state.scale * 1.15);
  updateTransform();
  renderPoints();
  renderPreview();
  constructionHistory?.viewChanged();
  if (editingBlocked()) constructionHistory.drawAnnotation(constructionHistory.project.steps[constructionHistory.playback.index - 1]);
});
document.querySelector("#zoomOutBtn").addEventListener("click", () => {
  state.scale = Math.max(0.35, state.scale / 1.15);
  updateTransform();
  renderPoints();
  renderPreview();
  constructionHistory?.viewChanged();
  if (editingBlocked()) constructionHistory.drawAnnotation(constructionHistory.project.steps[constructionHistory.playback.index - 1]);
});
document.querySelector("#zoomReadout").addEventListener("click", resetView);

board.addEventListener("pointermove", (event) => {
  if (editingBlocked() && !state.isPanning) return;
  const svgPoint = screenToSvg(event);
  state.pointer = { ...svgToWorld(svgPoint), inside: true };
  if (state.isPanning) {
    const dx = svgPoint.x - state.panStart.x;
    const dy = svgPoint.y - state.panStart.y;
    if (Math.abs(dx) + Math.abs(dy) > 2) state.panMoved = true;
    state.panX = state.panStart.panX + dx;
    state.panY = state.panStart.panY + dy;
    updateTransform();
  } else {
    state.previewPoint = getSnap(state.pointer);
    renderPreview();
  }
  const cursor = prioritySnap(state.pointer) || state.pointer;
  cursorLayer.setAttribute("transform", `translate(${cursor.x} ${cursor.y})`);
});
board.addEventListener("pointerleave", () => {
  if (editingBlocked()) return;
  state.pointer.inside = false;
  state.previewPoint = null;
  renderPreview();
});
board.addEventListener("pointerdown", (event) => {
  // A normal left click selects a point on the guide or canvas. Panning is
  // explicit: middle/right mouse, Shift, or Space + drag.
  if (event.button === 1 || event.button === 2 || event.shiftKey || state.spacePressed) {
    const svgPoint = screenToSvg(event);
    state.isPanning = true;
    state.panMoved = false;
    state.panStart = { x: svgPoint.x, y: svgPoint.y, panX: state.panX, panY: state.panY };
    board.setPointerCapture(event.pointerId);
    event.preventDefault();
  }
});
board.addEventListener("pointerup", (event) => {
  if (state.isPanning) {
    state.isPanning = false;
    try { board.releasePointerCapture(event.pointerId); } catch (_) { /* already released */ }
    constructionHistory?.viewChanged();
    return;
  }
  if (event.button === 0) {
    handleCanvasClick(eventToWorld(event));
  }
});
board.addEventListener("contextmenu", (event) => event.preventDefault());
board.addEventListener("wheel", (event) => {
  event.preventDefault();
  const before = eventToWorld(event);
  const svgPoint = screenToSvg(event);
  const factor = event.deltaY < 0 ? 1.1 : 0.9;
  const nextScale = Math.max(0.35, Math.min(3.5, state.scale * factor));
  state.scale = nextScale;
  state.panX = svgPoint.x - before.x * state.scale;
  state.panY = svgPoint.y - before.y * state.scale;
  updateTransform();
  renderPoints();
  renderPreview();
  constructionHistory?.viewChanged();
  if (editingBlocked()) constructionHistory.drawAnnotation(constructionHistory.project.steps[constructionHistory.playback.index - 1]);
}, { passive: false });

document.addEventListener("keydown", (event) => {
  if (document.querySelector("#projectsDialog")?.open) return;
  if (["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName) || event.target.isContentEditable) return;
  if (event.code === "Space" && ["BUTTON", "SUMMARY"].includes(event.target.tagName)) return;
  if (editingBlocked() && event.key === "Escape") {
    constructionHistory.exitPlayback();
    return;
  }
  if (event.code === "Space") {
    state.spacePressed = true;
    document.querySelector("#canvasSurface").classList.add("is-panning");
    event.preventDefault();
  }
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
    event.preventDefault();
    undo();
  }
  if (event.key === "Escape") {
    const canceled = state.pending.length > 0 || state.operationPoints.length > 0 || state.intersectionSelection.length > 0 || state.priorityIntersections.length > 0;
    clearOperationPoints();
    state.pending = [];
    state.lineGuide = null;
    state.previewPoint = null;
    state.selectedPoint = null;
    state.selectedEntity = null;
    state.quickRadiusSource = null;
    state.pendingOrigins = [];
    state.intersectionSelection = [];
    state.priorityIntersections = [];
    render();
    setStatus("statusCanceled");
    if (canceled) recordConstruction("cancel");
  }
  if (!event.metaKey && !event.ctrlKey && !event.altKey) {
    const shortcut = { v: "select", b: "bold", r: "radius", c: "compass", l: "line", d: "lineQuick", a: "arcThreePoint", m: "bisector", p: "perpendicular", g: "angleBisector", i: "intersections" }[event.key.toLowerCase()];
    if (shortcut && event.target.tagName !== "INPUT") setMode(shortcut);
  }
});
document.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    state.spacePressed = false;
    document.querySelector("#canvasSurface").classList.remove("is-panning");
  }
});

applyLanguage();
setStatus("statusInitial");
render();
