/* A construction journal owns the editable task. Playback only borrows the
 * canvas; it never overwrites the task or appends events to its journal. */
Object.assign(translations.zh, {
  projectName: "作图任务名称", newProject: "新建", saveProject: "保存", openProjects: "任务 / 导出",
  constructionHistory: "作图过程", playbackPlay: "播放", playbackPause: "暂停", playbackPrevious: "上一步", playbackNext: "下一步", playbackExit: "返回作图",
  playbackSpeed: "速度", playbackProgress: "回放进度", closeProjects: "关闭", exportProject: "导出完整任务（JSON）", importProject: "导入任务", exportSvg: "导出图形（SVG）", savedProjects: "已保存的任务", historyEmpty: "开始作图后，每一步都会记录在这里。",
  reuseLastArc: "沿用上一圆弧半径", saved: "已保存到本机", saving: "正在保存…", saveFailed: "未能保存到本机，请导出任务", noSavedProjects: "还没有已保存的任务。", invalidProject: "任务文件无效或版本不兼容，当前作图未改变。", projectImported: "任务已导入，可以继续作图或回放。", projectOpened: "任务已打开。", projectSaved: "任务及完整过程已保存。", projectNew: "新任务已创建。", playbackStart: "初始画布", playbackFinished: "回放完成；点击“返回作图”继续编辑。", playbackDone: "回放完成，可以继续作图。", playbackViewing: "正在回看第 {index} 步；点击“返回作图”继续编辑。", projectExported: "已导出完整任务，包含图形、过程和半径来源。", svgExported: "已导出 SVG 图形。",
  journalTool: "选择工具：{tool}", journalPoint: "添加点 {point}", journalPick: "{tool} · 第 {stage} 次取点：{point}", journalRadius: "设定半径：{source}", journalDraw: "绘制{shape}：{points}", journalAlign: "对齐 {points}；", journalStyleFinal: "将这一段加粗", journalStyleAux: "取消这一段的加粗", journalStyleColor: "将这一段颜色改为 {color}", journalStyleReset: "恢复这一段的默认颜色", journalUndo: "撤销上一步，恢复此前图形", journalCancel: "取消当前作图，移除临时点", journalClear: "清空画布", journalSteps: "{count} 步",
  radiusFreeSource: "自由取半径 {radius} px", radiusPointsSource: "取 {points} 间的距离：{radius} px", radiusReuseSource: "沿用第 {step} 步圆弧半径：{radius} px", radiusUnknownStep: "此前", radiusSourceLabel: "半径来源：{source}", radiusFreeAnchors: "（圆心 / 起点：{points}）",
  journalObjectPick: "选择求交对象：{object}", journalParallelSource: "选择平行方向线：{object}", journalIntersection: "求交：{objects}；交点 {points}", journalObjectStep: "第 {step} 步的{shape}", journalObjectId: "{shape} {id}", journalObjectCoordinates: "{shape}（{points}）",
  journalBisector: "作 {points} 的垂直平分线；", journalPerpendicular: "过 {point} 作{object}的垂线；", journalParallel: "过 {point} 作与{object}平行的线；", journalAngleBisector: "平分角 {points}；",
});
Object.assign(translations.en, {
  projectName: "Construction name", newProject: "New", saveProject: "Save", openProjects: "Projects / export",
  constructionHistory: "Construction history", playbackPlay: "Play", playbackPause: "Pause", playbackPrevious: "Previous", playbackNext: "Next", playbackExit: "Return to drawing",
  playbackSpeed: "Speed", playbackProgress: "Playback position", closeProjects: "Close", exportProject: "Export full project (JSON)", importProject: "Import project", exportSvg: "Export drawing (SVG)", savedProjects: "Saved projects", historyEmpty: "Each construction step will appear here as you draw.",
  reuseLastArc: "Use last arc’s radius", saved: "Saved on this device", saving: "Saving…", saveFailed: "Local save failed; export this project", noSavedProjects: "No saved projects yet.", invalidProject: "Invalid or incompatible project file. Your drawing has not changed.", projectImported: "Project imported. Continue drawing or replay its history.", projectOpened: "Project opened.", projectSaved: "Drawing and full history saved.", projectNew: "New project created.", playbackStart: "Initial canvas", playbackFinished: "Playback complete. Return to drawing to continue editing.", playbackDone: "Playback complete. You can continue drawing.", playbackViewing: "Viewing step {index}. Return to drawing to continue editing.", projectExported: "Full project exported with geometry, history and radius sources.", svgExported: "SVG drawing exported.",
  journalTool: "Choose tool: {tool}", journalPoint: "Add point {point}", journalPick: "{tool} · Pick {stage}: {point}", journalRadius: "Set radius: {source}", journalDraw: "Draw {shape}: {points}", journalAlign: "Align through {points}; ", journalStyleFinal: "Emphasize this piece", journalStyleAux: "Remove this piece’s emphasis", journalStyleColor: "Set this piece’s color to {color}", journalStyleReset: "Restore this piece’s default color", journalUndo: "Undo the last action and restore the preceding drawing", journalCancel: "Cancel the current construction and remove temporary points", journalClear: "Clear the canvas", journalSteps: "{count} steps",
  radiusFreeSource: "Free radius: {radius} px", radiusPointsSource: "Distance between {points}: {radius} px", radiusReuseSource: "Reuse the arc radius from step {step}: {radius} px", radiusUnknownStep: "an earlier step", radiusSourceLabel: "Radius source: {source}", radiusFreeAnchors: " (center / start: {points})",
  journalObjectPick: "Choose intersection object: {object}", journalParallelSource: "Choose the parallel direction line: {object}", journalIntersection: "Intersect {objects}; intersection points: {points}", journalObjectStep: "{shape} from step {step}", journalObjectId: "{shape} {id}", journalObjectCoordinates: "{shape} ({points})",
  journalBisector: "Construct the perpendicular bisector of {points}; ", journalPerpendicular: "Construct a perpendicular through {point} to {object}; ", journalParallel: "Construct a line through {point} parallel to {object}; ", journalAngleBisector: "Bisect angle {points}; ",
});
translations.zh.notSaved = "新任务，尚未保存";
translations.en.notSaved = "New project, not saved yet";

