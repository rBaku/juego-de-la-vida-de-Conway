const canvas = document.querySelector('#grid');
const ctx = canvas.getContext('2d');
const startBtn = document.querySelector('#startBtn');
const clearBtn = document.querySelector('#clearBtn');
const randomBtn = document.querySelector('#randomBtn');
const genDisplay = document.querySelector('#generationCount');

const resolution = 10;
canvas.width = 600;
canvas.height = 400;

const COLS = canvas.width / resolution;
const ROWS = canvas.height / resolution;

let grid = createGrid();
let requestID;
let running = false;
let generation = 0;

function createGrid() {
    return new Array(COLS).fill(null)
        .map(() => new Array(ROWS).fill(0));
}

// Dibujar la cuadrícula
function render(grid) {
    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            const cell = grid[col][row];

            ctx.beginPath();
            ctx.rect(col * resolution, row * resolution, resolution, resolution);
            ctx.fillStyle = cell ? '#00ff80' : '#000';
            ctx.fill();
            ctx.stroke();
            ctx.strokeStyle = '#111';
        }
    }
}

// Calcular el siguiente estado
function nextGeneration(grid) {
    const nextGrid = grid.map(arr => [...arr]);

    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            const cell = grid[col][row];
            let numNeighbors = 0;

            // Revisar los 8 vecinos
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if (i === 0 && j === 0) continue;
                    const x_cell = col + i;
                    const y_cell = row + j;

                    if (x_cell >= 0 && x_cell < COLS && y_cell >= 0 && y_cell < ROWS) {
                        numNeighbors += grid[x_cell][y_cell];
                    }
                }
            }

            // Reglas de Conway
            if (cell === 1 && (numNeighbors < 2 || numNeighbors > 3)) {
                nextGrid[col][row] = 0;
            } else if (cell === 0 && numNeighbors === 3) {
                nextGrid[col][row] = 1;
            }
        }
    }
    return nextGrid;
}

function update() {
    grid = nextGeneration(grid);
    generation++;
    genDisplay.innerText = `Generación: ${generation}`;
    render(grid);
    requestID = requestAnimationFrame(update);
}

// Interactividad: Dibujar con el mouse
canvas.addEventListener('click', event => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / resolution);
    const y = Math.floor((event.clientY - rect.top) / resolution);
    grid[x][y] = grid[x][y] ? 0 : 1;
    render(grid);
});

// Botones
startBtn.onclick = () => {
    if (running) {
        cancelAnimationFrame(requestID);
    } else {
        requestID = requestAnimationFrame(update);
    }
    running = !running;
};

randomBtn.onclick = () => {
    grid = grid.map(col => col.map(() => Math.floor(Math.random() * 2)));
    generation = 0;
    genDisplay.innerText = `Generación: ${generation}`;
    render(grid);
};

clearBtn.onclick = () => {
    grid = createGrid();
    generation = 0;
    genDisplay.innerText = `Generación: ${generation}`;
    render(grid);
    if (running) {
        cancelAnimationFrame(requestID);
        running = false;
    }
};

// Render inicial
render(grid);