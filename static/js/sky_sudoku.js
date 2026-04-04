const bodies = [
  {
    id: "planet",
    name: "行星",
    icon: "planet.png",
    bands: { uv: "暗", optical: "亮", radio: "暗" },
  },
  {
    id: "k_star",
    name: "K型恒星",
    icon: "k_star.png",
    bands: { uv: "暗", optical: "亮", radio: "暗" },
  },
  {
    id: "a_star",
    name: "A型恒星",
    icon: "a_star.png",
    bands: { uv: "亮", optical: "亮", radio: "暗" },
  },
  {
    id: "brown_dwarf",
    name: "褐矮星",
    icon: "brown_dwarf.png",
    bands: { uv: "暗", optical: "暗", radio: "暗" },
  },
  {
    id: "quasar",
    name: "类星体",
    icon: "quasar.png",
    bands: { uv: "亮", optical: "亮", radio: "亮" },
  },
  {
    id: "reflection_nebula",
    name: "反射星云",
    icon: "reflection_nebula.png",
    bands: { uv: "暗", optical: "亮", radio: "暗" },
  },
  {
    id: "spiral_galaxy",
    name: "漩涡星系",
    icon: "spiral_galaxy.png",
    bands: { uv: "暗", optical: "亮", radio: "亮" },
  },
  {
    id: "diffuse_galaxy",
    name: "弥散星系",
    icon: "diffuse_galaxy.png",
    bands: { uv: "暗", optical: "暗", radio: "暗" },
  },
  {
    id: "supernova_remnant",
    name: "超新星遗迹",
    icon: "supernova_remnant.png",
    bands: { uv: "亮", optical: "暗", radio: "亮" },
  },
];

const solutions = {
  template_a: [
    [6, 3, 1, 8, 5, 9, 2, 7, 4],
    [8, 9, 2, 7, 4, 1, 6, 5, 3],
    [5, 7, 4, 2, 6, 3, 8, 1, 9],
    [3, 5, 8, 1, 9, 4, 7, 2, 6],
    [1, 4, 7, 5, 2, 6, 9, 3, 8],
    [9, 2, 6, 3, 7, 8, 1, 4, 5],
    [4, 1, 3, 9, 8, 7, 5, 6, 2],
    [7, 8, 5, 6, 3, 2, 4, 9, 1],
    [2, 6, 9, 4, 1, 5, 3, 8, 7],
  ],
  template_b: [
    [9, 7, 5, 6, 8, 2, 3, 4, 1],
    [6, 2, 1, 3, 4, 9, 5, 7, 8],
    [8, 4, 3, 1, 5, 7, 6, 9, 2],
    [2, 1, 9, 7, 6, 4, 8, 5, 3],
    [3, 6, 8, 5, 9, 1, 7, 2, 4],
    [4, 5, 7, 8, 2, 3, 9, 1, 6],
    [1, 9, 6, 2, 3, 5, 4, 8, 7],
    [7, 8, 4, 9, 1, 6, 2, 3, 5],
    [5, 3, 2, 4, 7, 8, 1, 6, 9],
  ],
  template_c: [
    [1, 8, 6, 5, 4, 9, 3, 7, 2],
    [7, 5, 3, 1, 8, 2, 9, 6, 4],
    [9, 2, 4, 6, 3, 7, 1, 8, 5],
    [3, 6, 7, 2, 5, 4, 8, 9, 1],
    [2, 1, 9, 3, 7, 8, 4, 5, 6],
    [5, 4, 8, 9, 1, 6, 7, 2, 3],
    [6, 7, 2, 4, 9, 3, 5, 1, 8],
    [4, 9, 5, 8, 2, 1, 6, 3, 7],
    [8, 3, 1, 7, 6, 5, 2, 4, 9],
  ],
};

// https://ui.adsabs.harvard.edu/abs/2024IEEEA..12j4254W/abstract
const puzzleTemplates = {
  template_a: ["601009000", "090040053", "004200019", "300090706", "000000000", "906070005", "410007500", "780030090", "000400307"],
  template_b: ["000600001", "000040000", "043050092", "009000803", "000501000", "407000910", "190030480", "000010000", "500008000"],
  template_c: ["086500000", "703002000", "920000000", "060050890", "200000006", "048010020", "000000018", "000800607", "000705240"],
};

