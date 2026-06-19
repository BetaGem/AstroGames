const CASES = [
  {
    scientistName: "弗里德里希·贝塞尔 (Friedrich Bessel)",
    type: "parallax",
    scientistIntro: "1838年，贝塞尔首次测出恒星61 Cygni的三角视差。地球公转半年后，近距恒星相对远方背景星会有微小偏移。拖动下方两个滑块，将6月和12月星图上的目标星重合，即可测出视差。",
    experimentTitle: "观测图：61 Cygni 视差测量 — 蓝色圆点为6月星像，橙色圆点为12月星像",
    slopeLabel: "东西方向偏移",
    trueParallaxX: 0.28,
    trueParallaxY: -0.12,
    idealSlope: 0.28,
    idealIntercept: -0.12,
    slopeUnit: "角秒",
    interceptUnit: "角秒",
    questionOneTitle: "1. 你测得的 61 Cygni 视差约为多少角秒？",
    questionTwoTitle: "2. 根据 d ≈ 1/p，这颗星距离我们多远？",
    options: {
      conclusion: [
        { value: "p015", label: "约 0.15 角秒" },
        { value: "p031", label: "约 0.31 角秒" },
        { value: "p060", label: "约 0.60 角秒" },
      ],
      constant: [
        { value: "d16", label: "约 1.6 秒差距" },
        { value: "d32", label: "约 3.2 秒差距" },
        { value: "d67", label: "约 6.7 秒差距" },
      ],
    },
    answers: { conclusion: "p031", constant: "d32" },
    successTitle: "测量成功",
    successText: "61 Cygni 的视差约为 0.31 角秒，对应距离约 3.2 秒差距（约 10.4 光年）。贝塞尔正是用这个方法首次丈量了恒星的距离！",
    partialTitle: "还需精确",
    partialText: "视差或距离计算中有一项偏差，再看看 X 和 Y 两个方向都对齐了吗。",
    errorTitle: "测量偏差较大",
    errorText: "调整东西和南北两个方向的偏移滑块，直到目标星的蓝色和橙色圆点完全重合。提示：此时背景星会出现双像。",
    evaluate: function() {
      if (!selectedAnswers.conclusion || !selectedAnswers.constant) return showMissingAnswer();
      var sx = Number(slopeSlider.value), sy = Number(interceptSlider.value);
      var xOk = Math.abs(sx - this.trueParallaxX) <= 0.20;
      var yOk = Math.abs(sy - this.trueParallaxY) <= 0.20;
      var correctParallax = selectedAnswers.conclusion === this.answers.conclusion;
      var correctDistance = selectedAnswers.constant === this.answers.constant;
      return scoreResult(this, [xOk && yOk, correctParallax, correctDistance]);
    },
  },
  {
    scientistName: "埃希纳·赫茨普龙 (Ejnar Hertzsprung)",
    type: "mainseq",
    scientistIntro: "赫茨普龙与罗素分别独立发现了恒星的光度-温度关系——即著名的赫罗图（H-R Diagram）。通过将星团的主序星与标准主序对齐，可以测定星团的距离。",
    experimentTitle: "观测图：星团颜色-星等图",
    slopeLabel: "距离模数 m−M",
    idealSlope: 13.3,
    trueDM: 13.3,
    slopeUnit: "等",
    hideQuestionOne: true,
    questionOneTitle: "",
    questionTwoTitle: "根据拟合得到的距离模数，这个星团的距离约为多少？",
    options: {
      conclusion: [],
      constant: [
        { value: "d2", label: "约 2 千秒差距 (kpc)" },
        { value: "d45", label: "约 4.5 千秒差距 (kpc)" },
        { value: "d9", label: "约 9 千秒差距 (kpc)" },
      ],
    },
    answers: { conclusion: "none", constant: "d45" },
    successTitle: "主序拟合成功",
    successText: "距离模数约 13.3 等，对应距离约 4.5 千秒差距。主序拟合是测定星团距离的经典方法，通过将理论等龄线与观测数据对齐，可以同时得到星团的距离和年龄。",
    partialTitle: "还需精确",
    partialText: "调整距离模数滑块，使金黄色等龄线穿过星团主序最密集的带状区域。",
    errorTitle: "拟合偏差较大",
    errorText: "等龄线是恒星演化模型的计算结果，将其上下平移直到与观测主序重合，平移量就是距离模数 m−M。",
    evaluate: function() {
      if (!selectedAnswers.constant) return showMissingSingleAnswer();
      var sliderOk = Math.abs(Number(slopeSlider.value) - this.trueDM) <= 4.0;
      var correctDist = selectedAnswers.constant === this.answers.constant;
      return scoreResult(this, [sliderOk, correctDist]);
    },
  },
  {
    scientistName: "亨丽爱塔·勒维特 (Henrietta Leavitt)",
    type: "cepheids",
    scientistIntro: "勒维特发现了著名的周光关系：造父变星的周期越长，光度越大。下方是一颗造父变星的不均匀实测数据，请调节周期和相位使蓝色拟合曲线尽可能穿过所有误差棒。",
    experimentTitle: "观测图：造父变星光变曲线 — 数据集中在几个观测季",
    slopeLabel: "光变周期",
    idealSlope: 5.4,
    idealIntercept: 0.3,
    slopeUnit: "天",
    interceptUnit: "弧度",
    questionOneTitle: "1. 这颗造父变星的周期约为多少天？",
    questionTwoTitle: "2. 根据周期-光度关系 M ≈ −2.8 log₁₀(P) − 1.4，其绝对星等约为？",
    options: {
      conclusion: [
        { value: "p25", label: "约 2.5 天" },
        { value: "p54", label: "约 5 天" },
        { value: "p108", label: "约 10 天" },
      ],
      constant: [
        { value: "m35", label: "约 −3.5 等" },
        { value: "m50", label: "约 −5.0 等" },
        { value: "m65", label: "约 −6.5 等" },
      ],
    },
    answers: { conclusion: "p54", constant: "m35" },
    successTitle: "周期识别成功",
    successText: "周期约 5 天，相位约 0.3 rad，对应绝对星等约 −3.5 等。勒维特的周光关系为哈勃测量仙女座星系距离铺平了道路。",
    partialTitle: "还需精确",
    partialText: "周期或相位有一项偏差。观察曲线波峰是否对齐数据的最亮阶段，波谷是否对应最暗阶段。",
    errorTitle: "测量偏差较大",
    errorText: "注意数据集中在几个观测季内，中间有大段空白。周期决定了波峰间距，相位决定整条曲线的左右平移。",
    cephData: [
      { t: 0.2, m: 11.12, e: 0.08 }, { t: 0.8, m: 11.78, e: 0.10 },
      { t: 1.5, m: 12.40, e: 0.12 }, { t: 2.5, m: 12.72, e: 0.18 },
      { t: 4.5, m: 11.18, e: 0.14 }, { t: 4.9, m: 11.22, e: 0.12 },
      { t: 5.3, m: 11.02, e: 0.16 }, { t: 5.8, m: 11.42, e: 0.14 },
      { t: 6.2, m: 11.48, e: 0.26 }, { t: 7.0, m: 12.52, e: 0.20 },
      { t: 7.4, m: 12.62, e: 0.18 }, { t: 9.0, m: 12.28, e: 0.08 },
      { t: 9.3, m: 11.72, e: 0.09 }, { t: 9.7, m: 11.32, e: 0.08 },
      { t: 10.1, m: 11.08, e: 0.10 }, { t: 10.4, m: 11.18, e: 0.10 },
      { t: 11.0, m: 11.65, e: 0.28 }, { t: 12.0, m: 11.68, e: 0.24 },
      { t: 14.8, m: 11.62, e: 0.14 }, { t: 15.2, m: 11.50, e: 0.14 },
      { t: 15.4, m: 11.18, e: 0.16 }, { t: 17.0, m: 11.72, e: 0.12 },
      { t: 17.3, m: 11.85, e: 0.11 }, { t: 17.5, m: 12.30, e: 0.13 },
      { t: 17.8, m: 12.48, e: 0.16 }, { t: 18.5, m: 12.85, e: 0.22 },
      { t: 19.2, m: 11.62, e: 0.22 }, { t: 21.5, m: 11.08, e: 0.18 },
      { t: 22.0, m: 11.28, e: 0.16 }, { t: 22.3, m: 11.52, e: 0.20 },
    ],
    evaluate: function() {
      if (!selectedAnswers.conclusion || !selectedAnswers.constant) return showMissingAnswer();
      var pOk = Math.abs(Number(slopeSlider.value) - this.idealSlope) <= 2.0;
      var phOk = Math.abs(Number(interceptSlider.value) - this.idealIntercept) <= 1.5;
      var correctPeriod = selectedAnswers.conclusion === this.answers.conclusion;
      var correctAbsMag = selectedAnswers.constant === this.answers.constant;
      return scoreResult(this, [pOk && phOk, correctPeriod, correctAbsMag]);
    },
  },
  {
    scientistName: "埃德温·哈勃 (Edwin Hubble)",
    type: "hubble",
    scientistIntro: "你将读取一张星系距离与退行速度关系图，从数据趋势中判断宇宙正在发生什么。",
    experimentTitle: "观测图：星系距离 vs 退行速度",
    slopeLabel: "斜率 / 哈勃常数",
    xMax: 2.2,
    yMin: -200,
    yMax: 1200,
    idealSlope: 500,
    idealIntercept: 0,
    slopeUnit: "千米/秒/百万秒差距",
    interceptUnit: "千米/秒",
    questionOneTitle: "1. 这张图最支持哪个结论？",
    questionTwoTitle: "2. 从你现在的拟合看，哈勃常数更接近哪个范围？",
    options: {
      conclusion: [
        { value: "expanding", label: "宇宙在膨胀，距离越远的星系退行越快" },
        { value: "accelerating", label: "宇宙在加速膨胀，星系的退行速度越来越快" },
        { value: "earth-center", label: "银河系位于宇宙中心，大家都在离我们远去" },
      ],
      constant: [
        { value: "low", label: "约 30 千米/秒/百万秒差距" },
        { value: "mid", label: "约 70 千米/秒/百万秒差距" },
        { value: "high", label: "约 500 千米/秒/百万秒差距" },
      ],
    },
    answers: {
      conclusion: "expanding",
      constant: "high",
    },
    successTitle: "研究成功：你已经很像哈勃了",
    successText: "你抓住了线性趋势，也做出了正确判断。这组数据支持宇宙在膨胀。虽然哈勃得到的哈勃常数错得离谱，但我们不得不佩服哈勃敏锐的观察力。",
    partialTitle: "研究接近完成",
    partialText: "拟合或判断还有一点偏差，再看一眼散点整体趋势。",
    errorTitle: "研究结论需要复核",
    errorText: "这张图能说明膨胀，但还不足以单独证明加速膨胀，拟合线也建议再调一调。",
    points: [
      { x: 0.03, y: -20 }, { x: 0.03, y: 30 }, { x: 0.03, y: 60 },
      { x: 0.20, y: 40 }, { x: 0.25, y: 0 }, { x: 0.25, y: -30 },
      { x: 0.27, y: -80 }, { x: 0.27, y: -120 }, { x: 0.45, y: 400 },
      { x: 0.50, y: 410 }, { x: 0.50, y: 440 }, { x: 0.60, y: 380 },
      { x: 0.62, y: 310 }, { x: 0.65, y: 200 }, { x: 0.80, y: 380 },
      { x: 0.90, y: 90 }, { x: 0.90, y: 210 }, { x: 0.90, y: 430 },
      { x: 0.90, y: 510 }, { x: 0.90, y: 600 }, { x: 1.00, y: 830 },
      { x: 1.05, y: 740 }, { x: 1.10, y: 560 }, { x: 1.10, y: 720 },
      { x: 1.40, y: 610 }, { x: 1.40, y: 750 }, { x: 1.62, y: 720 },
      { x: 1.70, y: 1040 }, { x: 2.00, y: 520 }, { x: 2.00, y: 810 },
      { x: 2.00, y: 840 }, { x: 2.00, y: 1100 },
    ],
    evaluate: function() {
      if (!selectedAnswers.conclusion || !selectedAnswers.constant) return showMissingAnswer();
      const slope = Number(slopeSlider.value);
      const intercept = Number(interceptSlider.value);
      const fitGood = Math.abs(slope - this.idealSlope) <= 300 && Math.abs(intercept - this.idealIntercept) <= 120;
      const correctConclusion = selectedAnswers.conclusion === this.answers.conclusion;
      const correctConstant = selectedAnswers.constant === this.answers.constant;
      return scoreResult(this, [fitGood, correctConclusion, correctConstant]);
    },
  },
];

