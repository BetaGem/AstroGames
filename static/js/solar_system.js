const planetCatalog = [
  { id: "mercury", name: "水星", order: 1, visualClass: "mercury", visualStyle: "background: radial-gradient(circle at 35% 30%, #ded8cf, #8d7f73 68%, #584e49 100%);" },
  { id: "venus", name: "金星", order: 2, visualClass: "venus", visualStyle: "background: radial-gradient(circle at 35% 30%, #f3d59a, #cc9354 70%, #8a5830 100%);" },
  { id: "earth", name: "地球", order: 3, visualClass: "earth", visualStyle: "background: radial-gradient(circle at 35% 30%, #bde7ff, #2a7fcb 62%, #145384 100%);" },
  { id: "mars", name: "火星", order: 4, visualClass: "mars", visualStyle: "background: radial-gradient(circle at 35% 30%, #ffbd8d, #cb6944 64%, #7b3322 100%);" },
  { id: "jupiter", name: "木星", order: 5, visualClass: "jupiter", visualStyle: "background: linear-gradient(180deg, #e7c9a7, #d89762 25%, #f2d9bc 45%, #b57145 68%, #f4d6ae 100%);" },
  { id: "saturn", name: "土星", order: 6, visualClass: "saturn ringed", visualStyle: "background: radial-gradient(circle at 35% 30%, #f1deb0, #c7aa67 68%, #8f7342 100%);" },
  { id: "uranus", name: "天王星", order: 7, visualClass: "uranus", visualStyle: "background: radial-gradient(circle at 35% 30%, #d3fbff, #7cd5d9 65%, #3b8b93 100%);" },
  { id: "neptune", name: "海王星", order: 8, visualClass: "neptune", visualStyle: "background: radial-gradient(circle at 35% 30%, #bfe2ff, #457dd8 62%, #183d8c 100%);" },
];

const questionBank = [
  { id: "asteroid-belt", type: "multi", prompt: "小行星带位于哪两颗行星之间？", answers: ["mars", "jupiter"], explanation: "小行星带位于火星和木星的轨道之间。范围大约是距离太阳2.17到3.64天文单位。" },
  { id: "kuiper-belt", type: "single", prompt: "柯伊伯带位于哪颗行星之外？", answers: ["neptune"], explanation: "柯伊伯带是一个小型冰冻天体聚集的区域，位于海王星轨道之外，距离太阳大约30到55天文单位之间。" },
  { id: "smallest", type: "single", prompt: "最小的行星是哪一颗？", answers: ["mercury"], explanation: "水星是太阳系八大行星中体积和质量都最小的一颗。" },
  { id: "largest", type: "single", prompt: "最大的行星是哪一颗？", answers: ["jupiter"], explanation: "木星是太阳系里最大的行星，体积可以装下1300多个地球。" },
  { id: "hottest", type: "single", prompt: "最热的行星是哪一颗？", answers: ["venus"], explanation: "虽然水星离太阳最近，但金星的浓厚大气引发了强烈温室效应，平均温度比水星更高。" },
  { id: "rocky-planets", type: "multi", prompt: "岩石行星有哪些？", answers: ["mercury", "venus", "earth", "mars"], explanation: "水星、金星、地球、火星属于内侧的类地行星，也就是岩石行星。" },
  { id: "rings", type: "single", prompt: "哪颗行星以最显眼的光环著称？", answers: ["saturn"], explanation: "土星的环最醒目，也是很多人一眼就能认出来的行星特征。" },
  { id: "blue-green", type: "single", prompt: "自转轴倾斜很大的是哪颗行星？", answers: ["uranus"], explanation: "天王星的自转轴倾角约98度，几乎与其公转轨道平面平行，是“躺着转”的行星。" },
  { id: "red", type: "single", prompt: "被称为“红色星球”的是哪一颗？", answers: ["mars"], explanation: "火星表面富含氧化铁，因此整体看起来偏红。" },
  { id: "ice-giants", type: "multi", prompt: "冰巨星有哪些？", answers: ["uranus", "neptune"], explanation: "天王星和海王星通常被归为冰巨星，它们内部含有更多“冰”成分，如水冰、固态的氨和甲烷等。" },
  { id: "cloudiest", type: "single", prompt: "哪颗岩石行星被厚厚的大气包裹，表面很难直接看到？", answers: ["venus"], explanation: "金星有非常浓厚的大气和云层，它虽然明亮，却很难直接看到表面。" },
  { id: "cratered", type: "single", prompt: "哪颗行星表面布满陨石坑，外观看起来最像灰色岩石球？", answers: ["mercury"], explanation: "水星几乎没有大气层保护，保留了大量古老的撞击坑。" },
  { id: "great-red-spot", type: "single", prompt: "哪颗行星以巨大的条纹和“大红斑”最有名？", answers: ["jupiter"], explanation: "木星表面的条纹来自大气流动，而大红斑则是一场持续多年的巨大风暴。" },
  { id: "history", type: "single", prompt: "哪颗行星被称为“笔尖上的行星”？", answers: ["neptune"], explanation: "天文学者利用天王星轨道的摄动现象推测出了海王星的存在与可能的位置，最终被证实，因而它被称为“笔尖上算出的行星”。" },
  { id: "satellite-free", type: "multi", prompt: "哪些行星没有天然卫星环绕？", answers: ["mercury", "venus"], explanation: "水星、金星没有天然卫星。地球有一颗（月球），火星有两颗（火卫一、火卫二），其他四颗巨行星都有众多卫星。" },
];