const failureReasons = {
  uv: [
    { label: "紫外观测失败：仪器故障", weight: 40 },
  ],
  optical: [
    { label: "光学观测失败：天气多云", weight: 20 },
    { label: "光学观测失败：天气下雨", weight: 35 },
    { label: "光学观测失败：电缆被动物们咬断啦", weight: 5 },
    { label: "光学观测失败：镜片发霉需要清理", weight: 5 },
  ],
  radio: [
    { label: "射电观测失败：RFI 干扰", weight: 20 },
    { label: "射电观测失败：天线故障", weight: 10 },
    { label: "射电观测失败：热带气旋经过", weight: 5 },
    { label: "射电观测失败：雷暴天气", weight: 10 },
  ],
};

const bandLabels = {
  uv: "紫外",
  optical: "光学",
  radio: "射电",
};

const MAX_OBSERVATIONS = 5;
const MAX_TIMER_SECONDS = 99 * 60 * 60 + 59 * 60 + 59;
const OBSERVATION_TIME_COST = 5 * 60;
const DEFAULT_TEMPLATE = "template_b";

const state = {
  currentTemplate: DEFAULT_TEMPLATE,
  puzzle: [],
  solution: [],
  board: [],
  selectedRow: null,
  selectedCol: null,
  observationsLeft: MAX_OBSERVATIONS,
  successfulObservations: 0,
  observationPending: false,
  logs: [],
  elapsedSeconds: 0,
  timerId: null,
};
const cellRefs = Array.from({ length: 9 }, () => Array(9).fill(null));

const sudokuGrid = document.getElementById("sudokuGrid");
const axisTop = document.getElementById("axisTop");
const axisLeft = document.getElementById("axisLeft");
const paletteGrid = document.getElementById("paletteGrid");
const legendList = document.getElementById("legendList");
const observationLog = document.getElementById("observationLog");
const boardStatus = document.getElementById("boardStatus");
const selectedBar = document.getElementById("selectedBar");
const observationCount = document.getElementById("observationCount");
const timerChip = document.getElementById("timerChip");
const resetBoardButton = document.getElementById("resetBoardButton");
const submitBoardButton = document.getElementById("submitBoardButton");
const openLegendButton = document.getElementById("openLegendButton");
const templateSelect = document.getElementById("templateSelect");
const bandButtons = [...document.querySelectorAll(".band-button")];
const closeModalButtons = [...document.querySelectorAll("[data-close-modal]")];

function getPuzzle(templateKey = state.currentTemplate) {
  return puzzleTemplates[templateKey].map((row) => [...row].map((value) => Number(value)));
}

function getObservationLimit(templateKey = state.currentTemplate) {
  if (templateKey === "template_c") return 2;
  if (templateKey === "template_b") return 3;
  return MAX_OBSERVATIONS;
}

function cloneGrid(grid) {
  return grid.map((row) => [...row]);
}

function rotateGrid(grid) {
  return grid[0].map((_, colIndex) => grid.map((row) => row[colIndex]).reverse());
}

function mirrorGrid(grid) {
  return grid.map((row) => [...row].reverse());
}

function randomizeGridPair(puzzleGrid, solutionGrid) {
  let nextPuzzle = cloneGrid(puzzleGrid);
  let nextSolution = cloneGrid(solutionGrid);
  const rotations = Math.floor(Math.random() * 4);

  for (let step = 0; step < rotations; step += 1) {
    nextPuzzle = rotateGrid(nextPuzzle);
    nextSolution = rotateGrid(nextSolution);
  }

  if (Math.random() < 0.5) {
    nextPuzzle = mirrorGrid(nextPuzzle);
    nextSolution = mirrorGrid(nextSolution);
  }

  return { puzzle: nextPuzzle, solution: nextSolution };
}

function renderAxes() {
  axisTop.innerHTML = "<span></span>";
  axisLeft.innerHTML = "";
  for (let index = 1; index <= 9; index += 1) {
    const top = document.createElement("span");
    top.textContent = `C${index}`;
    axisTop.appendChild(top);

    const left = document.createElement("span");
    left.textContent = `R${index}`;
    axisLeft.appendChild(left);
  }
}