const chart = document.getElementById("hubbleChart");
const slopeSlider = document.getElementById("slopeSlider");
const interceptSlider = document.getElementById("interceptSlider");
const slopeValue = document.getElementById("slopeValue");
const submitButton = document.getElementById("submitAnswerButton");
const resetButton = document.getElementById("resetModuleButton");
const conclusionOptions = document.getElementById("conclusionOptions");
const constantOptions = document.getElementById("constantOptions");

const scientistName = document.getElementById("scientistName");
const scientistIntro = document.getElementById("scientistIntro");
const experimentTitle = document.getElementById("experimentTitle");
const slopeLabel = document.getElementById("slopeLabel");
const interceptLabelEl = interceptSlider.closest("label").querySelector("span");
const interceptValueEl = document.getElementById("interceptValue");
const questionOneTitle = document.getElementById("questionOneTitle");
const questionTwoTitle = document.getElementById("questionTwoTitle");
const questionBlockOne = document.getElementById("questionBlockOne");
const questionBlockTwo = document.getElementById("questionBlockTwo");
const levelIndicator = document.getElementById("levelIndicator");
const experimentPanel = document.getElementById("experimentPanel");
const answerPanel = document.getElementById("answerPanel");

const margins = { left: 68, right: 26, top: 26, bottom: 56 };
const viewBox = { width: 640, height: 420 };
const plotWidth = viewBox.width - margins.left - margins.right;
const plotHeight = viewBox.height - margins.top - margins.bottom;

