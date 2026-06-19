const CASES = [
  {
    scientistName: "埃德温·哈勃",
    scientistIntro: "你将读取一张星系距离与退行速度关系图，从数据趋势中判断宇宙正在发生什么。",
    experimentTitle: "观测图：星系距离 vs 退行速度",
    slopeLabel: "斜率 / 哈勃常数",
    xMax: 2.2,
    yMin: -200,
    yMax: 1200,
    idealSlope: 100,
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
      constant: "mid",
    },
    successTitle: "研究成功：你已经很像哈勃了",
    successText: "你抓住了线性趋势，也做出了正确判断。这组数据支持宇宙在膨胀，你当前拟合得到的哈勃常数也落在合理范围内。",
    partialTitle: "研究接近完成",
    partialText: "拟合或判断还有一点偏差，再看一眼散点整体趋势。",
    errorTitle: "研究结论需要复核",
    errorText: "这张图能说明膨胀，但还不足以单独证明加速膨胀，拟合线也建议再调一调。",
    points: [
      { x: 0.03, y: -20 },
      { x: 0.03, y: 30 },
      { x: 0.03, y: 60 },
      { x: 0.20, y: 40 },
      { x: 0.25, y: 0 },
      { x: 0.25, y: -30 },
      { x: 0.27, y: -80 },
      { x: 0.27, y: -120 },
      { x: 0.45, y: 400 },
      { x: 0.50, y: 410 },
      { x: 0.50, y: 440 },
      { x: 0.60, y: 380 },
      { x: 0.62, y: 310 },
      { x: 0.65, y: 200 },
      { x: 0.80, y: 380 },
      { x: 0.90, y: 90 },
      { x: 0.90, y: 210 },
      { x: 0.90, y: 430 },
      { x: 0.90, y: 510 },
      { x: 0.90, y: 600 },
      { x: 1.00, y: 830 },
      { x: 1.05, y: 740 },
      { x: 1.10, y: 560 },
      { x: 1.10, y: 720 },
      { x: 1.40, y: 610 },
      { x: 1.40, y: 750 },
      { x: 1.62, y: 720 },
      { x: 1.70, y: 1040 },
      { x: 2.00, y: 520 },
      { x: 2.00, y: 810 },
      { x: 2.00, y: 840 },
      { x: 2.00, y: 1100 },
    ],
  },
  {
    scientistName: "亨丽爱塔·勒维特",
    scientistIntro: "即将开放——敬请期待。",
    experimentTitle: "观测数据加载中……",
    slopeLabel: "斜率",
    xMax: 2.2,
    yMin: -200,
    yMax: 1200,
    idealSlope: 100,
    idealIntercept: 0,
    slopeUnit: "千米/秒/百万秒差距",
    interceptUnit: "千米/秒",
    questionOneTitle: "1. 待定",
    questionTwoTitle: "2. 待定",
    options: {
      conclusion: [
        { value: "a", label: "选项 A" },
        { value: "b", label: "选项 B" },
        { value: "c", label: "选项 C" },
      ],
      constant: [
        { value: "low", label: "约 30" },
        { value: "mid", label: "约 70" },
        { value: "high", label: "约 500" },
      ],
    },
    answers: { conclusion: "a", constant: "mid" },
    successTitle: "恭喜通关",
    successText: "你已完成本关。",
    partialTitle: "还需努力",
    partialText: "再试试看。",
    errorTitle: "未能通过",
    errorText: "再想想。",
    points: [
      { x: 0.5, y: 100 },
      { x: 1.0, y: 200 },
      { x: 1.5, y: 300 },
      { x: 2.0, y: 400 },
    ],
  },
  {
    scientistName: "弗里德里希·贝塞尔",
    scientistIntro: "即将开放——敬请期待。",
    experimentTitle: "观测数据加载中……",
    slopeLabel: "斜率",
    xMax: 2.2,
    yMin: -200,
    yMax: 1200,
    idealSlope: 100,
    idealIntercept: 0,
    slopeUnit: "千米/秒/百万秒差距",
    interceptUnit: "千米/秒",
    questionOneTitle: "1. 待定",
    questionTwoTitle: "2. 待定",
    options: {
      conclusion: [
        { value: "a", label: "选项 A" },
        { value: "b", label: "选项 B" },
        { value: "c", label: "选项 C" },
      ],
      constant: [
        { value: "low", label: "约 30" },
        { value: "mid", label: "约 70" },
        { value: "high", label: "约 500" },
      ],
    },
    answers: { conclusion: "a", constant: "mid" },
    successTitle: "恭喜通关",
    successText: "你已完成本关。",
    partialTitle: "还需努力",
    partialText: "再试试看。",
    errorTitle: "未能通过",
    errorText: "再想想。",
    points: [
      { x: 0.5, y: 100 },
      { x: 1.0, y: 200 },
      { x: 1.5, y: 300 },
      { x: 2.0, y: 400 },
    ],
  },
  {
    scientistName: "埃希纳·赫茨普龙",
    scientistIntro: "即将开放——敬请期待。",
    experimentTitle: "观测数据加载中……",
    slopeLabel: "斜率",
    xMax: 2.2,
    yMin: -200,
    yMax: 1200,
    idealSlope: 100,
    idealIntercept: 0,
    slopeUnit: "千米/秒/百万秒差距",
    interceptUnit: "千米/秒",
    questionOneTitle: "1. 待定",
    questionTwoTitle: "2. 待定",
    options: {
      conclusion: [
        { value: "a", label: "选项 A" },
        { value: "b", label: "选项 B" },
        { value: "c", label: "选项 C" },
      ],
      constant: [
        { value: "low", label: "约 30" },
        { value: "mid", label: "约 70" },
        { value: "high", label: "约 500" },
      ],
    },
    answers: { conclusion: "a", constant: "mid" },
    successTitle: "恭喜通关",
    successText: "你已完成本关。",
    partialTitle: "还需努力",
    partialText: "再试试看。",
    errorTitle: "未能通过",
    errorText: "再想想。",
    points: [
      { x: 0.5, y: 100 },
      { x: 1.0, y: 200 },
      { x: 1.5, y: 300 },
      { x: 2.0, y: 400 },
    ],
  },
  {
    scientistName: "苏布拉马尼扬·钱德拉塞卡",
    scientistIntro: "即将开放——敬请期待。",
    experimentTitle: "观测数据加载中……",
    slopeLabel: "斜率",
    xMax: 2.2,
    yMin: -200,
    yMax: 1200,
    idealSlope: 100,
    idealIntercept: 0,
    slopeUnit: "千米/秒/百万秒差距",
    interceptUnit: "千米/秒",
    questionOneTitle: "1. 待定",
    questionTwoTitle: "2. 待定",
    options: {
      conclusion: [
        { value: "a", label: "选项 A" },
        { value: "b", label: "选项 B" },
        { value: "c", label: "选项 C" },
      ],
      constant: [
        { value: "low", label: "约 30" },
        { value: "mid", label: "约 70" },
        { value: "high", label: "约 500" },
      ],
    },
    answers: { conclusion: "a", constant: "mid" },
    successTitle: "恭喜通关",
    successText: "你已完成本关。",
    partialTitle: "还需努力",
    partialText: "再试试看。",
    errorTitle: "未能通过",
    errorText: "再想想。",
    points: [
      { x: 0.5, y: 100 },
      { x: 1.0, y: 200 },
      { x: 1.5, y: 300 },
      { x: 2.0, y: 400 },
    ],
  },
];

