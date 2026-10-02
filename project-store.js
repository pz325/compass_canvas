/* Named local constructions and portable, validated project files. */
(function (global) {
  "use strict";

  const STORAGE_KEY = "compasscanvas-projects-v1";
  const PROJECT_FORMAT = "compasscanvas-project";
  const LIBRARY_FORMAT = "compasscanvas-library";
  const MAX_BYTES = 15 * 1024 * 1024;
  const MAX_ITEMS = 10000;
  const MODES = new Set(["select", "bold", "line", "lineQuick", "radius", "compass", "arcThreePoint", "circleQuick", "bisector", "perpendicular", "parallel", "angleBisector", "intersections"]);
  const STEP_KINDS = new Set(["tool", "point", "pick", "radius", "draw", "style", "undo", "cancel", "clear", "objectPick", "intersection"]);
  const UNSAFE_KEYS = new Set(["__proto__", "prototype", "constructor"]);
  const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

  class InvalidProjectError extends Error {
    constructor(message) {
      super(message);
      this.name = "InvalidProjectError";
      this.code = "InvalidProjectError";
    }
  }

  class StorageError extends Error {
    constructor(message, cause) {
      super(message);
      this.name = "StorageError";
      this.code = "StorageError";
      if (cause) this.cause = cause;
    }
  }

  function invalid(message) {
    throw new InvalidProjectError(message);
  }

  function isObject(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const prototype = Object.getPrototypeOf(value);
    // Accept plain objects from another window/realm as well as null-prototype objects.
    return prototype === null || (Object.getPrototypeOf(prototype) === null && prototype.constructor?.name === "Object");
  }

  function limitedText(text, label) {
    if (typeof text !== "string") invalid(`${label} must be text.`);
    if (text.length > MAX_BYTES) invalid(`${label} exceeds the 15 MB limit.`);
    let bytes = 0;
    for (let i = 0; i < text.length; i += 1) {
      const code = text.charCodeAt(i);
      if (code < 0x80) bytes += 1;
      else if (code < 0x800) bytes += 2;
      else if (code >= 0xd800 && code <= 0xdbff && i + 1 < text.length && text.charCodeAt(i + 1) >= 0xdc00 && text.charCodeAt(i + 1) <= 0xdfff) {
        bytes += 4;
        i += 1;
      } else bytes += 3;
      if (bytes > MAX_BYTES) invalid(`${label} exceeds the 15 MB limit.`);
    }
    return text;
  }

  function safeClone(value) {
    const active = new Set();
    let nodes = 0;
    let characters = 0;
    function clone(item, depth) {
      if (++nodes > 1000000 || depth > 32) invalid("Project data is too large or deeply nested.");
      if (item === null || typeof item === "boolean") return item;
      if (typeof item === "number") {
        if (!Number.isFinite(item)) invalid("Project numbers must be finite.");
        return item;
      }
      if (typeof item === "string") {
        characters += item.length;
        if (item.length > 100000 || characters > MAX_BYTES) invalid("Project text is too large.");
        return item;
      }
      if (typeof item !== "object" || (!Array.isArray(item) && !isObject(item))) invalid("Project data must contain only plain JSON values.");
      if (active.has(item)) invalid("Project data cannot contain circular references.");
      if (Object.getOwnPropertySymbols(item).length) invalid("Project data cannot contain symbol properties.");
      active.add(item);
      let result;
      if (Array.isArray(item)) {
        if (item.length > MAX_ITEMS) invalid("A project list exceeds the 10,000 item limit.");
        result = [];
        for (let i = 0; i < item.length; i += 1) {
          const descriptor = Object.getOwnPropertyDescriptor(item, String(i));
          if (!descriptor || !own(descriptor, "value")) invalid("Project lists must contain ordinary JSON values.");
          result.push(clone(descriptor.value, depth + 1));
        }
      } else {
        const keys = Object.keys(item);
        if (keys.length > MAX_ITEMS) invalid("A project object has too many properties.");
        result = {};
        for (const key of keys) {
          if (UNSAFE_KEYS.has(key)) invalid("Project contains an unsafe property name.");
          characters += key.length;
          if (key.length > 1000 || characters > MAX_BYTES) invalid("Project property names are too large.");
          const descriptor = Object.getOwnPropertyDescriptor(item, key);
          if (!descriptor || !own(descriptor, "value")) invalid("Project properties must contain ordinary JSON values.");
          result[key] = clone(descriptor.value, depth + 1);
        }
      }
      active.delete(item);
      return result;
    }
    return clone(value, 0);
  }

  function object(value, label) {
    if (!isObject(value)) invalid(`${label} must be an object.`);
  }

  function text(value, label, maxLength = 200) {
    if (typeof value !== "string" || !value.trim() || value.length > maxLength) invalid(`${label} must be nonempty text of at most ${maxLength} characters.`);
  }

  function finite(value, label) {
    if (typeof value !== "number" || !Number.isFinite(value)) invalid(`${label} must be a finite number.`);
  }

  function positive(value, label) {
    finite(value, label);
    if (value <= 0) invalid(`${label} must be greater than zero.`);
  }

  function point(value, label) {
    object(value, label);
    finite(value.x, `${label}.x`);
    finite(value.y, `${label}.y`);
    if (own(value, "id")) text(value.id, `${label}.id`, 160);
  }

  function array(value, label, limit = MAX_ITEMS) {
    if (!Array.isArray(value) || value.length > limit) invalid(`${label} must be a list of at most ${limit} items.`);
  }

  function boolean(value, label) {
    if (typeof value !== "boolean") invalid(`${label} must be true or false.`);
  }

  function sameRadius(actual, expected, label) {
    finite(actual, `${label} radius`);
    finite(expected, `${label} measured radius`);
    // Point references merge within 0.001 world units, so two referenced
    // endpoints can differ slightly from the original measured positions.
    if (Math.abs(actual - expected) > 0.002 + 1e-6 * Math.max(1, actual, expected)) invalid(`${label} does not match its recorded radius.`);
  }

  function radiusSource(value, label, allowReuse = true) {
    object(value, label);
    if (value.kind !== "free" && value.kind !== "points" && !(allowReuse && value.kind === "reuse")) invalid(`${label} has an unsupported radius source.`);
    positive(value.radius, `${label}.radius`);
    text(value.sourceId, `${label}.sourceId`, 160);
    if (own(value, "points")) {
      array(value.points, `${label}.points`);
      value.points.forEach((item, index) => point(item, `${label}.points[${index}]`));
    }
    if (value.kind === "points") {
      if (!Array.isArray(value.points) || value.points.length !== 2) invalid(`${label} must contain exactly two radius points.`);
      const measured = Math.hypot(value.points[1].x - value.points[0].x, value.points[1].y - value.points[0].y);
      sameRadius(value.radius, measured, label);
    }
    if (value.kind === "reuse") {
      text(value.fromStepId, `${label}.fromStepId`, 160);
      radiusSource(value.origin, `${label}.origin`, false);
      sameRadius(value.radius, value.origin.radius, label);
    }
  }

  function entity(value, label) {
    object(value, label);
    if (!["line", "arc", "circle"].includes(value.type)) invalid(`${label} has an unsupported geometry type.`);
    if (own(value, "final")) boolean(value.final, `${label}.final`);
    if (own(value, "color") && (typeof value.color !== "string" || !/^#[0-9a-f]{6}$/i.test(value.color))) invalid(`${label} has an invalid color.`);
    if (own(value, "colorFamily") && !["line", "arc", "circle"].includes(value.colorFamily)) invalid(`${label} has an invalid color family.`);
    if (own(value, "constructionId")) text(value.constructionId, `${label}.constructionId`, 160);
    if (own(value, "radiusSource")) radiusSource(value.radiusSource, `${label}.radiusSource`);
    if (value.type === "line") {
      point(value.p1, `${label}.p1`);
      point(value.p2, `${label}.p2`);
      if (value.p1.x === value.p2.x && value.p1.y === value.p2.y) invalid(`${label} must have distinct endpoints.`);
      return;
    }
    point(value.center, `${label}.center`);
    positive(value.radius, `${label}.radius`);
    if (own(value, "radiusSource")) sameRadius(value.radius, value.radiusSource.radius, label);
    if (value.type === "arc") {
      point(value.start, `${label}.start`);
      point(value.end, `${label}.end`);
      finite(value.a0, `${label}.a0`);
      finite(value.a1, `${label}.a1`);
      if (value.sweep !== 0 && value.sweep !== 1) invalid(`${label}.sweep must be 0 or 1.`);
      for (const [endpoint, angle] of [[value.start, value.a0], [value.end, value.a1]]) {
        const expectedX = value.center.x + value.radius * Math.cos(angle);
        const expectedY = value.center.y + value.radius * Math.sin(angle);
        if (Math.hypot(endpoint.x - expectedX, endpoint.y - expectedY) > 1e-5 * Math.max(1, value.radius)) invalid(`${label} has endpoints inconsistent with its circle.`);
      }
    }
  }

  function uniquePointList(value, label, limit = 2) {
    array(value, label, limit);
    value.forEach((item, index) => {
      point(item, `${label}[${index}]`);
      for (let previous = 0; previous < index; previous += 1) {
        if (Math.hypot(item.x - value[previous].x, item.y - value[previous].y) <= 1e-6) invalid(`${label} must contain distinct points.`);
      }
    });
  }

  function construction(value, label) {
    object(value, label);
    const pointCounts = { bisector: 2, perpendicular: 1, parallel: 1, angleBisector: 3 };
    if (!own(pointCounts, value.kind)) invalid(`${label} has an unsupported construction kind.`);
    array(value.points, `${label}.points`, 3);
    if (value.points.length !== pointCounts[value.kind]) invalid(`${label} has the wrong number of source points.`);
    value.points.forEach((item, index) => point(item, `${label}.points[${index}]`));
    array(value.objects, `${label}.objects`, 1);
    if (value.objects.length !== (["perpendicular", "parallel"].includes(value.kind) ? 1 : 0)) invalid(`${label} has the wrong number of source objects.`);
    value.objects.forEach((item, index) => {
      entity(item, `${label}.objects[${index}]`);
      if (item.type !== "line") invalid(`${label} requires a line as its source object.`);
    });
  }

  function snapshot(value, label) {
    object(value, label);
    array(value.entities, `${label}.entities`);
    value.entities.forEach((item, index) => entity(item, `${label}.entities[${index}]`));
    array(value.freePoints, `${label}.freePoints`);
    value.freePoints.forEach((item, index) => point(item, `${label}.freePoints[${index}]`));
    positive(value.radius, `${label}.radius`);
    // Optional transient fields receive safe defaults for early project files.
    const defaults = {
      pending: [], lineGuide: null, radiusReady: false, radiusSource: null,
      lastArc: null, mode: "select", arcMode: "arc", operationPoints: [],
      selectedPoint: null, selectedEntityIndex: null, panX: 0, panY: 0, scale: 1,
      intersectionSelection: [], priorityIntersections: [],
    };
    for (const [key, fallback] of Object.entries(defaults)) if (!own(value, key)) value[key] = fallback;
    for (const key of ["pending", "operationPoints"]) {
      array(value[key], `${label}.${key}`);
      value[key].forEach((item, index) => point(item, `${label}.${key}[${index}]`));
    }
    array(value.intersectionSelection, `${label}.intersectionSelection`, 1);
    value.intersectionSelection.forEach((item, index) => entity(item, `${label}.intersectionSelection[${index}]`));
    uniquePointList(value.priorityIntersections, `${label}.priorityIntersections`);
    boolean(value.radiusReady, `${label}.radiusReady`);
    if (!MODES.has(value.mode)) invalid(`${label}.mode is unsupported.`);
    if (value.arcMode !== "arc" && value.arcMode !== "circle") invalid(`${label}.arcMode is unsupported.`);
    finite(value.panX, `${label}.panX`);
    finite(value.panY, `${label}.panY`);
    positive(value.scale, `${label}.scale`);
    if (value.selectedPoint !== null) point(value.selectedPoint, `${label}.selectedPoint`);
    if (value.selectedEntityIndex !== null && (!Number.isInteger(value.selectedEntityIndex) || value.selectedEntityIndex < -1 || value.selectedEntityIndex >= value.entities.length)) invalid(`${label}.selectedEntityIndex is outside the entity list.`);
    if (value.lineGuide !== null) {
      object(value.lineGuide, `${label}.lineGuide`);
      point(value.lineGuide.p1, `${label}.lineGuide.p1`);
      point(value.lineGuide.p2, `${label}.lineGuide.p2`);
      point(value.lineGuide.unit, `${label}.lineGuide.unit`);
      if (Math.abs(Math.hypot(value.lineGuide.unit.x, value.lineGuide.unit.y) - 1) > 1e-5) invalid(`${label}.lineGuide must have a unit direction.`);
    }
    if (own(value, "parallelLine") && value.parallelLine !== null) entity(value.parallelLine, `${label}.parallelLine`);
    for (const key of ["radiusSource", "quickRadiusSource"]) {
      if (own(value, key) && value[key] !== null) radiusSource(value[key], `${label}.${key}`);
    }
    if (value.radiusSource !== null) sameRadius(value.radius, value.radiusSource.radius, `${label}.radiusSource`);
    if (value.lastArc !== null) {
      object(value.lastArc, `${label}.lastArc`);
      text(value.lastArc.stepId, `${label}.lastArc.stepId`, 160);
      positive(value.lastArc.radius, `${label}.lastArc.radius`);
      radiusSource(value.lastArc.source, `${label}.lastArc.source`);
      sameRadius(value.lastArc.radius, value.lastArc.source.radius, `${label}.lastArc`);
    }
    if (own(value, "pendingOrigins")) {
      array(value.pendingOrigins, `${label}.pendingOrigins`);
      value.pendingOrigins.forEach((item) => boolean(item, `${label}.pendingOrigins item`));
    }
    if (own(value, "history")) {
      array(value.history, `${label}.history`);
      value.history.forEach((item, index) => snapshot(item, `${label}.history[${index}]`));
    }
  }

  function stepData(kind, data, label) {
    if (!STEP_KINDS.has(kind)) invalid(`${label} has an unsupported construction step.`);
    object(data, `${label}.data`);
    if (own(data, "tool") && !MODES.has(data.tool)) invalid(`${label}.tool is unsupported.`);
    if (["tool", "pick", "draw", "objectPick", "intersection"].includes(kind) && !MODES.has(data.tool)) invalid(`${label} must name a supported tool.`);
    if (kind === "point" || kind === "pick" || own(data, "point")) point(data.point, `${label}.point`);
    if ((kind === "pick" || own(data, "stage")) && (!Number.isInteger(data.stage) || data.stage <= 0)) invalid(`${label}.stage must be a positive integer.`);
    if (own(data, "radiusSource") && data.radiusSource !== null) radiusSource(data.radiusSource, `${label}.radiusSource`);
    if (kind === "radius") radiusSource(data.radiusSource, `${label}.radiusSource`);
    if (kind === "draw" || kind === "style" || kind === "objectPick" || own(data, "geometry")) entity(data.geometry, `${label}.geometry`);
    if (kind === "draw" || own(data, "alignment")) {
      array(data.alignment, `${label}.alignment`);
      data.alignment.forEach((item, index) => point(item, `${label}.alignment[${index}]`));
    }
    if (kind === "style") {
      if (data.property === "final") boolean(data.value, `${label}.value`);
      else if (data.property === "color") {
        if (data.value !== null && (typeof data.value !== "string" || !/^#[0-9a-f]{6}$/i.test(data.value))) invalid(`${label}.value must be a color or null.`);
      } else invalid(`${label} has an unsupported style property.`);
    }
    if (own(data, "construction") && data.construction !== null) {
      construction(data.construction, `${label}.construction`);
      if (kind === "draw" && data.geometry.type !== "line") invalid(`${label} construction must produce a line.`);
    }
    if (kind === "objectPick" || kind === "intersection") {
      if (!["intersections", "parallel"].includes(data.tool)) invalid(`${label} must use the intersections or parallel tool.`);
    }
    if (kind === "intersection" || own(data, "objects")) {
      array(data.objects, `${label}.objects`, 2);
      data.objects.forEach((item, index) => entity(item, `${label}.objects[${index}]`));
      if (kind === "intersection" && data.objects.length !== 2) invalid(`${label} must contain two intersection objects.`);
    }
    if (kind === "intersection" || own(data, "points")) {
      uniquePointList(data.points, `${label}.points`);
      if (kind === "intersection" && !data.points.length) invalid(`${label} must contain at least one intersection point.`);
    }
    if (kind === "undo" && own(data, "before")) snapshot(data.before, `${label}.before`);
  }

  function validateProject(project) {
    object(project, "Project");
    if (project.format !== PROJECT_FORMAT || project.version !== 1) invalid("Unsupported project format or version.");
    text(project.id, "Project id", 160);
    text(project.title, "Project title", 200);
    if (own(project, "case") && project.case !== null) {
      object(project.case, "Project case");
      text(project.case.id, "Project case id", 160);
      for (const key of ["titleEn", "titleZh", "descriptionEn", "descriptionZh", "sourceUrl", "source"]) {
        if (own(project.case, key) && typeof project.case[key] !== "string") invalid(`Project case ${key} must be text.`);
      }
    }
    for (const key of ["createdAt", "updatedAt"]) {
      text(project[key], `Project ${key}`, 64);
      if (!Number.isFinite(Date.parse(project[key]))) invalid(`Project ${key} is not a valid timestamp.`);
    }
    snapshot(project.scene, "Project scene");
    if (own(project, "initialScene")) snapshot(project.initialScene, "Initial project scene");
    if (own(project, "undoHistory")) {
      array(project.undoHistory, "Project undo history", 30);
      project.undoHistory.forEach((item, index) => snapshot(item, `Project undo history[${index}]`));
    }
    array(project.steps, "Project steps");
    const stepIds = new Set();
    project.steps.forEach((step, index) => {
      const label = `Step ${index + 1}`;
      object(step, label);
      text(step.id, `${label} id`, 160);
      if (stepIds.has(step.id)) invalid("Project step ids must be unique.");
      stepIds.add(step.id);
      text(step.kind, `${label} kind`, 100);
      if (!own(step, "data")) invalid(`${label} is missing its construction data.`);
      stepData(step.kind, step.data, label);
      snapshot(step.scene, `${label} scene`);
    });
    array(project.pointCatalog, "Project point catalog");
    const pointIds = new Set();
    project.pointCatalog.forEach((item) => {
      point(item, "Catalog point");
      text(item.id, "Catalog point id", 160);
      if (pointIds.has(item.id)) invalid("Catalog point ids must be unique.");
      pointIds.add(item.id);
    });
    return project;
  }

  function sanitizeProject(project) {
    const result = validateProject(safeClone(project));
    limitedText(JSON.stringify(result), "Project");
    return result;
  }

  function parseProject(textValue) {
    limitedText(textValue, "Project file");
    let parsed;
    try { parsed = JSON.parse(textValue); } catch (_) { invalid("Project file is not valid JSON."); }
    return sanitizeProject(parsed);
  }

  class CompassProjectStore {
    static importJSON(textValue) {
      return parseProject(textValue);
    }

    static exportJSON(project) {
      return JSON.stringify(sanitizeProject(project));
    }

    constructor(storage) {
      try {
        this.storage = storage === undefined ? global.localStorage : storage;
        if (!this.storage || typeof this.storage.getItem !== "function" || typeof this.storage.setItem !== "function") throw new Error("Local storage is unavailable.");
      } catch (error) {
        throw new StorageError("Local storage is unavailable. Export your project to keep a copy.", error);
      }
    }

    _readLibrary() {
      let raw;
      try { raw = this.storage.getItem(STORAGE_KEY); } catch (error) {
        throw new StorageError("Cannot read saved projects. Export your current project to keep a copy.", error);
      }
      if (raw === null) return { format: LIBRARY_FORMAT, version: 1, projects: [] };
      try {
        limitedText(raw, "Saved project library");
        const library = safeClone(JSON.parse(raw));
        object(library, "Saved project library");
        if (library.format !== LIBRARY_FORMAT || library.version !== 1) invalid("Unsupported saved library format.");
        array(library.projects, "Saved projects", 1000);
        const ids = new Set();
        for (const project of library.projects) {
          validateProject(project);
          if (ids.has(project.id)) invalid("Saved project ids must be unique.");
          ids.add(project.id);
        }
        return library;
      } catch (error) {
        throw new StorageError("Saved project data is damaged or incompatible. It has not been overwritten; export your current project to keep a copy.", error);
      }
    }

    _writeLibrary(library) {
      let serialized;
      try {
        // Check aggregate bounds too, so every successfully written library is
        // guaranteed to fit the same limits when read again.
        serialized = limitedText(JSON.stringify(safeClone(library)), "Saved project library");
        this.storage.setItem(STORAGE_KEY, serialized);
      } catch (error) {
        throw new StorageError("Cannot save projects locally. Storage may be full or disabled; export your project to keep a copy.", error);
      }
    }

    list() {
      return this._readLibrary().projects
        .map(({ id, title, updatedAt, steps }) => ({ id, title, updatedAt, stepCount: steps.length }))
        .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt) || a.title.localeCompare(b.title));
    }

    save(project) {
      const validated = sanitizeProject(project);
      const library = this._readLibrary();
      const index = library.projects.findIndex((item) => item.id === validated.id);
      if (index === -1) {
        if (library.projects.length >= 1000) throw new StorageError("The saved project library is full. Export a project before removing old entries.");
        library.projects.push(validated);
      } else library.projects[index] = validated;
      this._writeLibrary(library);
      return validated;
    }

    load(id) {
      text(id, "Project id", 160);
      return this._readLibrary().projects.find((project) => project.id === id) || null;
    }

    importJSON(textValue) {
      return CompassProjectStore.importJSON(textValue);
    }

    exportJSON(project) {
      return CompassProjectStore.exportJSON(project);
    }

    delete(id) {
      text(id, "Project id", 160);
      const library = this._readLibrary();
      const index = library.projects.findIndex((project) => project.id === id);
      if (index === -1) return false;
      library.projects.splice(index, 1);
      this._writeLibrary(library);
      return true;
    }
  }

  CompassProjectStore.InvalidProjectError = InvalidProjectError;
  CompassProjectStore.StorageError = StorageError;
  CompassProjectStore.storageKey = STORAGE_KEY;
  global.CompassProjectStore = CompassProjectStore;
})(globalThis);