let currentCaseIndex = 0;
let currentCase = CASES[currentCaseIndex];
const selectedAnswers = { conclusion: null, constant: null };
let hrPoints = [];
let isochronePoints = [];
fetch(window.location.origin + "/games/astronomer-lab/hr-data")
  .then(function(r) { return r.json(); })
  .then(function(data) { hrPoints = data.points; });
fetch(window.location.origin + "/games/astronomer-lab/isochrone")
  .then(function(r) { return r.json(); })
  .then(function(data) { isochronePoints = data.points; });

function xToSvg(value) { return margins.left + (value / (currentCase.xMax || 2.2)) * plotWidth; }
function yToSvg(value) {
  const yMin = currentCase.yMin || 0;
  return margins.top + plotHeight - ((value - yMin) / (currentCase.yMax - yMin)) * plotHeight;
}

function createSvgNode(tag, attrs = {}) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function addSvgText(parent, x, y, text, extra = {}) {
  const el = createSvgNode("text", Object.assign({
    x, y, fill: "rgba(214,228,250,0.85)", "font-size": "13", "text-anchor": "middle",
  }, extra));
  el.textContent = text;
  parent.appendChild(el);
  return el;
}

function addSvgLine(parent, x1, y1, x2, y2, extra = {}) {
  return parent.appendChild(createSvgNode("line", Object.assign({
    x1, y1, x2, y2, stroke: "rgba(139,199,255,0.14)", "stroke-width": "1",
  }, extra)));
}

