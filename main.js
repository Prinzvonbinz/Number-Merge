let money = parseInt(localStorage.getItem("money")) || 0;
let blocks = JSON.parse(localStorage.getItem("blocks")) || [];
let startValue = parseInt(localStorage.getItem("startValue")) || 1;
let spawnSpeed = parseInt(localStorage.getItem("spawnSpeed")) || 30000;
let workerSpeed = parseInt(localStorage.getItem("workerSpeed")) || 10000;

let costStartValue = parseInt(localStorage.getItem("costStartValue")) || 10;
let costSpeed = parseInt(localStorage.getItem("costSpeed")) || 20;
let costWorker = parseInt(localStorage.getItem("costWorker")) || 50;

let gameTime = parseInt(localStorage.getItem("gameTime")) || 0;
let spawnTimer = Math.floor(spawnSpeed / 1000);
let spawnCountdown = spawnTimer;

const moneyEl = document.getElementById("money");
const blocksContainer = document.getElementById("blocks");
const spawnTimerEl = document.getElementById("spawnTimer");
const gameTimeEl = document.getElementById("gameTime");

const blockColors = [
  "#f1c40f", "#e67e22", "#e74c3c", "#9b59b6", "#2980b9", "#1abc9c", "#2ecc71"
];

function save() {
  localStorage.setItem("money", money);
  localStorage.setItem("blocks", JSON.stringify(blocks));
  localStorage.setItem("startValue", startValue);
  localStorage.setItem("spawnSpeed", spawnSpeed);
  localStorage.setItem("workerSpeed", workerSpeed);
  localStorage.setItem("costStartValue", costStartValue);
  localStorage.setItem("costSpeed", costSpeed);
  localStorage.setItem("costWorker", costWorker);
  localStorage.setItem("gameTime", gameTime);
}

function updateUI() {
  moneyEl.textContent = isNaN(money) ? 0 : Math.floor(money);
  spawnTimerEl.textContent = isNaN(spawnCountdown) ? 0 : spawnCountdown;

  const mins = Math.floor(gameTime / 60);
  const secs = gameTime % 60;
  gameTimeEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;

  blocksContainer.innerHTML = "";
  blocks.forEach((val, i) => {
    const div = document.createElement("div");
    div.className = "block";
    div.textContent = val;
    const colorIndex = Math.min(Math.log2(val) - 1, blockColors.length - 1);
    div.style.background = blockColors[colorIndex] || "#666";
    div.onclick = () => combineBlock(i);
    blocksContainer.appendChild(div);
  });

  document.getElementById("costStartValue").textContent = costStartValue;
  document.getElementById("costSpeed").textContent = costSpeed;
  document.getElementById("costWorker").textContent = costWorker;
}

function combineBlock(index) {
  const value = blocks[index];
  const sameIndex = blocks.findIndex((v, i) => v === value && i !== index);
  if (sameIndex !== -1) {
    blocks.splice(index, 1);
    blocks[sameIndex] *= 2;
    updateUI();
    save();
  }
}

function addBlock() {
  blocks.push(startValue);
  spawnCountdown = Math.floor(spawnSpeed / 1000);
  updateUI();
  save();
}

function earnMoney() {
  blocks.forEach(val => money += val);
  updateUI();
  save();
}

function workerCombine() {
  for (let i = 0; i < blocks.length; i++) {
    const val = blocks[i];
    const j = blocks.findIndex((v, idx) => v === val && idx !== i);
    if (j !== -1) {
      blocks.splice(i, 1);
      blocks[j] *= 2;
      updateUI();
      save();
      break;
    }
  }
}

let spawnInterval = setInterval(addBlock, spawnSpeed);
let workerInterval = setInterval(workerCombine, workerSpeed);
setInterval(earnMoney, 5000);

// Timer & UI
setInterval(() => {
  spawnCountdown = Math.max(0, spawnCountdown - 1);
  gameTime++;
  updateUI();
  save();
}, 1000);

// Shop
document.getElementById("shopButton").onclick = () => {
  document.getElementById("shop").classList.remove("hidden");
};

function closeShop() {
  document.getElementById("shop").classList.add("hidden");
}

document.getElementById("upgradeStartValue").onclick = () => {
  if (money >= costStartValue) {
    money -= costStartValue;
    startValue += 1;
    costStartValue = Math.floor(costStartValue * 2);
    updateUI();
    save();
  }
};

document.getElementById("upgradeSpeed").onclick = () => {
  if (money >= costSpeed && spawnSpeed > 5000) {
    money -= costSpeed;
    spawnSpeed = Math.max(5000, spawnSpeed - 2000);
    clearInterval(spawnInterval);
    spawnInterval = setInterval(addBlock, spawnSpeed);
    spawnCountdown = Math.floor(spawnSpeed / 1000);
    costSpeed = Math.floor(costSpeed * 2.5);
    updateUI();
    save();
  }
};

document.getElementById("upgradeWorker").onclick = () => {
  if (money >= costWorker && workerSpeed > 1000) {
    money -= costWorker;
    workerSpeed = Math.max(1000, workerSpeed - 1000);
    clearInterval(workerInterval);
    workerInterval = setInterval(workerCombine, workerSpeed);
    costWorker = Math.floor(costWorker * 2.5);
    updateUI();
    save();
  }
};

function resetGame() {
  if (confirm("Bist du sicher, dass du das Spiel komplett zurücksetzen möchtest?")) {
    localStorage.clear();
    location.reload();
  }
}

updateUI();
