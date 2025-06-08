// Variablen und LocalStorage laden
let blocks = JSON.parse(localStorage.getItem("blocks")) || [];
let money = Number(localStorage.getItem("money")) || 0;
let startValue = Number(localStorage.getItem("startValue")) || 1;
let spawnSpeed = Number(localStorage.getItem("spawnSpeed")) || 30000; // ms
let workerSpeed = Number(localStorage.getItem("workerSpeed")) || 10000; // ms
let prices = JSON.parse(localStorage.getItem("prices")) || {
  startValue: 10,
  spawnSpeed: 25,
  worker: 50
};
let gameTime = Number(localStorage.getItem("gameTime")) || 0;

let spawnCountdown = spawnSpeed;
let spawnInterval, incomeInterval, gameTimeInterval, workerInterval;

const moneyDisplay = document.getElementById("money");
const gameTimeDisplay = document.getElementById("gameTime");
const spawnTimerDisplay = document.getElementById("spawnTimer");
const blockContainer = document.getElementById("blockContainer");

// Spielstand speichern
function saveGame() {
  localStorage.setItem("blocks", JSON.stringify(blocks));
  localStorage.setItem("money", money);
  localStorage.setItem("startValue", startValue);
  localStorage.setItem("spawnSpeed", spawnSpeed);
  localStorage.setItem("workerSpeed", workerSpeed);
  localStorage.setItem("prices", JSON.stringify(prices));
  localStorage.setItem("gameTime", gameTime);
}

// Neue Blöcke spawnen
function spawnBlock() {
  blocks.push(startValue > 0 ? startValue : 1);
  renderBlocks();
}

// Blöcke rendern
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

// Farbe der Blöcke bestimmen
function getColor(val) {
  const hue = (val * 40) % 360;
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
    saveGame();
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

// Spawn-Timer aktualisieren
function updateSpawnTimer() {
  spawnCountdown -= 1000;
  if (spawnCountdown <= 0) {
    spawnBlock();
    spawnCountdown = spawnSpeed;
  }
  spawnTimerDisplay.textContent = Math.ceil(spawnCountdown / 1000);
}

// Upgrade kaufen
function buyUpgrade(type) {
  if (money >= prices[type]) {
    money -= prices[type];
    if (type === "startValue") startValue += 1;
    else if (type === "spawnSpeed") spawnSpeed = Math.max(5000, Math.floor(spawnSpeed * 0.95));
    else if (type === "worker") workerSpeed = Math.max(1000, Math.floor(workerSpeed * 0.9));

    prices[type] = Math.floor(prices[type] * 1.5);
    document.getElementById("price_" + type).textContent = prices[type];
    saveGame();
  }
}

// Arbeiter kombiniert Blöcke automatisch
function runWorker() {
  for (let i = 0; i < blocks.length; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      if (blocks[i] === blocks[j]) {
        const newVal = blocks[i] * 2;
        blocks.splice(j, 1);
        blocks.splice(i, 1);
        blocks.push(newVal);
        renderBlocks();
        saveGame();
        return;
      }
    }
  }
}

// Spiel zurücksetzen
function resetGame() {
  if (confirm("Bist du sicher, dass du das Spiel zurücksetzen willst?")) {
    blocks = [];
    money = 0;
    startValue = 1;
    spawnSpeed = 30000;
    workerSpeed = 10000;
    prices = {
      startValue: 10,
      spawnSpeed: 25,
      worker: 50
    };
    gameTime = 0;
    spawnCountdown = spawnSpeed;
    saveGame();
    renderBlocks();
    updateUIPrices();
  }
}

// UI-Preise aktualisieren
function updateUIPrices() {
  document.getElementById("price_startValue").textContent = prices.startValue;
  document.getElementById("price_spawnSpeed").textContent = prices.spawnSpeed;
  document.getElementById("price_worker").textContent = prices.worker;
}

// Spielzeit hochzählen
function updateGameTime() {
  gameTime++;
  gameTimeDisplay.textContent = gameTime + "s";
  saveGame();
}

// Initialisierung
renderBlocks();
updateUIPrices();

spawnInterval = setInterval(updateSpawnTimer, 1000);
incomeInterval = setInterval(generateIncome, 5000);
workerInterval = setInterval(runWorker, workerSpeed);
gameTimeInterval = setInterval(updateGameTime, 1000);