function renderOptions(container, group, options) {
  container.innerHTML = "";
  options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-button";
    button.dataset.group = group;
    button.dataset.value = option.value;
    button.textContent = option.label;
    button.addEventListener("click", () => selectOption(button));
    container.appendChild(button);
  });
}

function selectOption(button) {
  const group = button.dataset.group;
  selectedAnswers[group] = button.dataset.value;
  document.querySelectorAll(`.option-button[data-group="${group}"]`).forEach(function(node) {
    node.classList.toggle("selected", node === button);
  });
}

function hideInterceptSlider() {
  interceptSlider.closest("label").style.display = "none";
}
function showInterceptSlider(labelText, unit) {
  const label = interceptSlider.closest("label");
  label.style.display = "";
  if (interceptLabelEl) interceptLabelEl.textContent = labelText || "截距微调";
  interceptValueEl.textContent = "0 " + (unit || "");
}

function showMissingAnswer() {
  showResultOverlay("答案还没填完", "两个问题都选好后，再提交这份研究报告。", false);
}

function showMissingSingleAnswer() {
  showResultOverlay("答案还没填完", "请先选择答案。", false);
}

function showResultOverlay(title, text, isSuccess) {
  document.getElementById("resultOverlayTitle").textContent = title;
  document.getElementById("resultOverlayText").textContent = text;
  document.getElementById("resultBtnRetry").style.display = isSuccess ? "none" : "";
  document.getElementById("resultBtnNext").style.display = isSuccess ? "" : "none";
  document.getElementById("resultBtnClose").style.display = "";
  document.getElementById("resultOverlay").classList.add("show");
}

function hideResultOverlay() {
  document.getElementById("resultOverlay").classList.remove("show");
}

function scoreResult(theCase, checks) {
  var passed = checks.filter(Boolean).length;
  var total = checks.length;
  if (passed === total) {
    if (currentCaseIndex >= CASES.length - 1) {
      document.getElementById("completionOverlay").classList.add("show");
      return;
    }
    showResultOverlay(theCase.successTitle, theCase.successText, true);
  } else if (passed >= total - 1) {
    showResultOverlay(theCase.partialTitle, theCase.partialText, false);
  } else {
    showResultOverlay(theCase.errorTitle, theCase.errorText, false);
  }
}

