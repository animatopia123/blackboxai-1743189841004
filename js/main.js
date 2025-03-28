import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
import { setupPhysics, world, updatePhysics } from './physics.js';
import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { UI } from './ui.js';

let scene, camera, renderer, player, enemies, ui;
let lastTime = 0;
const fixedTimeStep = 1.0 / 60.0; // 60 FPS physics

function init() {
    // Set up the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x333333);
    
    // Set up camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    // Set up renderer
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('game-canvas'),
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Initialize physics
    setupPhysics();

    // Create player
    player = new Player(scene, camera);
    window.player = player; // Make accessible to enemies

    // Create enemies
    enemies = [];
    for (let i = 0; i < 5; i++) {
        enemies.push(new Enemy(scene));
    }

    // Initialize UI
    ui = new UI();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start the game loop
    lastTime = performance.now();
    animate();
}

function animate(currentTime) {
    requestAnimationFrame(animate);
    
    // Calculate delta time
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // Update physics
    updatePhysics();

    // Update game objects
    player.update();
    enemies.forEach(enemy => enemy.update());
    
    // Update UI
    ui.updateHealth(player.health);
    ui.updateAmmo(player.ammo, player.maxAmmo);
    
    // Check game over condition
    if (player.health <= 0) {
        ui.showGameOver();
        return;
    }

    // Render the scene
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