function getBodyByNumber(number) {
  return bodies[number - 1];
}

function getIconUrl(filename) {
  return `${window.skySudokuAssetBase}${filename}`;
}

function isBoardComplete() {
  return state.board.every((row) => row.every((value) => value !== 0));
}

function isBoardCorrect() {
  return state.board.every((row, rowIndex) => row.every((value, colIndex) => value === state.solution[rowIndex][colIndex]));
}

function formatElapsed(seconds) {
  const safe = Math.max(0, Math.min(seconds, MAX_TIMER_SECONDS));
  const hours = String(Math.floor(safe / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((safe % 3600) / 60)).padStart(2, "0");
  const secs = String(safe % 60).padStart(2, "0");
  return `${hours}:${minutes}:${secs}`;
}

function renderTimer() {
  timerChip.textContent = formatElapsed(state.elapsedSeconds);
}

function renderSubmitState() {
  submitBoardButton.disabled = !isBoardComplete();
}

function stopTimer() {
  if (state.timerId === null) return;
  window.clearInterval(state.timerId);
  state.timerId = null;
}

function startTimer() {
  stopTimer();
  renderTimer();
  state.timerId = window.setInterval(() => {
    if (state.elapsedSeconds >= MAX_TIMER_SECONDS) {
      stopTimer();
      return;
    }
    state.elapsedSeconds += 1;
    renderTimer();
  }, 1000);
}

function renderBoard() {
  sudokuGrid.innerHTML = "";
  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const value = state.board[row][col];
      const body = value ? getBodyByNumber(value) : null;
      const cell = document.createElement("div");
      cell.className = "cell";
      if (state.puzzle[row][col]) cell.classList.add("given");
      if (row === state.selectedRow && col === state.selectedCol) cell.classList.add("selected");
      if (row === 2 || row === 5) cell.classList.add("subgrid-bottom");
      if (col === 2 || col === 5) cell.classList.add("subgrid-right");
      if (body) {
        const image = document.createElement("img");
        image.className = "cell-icon";
        image.src = getIconUrl(body.icon);
        image.alt = body.name;
        cell.appendChild(image);
      }
      if (!state.puzzle[row][col]) {
        cell.setAttribute("role", "button");
        cell.setAttribute("tabindex", "0");
        cell.addEventListener("click", () => {
          if (state.selectedRow === row && state.selectedCol === col) return;
          setSelectedCell(row, col);
          renderSelectedBar();
        });
        cell.addEventListener("keydown", (event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          if (state.selectedRow === row && state.selectedCol === col) return;
          setSelectedCell(row, col);
          renderSelectedBar();
        });
      }
      cellRefs[row][col] = cell;
      sudokuGrid.appendChild(cell);
    }
  }
}

function setSelectedCell(row, col) {
  if (state.selectedRow !== null && state.selectedCol !== null) {
    cellRefs[state.selectedRow][state.selectedCol]?.classList.remove("selected");
  }
  state.selectedRow = row;
  state.selectedCol = col;
  cellRefs[row][col]?.classList.add("selected");
}

function renderPalette() {
  paletteGrid.innerHTML = "";
  for (const body of bodies) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "palette-card";
    card.innerHTML = `
      <img src="${getIconUrl(body.icon)}" alt="${body.name}">
      <div class="palette-name">${body.name}</div>
    `;
    card.addEventListener("click", () => placeBody(body));
    paletteGrid.appendChild(card);
  }
}

function renderLegend() {
  legendList.innerHTML = "";
  for (const body of bodies) {
    const item = document.createElement("div");
    item.className = "legend-card";
    item.innerHTML = `
      <img src="${getIconUrl(body.icon)}" alt="${body.name}">
      <div class="legend-name">${body.name}</div>
      <div class="legend-copy">UV ${body.bands.uv} / 光学 ${body.bands.optical} / 射电 ${body.bands.radio}</div>
    `;
    legendList.appendChild(item);
  }
}