function resetSelections() {
  selectedAnswers.conclusion = currentCase.hideQuestionOne ? "none" : null;
  selectedAnswers.constant = null;
  document.querySelectorAll(".option-button.selected").forEach(function(node) { node.classList.remove("selected"); });
}

function evaluateAnswer() {
  if (currentCase.evaluate) { currentCase.evaluate(); }
}

function setSlider(slider, value, min, max, step, valueEl, unit) {
  slider.min = String(min);
  slider.max = String(max);
  slider.step = String(step);
  slider.value = String(value);
  if (valueEl) valueEl.textContent = value + (unit ? " " + unit : "");
}

function resetModule() {
  switch (currentCase.type) {
    case "hubble":
      setSlider(slopeSlider, 100, 0, 1000, 10, slopeValue, currentCase.slopeUnit);
      setSlider(interceptSlider, currentCase.idealIntercept, -180, 180, 10, interceptValueEl, currentCase.interceptUnit);
      showInterceptSlider("截距微调", currentCase.interceptUnit);
      break;
    case "parallax":
      setSlider(slopeSlider, 0, -1.0, 1.0, 0.01, slopeValue, currentCase.slopeUnit);
      setSlider(interceptSlider, 0, -1.0, 1.0, 0.01, interceptValueEl, currentCase.interceptUnit);
      showInterceptSlider("南北方向偏移", currentCase.interceptUnit);
      break;
    case "cepheids":
      setSlider(slopeSlider, 2, 2, 12, 0.1, slopeValue, currentCase.slopeUnit);
      setSlider(interceptSlider, 3, 0, 6.3, 0.1, interceptValueEl, currentCase.interceptUnit);
      showInterceptSlider("相位偏移", currentCase.interceptUnit);
      break;
    case "mainseq":
      setSlider(slopeSlider, 10, 5, 18, 0.1, slopeValue, currentCase.slopeUnit);
      hideInterceptSlider();
      break;
  }
  resetSelections();
  updateControls();
}

function loadCase(index) {
  currentCaseIndex = index;
  currentCase = CASES[currentCaseIndex];

  scientistName.textContent = currentCase.scientistName;
  scientistIntro.textContent = currentCase.scientistIntro;
  experimentTitle.textContent = currentCase.experimentTitle;
  slopeLabel.textContent = currentCase.slopeLabel;
  questionOneTitle.textContent = currentCase.questionOneTitle;
  questionTwoTitle.textContent = currentCase.questionTwoTitle;
  levelIndicator.textContent = "关卡 " + (index + 1) + "/" + CASES.length;

  const isBlank = currentCase.type === "blank";
  experimentPanel.style.display = isBlank ? "none" : "";
  answerPanel.style.display = isBlank ? "none" : "";

  if (currentCase.hideQuestionOne) {
    questionBlockOne.style.display = "none";
  } else {
    questionBlockOne.style.display = "";
  }

  renderOptions(conclusionOptions, "conclusion", currentCase.options.conclusion);
  renderOptions(constantOptions, "constant", currentCase.options.constant);
  resetModule();
}

function updateControls() {
  if (currentCase.interceptUnit) {
    slopeValue.textContent = Number(slopeSlider.value) + " " + currentCase.slopeUnit;
    interceptValueEl.textContent = Number(interceptSlider.value) + " " + currentCase.interceptUnit;
  } else {
    slopeValue.textContent = Number(slopeSlider.value) + " " + currentCase.slopeUnit;
  }
  renderChart();
}

function goToNextLevel() {
  hideResultOverlay();
  loadCase(currentCaseIndex + 1);
}

// ─── RENDER DISPATCH ───

function renderChart() {
  chart.innerHTML = "";
  switch (currentCase.type) {
    case "hubble": renderHubble(); break;
    case "parallax": renderParallax(); break;
    case "cepheids": renderCepheid(); break;
    case "mainseq": renderMainSeq(); break;
  }
}

// ─── HUBBLE ───