const chart = document.getElementById("hubbleChart");
const slopeSlider = document.getElementById("slopeSlider");
const interceptSlider = document.getElementById("interceptSlider");
const slopeValue = document.getElementById("slopeValue");
const interceptValue = document.getElementById("interceptValue");
const resultBox = document.getElementById("resultBox");
const submitButton = document.getElementById("submitAnswerButton");
const resetButton = document.getElementById("resetModuleButton");
const nextCaseButton = document.getElementById("nextCaseButton");
const conclusionOptions = document.getElementById("conclusionOptions");
const constantOptions = document.getElementById("constantOptions");

const scientistName = document.getElementById("scientistName");
const scientistIntro = document.getElementById("scientistIntro");
const experimentTitle = document.getElementById("experimentTitle");
const slopeLabel = document.getElementById("slopeLabel");
const questionOneTitle = document.getElementById("questionOneTitle");
const questionTwoTitle = document.getElementById("questionTwoTitle");
const levelIndicator = document.getElementById("levelIndicator");

const margins = { left: 68, right: 26, top: 26, bottom: 56 };
const viewBox = { width: 640, height: 420 };
const plotWidth = viewBox.width - margins.left - margins.right;
const plotHeight = viewBox.height - margins.top - margins.bottom;

let currentCaseIndex = 0;
let currentCase = CASES[currentCaseIndex];
const selectedAnswers = { conclusion: null, constant: null };

