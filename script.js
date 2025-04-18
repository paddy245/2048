class Game {
    constructor() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
        this.tileContainer = document.querySelector('.tile-container');
        this.scoreDisplay = document.getElementById('score');
        this.bestScoreDisplay = document.getElementById('best-score');
        this.gameOverDisplay = document.getElementById('game-over');
        this.newGameButton = document.getElementById('new-game');
        this.init();
    }

    init() {
        // 清空网格和分数
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.tileContainer.innerHTML = '';
        this.gameOverDisplay.classList.add('hidden');

        // 初始化网格布局
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                this.tileContainer.appendChild(cell);
            }
        }

        // 添加两个初始方块
        this.addNewTile();
        this.addNewTile();

        // 更新显示
        this.updateDisplay();

        // 添加事件监听
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        this.newGameButton.addEventListener('click', () => this.init());

        // 显示最高分
        this.bestScoreDisplay.textContent = this.bestScore;
    }

    addNewTile() {
        const emptyCells = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({x: i, y: j});
                }
            }
        }
        if (emptyCells.length > 0) {
            const {x, y} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const value = Math.random() < 0.9 ? 2 : 4;
            this.grid[x][y] = value;
            this.renderTile(x, y, value);
        }
    }

    renderTile(x, y, value) {
        const tile = document.createElement('div');
        tile.classList.add('tile', `tile-${value}`);
        tile.textContent = value;
        tile.style.setProperty('--x', y);
        tile.style.setProperty('--y', x);
        this.tileContainer.appendChild(tile);
    }

    updateDisplay() {
        this.tileContainer.querySelectorAll('.tile').forEach(tile => tile.remove());
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] !== 0) {
                    this.renderTile(i, j, this.grid[i][j]);
                }
            }
        }
        this.scoreDisplay.textContent = this.score;

        // 更新最高分
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.bestScoreDisplay.textContent = this.bestScore;
            localStorage.setItem('bestScore', this.bestScore);
        }
    }

    move(direction) {
        const oldGrid = JSON.stringify(this.grid);
        let moved = false;

        switch(direction) {
            case 'left':
                moved = this.moveLeft();
                break;
            case 'right':
                moved = this.moveRight();
                break;
            case 'up':
                moved = this.moveUp();
                break;
            case 'down':
                moved = this.moveDown();
                break;
        }

        if (moved) {
            this.addNewTile();
            this.updateDisplay();

            // 检查游戏是否结束
            if (this.isGameOver()) {
                this.gameOverDisplay.classList.remove('hidden');
            }
        }
    }

    moveLeft() {
        let moved = false;
        for (let i = 0; i < 4; i++) {
            let row = this.grid[i].filter(cell => cell !== 0);
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j + 1, 1);
                    moved = true;
                }
            }
            const newRow = row.concat(Array(4 - row.length).fill(0));
            if (JSON.stringify(this.grid[i]) !== JSON.stringify(newRow)) {
                moved = true;
            }
            this.grid[i] = newRow;
        }
        return moved;
    }

    moveRight() {
        let moved = false;
        for (let i = 0; i < 4; i++) {
            let row = this.grid[i].filter(cell => cell !== 0);
            for (let j = row.length - 1; j > 0; j--) {
                if (row[j] === row[j - 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j - 1, 1);
                    moved = true;
                }
            }
            const newRow = Array(4 - row.length).fill(0).concat(row);
            if (JSON.stringify(this.grid[i]) !== JSON.stringify(newRow)) {
                moved = true;
            }
            this.grid[i] = newRow;
        }
        return moved;
    }

    moveUp() {
        let moved = false;
        for (let j = 0; j < 4; j++) {
            let column = [];
            for (let i = 0; i < 4; i++) {
                if (this.grid[i][j] !== 0) {
                    column.push(this.grid[i][j]);
                }
            }
            for (let i = 0; i < column.length - 1; i++) {
                if (column[i] === column[i + 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column.splice(i + 1, 1);
                    moved = true;
                }
            }
            const newColumn = column.concat(Array(4 - column.length).fill(0));
            for (let i = 0; i < 4; i++) {
                if (this.grid[i][j] !== newColumn[i]) {
                    moved = true;
                }
                this.grid[i][j] = newColumn[i];
            }
        }
        return moved;
    }

    moveDown() {
        let moved = false;
        for (let j = 0; j < 4; j++) {
            let column = [];
            for (let i = 0; i < 4; i++) {
                if (this.grid[i][j] !== 0) {
                    column.push(this.grid[i][j]);
                }
            }
            for (let i = column.length - 1; i > 0; i--) {
                if (column[i] === column[i - 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column.splice(i - 1, 1);
                    moved = true;
                }
            }
            const newColumn = Array(4 - column.length).fill(0).concat(column);
            for (let i = 0; i < 4; i++) {
                if (this.grid[i][j] !== newColumn[i]) {
                    moved = true;
                }
                this.grid[i][j] = newColumn[i];
            }
        }
        return moved;
    }

    isGameOver() {
        // 检查是否还有空格
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) return false;
            }
        }

        // 检查是否还有可以合并的相邻方块
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const current = this.grid[i][j];
                // 检查右边
                if (j < 3 && current === this.grid[i][j + 1]) return false;
                // 检查下边
                if (i < 3 && current === this.grid[i + 1][j]) return false;
            }
        }

        return true;
    }

    handleKeyPress(event) {
        if (!this.gameOverDisplay.classList.contains('hidden')) {
            return; // 如果游戏结束,不再响应按键
        }

        switch(event.key) {
            case 'ArrowLeft':
                this.move('left');
                break;
            case 'ArrowRight':
                this.move('right');
                break;
            case 'ArrowUp':
                this.move('up');
                break;
            case 'ArrowDown':
                this.move('down');
                break;
        }
    }
}

const game = new Game();