function renderHubble() {
  var yMin = currentCase.yMin || 0;
  var grid = createSvgNode("g");
  for (var xv = 0; xv <= currentCase.xMax + 0.01; xv += 0.5) addSvgLine(grid, xToSvg(xv), margins.top, xToSvg(xv), margins.top + plotHeight);
  for (var yv = Math.ceil(yMin / 200) * 200; yv <= currentCase.yMax; yv += 200) addSvgLine(grid, margins.left, yToSvg(yv), margins.left + plotWidth, yToSvg(yv));
  chart.appendChild(grid);
  if (yMin < 0) addSvgLine(chart, margins.left, yToSvg(0), margins.left + plotWidth, yToSvg(0), { stroke: "rgba(139,199,255,0.25)", "stroke-width": "1.2" });
  addSvgLine(chart, margins.left, margins.top, margins.left, margins.top + plotHeight, { stroke: "rgba(233,243,255,0.9)", "stroke-width": "2.4" });
  addSvgLine(chart, margins.left, margins.top + plotHeight, margins.left + plotWidth, margins.top + plotHeight, { stroke: "rgba(233,243,255,0.9)", "stroke-width": "2.4" });
  for (xv = 0; xv <= currentCase.xMax + 0.01; xv += 0.5) addSvgText(chart, xToSvg(xv), margins.top + plotHeight + 28, String(xv));
  for (yv = Math.ceil(yMin / 200) * 200; yv <= currentCase.yMax; yv += 200) addSvgText(chart, margins.left - 16, yToSvg(yv) + 5, String(yv), { "text-anchor": "end" });
  addSvgText(chart, margins.left + plotWidth / 2, viewBox.height - 12, "距离 d (百万秒差距)", { "font-size": "15", fill: "rgba(236,245,255,0.92)" });
  var yl = createSvgNode("text", { x: 20, y: margins.top + plotHeight / 2, "text-anchor": "middle", fill: "rgba(236,245,255,0.92)", "font-size": "15", transform: "rotate(-90 20 " + (margins.top + plotHeight / 2) + ")" });
  yl.textContent = "退行速度 v (千米/秒)"; chart.appendChild(yl);
  currentCase.points.forEach(function(p) {
    chart.appendChild(createSvgNode("circle", { cx: xToSvg(p.x), cy: yToSvg(p.y), r: "6.5", fill: "rgba(245,191,119,0.95)", stroke: "rgba(255,244,227,0.85)", "stroke-width": "1.4" }));
  });
  var s = Number(slopeSlider.value), ic = Number(interceptSlider.value);
  chart.appendChild(createSvgNode("line", { x1: xToSvg(0), y1: yToSvg(s * 0 + ic), x2: xToSvg(currentCase.xMax), y2: yToSvg(s * currentCase.xMax + ic), stroke: "rgba(130,219,255,0.96)", "stroke-width": "4", "stroke-linecap": "round" }));
}

// ─── PARALLAX ───

function renderParallax() {
  var cx = margins.left + plotWidth / 2, cy = margins.top + plotHeight / 2;
  var r = Math.min(plotWidth, plotHeight) * 0.38;
  var px = Number(slopeSlider.value), py = Number(interceptSlider.value);
  var tx = currentCase.trueParallaxX, ty = currentCase.trueParallaxY;

  // background stars
  var bgStars = [[-0.6,-0.5],[-0.3,0.6],[0.2,-0.7],[0.5,0.3],[-0.7,0.1],[0.6,-0.3],
    [-0.4,-0.7],[0.7,0.6],[0.1,0.8],[-0.8,-0.2],[0.9,-0.5],[-0.5,0.4],
    [0.4,-0.6],[-0.2,-0.4],[-0.9,0.2],[0.3,0.5],[0.8,-0.1],[-0.1,-0.8]];
  // half of the background stars get small random intrinsic parallax offsets
  var perturbedIdx = [0, 2, 4, 6, 9, 11, 13, 15, 17];
  var pOffsets = [];
  for (var pi = 0; pi < bgStars.length; pi++) {
    if (perturbedIdx.indexOf(pi) >= 0) {
      var seed = (pi * 0.37 + 0.15) % 1;
      pOffsets.push([(seed - 0.5) * 0.12, ((seed * 1.7 + 0.3) % 1 - 0.5) * 0.10]);
    } else {
      pOffsets.push([0, 0]);
    }
  }
  var fieldScale = r * 0.9;

  bgStars.forEach(function(s, idx) {
    var bx = cx + s[0] * fieldScale, by = cy + s[1] * fieldScale;
    var ox = pOffsets[idx][0] * fieldScale, oy = pOffsets[idx][1] * fieldScale;
    chart.appendChild(createSvgNode("circle", { cx: bx, cy: by, r: "2", fill: "rgba(107,169,255,0.65)", stroke: "none" }));
    chart.appendChild(createSvgNode("circle", { cx: bx + px * fieldScale + ox, cy: by + py * fieldScale + oy, r: "2", fill: "rgba(245,191,119,0.65)", stroke: "none" }));
  });

  // target star
  var txBlue = cx, tyBlue = cy;
  var txOrange = cx + px * fieldScale - tx * fieldScale, tyOrange = cy + py * fieldScale - ty * fieldScale;

  chart.appendChild(createSvgNode("circle", { cx: txBlue, cy: tyBlue, r: "7", fill: "rgba(107,169,255,0.95)", stroke: "rgba(193,219,255,0.95)", "stroke-width": "2" }));
  chart.appendChild(createSvgNode("circle", { cx: txOrange, cy: tyOrange, r: "7", fill: "rgba(245,191,119,0.95)", stroke: "rgba(255,234,194,0.95)", "stroke-width": "2" }));

  // label target
  addSvgText(chart, txBlue, tyBlue - 16, "目标星 (6月)", { fill: "rgba(140,195,255,0.95)", "font-size": "11" });
  addSvgText(chart, txOrange, tyOrange + 18, "目标星 (12月)", { fill: "rgba(255,213,148,0.95)", "font-size": "11" });

  // readout
  var totalP = Math.sqrt(px * px + py * py);
  addSvgText(chart, margins.left + plotWidth / 2, viewBox.height - 12, "东西 " + px.toFixed(2) + "\u2033  南北 " + py.toFixed(2) + "\u2033  总视差 " + totalP.toFixed(2) + "\u2033", { "font-size": "15", fill: "rgba(236,245,255,0.92)" });
}