function xToSvg(value) {
  return margins.left + (value / currentCase.xMax) * plotWidth;
}

function yToSvg(value) {
  const yMin = currentCase.yMin || 0;
  return margins.top + plotHeight - ((value - yMin) / (currentCase.yMax - yMin)) * plotHeight;
}

function createSvgNode(tag, attrs = {}) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attrs).forEach(([key, value]) => {
    node.setAttribute(key, value);
  });
  return node;
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

function updateControls() {
  const slope = Number(slopeSlider.value);
  const intercept = Number(interceptSlider.value);
  slopeValue.textContent = `${slope} ${currentCase.slopeUnit}`;
  interceptValue.textContent = `${intercept} ${currentCase.interceptUnit}`;
  renderChart();
}

function renderChart() {
  chart.innerHTML = "";

  const yMin = currentCase.yMin || 0;

  const grid = createSvgNode("g");
  for (let xVal = 0; xVal <= currentCase.xMax + 0.01; xVal += 0.5) {
    const x = xToSvg(xVal);
    grid.appendChild(createSvgNode("line", {
      x1: x, y1: margins.top, x2: x, y2: margins.top + plotHeight,
      stroke: "rgba(139,199,255,0.14)", "stroke-width": "1",
    }));
  }
  for (let yVal = Math.ceil(yMin / 200) * 200; yVal <= currentCase.yMax; yVal += 200) {
    const y = yToSvg(yVal);
    grid.appendChild(createSvgNode("line", {
      x1: margins.left, y1: y, x2: margins.left + plotWidth, y2: y,
      stroke: "rgba(139,199,255,0.12)", "stroke-width": "1",
    }));
  }
  chart.appendChild(grid);

  if (yMin < 0) {
    const y0 = yToSvg(0);
    chart.appendChild(createSvgNode("line", {
      x1: margins.left, y1: y0, x2: margins.left + plotWidth, y2: y0,
      stroke: "rgba(139,199,255,0.25)", "stroke-width": "1.2",
    }));
  }

  chart.appendChild(createSvgNode("line", {
    x1: margins.left, y1: margins.top,
    x2: margins.left, y2: margins.top + plotHeight,
    stroke: "rgba(233,243,255,0.9)", "stroke-width": "2.4",
  }));
  chart.appendChild(createSvgNode("line", {
    x1: margins.left, y1: margins.top + plotHeight,
    x2: margins.left + plotWidth, y2: margins.top + plotHeight,
    stroke: "rgba(233,243,255,0.9)", "stroke-width": "2.4",
  }));

  for (let xVal = 0; xVal <= currentCase.xMax + 0.01; xVal += 0.5) {
    chart.appendChild(createSvgNode("text", {
      x: xToSvg(xVal), y: margins.top + plotHeight + 28,
      "text-anchor": "middle", fill: "rgba(214,228,250,0.85)", "font-size": "13",
    })).textContent = `${xVal}`;
  }

  for (let yVal = Math.ceil(yMin / 200) * 200; yVal <= currentCase.yMax; yVal += 200) {
    chart.appendChild(createSvgNode("text", {
      x: margins.left - 16, y: yToSvg(yVal) + 5,
      "text-anchor": "end", fill: "rgba(214,228,250,0.85)", "font-size": "13",
    })).textContent = `${yVal}`;
  }

  chart.appendChild(createSvgNode("text", {
    x: margins.left + plotWidth / 2, y: viewBox.height - 12,
    "text-anchor": "middle", fill: "rgba(236,245,255,0.92)", "font-size": "15",
  })).textContent = "距离 d (百万秒差距)";

  const yAxisLabel = createSvgNode("text", {
    x: 20, y: margins.top + plotHeight / 2,
    "text-anchor": "middle", fill: "rgba(236,245,255,0.92)", "font-size": "15",
    transform: `rotate(-90 20 ${margins.top + plotHeight / 2})`,
  });
  yAxisLabel.textContent = "退行速度 v (千米/秒)";
  chart.appendChild(yAxisLabel);

  currentCase.points.forEach((point) => {
    chart.appendChild(createSvgNode("circle", {
      cx: xToSvg(point.x), cy: yToSvg(point.y),
      r: "6.5", fill: "rgba(245,191,119,0.95)",
      stroke: "rgba(255,244,227,0.85)", "stroke-width": "1.4",
    }));
  });

  const slope = Number(slopeSlider.value);
  const intercept = Number(interceptSlider.value);
  chart.appendChild(createSvgNode("line", {
    x1: xToSvg(0), y1: yToSvg(slope * 0 + intercept),
    x2: xToSvg(currentCase.xMax), y2: yToSvg(slope * currentCase.xMax + intercept),
    stroke: "rgba(130,219,255,0.96)", "stroke-width": "4", "stroke-linecap": "round",
  }));
}

