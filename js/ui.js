export class UI {
    constructor() {
        this.healthBar = document.querySelector('.health-fill');
        this.ammoCounter = document.querySelector('.ammo-counter');
        this.scoreDisplay = document.querySelector('.score');
        this.loadingScreen = document.getElementById('loading-screen');
        this.menu = document.getElementById('menu');
        this.startBtn = document.getElementById('start-btn');
        this.optionsBtn = document.getElementById('options-btn');
        this.quitBtn = document.getElementById('quit-btn');

        this.setupEventListeners();
        this.hideLoadingScreen();
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.optionsBtn.addEventListener('click', () => this.showOptions());
        this.quitBtn.addEventListener('click', () => this.quitGame());
    }

    hideLoadingScreen() {
        setTimeout(() => {
            this.loadingScreen.style.opacity = '0';
            setTimeout(() => {
                this.loadingScreen.style.display = 'none';
            }, 500);
        }, 1500);
    }

    startGame() {
        this.menu.style.display = 'none';
        // TODO: Initialize game state
        document.exitPointerLock = document.exitPointerLock || 
                                 document.mozExitPointerLock;
        document.exitPointerLock();
        
        const canvas = document.getElementById('game-canvas');
        canvas.requestPointerLock = canvas.requestPointerLock || 
                                  canvas.mozRequestPointerLock;
        canvas.requestPointerLock();
    }

    showOptions() {
        // TODO: Implement options menu
        console.log('Options menu would appear here');
    }

    quitGame() {
        // TODO: Implement proper game exit
        window.close();
    }

    updateHealth(health) {
        this.healthBar.style.width = `${health}%`;
        this.healthBar.style.backgroundColor = 
            health > 50 ? '#0f0' : 
            health > 20 ? '#ff0' : '#f00';
    }

    updateAmmo(current, max) {
        this.ammoCounter.textContent = `${current}/${max}`;
    }

    updateScore(score) {
        this.scoreDisplay.textContent = score;
    }

    showGameOver() {
        this.menu.style.display = 'flex';
        this.menu.innerHTML = `
            <h1>GAME OVER</h1>
            <div class="final-score">Score: ${this.scoreDisplay.textContent}</div>
            <button id="restart-btn">PLAY AGAIN</button>
        `;
        document.getElementById('restart-btn').addEventListener('click', () => {
            location.reload();
        });
    }
}