const planetAtlasCatalog = [
  { id: "mercury", name: "水星", subtitle: "离太阳最近，也最小巧", style: "background: radial-gradient(circle at 35% 30%, #ded8cf, #8d7f73 68%, #584e49 100%);", ringed: false, distance: "约 5,790 万千米", type: "岩石行星", diameter: "约 4,879 千米", year: "约 88 个地球日", summary: "水星表面布满大量撞击坑，看起来很像放大版的月球。因为几乎没有大气，它白天和夜晚的温差可达 600°C。", history: "水星古称「辰星」。由于它总是贴近太阳附近出现，人们只能在黎明或黄昏短暂地看到它。" },
  { id: "venus", name: "金星", subtitle: "明亮耀眼，却被浓云遮蔽", style: "background: radial-gradient(circle at 35% 30%, #f3d59a, #cc9354 70%, #8a5830 100%);", ringed: false, distance: "约 1.082 亿千米", type: "岩石行星", diameter: "约 12,104 千米", year: "约 225 个地球日", summary: "金星大小和地球接近，但被厚厚的大气与云层包裹，产生强烈温室效应，因此它比水星更热。", history: "金星是天空中最亮的行星之一，古代常被分作晨星和昏星。后来人们才知道，它们其实是同一颗星。" },
  { id: "earth", name: "地球", subtitle: "目前已知唯一存在生命的行星", style: "background: radial-gradient(circle at 35% 30%, #bde7ff, #2a7fcb 62%, #145384 100%);", ringed: false, distance: "约 1.496 亿千米", type: "岩石行星", diameter: "约 12,742 千米", year: "365.25 天", summary: "地球表面有液态水、稳定大气和适中的温度，是目前已知唯一孕育生命的行星。", history: "人类对地球的认识经历了漫长演变，从“天圆地方”到现代天文学，才逐步建立起我们在太阳系中的位置感。" },
  { id: "mars", name: "火星", subtitle: "红色星球，常被当作移民候选", style: "background: radial-gradient(circle at 35% 30%, #ffbd8d, #cb6944 64%, #7b3322 100%);", ringed: false, distance: "约 2.279 亿千米", type: "岩石行星", diameter: "约 6,779 千米", year: "约 687 个地球日", summary: "火星因为表面富含氧化铁而显红色。它有极冠、峡谷和古老河道痕迹，是寻找地外生命的重要目标之一。", history: "由于颜色偏红，火星在很多古代文明里都与战争或火焰相关联。现代则把它视作深空探测的重点。" },
  { id: "jupiter", name: "木星", subtitle: "太阳系最大的行星", style: "background: linear-gradient(180deg, #e7c9a7, #d89762 25%, #f2d9bc 45%, #b57145 68%, #f4d6ae 100%);", ringed: false, distance: "约 7.785 亿千米", type: "气态巨行星", diameter: "约 139,820 千米", year: "约 11.86 个地球年", summary: "木星拥有厚厚的大气层和明显条纹，大红斑是一场持续多年的巨大风暴。它的引力也深刻影响着太阳系其它天体的分布。", history: "伽利略在 1610 年观测到木星的四颗大卫星，这成为支持“并非所有天体都绕地球转”的重要证据。" },
  { id: "saturn", name: "土星", subtitle: "以华丽光环闻名", style: "background: radial-gradient(circle at 35% 30%, #f1deb0, #c7aa67 68%, #8f7342 100%);", ringed: true, distance: "约 14.33 亿千米", type: "气态巨行星", diameter: "约 116,460 千米", year: "约 29.5 个地球年", summary: "土星最著名的特征是壮观的环系统。虽然其他巨行星也有环，但土星的最明显。土星也是太阳系中密度最小的行星，其密度甚至低于水。", history: "早期望远镜时代，人们一度不明白土星两侧“耳朵”般的结构是什么，将它们误认为是卫星。后来才确认那其实是环。" },
  { id: "uranus", name: "天王星", subtitle: "像是躺着旋转的蓝绿色行星", style: "background: radial-gradient(circle at 35% 30%, #d3fbff, #7cd5d9 65%, #3b8b93 100%);", ringed: false, distance: "约 28.72 亿千米", type: "冰巨行星", diameter: "约 50,724 千米", year: "约 84 个地球年", summary: "天王星颜色偏蓝绿色，主要来自大气中的甲烷。它最特别的是自转轴倾角极大，看起来几乎像侧躺着公转。", history: "天王星是第一颗在近代通过望远镜发现的行星。1781 年赫歇耳观测到它时，最初还以为是一颗彗星。" },
  { id: "neptune", name: "海王星", subtitle: "最外侧的深蓝世界", style: "background: radial-gradient(circle at 35% 30%, #bfe2ff, #457dd8 62%, #183d8c 100%);", ringed: false, distance: "约 45.0 亿千米", type: "冰巨行星", diameter: "约 49,244 千米", year: "约 164.8 个地球年", summary: "海王星颜色深蓝，风暴活动强烈，风速可达 2400km/h。它是八大行星中离太阳最远的一颗。", history: "海王星被称为“笔尖下的行星”。天文学家根据天王星轨道异常推算出它的位置，后来果然观测到了它。" },
  { id: "pluto", name: "冥王星", subtitle: "著名矮行星，属于柯伊伯带天体", visualClass: "pluto", style: "background: radial-gradient(circle at 35% 30%, #ead7c0, #9a7b62 62%, #5c4335 100%);", ringed: false, distance: "约 59 亿千米", type: "矮行星", diameter: "约 2,377 千米", year: "约 248 个地球年", summary: "冥王星体积很小，表面覆盖着氮冰、甲烷冰和一片著名的心形亮区。它轨道很椭圆，也和八大行星明显不同。", history: "1930 年汤博发现冥王星后，它曾长期被列为第九大行星。2006 年国际天文学联合会重新定义“行星”后，冥王星被归入矮行星。" },
  { id: "ceres", name: "谷神星", subtitle: "小行星带里最大的天体", visualClass: "ceres", style: "background: radial-gradient(circle at 35% 30%, #d9d4cf, #98928d 66%, #615c58 100%);", ringed: false, distance: "约 4.14 亿千米", type: "矮行星", diameter: "约 940 千米", year: "约 4.6 个地球年", summary: "谷神星位于火星和木星之间的小行星带，是那小行星带最大的成员。它表面较暗，但局部存在明亮盐类沉积。", history: "1801 年皮亚齐发现谷神星时，人们一度把它当成新行星。后来随着更多类似天体被找到，它被归入小行星；2006 年又被列为矮行星。" },
  { id: "vesta", name: "灶神星", subtitle: "最亮的小行星之一", visualClass: "vesta", style: "background: radial-gradient(circle at 35% 30%, #ddd0c1, #ab8f76 66%, #6d5645 100%);", ringed: false, distance: "约 3.53 亿千米", type: "大型小行星", diameter: "约 525 千米", year: "约 3.6 个地球年", summary: "灶神星是小行星带中质量最大的成员之一，内部曾发生分层，表面有巨大的撞击盆地，和普通碎石状小行星不太一样。", history: "1807 年奥伯斯发现灶神星。现代探测器“黎明号”曾近距离考察它，让我们看到它复杂的地质历史。" },
  { id: "eris", name: "阋神星", subtitle: "比冥王星稍小但质量更大", visualClass: "eris", style: "background: radial-gradient(circle at 35% 30%, #f2f5fb, #b8c2d2 62%, #68758d 100%);", ringed: false, distance: "约 101 亿千米", type: "矮行星", diameter: "约 2,326 千米", year: "约 558 个地球年", summary: "阋神星位于太阳系非常外侧，表面极冷，反照率较高，看起来像一颗带冰霜的遥远小世界。它的发现提醒人们：太阳系外缘还有不少大型天体。", history: "2005 年阋神星被发现后，因为它和冥王星体量接近甚至更重，引发了“什么才算行星”的讨论，最终推动了矮行星分类的确立。" },
];