function renderSelectedBar() {
  if (state.selectedRow === null || state.selectedCol === null) {
    selectedBar.innerHTML = "请选中一个格子。";
    return;
  }
  const row = state.selectedRow + 1;
  const col = state.selectedCol + 1;
  const value = state.board[state.selectedRow][state.selectedCol];
  const label = value ? getBodyByNumber(value).name : "空格";
  const given = state.puzzle[state.selectedRow][state.selectedCol] ? "题面格，可观测不可改。" : "可填写。";
  selectedBar.innerHTML = `<strong>R${row}C${col}</strong> · <strong>${label}</strong> · ${given}`;
}

function placeBody(body) {
  if (state.selectedRow === null || state.selectedCol === null) {
    setBoardStatus("先点一个空格，再从天体面板里填入。", "bad");
    return;
  }
  if (state.puzzle[state.selectedRow][state.selectedCol]) {
    setBoardStatus("题面给定格不能修改，请换一个空格。", "bad");
    return;
  }
  state.board[state.selectedRow][state.selectedCol] = bodies.indexOf(body) + 1;
  renderBoard();
  renderSelectedBar();
  renderSubmitState();
  setBoardStatus(`已在 R${state.selectedRow + 1}C${state.selectedCol + 1} 填入 ${body.name}。`, "");
}

function setBoardStatus(message, tone) {
  boardStatus.className = `result-banner${tone ? ` ${tone}` : ""}`;
  boardStatus.textContent = message;
}

function resetBoard() {
  const randomized = randomizeGridPair(getPuzzle(), solutions[state.currentTemplate]);
  state.puzzle = randomized.puzzle;
  state.solution = randomized.solution;
  state.board = cloneGrid(state.puzzle);
  state.selectedRow = null;
  state.selectedCol = null;
  state.observationsLeft = getObservationLimit();
  state.successfulObservations = 0;
  state.observationPending = false;
  state.logs = [];
  state.elapsedSeconds = 0;
  renderBoard();
  renderSelectedBar();
  renderObservationMeter();
  renderSubmitState();
  renderLogs();
  renderTimer();
  startTimer();
  setBoardStatus("请先完成全部填空。", "");
}

function renderObservationMeter() {
  observationCount.textContent = `${state.observationsLeft} / ${getObservationLimit()}`;
  for (const button of bandButtons) {
    button.disabled = state.observationsLeft <= 0 || state.observationPending;
  }
}

function weightedChoice(options) {
  const total = options.reduce((sum, option) => sum + option.weight, 0);
  let cursor = Math.random() * total;
  for (const option of options) {
    cursor -= option.weight;
    if (cursor <= 0) return option.label;
  }
  return options[options.length - 1].label;
}

function getFailureProbability(band) {
  const totalWeight = failureReasons[band].reduce((sum, option) => sum + option.weight, 0);
  return Math.min(Math.max(totalWeight / 100, 0), 0.95);
}

