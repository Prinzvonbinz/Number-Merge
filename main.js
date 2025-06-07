// Initiale Werte laden oder Standard setzen
let money = parseInt(localStorage.getItem("money")) || 0;
let blocks = JSON.parse(localStorage.getItem("blocks")) || [];
let startValue = parseInt(localStorage.getItem("startValue")) || 1;
let spawnSpeed = parseInt(localStorage.getItem("spawnSpeed")) || 30000;
let workerSpeed = parseInt(localStorage.getItem("workerSpeed")) || 10000;

let costStartValue = parseInt(localStorage.getItem("costStartValue")) || 10;
let costSpeed = parseInt(localStorage.getItem("costSpeed")) || 20;
let costWorker = parseInt(localStorage.getItem("costWorker")) || 50;

const blockColors = [
  "#f1c40f", "#e67e22", "#e74c3c", "#9b59b6", "#2980b9", "#1abc9c", "#2ecc71"
];

const moneyEl = document.getElementById("money");
const blocksContainer = document.getElementById("blocks");

function save() {
  localStorage.setItem("money", money);
  localStorage.setItem("blocks", JSON.stringify(blocks));
  localStorage.setItem("startValue", startValue);
  localStorage.setItem("spawnSpeed", spawnSpeed);
  localStorage.setItem("workerSpeed", workerSpeed);
  localStorage.setItem("costStartValue", costStartValue);
  localStorage.setItem("costSpeed", costSpeed);
  localStorage.setItem("costWorker", costWorker);
}

function updateUI() {
  moneyEl.textContent = Math.floor(money);
  blocksContainer.innerHTML = "";
  blocks.forEach((val, i) => {
    const div = document.createElement("div");
    div.className = "block";
    div.textContent = val;
    const colorIndex = Math.min(Math.log2(val) - 1, blockColors.length - 1);
    div.style.background = blockColors[colorIndex];
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

// Startintervalle
let spawnInterval = setInterval(addBlock, spawnSpeed);
let workerInterval = setInterval(workerCombine, workerSpeed);
setInterval(earnMoney, 5000);

// Shop-Button
document.getElementById("shopButton").onclick = () => {
  document.getElementById("shop").classList.remove("hidden");
};

function closeShop() {
  document.getElementById("shop").classList.add("hidden");
}

// Upgrade-Buttons
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

// Reset-Funktion
function resetGame() {
  if (confirm("Bist du sicher, dass du das Spiel komplett zurücksetzen möchtest?")) {
    localStorage.clear();
    location.reload();
  }
}

// UI initialisieren
updateUI();
