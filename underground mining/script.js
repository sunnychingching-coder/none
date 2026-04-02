// ===== 遊戲全域狀態設定 =====
const CONFIG = {
    GRID_WIDTH: 15,   // 寬度：15 格
    GRID_HEIGHT: 15,  // 高度：15 格
    CELL_SIZE: 48     // 每格長寬為 48 像素 (Pixel)
};

// 單位對應表 (2D Array 的資料結構標示)
// 因為「每一個網格只能有一個單位」，所以直接用數字代表狀態最乾淨
const ENTITY_TYPES = {
    EMPTY: 0,
    MINER: 1,
    SLIME: 2,
    CRYSTAL: 3,
    GOLD: 4
};

// 對應到 CSS 決定圖片長相的 Class Name
const CLASS_MAPPING = {
    [ENTITY_TYPES.MINER]: 'miner',
    [ENTITY_TYPES.SLIME]: 'slime',
    [ENTITY_TYPES.CRYSTAL]: 'crystal',
    [ENTITY_TYPES.GOLD]: 'gold'
};

// 遊戲世界：由長寬組成的 2D 陣列 (二維陣列)
// 例如: mapData[y][x] 代表第 y 列第 x 欄的狀態
let mapData = [];

// ===== 核心功能 =====

/**
 * 1. 遊戲初始化：建立空白陣列結構 15x15
 */
function initMap() {
    mapData = [];
    for (let y = 0; y < CONFIG.GRID_HEIGHT; y++) {
        let row = [];
        for (let x = 0; x < CONFIG.GRID_WIDTH; x++) {
            row.push(ENTITY_TYPES.EMPTY); // 初始全部設為空 (0)
        }
        mapData.push(row);
    }
    console.log("地圖陣列初始化完成", mapData);
}

/**
 * 2. 建立畫面上看得見的 HTML 網格容器
 */
function renderBoardStructure() {
    const board = document.getElementById('game-board');
    board.innerHTML = ''; // 清空內容

    // 使用 CSS Grid 規範行與列
    board.style.gridTemplateColumns = `repeat(${CONFIG.GRID_WIDTH}, ${CONFIG.CELL_SIZE}px)`;
    board.style.gridTemplateRows = `repeat(${CONFIG.GRID_HEIGHT}, ${CONFIG.CELL_SIZE}px)`;

    // 依序產出實體 HTML Grid Cell
    for (let y = 0; y < CONFIG.GRID_HEIGHT; y++) {
        for (let x = 0; x < CONFIG.GRID_WIDTH; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = `cell-x${x}-y${y}`; // 幫每個格子命名 ID 讓我們可以輕易找到他
            board.appendChild(cell);
        }
    }
}

/**
 * 3. [對外開放方法] 在陣列中放置一個實體單位 (例如：礦工、礦石等)
 * (你可以後續使用 for loop 或 if 邏輯來呼叫這個)
 */
function setEntity(x, y, entityType) {
    if (x >= 0 && x < CONFIG.GRID_WIDTH && y >= 0 && y < CONFIG.GRID_HEIGHT) {
        // 因為「每個網格只能有一個單位」，如果該處已經有單位就可以決定要不要覆蓋
        mapData[y][x] = entityType;
    } else {
        console.warn(`座標 (${x}, ${y}) 超出地圖範圍了！`);
    }
}

/**
 * 4. 根據 mapData 陣列的狀態，更新整個遊戲畫面上的圖片 (div)
 */
function drawEntities() {
    // 每次繪製前，先拔除所有上一次的單位 (避免重複繪圖)
    const existingEntities = document.querySelectorAll('.entity');
    existingEntities.forEach(e => e.remove());

    // 掃描一次全地圖，看陣列哪裡有東西
    for (let y = 0; y < CONFIG.GRID_HEIGHT; y++) {
        for (let x = 0; x < CONFIG.GRID_WIDTH; x++) {
            const type = mapData[y][x];

            if (type !== ENTITY_TYPES.EMPTY) {
                // 如果這格不是空的，就找到這格的 HTML Cell
                const cell = document.getElementById(`cell-x${x}-y${y}`);

                // 生出一個包含圖片的單位 (div)
                const entityDiv = document.createElement('div');
                entityDiv.classList.add('entity');
                entityDiv.classList.add(CLASS_MAPPING[type]); // 加上對應的長相 class

                // 把實體放進格子裡
                cell.appendChild(entityDiv);
            }
        }
    }
}


// ===== 啟動流程 =====
function startGame() {
    // 步驟 A: 生成基本結構
    initMap();
    renderBoardStructure();

    // 步驟 B: 放上測試單位 (隨便擺幾個給你看)

    // 放礦工在正中間
    setEntity(7, 7, ENTITY_TYPES.MINER);

    // 放兩顆水晶礦
    setEntity(2, 2, ENTITY_TYPES.CRYSTAL);
    setEntity(12, 10, ENTITY_TYPES.CRYSTAL);

    // 放黃金
    setEntity(5, 8, ENTITY_TYPES.GOLD);

    // 放兩隻史萊姆怪獸
    setEntity(10, 4, ENTITY_TYPES.SLIME);
    setEntity(11, 4, ENTITY_TYPES.SLIME);

    // 步驟 C: 將地圖資料繪製到畫面上
    drawEntities();

    console.log("遊戲啟動完成！目前畫面已經依照 mapData 渲染過了");
}

/* 
 * 頁面載入完成後自動啟動遊戲
 */
window.onload = () => {
    startGame();
};

/* 
 * 暴露全域變數方便你在 Console 中進行操作測試
 * 例如你在開發者工具可以直接輸入 `setEntity(5, 5, ENTITY_TYPES.MINER); drawEntities();`
 */
window.GAME = {
    mapData,
    setEntity,
    drawEntities,
    ENTITY_TYPES
};