const slotGrid = document.getElementById("slotGrid");
const tray = document.getElementById("tray");
const stageOneStatus = document.getElementById("stageOneStatus");
const checkOrderButton = document.getElementById("checkOrderButton");
const resetOrderButton = document.getElementById("resetOrderButton");
const stageTwoLocked = document.getElementById("stageTwoLocked");
const quizArea = document.getElementById("quizArea");
const quizSummary = document.getElementById("quizSummary");
const quizCards = document.getElementById("quizCards");
const quizProgressTitle = document.getElementById("quizProgressTitle");
const quizProgressMeta = document.getElementById("quizProgressMeta");
const questionTypeBadge = document.getElementById("questionTypeBadge");
const questionTitle = document.getElementById("questionTitle");
const quizStatus = document.getElementById("quizStatus");
const quizExplanation = document.getElementById("quizExplanation");
const submitQuizAnswerButton = document.getElementById("submitQuizAnswerButton");
const clearSelectionButton = document.getElementById("clearSelectionButton");
const nextQuestionButton = document.getElementById("nextQuestionButton");
const scoreRing = document.getElementById("scoreRing");
const summaryText = document.getElementById("summaryText");
const summaryList = document.getElementById("summaryList");
const restartGameButton = document.getElementById("restartGameButton");