class ConstructionHistory {
  constructor() {
    this.clone = (value) => JSON.parse(JSON.stringify(value));
    this.playback = { active: false, playing: false, index: 0, speed: 1 };
    this.timer = null;
    this.saveTimer = null;
    this.dirty = false;
    this.saveError = false;
    this.savedOnce = false;
    this.listSignature = "";
    this.emptyScene = this.captureScene();
    this.project = this.createProject();
    try {
      this.store = new CompassProjectStore();
      const activeId = localStorage.getItem("compasscanvas-active-project-v1");
      const saved = activeId && this.store.load(activeId);
      if (saved) this.activateProject(saved);
    } catch (_) { this.saveError = true; }
    this.node("projectName").value = this.project.title;
    this.bindControls();
  }

  node(id) { return document.querySelector(`#${id}`); }
  uid() { return `task-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`; }
  nextStepId() {
    let index = this.project.steps.length + 1;
    while (this.project.steps.some((step) => step.id === `step-${index}`)) index += 1;
    return `step-${index}`;
  }
  nextSourceId() { return `${this.nextStepId()}-radius-${++radiusSourceSequence}`; }

  createProject() {
    const now = new Date().toISOString();
    return { format: "compasscanvas-project", version: 1, id: this.uid(), title: t("untitled"), createdAt: now, updatedAt: now,
      case: null, initialScene: this.clone(this.emptyScene), scene: this.clone(this.emptyScene), steps: [], pointCatalog: [], undoHistory: [] };
  }