// ─── CEPHEID ───

function renderCepheid() {
  var period = Number(slopeSlider.value);
  var phase = Number(interceptSlider.value);
  var tMax = 24;
  function tToX(t) { return margins.left + (t / tMax) * plotWidth; }
  function mToY(m) { return margins.top + ((m - 10.8) / 2.4) * plotHeight; }

  var grid = createSvgNode("g");
  for (var tv = 0; tv <= tMax + 0.01; tv += 2) addSvgLine(grid, tToX(tv), margins.top, tToX(tv), margins.top + plotHeight);
  for (var mv = 11; mv <= 13.2; mv += 0.5) addSvgLine(grid, margins.left, mToY(mv), margins.left + plotWidth, mToY(mv));
  chart.appendChild(grid);

  addSvgLine(chart, margins.left, margins.top, margins.left, margins.top + plotHeight, { stroke: "rgba(233,243,255,0.9)", "stroke-width": "2.4" });
  addSvgLine(chart, margins.left, margins.top + plotHeight, margins.left + plotWidth, margins.top + plotHeight, { stroke: "rgba(233,243,255,0.9)", "stroke-width": "2.4" });

  for (tv = 0; tv <= tMax + 0.01; tv += 2) addSvgText(chart, tToX(tv), margins.top + plotHeight + 24, String(tv));
  for (mv = 11; mv <= 13.2; mv += 0.5) addSvgText(chart, margins.left - 16, mToY(mv) + 5, mv.toFixed(1), { "text-anchor": "end" });

  addSvgText(chart, margins.left + plotWidth / 2, viewBox.height - 10, "时间 (天)", { "font-size": "15", fill: "rgba(236,245,255,0.92)" });
  var yl = createSvgNode("text", { x: 20, y: margins.top + plotHeight / 2, "text-anchor": "middle", fill: "rgba(236,245,255,0.92)", "font-size": "15", transform: "rotate(-90 20 " + (margins.top + plotHeight / 2) + ")" });
  yl.textContent = "视星等 m"; chart.appendChild(yl);

  // data points with error bars
  currentCase.cephData.forEach(function(pt) {
    var x = tToX(pt.t), y = mToY(pt.m);
    var ePx = (pt.e / 2.4) * plotHeight;
    addSvgLine(chart, x, y - ePx, x, y + ePx, { stroke: "rgba(245,191,119,0.7)", "stroke-width": "1.6", "stroke-linecap": "round" });
    chart.appendChild(createSvgNode("line", { x1: x - 5, y1: y - ePx, x2: x + 5, y2: y - ePx, stroke: "rgba(245,191,119,0.6)", "stroke-width": "1" }));
    chart.appendChild(createSvgNode("line", { x1: x - 5, y1: y + ePx, x2: x + 5, y2: y + ePx, stroke: "rgba(245,191,119,0.6)", "stroke-width": "1" }));
    chart.appendChild(createSvgNode("circle", { cx: x, cy: y, r: "4.5", fill: "rgba(245,191,119,0.9)", stroke: "rgba(255,244,227,0.8)", "stroke-width": "1.2" }));
  });

  // model curve
  var pathD = "";
  var nPts = 300;
  for (var i = 0; i <= nPts; i++) {
    var t = (i / nPts) * tMax;
    var m = 11.95 - 0.88 * Math.cos(2 * Math.PI * t / period + phase);
    pathD += (i === 0 ? "M" : "L") + tToX(t) + "," + mToY(m) + " ";
  }
  chart.appendChild(createSvgNode("path", { d: pathD, fill: "none", stroke: "rgba(130,219,255,0.92)", "stroke-width": "3", "stroke-linecap": "round" }));

  addSvgText(chart, margins.left + plotWidth - 20, margins.top + 20, "周期 " + period.toFixed(1) + " 天", { "text-anchor": "end", fill: "rgba(214,228,250,0.85)", "font-size": "13" });
  addSvgText(chart, margins.left + plotWidth - 20, margins.top + 42, "相位 " + phase.toFixed(1) + " rad", { "text-anchor": "end", fill: "rgba(214,228,250,0.85)", "font-size": "13" });
}

