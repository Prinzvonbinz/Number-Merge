// Initialwerte
let money = 0;
let blocks = [];
let startValue = 1;
let spawnSpeed = 10000; // in ms
let workerSpeed = 5000;

let costStartValue = 10;
let costSpeed = 20;
let costWorker = 50;

let gameTime = 0;
let spawnCountdown = Math.floor(spawnSpeed / 1000);

const blockColors = ["#f39c12", "#e67e22", "#e74c3c", "#9b59b6", "#3498db", "#1abc9c", "#2ecc71", "#95a5a6"];

const moneyEl = document.getElementById("money");
const blocksContainer = document.getElementById("blocks");
const spawnTimerEl = document.getElementById("spawnTimer");
const gameTimeEl = document.getElementById("gameTime");

// UI-Update
function updateUI() {
  moneyEl.textContent = money;
  spawnTimerEl.textContent = Math.max(0, spawnCountdown);

  const mins = Math.floor(gameTime / 60);
  const secs = gameTime % 60;
  gameTimeEl.textContent = `${mins}:${secs.toString().padStart(2, "0")}`;

  blocksContainer.innerHTML = "";
  blocks.forEach((val, index) => {
    const div = document.createElement("div");
    div.className = "block";
    div.textContent = val;
    const colorIndex = Math.min(Math.log2(val) - 1, blockColors.length - 1);
    div.style.background = blockColors[colorIndex] || "#666";
    div.onclick = () => combineBlock(index);
    blocksContainer.appendChild(div);
  });

  document.getElementById("costStartValue").textContent = costStartValue;
  document.getElementById("costSpeed").textContent = costSpeed;
  document.getElementById("costWorker").textContent = costWorker;
}

// Block hinzufügen
function addBlock() {
  blocks.push(startValue);
  spawnCountdown = Math.floor(spawnSpeed / 1000);
  updateUI();
}

// Block kombinieren
function combineBlock(index) {
  const value = blocks[index];
  const matchIndex = blocks.findIndex((v, i) => i !== index && v === value);
  if (matchIndex !== -1) {
    blocks.splice(index, 1);
    blocks[matchIndex] *= 2;
    updateUI();
  }
}

// Geld verdienen
function earnMoney() {
  money += blocks.reduce((sum, val) => sum + val, 0);
  updateUI();
}

// Arbeiter kombiniert Blöcke automatisch
function workerCombine() {
  for (let i = 0; i < blocks.length; i++) {
    const val = blocks[i];
    const matchIndex = blocks.findIndex((v, j) => j !== i && v === val);
    if (matchIndex !== -1) {
      blocks.splice(i, 1);
      blocks[matchIndex] *= 2;
      updateUI();
      break;
    }
  }
}

// Spielzeit und Spawn-Timer zählen
setInterval(() => {
  gameTime++;
  spawnCountdown--;
  if (spawnCountdown <= 0) {
    addBlock();
  }
  updateUI();
}, 1000);

// Geld und Arbeit regelmäßig
setInterval(earnMoney, 5000);
setInterval(workerCombine, workerSpeed);

// Shop anzeigen/verstecken
document.getElementById("shopButton").onclick = () => {
  document.getElementById("shop").classList.remove("hidden");
};

function closeShop() {
  document.getElementById("shop").classList.add("hidden");
}

// Upgrades
document.getElementById("upgradeStartValue").onclick = () => {
  if (money >= costStartValue) {
    money -= costStartValue;
    startValue++;
    costStartValue *= 2;
    updateUI();
  }
};

document.getElementById("upgradeSpeed").onclick = () => {
  if (money >= costSpeed && spawnSpeed > 2000) {
    money -= costSpeed;
    spawnSpeed -= 1000;
    costSpeed *= 2;
    spawnCountdown = Math.floor(spawnSpeed / 1000);
    updateUI();
  }
};

document.getElementById("upgradeWorker").onclick = () => {
  if (money >= costWorker && workerSpeed > 1000) {
    money -= costWorker;
    workerSpeed -= 1000;
    costWorker *= 2;
    clearInterval(workerInterval);
    workerInterval = setInterval(workerCombine, workerSpeed);
    updateUI();
  }
};

// Reset
function resetGame() {
  if (confirm("Spiel wirklich zurücksetzen?")) {
    location.reload();
  }
}

// Starte UI
updateUI();