const state = {
  revealed: new Set(),
  orderSlots: Array(planetCatalog.length).fill(null),
  trayOrder: [],
  stageOneComplete: false,
  quizQuestions: [],
  currentQuestionIndex: 0,
  quizSelection: new Set(),
  score: 0,
  quizAnswered: false,
  quizResults: [],
};

let activeAtlasPlanetId = planetAtlasCatalog[0].id;

function shuffle(array) {
  const cloned = [...array];
  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [cloned[index], cloned[swapIndex]] = [cloned[swapIndex], cloned[index]];
  }
  return cloned;
}

function createPlanetCard(planet, context) {
  const card = document.createElement("div");
  card.className = `planet-card${context === "slot" ? " slot-card" : ""}`;
  card.draggable = context === "tray" || context === "slot";
  card.dataset.planetId = planet.id;
  const showName = context === "quiz" || context === "tray" || state.stageOneComplete;
  const showHintButton = context === "tray" && !state.stageOneComplete;
  const isRevealed = state.revealed.has(planet.id) || state.stageOneComplete || context === "quiz";
  const nameText = isRevealed ? planet.name : "";
  card.innerHTML = `
    <div class="planet-visual ${planet.visualClass}" style="${planet.visualStyle}">
      <span class="planet-visual-sphere">
        <span class="planet-texture"></span>
        <span class="planet-clouds"></span>
        <span class="planet-detail"></span>
      </span>
    </div>
    ${showName ? `<div class="planet-name ${nameText ? "" : "is-hidden"}">${nameText}</div>` : ""}
    ${showHintButton ? '<button class="hint-button" type="button">提示</button>' : ""}
  `;
  if (isRevealed) card.classList.add("revealed");

  if (context === "tray" || context === "slot") {
    card.addEventListener("dragstart", (event) => {
      card.classList.add("dragging");
      event.dataTransfer.setData("text/plain", planet.id);
    });
    card.addEventListener("dragend", () => card.classList.remove("dragging"));
    const hintButton = card.querySelector(".hint-button");
    if (hintButton) {
      hintButton.addEventListener("click", (event) => {
        event.stopPropagation();
        state.revealed.add(planet.id);
        renderStageOne();
      });
    }
  } else {
    card.addEventListener("click", () => {
      if (!state.quizAnswered) toggleQuizSelection(planet.id);
    });
  }
  return card;
}

function attachDropBehavior(target, onDropPlanet) {
  target.addEventListener("dragover", (event) => {
    event.preventDefault();
    target.classList.add("drag-over");
  });
  target.addEventListener("dragleave", () => target.classList.remove("drag-over"));
  target.addEventListener("drop", (event) => {
    event.preventDefault();
    target.classList.remove("drag-over");
    const planetId = event.dataTransfer.getData("text/plain");
    if (planetId) onDropPlanet(planetId);
  });
}