// ─── MAIN SEQUENCE ───

function renderMainSeq() {
  var dm = Number(slopeSlider.value);
  var isochroneDM = currentCase.trueDM || 13.3;
  function colToX(bv) { return margins.left + ((bv + 0.3) / 2.3) * plotWidth; }
  function magToY(m) { return margins.top + ((m - 7) / 13) * plotHeight; }

  var grid = createSvgNode("g");
  for (var yv = 8; yv <= 20; yv += 2) addSvgLine(grid, margins.left, magToY(yv), margins.left + plotWidth, magToY(yv));
  for (var xv = -0.3; xv <= 2.0 + 0.001; xv += 0.5) addSvgLine(grid, colToX(xv), margins.top, colToX(xv), margins.top + plotHeight);
  chart.appendChild(grid);
  addSvgLine(chart, margins.left, margins.top, margins.left, margins.top + plotHeight, { stroke: "rgba(233,243,255,0.9)", "stroke-width": "2.4" });
  addSvgLine(chart, margins.left, margins.top + plotHeight, margins.left + plotWidth, margins.top + plotHeight, { stroke: "rgba(233,243,255,0.9)", "stroke-width": "2.4" });
  for (yv = 8; yv <= 20; yv += 2) addSvgText(chart, margins.left - 16, magToY(yv) + 5, String(yv), { "text-anchor": "end" });
  var xLabels = [-0.3, 0.0, 0.5, 1.0, 1.5, 2.0];
  xLabels.forEach(function(xv) { addSvgText(chart, colToX(xv), margins.top + plotHeight + 24, String(xv)); });
  addSvgText(chart, margins.left + plotWidth / 2, viewBox.height - 10, "B\u2212V 色指数", { "font-size": "15", fill: "rgba(236,245,255,0.92)" });
  var yl = createSvgNode("text", { x: 20, y: margins.top + plotHeight / 2, "text-anchor": "middle", fill: "rgba(236,245,255,0.92)", "font-size": "15", transform: "rotate(-90 20 " + (margins.top + plotHeight / 2) + ")" });
  yl.textContent = "视星等 V"; chart.appendChild(yl);

  if (hrPoints.length) {
    hrPoints.forEach(function(p) {
      if (p.y < 7 || p.y > 20) return;
      chart.appendChild(createSvgNode("circle", { cx: colToX(p.x), cy: magToY(p.y), r: "1.6", fill: "rgba(107,169,255,0.7)", stroke: "none" }));
    });
  }

  if (isochronePoints.length) {
    var isoPath = "";
    isochronePoints.forEach(function(pt, i) {
      var shiftedY = pt.y - isochroneDM + dm;
      isoPath += (i === 0 ? "M" : "L") + colToX(pt.x) + "," + magToY(shiftedY) + " ";
    });
    chart.appendChild(createSvgNode("path", { d: isoPath, fill: "none", stroke: "rgba(255,213,77,0.85)", "stroke-width": "3.5", "stroke-linecap": "round" }));
  }

  addSvgText(chart, margins.left + plotWidth - 20, margins.top + 20, "距离模数 " + dm.toFixed(1) + " 等", { "text-anchor": "end", fill: "rgba(255,213,77,0.9)", "font-size": "13" });
}


slopeSlider.addEventListener("input", updateControls);
interceptSlider.addEventListener("input", updateControls);
submitButton.addEventListener("click", evaluateAnswer);
resetButton.addEventListener("click", resetModule);
document.getElementById("resultBtnRetry").addEventListener("click", function() {
  hideResultOverlay();
  resetModule();
});
document.getElementById("resultBtnNext").addEventListener("click", goToNextLevel);
document.getElementById("resultBtnClose").addEventListener("click", hideResultOverlay);
document.getElementById("completionOverlay").addEventListener("click", function(e) {
  if (e.target === this) this.classList.remove("show");
});

loadCase(0);