  captureScene() {
    const result = {};
    for (const key of ["entities", "freePoints", "pending", "lineGuide", "radius", "radiusReady", "radiusSource", "quickRadiusSource", "pendingOrigins", "lastArc", "mode", "arcMode", "operationPoints", "selectedPoint", "panX", "panY", "scale"]) result[key] = this.clone(state[key]);
    for (const key of ["intersectionSelection", "priorityIntersections"]) result[key] = this.clone(state[key] || []);
    if (state.parallelLine) result.parallelLine = this.clone(state.parallelLine);
    result.selectedEntityIndex = state.entities.indexOf(state.selectedEntity);
    return result;
  }

  restoreScene(scene) {
    const restored = this.clone({ ...this.emptyScene, ...scene });
    for (const key of Object.keys(this.emptyScene)) if (key !== "selectedEntityIndex") state[key] = restored[key];
    state.parallelLine = restored.parallelLine || null;
    state.selectedEntity = state.entities[restored.selectedEntityIndex] || null;
    state.radiusPicking = state.mode === "radius";
    state.pointer.inside = false;
    state.previewPoint = null;
    state.isPanning = false;
    state.spacePressed = false;
    radiusSliderEditing = false;
    render();
  }

  pointReference(point) {
    if (!point) return null;
    let reference = this.project.pointCatalog.find((p) => pointNear(p, point, 0.001));
    if (!reference) {
      let index = this.project.pointCatalog.length + 1;
      while (this.project.pointCatalog.some((p) => p.id === `P${index}`)) index += 1;
      reference = { id: `P${index}`, x: point.x, y: point.y };
      this.project.pointCatalog.push(reference);
    }
    return this.clone(reference);
  }

  pointText(point) {
    if (!point) return "";
    const reference = this.project.pointCatalog.find((p) => pointNear(p, point, 0.001));
    const value = (number) => Math.round(number * 10) / 10;
    return `${point.id || reference?.id || "P"} (${value(point.x)}, ${value(point.y)})`;
  }

  sourceText(source) {
    if (!source) return t("noCompassRadius");
    const radius = Math.round(source.radius * 10) / 10;
    const points = (source.points || []).map((p) => this.pointText(p)).join(" ↔ ");
    if (source.kind === "reuse") {
      const index = this.project.steps.findIndex((step) => step.id === source.fromStepId);
      const reused = t("radiusReuseSource", { step: index < 0 ? t("radiusUnknownStep") : index + 1, radius });
      return source.origin ? `${reused} · ${this.sourceText(source.origin)}` : reused;
    }
    if (source.kind === "points") return t("radiusPointsSource", { points, radius });
    return t("radiusFreeSource", { radius }) + (points ? t("radiusFreeAnchors", { points }) : "");
  }

  geometryPoints(entity) {
    return entity.type === "line" ? [entity.p1, entity.p2]
      : entity.type === "arc" ? [entity.center, entity.start, entity.end] : [entity.center];
  }

  objectText(entity) {
    const shape = t(entity.type === "line" ? "entityLine" : entity.type === "circle" ? "entityCircle" : "entityArc");
    if (entity.constructionId) {
      const index = this.project.steps.findIndex((step) => step.id === entity.constructionId);
      return index < 0 ? t("journalObjectId", { shape, id: entity.constructionId }) : t("journalObjectStep", { shape, step: index + 1 });
    }
    return t("journalObjectCoordinates", { shape, points: this.geometryPoints(entity).map((point) => this.pointText(point)).join(" → ") });
  }

  constructionText(construction) {
    if (!construction) return "";
    const points = construction.points.map((point) => this.pointText(point));
    if (construction.kind === "perpendicular") return t("journalPerpendicular", { point: points[0], object: this.objectText(construction.objects[0]) });
    if (construction.kind === "parallel") return t("journalParallel", { point: points[0], object: this.objectText(construction.objects[0]) });
    return t(construction.kind === "bisector" ? "journalBisector" : "journalAngleBisector", { points: points.join(construction.kind === "bisector" ? " ↔ " : " → ") });
  }