function movePlanetToSlot(planetId, slotIndex) {
  const existingSlotIndex = state.orderSlots.findIndex((value) => value === planetId);
  if (existingSlotIndex >= 0) {
    state.orderSlots[existingSlotIndex] = null;
  } else {
    state.trayOrder = state.trayOrder.filter((id) => id !== planetId);
  }
  const displacedPlanet = state.orderSlots[slotIndex];
  if (displacedPlanet) state.trayOrder.push(displacedPlanet);
  state.orderSlots[slotIndex] = planetId;
  renderStageOne();
  if (!state.stageOneComplete && !state.orderSlots.includes(null)) evaluateOrderStage();
}

function movePlanetToTray(planetId) {
  const existingSlotIndex = state.orderSlots.findIndex((value) => value === planetId);
  if (existingSlotIndex >= 0) state.orderSlots[existingSlotIndex] = null;
  if (!state.trayOrder.includes(planetId)) state.trayOrder.push(planetId);
  renderStageOne();
}

function renderStageOne(feedback = null) {
  slotGrid.innerHTML = "";
  tray.innerHTML = "";
  state.orderSlots.forEach((planetId, index) => {
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.dataset.filled = planetId ? "true" : "false";
    if (feedback) {
      if (feedback.correctSlots.includes(index)) slot.classList.add("correct");
      else if (planetId) slot.classList.add("wrong");
    }
    slot.innerHTML = `<div class="slot-index">第 ${index + 1} 位</div>`;
    if (planetId) {
      const planet = planetCatalog.find((item) => item.id === planetId);
      slot.appendChild(createPlanetCard(planet, "slot"));
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "slot-placeholder";
      placeholder.textContent = index === 0 ? "离太阳最近" : index === 7 ? "离太阳最远" : "拖到这里";
      slot.appendChild(placeholder);
    }
    attachDropBehavior(slot, (droppedPlanetId) => movePlanetToSlot(droppedPlanetId, index));
    slotGrid.appendChild(slot);
  });

  const trayDropZone = document.createElement("div");
  trayDropZone.className = "card-grid";
  attachDropBehavior(trayDropZone, movePlanetToTray);
  state.trayOrder.forEach((planetId) => {
    const planet = planetCatalog.find((item) => item.id === planetId);
    trayDropZone.appendChild(createPlanetCard(planet, "tray"));
  });
  tray.appendChild(trayDropZone);
}

function evaluateOrderStage() {
  if (state.orderSlots.includes(null)) {
    stageOneStatus.className = "status-box bad";
    stageOneStatus.textContent = "还有空位没填完，先把 8 张卡片都放进顺序槽里吧。";
    renderStageOne();
    return;
  }
  const correctSlots = [];
  let allCorrect = true;
  state.orderSlots.forEach((planetId, index) => {
    const planet = planetCatalog.find((item) => item.id === planetId);
    if (planet.order === index + 1) correctSlots.push(index);
    else allCorrect = false;
  });
  renderStageOne({ correctSlots });
  if (!allCorrect) {
    stageOneStatus.className = "status-box bad";
    stageOneStatus.textContent = `目前有 ${correctSlots.length} 个位置正确。点击「重新开始」重置游戏。`;
    return;
  }
  state.stageOneComplete = true;
  planetCatalog.forEach((planet) => state.revealed.add(planet.id));
  state.orderSlots = [...planetCatalog].sort((a, b) => a.order - b.order).map((planet) => planet.id);
  state.trayOrder = [];
  renderStageOne({ correctSlots: planetCatalog.map((_, index) => index) });
  stageOneStatus.className = "status-box good";
  stageOneStatus.textContent = "顺序完全正确。八大行星已经归位，下面进入第二轮小测验。";
  unlockQuizStage();
}

function buildQuizQuestions() {
  return shuffle(questionBank).slice(0, 10);
}

function unlockQuizStage() {
  stageTwoLocked.classList.add("hidden");
  quizArea.classList.remove("hidden");
  quizSummary.classList.add("hidden");
  state.quizQuestions = buildQuizQuestions();
  state.currentQuestionIndex = 0;
  state.quizSelection = new Set();
  state.score = 0;
  state.quizAnswered = false;
  state.quizResults = [];
  renderQuizQuestion();
}

