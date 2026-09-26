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
    selectionHelp: "点线可选中；选中辅助线后可加粗为最终结果", finalize: "加粗为最终结果", shortcuts: "快捷键",
    "tool.select.title": "选择 / 添加点", "tool.select.desc": "点击画布创建可交互点", "tool.radius.title": "定半径", "tool.radius.desc": "依次点取两个点",
    "tool.compass.title": "画弧 / 画圆", "tool.compass.desc": "圆心 → 起点 → 终点", "tool.line.title": "直尺：对齐两点", "tool.line.desc": "两点定向，再取线段端点", "tool.line.short": "对齐两点",
    emptyTitle: "从一个点开始", emptyDesc: "选择左侧工具，然后在画布上点取位置", emptyHint: "<kbd>R</kbd> 定半径 <i></i> <kbd>C</kbd> 画弧 / 圆 <i></i> <kbd>L</kbd> 画直线",
    stateIdle: "圆规待设定", stateSetting: "重新取半径", stateReady: "圆规已就绪", stateHeld: "圆规半径保持", stateRuler: "直尺作图中",
    stateIdleHint: "先用“定半径”点取两点，或直接输入半径。", stateSettingHint: "依次点击两个点，新的距离会替换当前半径。",
    stateReadyHint: "当前保持 {radius} px；点击圆心开始作图。", stateHeldHint: "当前半径 {radius} px，切换回圆规即可继续。", stateRulerHint: "圆规半径仍保持 {radius} px，切回画弧 / 圆即可继续。",
    liveIdle: "待设定", liveSetting: "设定中", liveReady: "已就绪", liveHeld: "保持中", liveRuler: "直尺中",
    statusInitial: "准备就绪：从左侧选择工具，或点击画布添加一个点。", statusSelect: "选择模式：点击空白处创建点，点击已有点可选中。", statusRadius: "设定半径：请依次点击两个点。",
    statusLine: "直尺模式：请点击第一个对齐点。", statusCompassCircle: "整圆模式：请点击圆心。", statusCompassArc: "圆弧模式：请点击圆心。",
    statusEntityDone: "{entity}已完成；交点已自动生成，可继续点取。", statusSelectedPoint: "已选中点 ({x}, {y})。可切换工具继续作图。",
    statusRadiusFirst: "已记录第一个点，请点击第二个点确定半径。", statusTooClose: "两点距离太近，请换两个不同的点。",
    statusRadiusAuto: "半径已设为 {radius} px。已自动切换到圆规作图，请点击圆心。", statusLineFirst: "已记录第一个对齐点，请点击第二个对齐点确定直线方向。",
    statusLineNear: "两个对齐点太近，请换一个点确定方向。", statusLineDirection: "直线方向已确定，请在线上点击线段起点。",
    statusLineStart: "已记录线段起点，请在线上点击线段终点。", statusLineTooClose: "线段起点和终点太近，请在线上选择另一个点。",
    statusCircleCenter: "已记录圆心，点击画布完成整圆。", statusArcCenter: "已记录圆心，请点击圆周上的起点。", statusArcSame: "起点不能和圆心重合，请点在圆周方向上。",
    statusArcStart: "已记录弧起点，请点击圆周上的结束方向。", statusArcTooClose: "起点和终点方向太近，请点击另一个方向。",
    statusEntityFinal: "已选中最终结果。", statusEntityAux: "已选中辅助线段，可点击右侧按钮加粗为最终结果。", statusNoUndo: "没有可撤销的步骤。",
    statusUndo: "已撤销上一步作图。", statusClear: "画布已清空。", statusFinalized: "已将选中的辅助线段 / 弧线段加粗为最终结果。",
    statusRadiusMin: "半径至少为 10 px。", statusRadiusApplied: "半径已设为 {radius} px。", statusCanceled: "已取消当前操作，临时点也已移除。",
    entityLine: "直线段", entityCircle: "圆", entityArc: "圆弧", modeCircle: "整圆模式：请点击圆心。", modeArc: "圆弧模式：请点击圆心。",
    selectedFinal: "已是最终结果", arcCircle: "整圆", arcDraw: "画弧", pointIntersectionTitle: "交点 · 可继续点取", pointInteractiveTitle: "可交互点",
    helperSelect: "点击任意位置创建点；点击金色交点或端点可继续用于后续作图。", helperRadius: "依次点击两个点，以两点距离作为圆规半径。也可以在左侧输入框直接设定。",
    helperLine: "先点取两个对齐点确定直线方向，再在线上点取线段起点和终点。", helperCompass: "先点圆心，再点圆周上的起点和终点。弧线会严格保持当前半径。", helperCompassArc: "依次点击圆心、圆周上的起点和终点，按当前半径画出对应圆弧。", helperCompassCircle: "点击圆心即可画出整圆；使用右侧切换按钮可改为画弧。",
    noCompassRadius: "尚未设定圆规半径。", languageToggle: "切换语言", selectedAux: "已选中辅助对象", selectedPoint: "已选点 ({x}, {y})",
    editActions: "编辑操作", workspace: "尺规作图工作区", toolRail: "作图工具", toolToolbar: "选择作图工具", canvasSurface: "几何作图画布", canvasBoard: "尺规作图画布", inspector: "作图信息", radiusSlider: "半径滑块",
  },
  en: {
    documentTitle: "CompassCanvas · Straightedge & Compass Studio",
    "brand.subtitle": "Straightedge & compass studio", clear: "Clear canvas", undo: "Undo (⌘/Ctrl Z)", tools: "Tools", currentStep: "Current step",
    panHint: "Hold <kbd>Space</kbd> + drag to pan; use the wheel to zoom", autosave: "Saved locally", escCancel: "Esc cancels the current step",
    untitled: "Untitled construction", newDoc: "/ New", zoomOut: "Zoom out", zoomIn: "Zoom in", resetView: "Reset view", noSelection: "No selection",
    wheelZoom: "<kbd>Wheel</kbd> zoom", spacePan: "<kbd>Space</kbd> + drag to pan", snapHint: "Intersections snap automatically · every point can be reused",
    compassStatus: "Compass status", currentRadius: "Current radius", freeRadius: "Set freely", apply: "Apply", currentMode: "Mode: ", switch: "Switch ↔",
    compassNote: "Once set, the compass keeps this radius until you choose a new radius or switch tools.",
    canvasStats: "Canvas stats", objects: "objects", completed: "completed", points: "points", interactivePoints: "interactive",
    selectionHelp: "Select a line or arc; confirm an auxiliary guide as a final result", finalize: "Make final result", shortcuts: "Shortcuts",
    "tool.select.title": "Select / add point", "tool.select.desc": "Click the canvas to create a point", "tool.radius.title": "Set radius", "tool.radius.desc": "Pick two points in order",
    "tool.compass.title": "Draw arc / circle", "tool.compass.desc": "Center → start → end", "tool.line.title": "Straightedge: align points", "tool.line.desc": "Set direction, then choose segment ends", "tool.line.short": "Align two points",
    emptyTitle: "Start with a point", emptyDesc: "Choose a tool, then click on the canvas", emptyHint: "<kbd>R</kbd> set radius <i></i> <kbd>C</kbd> draw arc / circle <i></i> <kbd>L</kbd> draw line",
    stateIdle: "Compass not set", stateSetting: "Choosing a new radius", stateReady: "Compass ready", stateHeld: "Compass radius held", stateRuler: "Straightedge active",
    stateIdleHint: "Set a radius with two points or enter a value directly.", stateSettingHint: "Pick two points; their distance will replace the current radius.",
    stateReadyHint: "Holding {radius} px; click a center to begin.", stateHeldHint: "Current radius: {radius} px. Switch back to the compass to continue.", stateRulerHint: "The compass keeps {radius} px. Switch back to draw an arc or circle.",
    liveIdle: "Not set", liveSetting: "Setting", liveReady: "Ready", liveHeld: "Held", liveRuler: "Ruler",
    statusInitial: "Ready: choose a tool or click the canvas to add a point.", statusSelect: "Select mode: click empty space to add a point, or click an existing point.", statusRadius: "Radius mode: click two points in order.",
    statusLine: "Straightedge mode: click the first alignment point.", statusCompassCircle: "Circle mode: click the center.", statusCompassArc: "Arc mode: click the center.",
    statusEntityDone: "{entity} completed; intersections are ready to reuse.", statusSelectedPoint: "Selected point ({x}, {y}). Switch tools to continue.",
    statusRadiusFirst: "First point recorded. Click the second point to set the radius.", statusTooClose: "Those points are too close. Choose two different points.",
    statusRadiusAuto: "Radius set to {radius} px. Switched to compass drawing; click a center.", statusLineFirst: "First alignment point recorded. Click the second point to set the direction.",
    statusLineNear: "Those alignment points are too close. Choose another point.", statusLineDirection: "Direction set. Click the segment start on the guide line.",
    statusLineStart: "Segment start recorded. Click the segment end on the guide line.", statusLineTooClose: "The segment is too short. Choose another point on the guide line.",
    statusCircleCenter: "Center recorded. Click the canvas to complete the circle.", statusArcCenter: "Center recorded. Click the start direction on the circle.", statusArcSame: "The start cannot overlap the center. Click toward the circle.",
    statusArcStart: "Arc start recorded. Click the end direction on the circle.", statusArcTooClose: "Start and end directions are too close. Choose another direction.",
    statusEntityFinal: "Final result selected.", statusEntityAux: "Auxiliary guide selected. Use the button to make it final.", statusNoUndo: "There is nothing to undo.",
    statusUndo: "Last construction undone.", statusClear: "Canvas cleared.", statusFinalized: "Selected guide is now a final result.",
    statusRadiusMin: "Radius must be at least 10 px.", statusRadiusApplied: "Radius set to {radius} px.", statusCanceled: "Current operation canceled; temporary points were removed.",
    entityLine: "Segment", entityCircle: "Circle", entityArc: "Arc", modeCircle: "Circle mode: click the center.", modeArc: "Arc mode: click the center.",
    selectedFinal: "Already final", arcCircle: "Circle", arcDraw: "Draw arc", pointIntersectionTitle: "Intersection · ready to reuse", pointInteractiveTitle: "Interactive point",
    helperSelect: "Click anywhere to create a point; click a highlighted intersection or endpoint to reuse it.", helperRadius: "Pick two points in order to use their distance as the compass radius, or enter a value on the left.",
    helperLine: "Pick two alignment points to set the direction, then choose the segment start and end on the guide line.", helperCompass: "Pick a center, then the start and end directions on the circle. The arc keeps the current radius.", helperCompassArc: "Click the center, then the start and end points on the circle to draw the arc at the current radius.", helperCompassCircle: "Click the center to draw a full circle. Use the switch button to draw an arc instead.",
    noCompassRadius: "The compass radius is not set.", languageToggle: "Switch language", selectedAux: "Auxiliary object selected", selectedPoint: "Point selected ({x}, {y})",
    editActions: "Edit actions", workspace: "Straightedge and compass workspace", toolRail: "Construction tools", toolToolbar: "Choose a construction tool", canvasSurface: "Geometry construction canvas", canvasBoard: "Straightedge and compass canvas", inspector: "Construction details", radiusSlider: "Radius slider",
  },
};

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

