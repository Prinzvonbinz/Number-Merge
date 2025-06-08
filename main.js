// Spiellogik-Variablen
let blocks = JSON.parse(localStorage.getItem("blocks")) || [];
let money = Number(localStorage.getItem("money")) || 0;
let startValue = Number(localStorage.getItem("startValue")) || 1;
let spawnSpeed = Number(localStorage.getItem("spawnSpeed")) || 30000;
let workerSpeed = Number(localStorage.getItem("workerSpeed")) || 10000;
let prices = JSON.parse(localStorage.getItem("prices")) || {
  startValue: 10,
  spawnSpeed: 25,
  worker: 50
};
let gameTime = Number(localStorage.getItem("gameTime")) || 0;

// Timer und Anzeigen
let spawnCountdown = spawnSpeed;
let spawnInterval;
let incomeInterval;
let gameTimeInterval;
let workerInterval;

// DOM-Elemente
const moneyDisplay = document.getElementById("money");
const gameTimeDisplay = document.getElementById("gameTime");
const spawnTimerDisplay = document.getElementById("spawnTimer");
const blockContainer = document.getElementById("blockContainer");

// Speichern
function saveGame() {
  localStorage.setItem("blocks", JSON.stringify(blocks));
  localStorage.setItem("money", money);
  localStorage.setItem("startValue", startValue);
  localStorage.setItem("spawnSpeed", spawnSpeed);
  localStorage.setItem("workerSpeed", workerSpeed);
  localStorage.setItem("prices", JSON.stringify(prices));
  localStorage.setItem("gameTime", gameTime);
}

// Block erstellen
function spawnBlock() {
  const value = Math.max(1, startValue);
  blocks.push(value);
  renderBlocks();
}

// Blöcke anzeigen
function renderBlocks() {
  blockContainer.innerHTML = "";
  blocks.forEach((val, idx) => {
    const block = document.createElement("div");
    block.className = "block";
    block.textContent = val > 0 ? val : 1;
    block.style.backgroundColor = getColor(val);
    block.onclick = () => combineBlock(idx, val);
    blockContainer.appendChild(block);
  });
  moneyDisplay.textContent = Math.floor(money);
}

// Farbe nach Wert
function getColor(val) {
  const hue = (val * 30) % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

// Blöcke kombinieren
function combineBlock(index, value) {
  const sameIndex = blocks.findIndex((v, i) => v === value && i !== index);
  if (sameIndex !== -1) {
    blocks.splice(index, 1);
    blocks.splice(sameIndex, 1);
    blocks.push(value * 2);
    renderBlocks();
  }
}

// Einkommen generieren
function generateIncome() {
  blocks.forEach(val => {
    if (val > 0) money += val;
  });
  renderBlocks();
  saveGame();
}

// Spawn-Timer-Logik
function updateSpawnTimer() {
  spawnCountdown -= 1000;
  if (spawnCountdown <= 0) {
    spawnBlock();
    spawnCountdown = spawnSpeed;
  }
  spawnTimerDisplay.textContent = Math.ceil(spawnCountdown / 1000);
}
// Spielzeit erhöhen
function updateGameTime() {
  gameTime++;
  gameTimeDisplay.textContent = gameTime + "s";
  saveGame();
}

// Upgrades kaufen
function upgrade(type) {
  if (money < prices[type]) return;
  money -= prices[type];

  switch (type) {
    case "startValue":
      startValue += 1;
      prices.startValue = Math.floor(prices.startValue * 1.5);
      break;
    case "spawnSpeed":
      if (spawnSpeed > 5000) spawnSpeed -= 5000;
      prices.spawnSpeed = Math.floor(prices.spawnSpeed * 1.8);
      clearInterval(spawnInterval);
      spawnInterval = setInterval(updateSpawnTimer, 1000);
      break;
    case "worker":
      if (workerSpeed > 1000) workerSpeed -= 1000;
      prices.worker = Math.floor(prices.worker * 2);
      clearInterval(workerInterval);
      workerInterval = setInterval(generateIncome, workerSpeed);
      break;
  }
  renderShop();
  renderBlocks();
  saveGame();
}

// Shop anzeigen
function renderShop() {
  document.getElementById("priceStartValue").textContent = prices.startValue;
  document.getElementById("priceSpawnSpeed").textContent = prices.spawnSpeed;
  document.getElementById("priceWorker").textContent = prices.worker;
}

// Zurücksetzen
function resetGame() {
  localStorage.clear();
  blocks = [];
  money = 0;
  startValue = 1;
  spawnSpeed = 30000;
  workerSpeed = 10000;
  prices = { startValue: 10, spawnSpeed: 25, worker: 50 };
  gameTime = 0;
  spawnCountdown = spawnSpeed;
  clearInterval(spawnInterval);
  clearInterval(incomeInterval);
  clearInterval(workerInterval);
  clearInterval(gameTimeInterval);
  startGame();
}

// Initialisierung
function startGame() {
  renderBlocks();
  renderShop();
  gameTimeDisplay.textContent = gameTime + "s";
  spawnTimerDisplay.textContent = Math.ceil(spawnCountdown / 1000);
  moneyDisplay.textContent = Math.floor(money);
  spawnInterval = setInterval(updateSpawnTimer, 1000);
  workerInterval = setInterval(generateIncome, workerSpeed);
  gameTimeInterval = setInterval(updateGameTime, 1000);
}

// EventListener für Buttons
document.getElementById("btnStartValue").addEventListener("click", () => upgrade("startValue"));
document.getElementById("btnSpawnSpeed").addEventListener("click", () => upgrade("spawnSpeed"));
document.getElementById("btnWorker").addEventListener("click", () => upgrade("worker"));
document.getElementById("reset").addEventListener("click", resetGame);

// Spiel starten
startGame();