function renderQuizCards() {
  quizCards.innerHTML = "";
  const currentQuestion = state.quizQuestions[state.currentQuestionIndex];
  planetCatalog.forEach((planet) => {
    const card = createPlanetCard(planet, "quiz");
    card.classList.add("revealed");
    if (state.quizSelection.has(planet.id)) card.classList.add("quiz-selected");
    if (state.quizAnswered) {
      const isCorrectAnswer = currentQuestion.answers.includes(planet.id);
      if (isCorrectAnswer) card.classList.add("quiz-correct");
      else if (state.quizSelection.has(planet.id)) card.classList.add("quiz-wrong");
    }
    quizCards.appendChild(card);
  });
}

function renderQuizQuestion() {
  const currentQuestion = state.quizQuestions[state.currentQuestionIndex];
  state.quizSelection = new Set();
  state.quizAnswered = false;
  quizExplanation.classList.add("hidden");
  quizExplanation.textContent = "";
  nextQuestionButton.classList.add("hidden");
  submitQuizAnswerButton.disabled = false;
  quizProgressTitle.textContent = `第 ${state.currentQuestionIndex + 1} / ${state.quizQuestions.length} 题`;
  quizProgressMeta.textContent = `当前得分：${state.score}`;
  questionTypeBadge.textContent = currentQuestion.type === "single" ? "单选题" : "多选题";
  questionTitle.textContent = currentQuestion.prompt;
  quizStatus.className = "status-box";
  quizStatus.textContent = currentQuestion.type === "single"
    ? "从 8 张行星卡里选出 1 张最符合题意的。"
    : "这是一道多选题，可能有多颗行星同时符合。";
  renderQuizCards();
}

function toggleQuizSelection(planetId) {
  const currentQuestion = state.quizQuestions[state.currentQuestionIndex];
  if (currentQuestion.type === "single") state.quizSelection = new Set([planetId]);
  else if (state.quizSelection.has(planetId)) state.quizSelection.delete(planetId);
  else state.quizSelection.add(planetId);
  renderQuizCards();
}

function compareAnswers(actualAnswers, selectedAnswers) {
  return actualAnswers.length === selectedAnswers.length && actualAnswers.every((answer) => selectedAnswers.includes(answer));
}

function submitQuizAnswer() {
  const currentQuestion = state.quizQuestions[state.currentQuestionIndex];
  const selectedAnswers = [...state.quizSelection];
  if (selectedAnswers.length === 0) {
    quizStatus.className = "status-box bad";
    quizStatus.textContent = "先选出你认为正确的行星，再提交答案。";
    return;
  }
  state.quizAnswered = true;
  submitQuizAnswerButton.disabled = true;
  const isCorrect = compareAnswers(currentQuestion.answers, selectedAnswers);
  if (isCorrect) state.score += 1;
  state.quizResults.push({ prompt: currentQuestion.prompt, isCorrect, explanation: currentQuestion.explanation });
  quizProgressMeta.textContent = `当前得分：${state.score}`;
  quizStatus.className = `status-box ${isCorrect ? "good" : "bad"}`;
  quizStatus.textContent = isCorrect ? "回答正确。" : `这道题没有答对，正确答案是：${currentQuestion.answers.map((id) => planetCatalog.find((planet) => planet.id === id).name).join("、")}。`;
  quizExplanation.classList.remove("hidden");
  quizExplanation.textContent = currentQuestion.explanation;
  renderQuizCards();
  if (state.currentQuestionIndex < state.quizQuestions.length - 1) nextQuestionButton.classList.remove("hidden");
  else setTimeout(showQuizSummary, 450);
}

function nextQuestion() {
  state.currentQuestionIndex += 1;
  renderQuizQuestion();
}

function getSummaryComment(score) {
  if (score === 10) return "满分通关。你已经熟练掌握太阳系的基础知识了。";
  if (score >= 8) return "很不错，太阳系的基础知识你已经掌握得很扎实。";
  if (score >= 6) return "你已经对太阳系有了基本的了解，继续努力！";
  return "再复习一下太阳系的相关知识，争取下次做得更好！";
}

