let money = parseFloat(localStorage.getItem("money")) || 0;
let blocks = JSON.parse(localStorage.getItem("blocks")) || [];
let startValue = parseInt(localStorage.getItem("startValue")) || 1;
let speedLevel = parseInt(localStorage.getItem("speedLevel")) || 0;
let workerLevel = parseInt(localStorage.getItem("workerLevel")) || 0;
let playTime = parseInt(localStorage.getItem("playTime")) || 0;

let spawnInterval = 30000 / Math.pow(1.1, speedLevel);
let spawnTimer = spawnInterval;
let blockId = 0;

function save() {
    localStorage.setItem("money", money);
    localStorage.setItem("blocks", JSON.stringify(blocks));
    localStorage.setItem("startValue", startValue);
    localStorage.setItem("speedLevel", speedLevel);
    localStorage.setItem("workerLevel", workerLevel);
    localStorage.setItem("playTime", playTime);
}

function updateUI() {
    document.getElementById("money").textContent = Math.floor(money);
    document.getElementById("playTime").textContent = playTime;
    document.getElementById("spawnTimer").textContent = Math.ceil(spawnTimer / 1000);
    document.getElementById("cost-startValue").textContent = Math.floor(50 * Math.pow(2, startValue - 1));
    document.getElementById("cost-speed").textContent = Math.floor(100 * Math.pow(2, speedLevel));
    document.getElementById("cost-worker").textContent = Math.floor(150 * Math.pow(2, workerLevel));
}

function spawnBlock() {
    const value = Math.max(1, startValue);
    blocks.push({ id: blockId++, value: value });
    renderBlocks();
}

function renderBlocks() {
    const container = document.getElementById("blockContainer");
    container.innerHTML = "";
    blocks.forEach(block => {
        const div = document.createElement("div");
        div.className = "block";
        div.textContent = block.value;
        div.style.backgroundColor = getColor(block.value);
        div.onclick = () => combineBlock(block);
        container.appendChild(div);
    });
}

function getColor(value) {
    const colors = ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0", "#F44336", "#00BCD4", "#FFEB3B"];
    return colors[Math.floor(Math.log2(value)) % colors.length];
}

function combineBlock(clickedBlock) {
    const sameBlocks = blocks.filter(b => b.value === clickedBlock.value && b.id !== clickedBlock.id);
    if (sameBlocks.length > 0) {
        const target = sameBlocks[0];
        blocks = blocks.filter(b => b.id !== clickedBlock.id && b.id !== target.id);
        blocks.push({ id: blockId++, value: clickedBlock.value * 2 });
        renderBlocks();
    }
}

function generateMoney() {
    blocks.forEach(b => money += b.value);
}

function upgrade(type) {
    if (type === "startValue") {
        const cost = 50 * Math.pow(2, startValue - 1);
        if (money >= cost) {
            money -= cost;
            startValue++;
        }
    } else if (type === "speed") {
        const cost = 100 * Math.pow(2, speedLevel);
        if (money >= cost) {
            money -= cost;
            speedLevel++;
            spawnInterval = 30000 / Math.pow(1.1, speedLevel);
        }
    } else if (type === "worker") {
        const cost = 150 * Math.pow(2, workerLevel);
        if (money >= cost) {
            money -= cost;
            workerLevel++;
        }
    }
    updateUI();
}

function autoWorker() {
    if (workerLevel > 0) {
        for (let val of [...new Set(blocks.map(b => b.value))]) {
            const matches = blocks.filter(b => b.value === val);
            if (matches.length >= 2) {
                combineBlock(matches[0]);
                break;
            }
        }
    }
}

setInterval(() => {
    spawnTimer -= 1000;
    if (spawnTimer <= 0) {
        spawnBlock();
        spawnTimer = spawnInterval;
    }
    updateUI();
}, 1000);

setInterval(() => {
    generateMoney();
    updateUI();
    save();
}, 5000);

setInterval(() => {
    playTime++;
    updateUI();
    save();
}, 1000);

setInterval(() => {
    autoWorker();
}, Math.max(5000 - workerLevel * 400, 1000));

document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('Willst du das Spiel wirklich zurücksetzen?')) {
        localStorage.clear();
        location.reload();
    }
});

renderBlocks();
updateUI();