function observeCell(band) {
  if (state.selectedRow === null || state.selectedCol === null) {
    setBoardStatus("先选择一个格子，再发起观测。", "bad");
    return;
  }
  if (state.observationPending) {
    setBoardStatus("当前观测尚未结束，请稍等。", "bad");
    return;
  }
  if (state.observationsLeft <= 0) {
    setBoardStatus("观测次数已经用完了。", "bad");
    return;
  }

  const row = state.selectedRow;
  const col = state.selectedCol;
  const attemptIndex = getObservationLimit() - state.observationsLeft + 1;
  const mustSucceed = state.successfulObservations === 0 && attemptIndex === getObservationLimit();
  state.observationsLeft -= 1;
  state.observationPending = true;
  renderObservationMeter();

  let result;
  const startTimestamp = state.elapsedSeconds;
  if (!mustSucceed && Math.random() < getFailureProbability(band)) {
    const failureReason = weightedChoice(failureReasons[band]);
    result = {
      ok: false,
      title: `${bandLabels[band]}观测失败`,
      detail: failureReason,
      summary: `观测坐标：R${row + 1}C${col + 1}; 使用波段：${bandLabels[band]}; 观测结果：失败。${failureReason}`,
      value: null,
    };
  } else {
    const solvedBody = getBodyByNumber(state.solution[row][col]);
    const brightness = solvedBody.bands[band];
    result = {
      ok: true,
      title: `${bandLabels[band]}观测成功`,
      detail: `R${row + 1}C${col + 1} 在 ${bandLabels[band]}波段显示为「${brightness}」。目标天体的真实类型仍需你结合数独继续判断。`,
      summary: `观测坐标：R${row + 1}C${col + 1}; 使用波段：${bandLabels[band]}; 观测结果：${brightness}`,
      value: brightness,
    };
    state.successfulObservations += 1;
  }

  const endTimestamp = Math.min(startTimestamp + OBSERVATION_TIME_COST, MAX_TIMER_SECONDS);
  state.logs.push({
    id: `${Date.now()}-${Math.random()}`,
    startTimestamp,
    endTimestamp,
    row: row + 1,
    col: col + 1,
    bandLabel: bandLabels[band],
    ok: result.ok,
    detail: result.detail,
    value: result.value,
    completed: false,
  });
  renderLogs();
  setBoardStatus(`观测已启动：R${row + 1}C${col + 1} / ${bandLabels[band]}`, "");

  window.setTimeout(() => {
    const targetLog = state.logs[state.logs.length - 1];
    if (targetLog) targetLog.completed = true;
    state.elapsedSeconds = endTimestamp;
    state.observationPending = false;
    renderTimer();
    renderObservationMeter();
    renderLogs();
    const tone = result.ok ? "" : "bad";
    setBoardStatus(result.ok ? `${result.summary}。${result.detail}` : result.summary, tone);
  }, 1000);
}

function submitBoard() {
  if (!isBoardComplete()) {
    setBoardStatus("请先完成全部填空。", "bad");
    return;
  }
  stopTimer();
  if (isBoardCorrect()) {
    setBoardStatus(`恭喜您回答正确。用时 ${formatElapsed(state.elapsedSeconds)}`, "good");
    return;
  }
  setBoardStatus(`结果不正确哦。用时 ${formatElapsed(state.elapsedSeconds)}`, "bad");
}

function renderLogs() {
  observationLog.innerHTML = "";
  if (!state.logs.length) {
    observationLog.innerHTML = '<div class="log-line">[00:00:00] 欢迎来到火烧寮天文台，我们有功能强大的光学、紫外、射电望远镜，欢迎使用！</div>';
    return;
  }
  observationLog.innerHTML = state.logs
    .map((log) => {
      const startLine = `<div class="log-line">[${formatElapsed(log.startTimestamp)}] 观测开始。观测坐标：R${log.row}C${log.col}; 使用波段：${log.bandLabel}</div>`;
      if (!log.completed) return startLine;
      const endDetail = log.ok ? `观测结果：${log.value}` : `观测结果：失败。${log.detail}`;
      const endLine = `<div class="log-line ${log.ok ? "success" : "fail"}">[${formatElapsed(log.endTimestamp)}] 观测结束。${endDetail}</div>`;
      return `${startLine}${endLine}`;
    })
    .join("");
  observationLog.scrollTop = observationLog.scrollHeight;
}

function openModalById(id) {
  const target = document.getElementById(id);
  if (!target) return;
  target.classList.add("show");
  target.setAttribute("aria-hidden", "false");
}

function closeModalById(id) {
  const target = document.getElementById(id);
  if (!target) return;
  target.classList.remove("show");
  target.setAttribute("aria-hidden", "true");
}

resetBoardButton.addEventListener("click", resetBoard);
submitBoardButton.addEventListener("click", submitBoard);
openLegendButton.addEventListener("click", () => openModalById("legendModal"));
templateSelect?.addEventListener("change", (event) => {
  state.currentTemplate = event.target.value;
  resetBoard();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModalById("legendModal");
  }
});
for (const button of closeModalButtons) {
  button.addEventListener("click", () => closeModalById(button.dataset.closeModal));
}
for (const modalElement of [...document.querySelectorAll(".modal")]) {
  modalElement.addEventListener("click", (event) => {
    if (event.target === modalElement) closeModalById(modalElement.id);
  });
}
for (const button of bandButtons) {
  button.addEventListener("click", () => observeCell(button.dataset.band));
}

resetBoard();
renderAxes();
renderPalette();
renderLegend();