function showQuizSummary() {
  quizArea.classList.add("hidden");
  quizSummary.classList.remove("hidden");
  scoreRing.textContent = `${state.score}/10`;
  summaryText.textContent = getSummaryComment(state.score);
  summaryList.innerHTML = "";
  state.quizResults.forEach((result, index) => {
    const item = document.createElement("div");
    item.className = "summary-item";
    item.innerHTML = `<strong>第 ${index + 1} 题：${result.isCorrect ? "回答正确" : "回答有误"}</strong><div>${result.prompt}</div><div class="planet-hint">${result.explanation}</div>`;
    summaryList.appendChild(item);
  });
}

function restartGame() {
  state.revealed = new Set();
  state.orderSlots = Array(planetCatalog.length).fill(null);
  state.trayOrder = shuffle(planetCatalog.map((planet) => planet.id));
  state.stageOneComplete = false;
  state.quizQuestions = [];
  state.currentQuestionIndex = 0;
  state.quizSelection = new Set();
  state.score = 0;
  state.quizAnswered = false;
  state.quizResults = [];
  stageOneStatus.className = "status-box";
  stageOneStatus.textContent = "新的一轮开始了。先把八大行星重新排好吧。";
  stageTwoLocked.classList.remove("hidden");
  quizArea.classList.add("hidden");
  quizSummary.classList.add("hidden");
  renderStageOne();
}

function renderPlanetAtlas() {
  const grid = document.getElementById("planetAtlasGrid");
  const detail = document.getElementById("planetAtlasDetail");
  if (!grid || !detail) return;
  grid.innerHTML = "";
  for (const planet of planetAtlasCatalog) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `atlas-card${planet.id === activeAtlasPlanetId ? " active" : ""}`;
    card.innerHTML = `<div class="atlas-card-name">${planet.name}</div>`;
    card.addEventListener("click", () => {
      activeAtlasPlanetId = planet.id;
      renderPlanetAtlas();
    });
    grid.appendChild(card);
  }
  const activePlanet = planetAtlasCatalog.find((planet) => planet.id === activeAtlasPlanetId) || planetAtlasCatalog[0];
  const visualPlanet = planetCatalog.find((planet) => planet.id === activePlanet.id);
  const visualClass = visualPlanet ? visualPlanet.visualClass : activePlanet.visualClass || "";
  const visualStyle = visualPlanet ? visualPlanet.visualStyle : activePlanet.style;
  detail.innerHTML = `
    <div class="atlas-detail-head">
      <div class="planet-visual atlas-planet-visual ${visualClass}" style="${visualStyle}">
        <span class="planet-visual-sphere">
          <span class="planet-texture"></span>
          <span class="planet-clouds"></span>
          <span class="planet-detail"></span>
        </span>
      </div>
      <div><h3>${activePlanet.name}</h3><div class="atlas-subtitle">${activePlanet.subtitle}</div></div>
    </div>
    <div class="atlas-stats">
      <div class="atlas-stat"><strong>到太阳的平均距离</strong><span>${activePlanet.distance}</span></div>
      <div class="atlas-stat"><strong>类型</strong><span>${activePlanet.type}</span></div>
      <div class="atlas-stat"><strong>直径</strong><span>${activePlanet.diameter}</span></div>
      <div class="atlas-stat"><strong>公转周期</strong><span>${activePlanet.year}</span></div>
    </div>
    <div class="atlas-section"><h4>性质特点</h4><p>${activePlanet.summary}</p></div>
    <div class="atlas-section"><h4>一点历史</h4><p>${activePlanet.history}</p></div>
  `;
}

window.openPlanetAtlas = function openPlanetAtlas() {
  const modal = document.getElementById("planetAtlasModal");
  if (!modal) return;
  renderPlanetAtlas();
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
};

window.closePlanetAtlas = function closePlanetAtlas() {
  const modal = document.getElementById("planetAtlasModal");
  if (!modal) return;
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
};

document.addEventListener("click", (event) => {
  const modal = document.getElementById("planetAtlasModal");
  if (modal && event.target === modal) window.closePlanetAtlas();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") window.closePlanetAtlas();
});

checkOrderButton.addEventListener("click", evaluateOrderStage);
resetOrderButton.addEventListener("click", restartGame);
submitQuizAnswerButton.addEventListener("click", submitQuizAnswer);
clearSelectionButton.addEventListener("click", () => {
  if (state.quizAnswered) return;
  state.quizSelection = new Set();
  renderQuizCards();
});
nextQuestionButton.addEventListener("click", nextQuestion);
restartGameButton.addEventListener("click", restartGame);

restartGame();