  describe(step) {
    const data = step.data || {};
    const tool = t(toolCopy[data.tool]?.titleKey || "tool.select.title");
    if (step.kind === "tool") return t("journalTool", { tool });
    if (step.kind === "point") return t("journalPoint", { point: this.pointText(data.point) });
    if (step.kind === "pick") {
      const pick = t("journalPick", { tool, stage: data.stage, point: this.pointText(data.point) });
      return data.radiusSource ? `${pick} · ${this.sourceText(data.radiusSource)}` : pick;
    }
    if (step.kind === "radius") return t("journalRadius", { source: this.sourceText(data.radiusSource) });
    if (step.kind === "objectPick") return t(data.tool === "parallel" ? "journalParallelSource" : "journalObjectPick", { object: this.objectText(data.geometry) });
    if (step.kind === "intersection") return t("journalIntersection", { objects: data.objects.map((entity) => this.objectText(entity)).join(" ∩ "), points: data.points.map((point) => this.pointText(point)).join("; ") });
    if (step.kind === "draw") {
      const entity = data.geometry;
      const points = (entity.type === "line" ? [entity.p1, entity.p2] : entity.type === "arc" ? [entity.center, entity.start, entity.end] : [entity.center]).map((p) => this.pointText(p)).join(" → ");
      const aligned = data.alignment?.length ? t("journalAlign", { points: data.alignment.map((p) => this.pointText(p)).join(" ↔ ") }) : "";
      return this.constructionText(data.construction) + aligned + t("journalDraw", { shape: t(entity.type === "line" ? "entityLine" : entity.type === "circle" ? "entityCircle" : "entityArc"), points }) + (entity.radiusSource ? ` · ${this.sourceText(entity.radiusSource)}` : "");
    }
    if (step.kind === "style") return data.property === "final" ? t(data.value ? "journalStyleFinal" : "journalStyleAux") : data.value ? t("journalStyleColor", { color: data.value }) : t("journalStyleReset");
    return t({ undo: "journalUndo", cancel: "journalCancel", clear: "journalClear" }[step.kind] || "constructionHistory");
  }

  record(kind, data) {
    if (this.playback.active) return;
    const recorded = this.clone(data);
    if (recorded.point) recorded.point = this.pointReference(recorded.point);
    if (recorded.alignment) recorded.alignment = recorded.alignment.map((p) => this.pointReference(p));
    if (recorded.points) recorded.points = recorded.points.map((point) => this.pointReference(point));
    if (recorded.construction) recorded.construction.points = recorded.construction.points.map((point) => this.pointReference(point));
    const geometry = recorded.geometry;
    if (geometry) for (const key of ["p1", "p2", "center", "start", "end"]) if (geometry[key]) this.pointReference(geometry[key]);
    for (const object of [...(recorded.objects || []), ...(recorded.construction?.objects || [])]) this.geometryPoints(object).forEach((point) => this.pointReference(point));
    this.project.scene = this.captureScene();
    this.project.steps.push({ id: this.nextStepId(), kind, data: recorded, scene: this.clone(this.project.scene) });
    this.dirty = true;
    this.scheduleSave();
    this.refresh();
  }