const state = {
  language: initialLanguage,
  mode: "select",
  arcMode: "arc",
  radius: 150,
  radiusReady: false,
  radiusPicking: false,
  entities: [],
  freePoints: [],
  pending: [],
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
  select: {
    titleKey: "tool.select.title",
    helperKey: "helperSelect",
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
    titleKey: "tool.compass.title",
    helperKey: "helperCompass",
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
  return travelled <= total + 1e-5;
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
  if (a.type === "line" && b.type === "line") {
    const hit = lineIntersection(a.p1, a.p2, b.p1, b.p2);
    if (hit) hits.push(hit);
  } else if (a.type === "line" || b.type === "line") {
    const line = a.type === "line" ? a : b;
    const circular = a.type === "line" ? b : a;
    for (const hit of segmentCircleIntersections(line.p1, line.p2, circular.center, circular.radius)) {
      if (circular.type === "circle" || angleOnArc(angleOf(circular.center, hit), circular)) hits.push(hit);
    }
  } else {
    const ca = entityCircle(a);
    const cb = entityCircle(b);
    for (const hit of circleIntersections(ca.center, ca.radius, cb.center, cb.radius)) {
      if ((a.type === "circle" || angleOnArc(angleOf(a.center, hit), a)) && (b.type === "circle" || angleOnArc(angleOf(b.center, hit), b))) hits.push(hit);
    }
  }
  return hits;
}

function allIntersections() {
  const hits = [];
  for (let i = 0; i < state.entities.length; i += 1) {
    for (let j = i + 1; j < state.entities.length; j += 1) hits.push(...intersectionsForPair(state.entities[i], state.entities[j]));
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
  const merged = [...points, ...intersections];
  const unique = uniquePoints(merged);
  return unique.map((point) => {
    const isIntersection = intersections.some((p) => pointNear(p, point, 0.02));
    const isDerived = derived.some((p) => pointNear(p, point, 0.02));
    return { point, isIntersection, isStandalone: !isIntersection && !isDerived };
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
}

function setStatus(text) {
  statusLine.textContent = text;
}

function updateToolCopy() {
  const copy = toolCopy[state.mode];
  if (!copy) return;
  const helperKey = state.mode === "compass"
    ? (state.arcMode === "circle" ? "helperCompassCircle" : "helperCompassArc")
    : copy.helperKey;
  helperLine.textContent = t(helperKey);
  document.querySelector("#toolTitle").textContent = t(copy.titleKey);
  document.querySelectorAll("[data-mode]").forEach((button) => button.classList.toggle("active", button.dataset.mode === state.mode));
  document.querySelector("#arcModeToggle").classList.toggle("active", state.arcMode === "circle");
  document.querySelector("#arcModeLabel").textContent = t(state.arcMode === "circle" ? "arcCircle" : "arcDraw");
  updateCompassStateUI();
}

function updateCompassStateUI() {
  if (!compassStateCard) return;
  let cardState = "idle";
  let label = t("stateIdle");
  let hint = t("stateIdleHint");
  let live = t("liveIdle");
  if (state.mode === "radius" && state.radiusPicking) {
    cardState = "setting";
    label = t("stateSetting");
    hint = t("stateSettingHint");
    live = t("liveSetting");
  } else if (state.mode === "line") {
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
  document.querySelector("#radiusReadout").textContent = `${Math.round(state.radius)} px`;
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

function getSnap(point) {
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

function setMode(mode) {
  state.mode = mode;
  state.radiusPicking = mode === "radius";
  state.pending = [];
  state.lineGuide = null;
  state.previewPoint = null;
  state.selectedPoint = null;
  state.selectedEntity = null;
  state.operationPoints = [];
  updateToolCopy();
  render();
  const messages = {
    select: t("statusSelect"),
    radius: t("statusRadius"),
    line: t("statusLine"),
    compass: t(state.arcMode === "circle" ? "statusCompassCircle" : "statusCompassArc"),
  };
  setStatus(messages[mode]);
}

function pushHistory() {
  state.history.push({ entities: JSON.parse(JSON.stringify(state.entities)), freePoints: JSON.parse(JSON.stringify(state.freePoints)), radius: state.radius, radiusReady: state.radiusReady });
  if (state.history.length > 30) state.history.shift();
}

function commitEntity(entity) {
  pushHistory();
  entity.final = false;
  state.entities.push(entity);
  state.pending = [];
  state.lineGuide = null;
  state.previewPoint = null;
  state.operationPoints = [];
  render();
  const entityKey = entity.type === "line" ? "entityLine" : entity.type === "circle" ? "entityCircle" : "entityArc";
  setStatus(t("statusEntityDone", { entity: t(entityKey) }));
}

function pointOnRadius(center, clickPoint) {
  const vector = { x: clickPoint.x - center.x, y: clickPoint.y - center.y };
  const len = Math.hypot(vector.x, vector.y);
  if (len < EPS) return null;
  return { x: center.x + (vector.x / len) * state.radius, y: center.y + (vector.y / len) * state.radius };
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
  const tolerance = 14 / state.scale;
  let closest = null;
  let best = tolerance;
  for (const item of pointKinds()) {
    const onGuide = projectToLine(item.point, state.lineGuide);
    if (distance(item.point, onGuide) > tolerance) continue;
    const d = distance(projected, item.point);
    if (d < best) {
      best = d;
      closest = item.point;
    }
  }
  return closest ? clonePoint(closest) : projected;
}

function handleCanvasClick(rawPoint) {
  let point = getSnap(rawPoint);
  if (state.mode === "select") {
    addOperationPoint(point);
    state.selectedPoint = point;
    state.selectedEntity = null;
    render();
    setStatus(t("statusSelectedPoint", { x: Math.round(point.x), y: Math.round(point.y) }));
    return;
  }

  if (state.mode === "radius") {
    if (state.pending.length === 0) {
      state.pending = [point];
      addOperationPoint(point);
      setStatus(t("statusRadiusFirst"));
    } else {
      const first = state.pending[0];
      const radius = distance(first, point);
      if (radius < 4) {
        setStatus(t("statusTooClose"));
        return;
      }
      pushHistory();
      state.radius = radius;
      state.radiusReady = true;
      state.radiusPicking = false;
      addOperationPoint(point);
      state.pending = [];
      state.mode = "compass";
      state.radiusPicking = false;
      state.pending = [];
      state.lineGuide = null;
      state.operationPoints = [];
      updateToolCopy();
      syncRadiusControls();
      setStatus(t("statusRadiusAuto", { radius: Math.round(radius * 10) / 10 }));
    }
    render();
    return;
  }

  if (state.mode === "line") {
    if (state.pending.length === 0) {
      state.pending = [point];
      addOperationPoint(point);
      setStatus(t("statusLineFirst"));
    } else if (!state.lineGuide) {
      const first = state.pending[0];
      if (distance(first, point) < 4) {
        setStatus(t("statusLineNear"));
        return;
      }
      addOperationPoint(point);
      state.pending.push(point);
      state.lineGuide = makeLineGuide(first, point);
      setStatus(t("statusLineDirection"));
    } else if (state.pending.length === 2) {
      const start = lineGuidePoint(rawPoint);
      state.pending.push(start);
      addOperationPoint(start);
      setStatus(t("statusLineStart"));
    } else {
      const start = state.pending[2];
      const end = lineGuidePoint(rawPoint);
      if (distance(start, end) < 4) {
        setStatus(t("statusLineTooClose"));
        return;
      }
      addOperationPoint(end);
      commitEntity({ type: "line", p1: clonePoint(start), p2: clonePoint(end) });
    }
    render();
    return;
  }

  if (state.mode === "compass") {
    if (state.pending.length === 0) {
      state.pending = [point];
      addOperationPoint(point);
      setStatus(t(state.arcMode === "circle" ? "statusCircleCenter" : "statusArcCenter"));
    } else if (state.arcMode === "circle") {
      const center = state.pending[0];
      commitEntity({ type: "circle", center: clonePoint(center), radius: state.radius });
    } else if (state.pending.length === 1) {
      const start = pointOnRadius(state.pending[0], point);
      if (!start) {
        setStatus(t("statusArcSame"));
        return;
      }
      state.pending.push(start);
      addOperationPoint(start);
      setStatus(t("statusArcStart"));
    } else {
      const center = state.pending[0];
      const start = state.pending[1];
      const end = pointOnRadius(center, point);
      if (!end) return;
      const a0 = angleOf(center, start);
      const a1 = angleOf(center, end);
      const sweep = normalizeAngle(a1 - a0) <= Math.PI ? 1 : 0;
      if (Math.abs(normalizeAngle(a1 - a0)) < 0.02) {
        setStatus(t("statusArcTooClose"));
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

function bindEntityInteraction(node, entity) {
  node.addEventListener("pointerdown", (event) => {
    if (state.mode === "select" && !state.spacePressed) event.stopPropagation();
  });
  node.addEventListener("pointerup", (event) => {
    if (state.mode === "select" && !state.spacePressed) event.stopPropagation();
  });
  node.addEventListener("click", (event) => {
    if (state.mode !== "select" || state.spacePressed) return;
    event.stopPropagation();
    state.selectedEntity = entity;
    state.selectedPoint = null;
    render();
    setStatus(t(entity.final ? "statusEntityFinal" : "statusEntityAux"));
  });
}

function renderLine(entity, layer) {
  const node = el("line", { x1: entity.p1.x, y1: entity.p1.y, x2: entity.p2.x, y2: entity.p2.y, class: entityClass(entity, "geometry-line") });
  bindEntityInteraction(node, entity);
  const hit = el("line", { x1: entity.p1.x, y1: entity.p1.y, x2: entity.p2.x, y2: entity.p2.y, class: "geometry-hit-area" });
  bindEntityInteraction(hit, entity);
  layer.appendChild(node);
  layer.appendChild(hit);
}

function renderCircle(entity, layer) {
  const node = el("circle", { cx: entity.center.x, cy: entity.center.y, r: entity.radius, class: entityClass(entity, "geometry-circle") });
  bindEntityInteraction(node, entity);
  layer.appendChild(node);
  const hit = el("circle", { cx: entity.center.x, cy: entity.center.y, r: entity.radius, class: "geometry-hit-area" });
  bindEntityInteraction(hit, entity);
  layer.appendChild(hit);
}

function arcPath(entity) {
  const start = polar(entity.center, entity.radius, entity.a0);
  const end = polar(entity.center, entity.radius, entity.a1);
  const large = angleDelta(entity.a0, entity.a1, entity.sweep) > Math.PI ? 1 : 0;
  return `M ${start.x} ${start.y} A ${entity.radius} ${entity.radius} 0 ${large} ${entity.sweep} ${end.x} ${end.y}`;
}

function renderArc(entity, layer) {
  const node = el("path", { d: arcPath(entity), class: entityClass(entity, "geometry-arc") });
  bindEntityInteraction(node, entity);
  layer.appendChild(node);
  const hit = el("path", { d: arcPath(entity), class: "geometry-hit-area" });
  bindEntityInteraction(hit, entity);
  layer.appendChild(hit);
}

function renderPreview() {
  referenceLayer.replaceChildren();
  const pending = state.pending;
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
  if (!state.pointer.inside || !state.previewPoint) return;
  const cursor = state.previewPoint;
  if (state.mode === "radius" && pending.length === 1) {
    referenceLayer.appendChild(el("line", { x1: pending[0].x, y1: pending[0].y, x2: cursor.x, y2: cursor.y, class: "reference-line" }));
    const distanceText = `${Math.round(distance(pending[0], cursor))} px`;
    referenceLayer.appendChild(el("text", { x: cursor.x + 12, y: cursor.y - 12, class: "reference-label" }, distanceText));
  }
  if (state.mode === "compass" && pending.length >= 1) {
    const center = pending[0];
    referenceLayer.appendChild(el("circle", { cx: center.x, cy: center.y, r: state.radius, class: "reference-circle" }));
    referenceLayer.appendChild(el("line", { x1: center.x, y1: center.y, x2: cursor.x, y2: cursor.y, class: "reference-line" }));
    if (state.arcMode === "arc" && pending.length === 2) {
      const end = pointOnRadius(center, cursor);
      if (end) {
        const preview = { center, radius: state.radius, a0: angleOf(center, pending[1]), a1: angleOf(center, end), sweep: normalizeAngle(angleOf(center, end) - angleOf(center, pending[1])) <= Math.PI ? 1 : 0 };
        referenceLayer.appendChild(el("path", { d: arcPath(preview), class: "reference-arc" }));
      }
    }
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
    if (isIntersection) node.appendChild(el("circle", { cx: point.x, cy: point.y, r: 10, class: "point-hit-area" }));
    const label = el("title", {}, isIntersection ? t("pointIntersectionTitle") : t("pointInteractiveTitle"));
    node.appendChild(label);
    node.addEventListener("pointerdown", (event) => event.stopPropagation());
    node.addEventListener("pointerup", (event) => event.stopPropagation());
    node.addEventListener("click", (event) => {
      event.stopPropagation();
      handleCanvasClick(point);
    });
    pointLayer.appendChild(node);
  }
  pointCount.innerHTML = `${pointKinds().length} <span>${t("points")}</span>`;
}

function render() {
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
    finalizeBtn.disabled = !state.selectedEntity || state.selectedEntity.final;
    finalizeBtn.textContent = state.selectedEntity?.final ? t("selectedFinal") : t("finalize");
  }
  updateTransform();
}

function resetView() {
  state.panX = 0;
  state.panY = 0;
  state.scale = 1;
  updateTransform();
}

function undo() {
  const previous = state.history.pop();
  if (!previous) {
    setStatus(t("statusNoUndo"));
    return;
  }
  state.entities = previous.entities;
  state.freePoints = previous.freePoints;
  state.radius = previous.radius;
  state.radiusReady = previous.radiusReady ?? state.radiusReady;
  state.radiusPicking = state.mode === "radius" && !state.radiusReady;
  state.pending = [];
  state.lineGuide = null;
  state.operationPoints = [];
  state.selectedPoint = null;
  state.selectedEntity = null;
  syncRadiusControls();
  render();
  setStatus(t("statusUndo"));
}

function clearBoard() {
  if (!state.entities.length && !state.freePoints.length) return;
  pushHistory();
  state.entities = [];
  state.freePoints = [];
  state.pending = [];
  state.lineGuide = null;
  state.selectedPoint = null;
  state.selectedEntity = null;
  state.operationPoints = [];
  render();
  setStatus(t("statusClear"));
}

function finalizeSelectedEntity() {
  if (!state.selectedEntity || state.selectedEntity.final) return;
  pushHistory();
  state.selectedEntity.final = true;
  render();
  setStatus(t("statusFinalized"));
}

document.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => setMode(button.dataset.mode)));
if (languageToggle) languageToggle.addEventListener("click", () => {
  state.language = state.language === "zh" ? "en" : "zh";
  try { localStorage.setItem(LANG_KEY, state.language); } catch (_) { /* storage may be unavailable for file URLs */ }
  applyLanguage();
  const messageKey = state.mode === "radius" ? "statusRadius" : state.mode === "line" ? "statusLine" : state.mode === "compass" ? (state.arcMode === "circle" ? "statusCompassCircle" : "statusCompassArc") : "statusSelect";
  setStatus(t(messageKey));
});
document.querySelector("#arcModeToggle").addEventListener("click", () => {
  state.arcMode = state.arcMode === "arc" ? "circle" : "arc";
  state.pending = [];
  state.lineGuide = null;
  updateToolCopy();
  render();
  setStatus(t(state.arcMode === "circle" ? "statusCompassCircle" : "statusCompassArc"));
});
document.querySelector("#applyRadius").addEventListener("click", () => {
  const value = Number(radiusInput.value);
  if (!Number.isFinite(value) || value < 10) {
    setStatus(t("statusRadiusMin"));
    return;
  }
  pushHistory();
  state.radius = Math.min(1000, value);
  state.radiusReady = true;
  state.radiusPicking = false;
  syncRadiusControls();
  setStatus(t("statusRadiusApplied", { radius: Math.round(state.radius * 10) / 10 }));
});
radiusSlider.addEventListener("input", () => {
  state.radius = Number(radiusSlider.value);
  state.radiusReady = true;
  state.radiusPicking = false;
  syncRadiusControls();
});
document.querySelector("#undoBtn").addEventListener("click", undo);
document.querySelector("#clearBtn").addEventListener("click", clearBoard);
if (finalizeBtn) finalizeBtn.addEventListener("click", finalizeSelectedEntity);
document.querySelector("#resetViewBtn").addEventListener("click", resetView);
document.querySelector("#zoomInBtn").addEventListener("click", () => {
  state.scale = Math.min(3.5, state.scale * 1.15);
  updateTransform();
  renderPreview();
});
document.querySelector("#zoomOutBtn").addEventListener("click", () => {
  state.scale = Math.max(0.35, state.scale / 1.15);
  updateTransform();
  renderPreview();
});
document.querySelector("#zoomReadout").addEventListener("click", resetView);

board.addEventListener("pointermove", (event) => {
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
  cursorLayer.setAttribute("transform", `translate(${state.pointer.x} ${state.pointer.y})`);
});
board.addEventListener("pointerleave", () => {
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
    const wasMoved = state.panMoved;
    state.isPanning = false;
    try { board.releasePointerCapture(event.pointerId); } catch (_) { /* already released */ }
    if (wasMoved || event.button !== 0 || event.shiftKey) return;
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
  renderPreview();
}, { passive: false });

document.addEventListener("keydown", (event) => {
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
    clearOperationPoints();
    state.pending = [];
    state.lineGuide = null;
    state.previewPoint = null;
    state.selectedPoint = null;
    state.selectedEntity = null;
    render();
    setStatus(t("statusCanceled"));
  }
  if (!event.metaKey && !event.ctrlKey && !event.altKey) {
    const shortcut = { v: "select", r: "radius", c: "compass", l: "line" }[event.key.toLowerCase()];
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
setStatus(t("statusInitial"));
render();
