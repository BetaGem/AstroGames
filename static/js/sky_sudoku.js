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

const solution = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [4, 5, 6, 7, 8, 9, 1, 2, 3],
  [7, 8, 9, 1, 2, 3, 4, 5, 6],
  [2, 3, 4, 5, 6, 7, 8, 9, 1],
  [5, 6, 7, 8, 9, 1, 2, 3, 4],
  [8, 9, 1, 2, 3, 4, 5, 6, 7],
  [3, 4, 5, 6, 7, 8, 9, 1, 2],
  [6, 7, 8, 9, 1, 2, 3, 4, 5],
  [9, 1, 2, 3, 4, 5, 6, 7, 8],
];

const puzzleTemplates = {
  template_a: ["100400700", "050080020", "009003006", "200507800", "060090030", "001204007", "300600900", "070010040", "002005008"],
  template_b: ["120400700", "006080023", "080003400", "204060801", "060801030", "801030507", "305600010", "670010300", "002005078"],
  template_c: ["020450080", "400089003", "089100400", "204500890", "067091034", "090230507", "340078900", "008910045", "900345070"],
};

const failureReasons = {
  uv: [
    { label: "紫外观测失败：仪器故障", weight: 20 },
  ],
  optical: [
    { label: "光学观测失败：天气多云", weight: 15 },
    { label: "光学观测失败：天气下雨", weight: 5 },
  ],
  radio: [
    { label: "射电观测失败：RFI 干扰", weight: 15 },
    { label: "射电观测失败：仪器故障", weight: 5 },
  ],
};

const bandLabels = {
  uv: "紫外",
  optical: "光学",
  radio: "射电",
};

const MAX_OBSERVATIONS = 5;
const MAX_TIMER_SECONDS = 99 * 60 * 60 + 59 * 60 + 59;
const DEFAULT_TEMPLATE = "template_b";

const state = {
  currentTemplate: DEFAULT_TEMPLATE,
  puzzle: getPuzzle(DEFAULT_TEMPLATE),
  board: getPuzzle(DEFAULT_TEMPLATE),
  selectedRow: null,
  selectedCol: null,
  observationsLeft: MAX_OBSERVATIONS,
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
  return state.board.every((row, rowIndex) => row.every((value, colIndex) => value === solution[rowIndex][colIndex]));
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
  state.puzzle = getPuzzle();
  state.board = state.puzzle.map((row) => [...row]);
  state.selectedRow = null;
  state.selectedCol = null;
  state.observationsLeft = MAX_OBSERVATIONS;
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
  observationCount.textContent = `${state.observationsLeft} / ${MAX_OBSERVATIONS}`;
  for (const button of bandButtons) {
    button.disabled = state.observationsLeft <= 0;
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

function observeCell(band) {
  if (state.selectedRow === null || state.selectedCol === null) {
    setBoardStatus("先选择一个格子，再发起观测。", "bad");
    return;
  }
  if (state.observationsLeft <= 0) {
    setBoardStatus("观测次数已经用完了。", "bad");
    return;
  }

  const row = state.selectedRow;
  const col = state.selectedCol;
  state.observationsLeft -= 1;
  renderObservationMeter();

  let result;
  if (Math.random() < 0.2) {
    result = {
      ok: false,
      title: `${bandLabels[band]}观测失败`,
      detail: weightedChoice(failureReasons[band]),
      summary: `R${row + 1}C${col + 1} · ${bandLabels[band]} · 失败`,
    };
  } else {
    const solvedBody = getBodyByNumber(solution[row][col]);
    const brightness = solvedBody.bands[band];
    result = {
      ok: true,
      title: `${bandLabels[band]}观测成功`,
      detail: `R${row + 1}C${col + 1} 在 ${bandLabels[band]}波段显示为「${brightness}」。目标天体的真实类型仍需你结合数独继续判断。`,
      summary: `R${row + 1}C${col + 1} · ${bandLabels[band]} · ${brightness}`,
    };
  }

  state.logs.unshift({
    id: `${Date.now()}-${Math.random()}`,
    ok: result.ok,
    title: result.title,
    summary: result.summary,
    detail: result.detail,
  });
  renderLogs();
  const tone = result.ok ? "" : "bad";
  setBoardStatus(`${result.summary}。${result.detail}`, tone);
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
    observationLog.innerHTML = '<div class="log-line">[日志] 暂无观测记录</div>';
    return;
  }
  observationLog.innerHTML = state.logs
    .map((log) => `<div class="log-line ${log.ok ? "success" : "fail"}">[日志] ${log.summary}${log.ok ? "" : ` · ${log.detail}`}</div>`)
    .join("");
  observationLog.scrollTop = 0;
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

renderAxes();
renderBoard();
renderPalette();
renderLegend();
renderSelectedBar();
renderObservationMeter();
renderSubmitState();
renderLogs();
startTimer();