  scheduleSave() {
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.saveProject(false), 350);
  }

  viewChanged() {
    if (this.playback.active) return;
    this.project.scene = this.captureScene();
    this.dirty = true;
    this.scheduleSave();
  }

  exportProjectData() {
    if (!this.playback.active) this.project.scene = this.captureScene();
    this.project.title = this.node("projectName").value.trim().slice(0, 100) || t("untitled");
    this.project.updatedAt = new Date().toISOString();
    this.project.undoHistory = this.clone(this.playback.active ? this.playback.savedHistory : state.history);
    return this.clone(this.project);
  }

  saveProject(announce = true) {
    clearTimeout(this.saveTimer);
    try {
      if (!this.store) this.store = new CompassProjectStore();
      this.project = this.store.save(this.exportProjectData());
      localStorage.setItem("compasscanvas-active-project-v1", this.project.id);
      this.dirty = false;
      this.saveError = false;
      this.savedOnce = true;
      if (announce) setStatus("projectSaved");
      this.refresh();
      return true;
    } catch (_) {
      this.saveError = true;
      if (announce) setStatus("saveFailed");
      this.refresh();
      return false;
    }
  }

  activateProject(project) {
    clearTimeout(this.saveTimer);
    this.project = this.clone(project);
    this.project.pointCatalog ||= [];
    this.project.case ||= null;
    this.project.initialScene ||= this.clone(this.emptyScene);
    this.project.undoHistory ||= [];
    this.dirty = false;
    this.savedOnce = true;
    this.listSignature = "";
    this.node("projectName").value = this.project.title;
    state.classicCase = this.project.case ? this.clone(this.project.case) : null;
    this.restoreScene(this.project.scene);
    updateClassicCaseBanner();
    state.history = this.clone(this.project.undoHistory);
  }

  newProject() {
    this.exitPlayback();
    if (!this.saveProject(false)) return false;
    this.activateProject(this.createProject());
    this.saveProject(false);
    setStatus("projectNew");
    return true;
  }

  openProject(id) {
    if (id === this.project.id) {
      this.exitPlayback();
      this.saveProject(false);
      this.node("projectsDialog").close();
      return true;
    }
    try {
      const project = this.store.load(id);
      if (!project) return false;
      this.exitPlayback();
      if (!this.saveProject(false)) return false;
      this.activateProject(project);
      localStorage.setItem("compasscanvas-active-project-v1", this.project.id);
      this.node("projectsDialog").close();
      this.refresh();
      setStatus("projectOpened");
      return true;
    } catch (_) { setStatus("saveFailed"); return false; }
  }

  importProjectJSON(text) {
    let project;
    try { project = CompassProjectStore.importJSON(text); }
    catch (_) { setStatus("invalidProject"); return false; }
    this.exitPlayback();
    if (!this.saveProject(false)) return false;
    project.id = this.uid();
    try { this.store.save(project); }
    catch (_) { setStatus("saveFailed"); return false; }
    this.activateProject(project);
    this.saveProject(false);
    this.node("projectsDialog").close();
    setStatus("projectImported");
    return true;
  }

  refresh() {
    const n = this.project.steps.length;
    const playback = this.playback;
    this.node("historyCount").textContent = t("journalSteps", { count: n });
    this.node("projectSaveState").textContent = t(this.saveError ? "saveFailed" : this.dirty ? "saving" : this.savedOnce ? "saved" : "notSaved");
    this.node("projectSaveState").dataset.state = this.saveError ? "error" : this.dirty ? "saving" : "saved";
    this.node("playbackPlay").textContent = t(playback.playing ? "playbackPause" : "playbackPlay");
    this.node("playbackPlay").disabled = n === 0;
    this.node("playbackPrev").disabled = n === 0 || (playback.active && playback.index === 0);
    this.node("playbackNext").disabled = n === 0 || (playback.active && playback.index === n);
    this.node("playbackExit").disabled = !playback.active;
    this.node("playbackProgress").max = n;
    this.node("playbackProgress").value = playback.active ? playback.index : n;
    this.node("playbackProgress").disabled = n === 0;
    this.node("playbackPosition").textContent = `${playback.active ? playback.index : n} / ${n}`;
    const step = this.project.steps[(playback.active ? playback.index : n) - 1];
    this.node("playbackDescription").textContent = step ? this.describe(step) : t(n ? "playbackStart" : "historyEmpty");
    let source = state.quickRadiusSource || state.selectedEntity?.radiusSource || state.radiusSource;
    if (state.mode === "compass" && !state.selectedEntity && source?.kind !== "reuse") {
      const previous = this.project.steps.findLast((entry) => entry.kind === "draw" && entry.data.geometry?.radiusSource?.sourceId === source?.sourceId);
      if (previous) source = { kind: "reuse", radius: state.radius, sourceId: source.sourceId, fromStepId: previous.id, origin: source };
    }
    this.node("radiusSourceReadout").textContent = state.mode === "circleQuick" && state.pending.length
      ? t("circleRadiusSourceHint") : t("radiusSourceLabel", { source: this.sourceText(source) });
    for (const selector of ["[data-mode]"]) document.querySelectorAll(selector).forEach((node) => { if (node.tagName === "BUTTON") node.disabled = playback.active; });
    for (const id of ["projectName", "radiusInput", "radiusSlider", "applyRadius", "reuseRadiusBtn"]) this.node(id).disabled = playback.active;
    this.node("reuseLastArcBtn").disabled = playback.active || !state.lastArc;
    this.node("arcModeToggle").disabled = playback.active || usesOwnRadius();
    this.node("undoBtn").disabled = playback.active || !state.history.length;
    this.node("clearBtn").disabled = playback.active;
    this.node("finalizeBtn").disabled = playback.active || !state.selectedEntity;
    this.node("segmentColor").disabled = playback.active || !state.selectedEntity;
    this.node("resetSegmentColor").disabled = playback.active || !state.selectedEntity?.color;
    const signature = `${this.project.id}:${n}:${state.language}`;
    if (signature !== this.listSignature) {
      const list = this.node("constructionLog");
      list.replaceChildren();
      this.project.steps.forEach((entry, index) => {
        const item = document.createElement("li");
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = `${index + 1}. ${this.describe(entry)}`;
        button.addEventListener("click", () => this.showStep(index + 1));
        item.appendChild(button);
        list.appendChild(item);
      });
      this.listSignature = signature;
      if (!playback.active) list.scrollTop = list.scrollHeight;
    }
    Array.from(this.node("constructionLog").children).forEach((item, index) => {
      const button = item.firstElementChild;
      if (button) button.setAttribute("aria-current", playback.active && index + 1 === playback.index ? "step" : "false");
    });
  }

  enterPlayback() {
    if (this.playback.active) return;
    this.project.scene = this.captureScene();
    this.playback.savedHistory = this.clone(state.history);
    this.playback.savedStatus = this.clone(state.status);
    this.playback.active = true;
  }

  showStep(index, running = false) {
    if (!running) this.pausePlayback();
    this.enterPlayback();
    this.playback.index = Math.max(0, Math.min(this.project.steps.length, Number(index) || 0));
    const entry = this.project.steps[this.playback.index - 1];
    this.restoreScene(entry?.scene || this.project.initialScene);
    setStatus(this.playback.index === this.project.steps.length ? "playbackFinished" : "playbackViewing", { index: this.playback.index });
    this.refresh();
  }

  startPlayback() {
    if (!this.project.steps.length) return;
    if (!this.playback.active || this.playback.index === this.project.steps.length) this.showStep(0);
    this.playback.playing = true;
    this.scheduleFrame();
    this.refresh();
  }

  scheduleFrame() {
    clearTimeout(this.timer);
    if (!this.playback.playing) return;
    this.timer = setTimeout(() => {
      this.showStep(this.playback.index + 1, true);
      if (this.playback.index >= this.project.steps.length) { this.exitPlayback(); setStatus("playbackDone"); }
      else this.scheduleFrame();
    }, 1000 / this.playback.speed);
  }

  pausePlayback() {
    clearTimeout(this.timer);
    this.playback.playing = false;
    this.refresh();
  }

  exitPlayback() {
    if (!this.playback.active) return;
    this.pausePlayback();
    this.playback.active = false;
    state.history = this.clone(this.playback.savedHistory);
    this.restoreScene(this.project.scene);
    state.status = this.clone(this.playback.savedStatus);
    updateStatus();
    this.refresh();
  }

  drawAnnotation(step) {
    if (!step) return;
    const data = step.data;
    const source = data.radiusSource || data.geometry?.radiusSource;
    const origin = source?.kind === "reuse" ? source.origin : source;
    const objects = [...(data.objects || []), ...(data.construction?.objects || []), ...(step.kind === "objectPick" ? [data.geometry] : [])];
    const sourcePoints = [
      ...(origin?.points || []), ...(data.alignment || []), ...(data.point ? [data.point] : []),
      ...(data.points || []), ...(data.construction?.points || []), ...objects.flatMap((object) => this.geometryPoints(object)),
    ];
    const pointKeys = new Set();
    const points = sourcePoints.filter((point) => {
      const key = makePointKey(point);
      if (pointKeys.has(key)) return false;
      pointKeys.add(key);
      return true;
    });
    const group = el("g", { "pointer-events": "none", class: "playback-annotation" });
    const line = (a, b) => group.appendChild(el("line", { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: "#39749c", "stroke-width": 2, "stroke-dasharray": "6 4" }));
    if (data.construction?.kind === "angleBisector") {
      line(data.construction.points[0], data.construction.points[1]);
      line(data.construction.points[1], data.construction.points[2]);
    } else if (data.construction?.kind === "bisector") line(...data.construction.points);
    else {
      const pairedPoints = origin?.points?.length ? origin.points : data.alignment || [];
      if (pairedPoints.length >= 2) line(pairedPoints[0], pairedPoints[1]);
    }
    for (const object of objects) {
      const style = { fill: "none", stroke: "#39749c", "stroke-width": 2, "stroke-dasharray": "6 4", class: "playback-source-object" };
      if (object.type === "line") group.appendChild(el("line", { ...style, x1: object.p1.x, y1: object.p1.y, x2: object.p2.x, y2: object.p2.y }));
      else if (object.type === "circle") group.appendChild(el("circle", { ...style, cx: object.center.x, cy: object.center.y, r: object.radius }));
      else group.appendChild(el("path", { ...style, d: arcPath(object) }));
    }
    for (const point of points) {
      group.appendChild(el("circle", { cx: point.x, cy: point.y, r: 5, fill: "#e5f3ff", stroke: "#39749c", "stroke-width": 1.5 }));
      group.appendChild(el("text", { x: point.x + 9, y: point.y - 9, fill: "#245779", "font-size": 13 }, this.pointText(point)));
    }
    referenceLayer.appendChild(group);
  }

  showProjects() {
    if (this.dirty) this.saveProject(false);
    const list = this.node("savedProjectsList");
    list.replaceChildren();
    try {
      const projects = this.store.list();
      if (!projects.length) { const empty = document.createElement("li"); empty.textContent = t("noSavedProjects"); list.appendChild(empty); }
      for (const project of projects) {
        const item = document.createElement("li");
        const button = document.createElement("button");
        const title = document.createElement("strong");
        const detail = document.createElement("small");
        title.textContent = project.title;
        detail.textContent = `${t("journalSteps", { count: project.stepCount })} · ${new Date(project.updatedAt).toLocaleString(state.language === "zh" ? "zh-CN" : "en")}`;
        button.appendChild(title); button.appendChild(detail);
        button.addEventListener("click", () => this.openProject(project.id));
        item.appendChild(button); list.appendChild(item);
      }
    } catch (_) { const error = document.createElement("li"); error.textContent = t("saveFailed"); list.appendChild(error); }
    this.node("projectsDialog").showModal();
  }

  download(content, type, extension) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${this.project.title.replace(/[\\/:*?"<>|]/g, "_") || "CompassCanvas"}.${extension}`;
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  exportSVG() {
    const scene = this.exportProjectData().scene;
    const entities = scene.entities;
    const points = [...scene.freePoints];
    for (const entity of entities) {
      if (entity.type === "line") points.push(entity.p1, entity.p2);
      else points.push({ x: entity.center.x - entity.radius, y: entity.center.y - entity.radius }, { x: entity.center.x + entity.radius, y: entity.center.y + entity.radius });
    }
    const xs = points.map((p) => p.x), ys = points.map((p) => p.y);
    const x = points.length ? Math.min(...xs) - 30 : 0, y = points.length ? Math.min(...ys) - 30 : 0;
    const width = points.length ? Math.max(60, Math.max(...xs) - x + 30) : WIDTH;
    const height = points.length ? Math.max(60, Math.max(...ys) - y + 30) : HEIGHT;
    const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[char]));
    const shapes = entities.map((entity) => {
      const style = `fill="none" stroke="${escape(entity.color || defaultGeometryColor(entity))}" stroke-width="${entity.final ? 3.6 : 1.35}" opacity="${entity.final ? 1 : 0.62}" stroke-linecap="round"`;
      if (entity.type === "line") return `<line x1="${entity.p1.x}" y1="${entity.p1.y}" x2="${entity.p2.x}" y2="${entity.p2.y}" ${style}/>`;
      if (entity.type === "circle") return `<circle cx="${entity.center.x}" cy="${entity.center.y}" r="${entity.radius}" ${style}/>`;
      return `<path d="${arcPath(entity)}" ${style}/>`;
    });
    const visible = uniquePoints([...scene.freePoints, ...entities.filter((e) => e.type === "arc").map((e) => e.center)])
      .filter((point) => !entities.some((entity) => pointOnEntity(point, entity, 6 / scene.scale)) && !entities.some((entity) => entity.type === "circle" && pointNear(entity.center, point)));
    shapes.push(...visible.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="3" fill="#aa6b1f"/>`));
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${width} ${height}" width="1200" height="${Math.round(1200 * height / width)}"><title>${escape(this.project.title)}</title><rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#fffdf7"/>${shapes.join("")}</svg>`;
  }

  bindControls() {
    this.node("projectName").addEventListener("input", () => { if (!this.playback.active) { this.dirty = true; this.scheduleSave(); this.refresh(); } });
    this.node("newProjectBtn").addEventListener("click", () => this.newProject());
    this.node("saveProjectBtn").addEventListener("click", () => this.saveProject());
    this.node("openProjectsBtn").addEventListener("click", () => this.showProjects());
    this.node("closeProjectsBtn").addEventListener("click", () => this.node("projectsDialog").close());
    this.node("playbackPlay").addEventListener("click", () => this.playback.playing ? this.pausePlayback() : this.startPlayback());
    this.node("playbackPrev").addEventListener("click", () => this.showStep((this.playback.active ? this.playback.index : this.project.steps.length) - 1));
    this.node("playbackNext").addEventListener("click", () => this.showStep(this.playback.active ? this.playback.index + 1 : 1));
    this.node("playbackExit").addEventListener("click", () => this.exitPlayback());
    this.node("playbackProgress").addEventListener("input", () => this.showStep(this.node("playbackProgress").value));
    this.node("playbackSpeed").addEventListener("change", () => { this.playback.speed = Math.max(0.25, Math.min(4, Number(this.node("playbackSpeed").value) || 1)); this.scheduleFrame(); });
    this.node("reuseLastArcBtn").addEventListener("click", () => {
      if (editingBlocked() || !state.lastArc) return;
      pushHistory();
      const last = this.clone(state.lastArc);
      state.radius = last.radius;
      state.radiusReady = true;
      const origin = last.source.kind === "reuse" ? last.source.origin : last.source;
      state.radiusSource = { kind: "reuse", radius: last.radius, sourceId: last.source.sourceId, fromStepId: last.stepId, origin };
      state.arcMode = "arc";
      setMode("compass", false);
      recordConstruction("radius", { radiusSource: state.radiusSource });
    });
    this.node("exportProjectBtn").addEventListener("click", () => {
      try { this.download(CompassProjectStore.exportJSON(this.exportProjectData()), "application/json", "compasscanvas.json"); setStatus("projectExported"); }
      catch (_) { setStatus("saveFailed"); }
    });
    this.node("exportSvgBtn").addEventListener("click", () => { this.download(this.exportSVG(), "image/svg+xml", "svg"); setStatus("svgExported"); });
    this.node("importProjectBtn").addEventListener("click", () => this.node("importProjectFile").click());
    this.node("importProjectFile").addEventListener("change", async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      if (file.size > 15 * 1024 * 1024) setStatus("invalidProject");
      else { try { this.importProjectJSON(await file.text()); } catch (_) { setStatus("invalidProject"); } }
      event.target.value = "";
    });
    window.addEventListener("beforeunload", () => { if (this.dirty) this.saveProject(false); });
  }
}

constructionHistory = new ConstructionHistory();
applyLanguage();
constructionHistory.refresh();