function selectOption(button) {
  const group = button.dataset.group;
  selectedAnswers[group] = button.dataset.value;
  document.querySelectorAll(`.option-button[data-group="${group}"]`).forEach((node) => {
    node.classList.toggle("selected", node === button);
  });
}

function resetResultBox() {
  resultBox.className = "result-box";
  resultBox.innerHTML = "";
}

function resetSelections() {
  selectedAnswers.conclusion = null;
  selectedAnswers.constant = null;
  document.querySelectorAll(".option-button.selected").forEach((node) => node.classList.remove("selected"));
}

function resetModule() {
  slopeSlider.value = String(currentCase.idealSlope);
  interceptSlider.value = String(currentCase.idealIntercept);
  resetSelections();
  resetResultBox();
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
  levelIndicator.textContent = `关卡 ${index + 1}/${CASES.length}`;

  renderOptions(conclusionOptions, "conclusion", currentCase.options.conclusion);
  renderOptions(constantOptions, "constant", currentCase.options.constant);
  resetModule();
}

function evaluateAnswer() {
  if (!selectedAnswers.conclusion || !selectedAnswers.constant) {
    resultBox.className = "result-box error";
    resultBox.innerHTML = `
      <p class="result-title">答案还没填完</p>
      <p class="result-text">两个问题都选好后，再提交这份研究报告。</p>
    `;
    return;
  }

  const slope = Number(slopeSlider.value);
  const intercept = Number(interceptSlider.value);
  const fitGood = Math.abs(slope - currentCase.idealSlope) <= 25 && Math.abs(intercept - currentCase.idealIntercept) <= 60;
  const correctConclusion = selectedAnswers.conclusion === currentCase.answers.conclusion;
  const correctConstant = selectedAnswers.constant === currentCase.answers.constant;
  const score = [fitGood, correctConclusion, correctConstant].filter(Boolean).length;

  if (score === 3) {
    resultBox.className = "result-box success";
    resultBox.innerHTML = `
      <p class="result-title">${currentCase.successTitle}</p>
      <p class="result-text">${currentCase.successText}</p>
    `;
    return;
  }

  if (score >= 2) {
    resultBox.className = "result-box partial";
    resultBox.innerHTML = `
      <p class="result-title">${currentCase.partialTitle}</p>
      <p class="result-text">${currentCase.partialText}</p>
    `;
    return;
  }

  resultBox.className = "result-box error";
  resultBox.innerHTML = `
    <p class="result-title">${currentCase.errorTitle}</p>
    <p class="result-text">${currentCase.errorText}</p>
  `;
}

function goToNextCase() {
  loadCase((currentCaseIndex + 1) % CASES.length);
}

slopeSlider.addEventListener("input", updateControls);
interceptSlider.addEventListener("input", updateControls);
submitButton.addEventListener("click", evaluateAnswer);
resetButton.addEventListener("click", resetModule);
nextCaseButton.addEventListener("click", goToNextCase);

loadCase(0);
