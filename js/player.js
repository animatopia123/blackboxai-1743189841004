import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
import { world } from './physics.js';

export class Player {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.health = 100;
        this.ammo = 30;
        this.maxAmmo = 90;
        this.isShooting = false;
        
        // Set up player body
        this.setupPlayer();
        
        // Set up controls
        this.setupControls();
        
        // Set up weapon
        this.setupWeapon();
    }

    setupPlayer() {
        // Create player collision body
        this.body = new CANNON.Body({
            mass: 1,
            shape: new CANNON.Sphere(0.5),
            position: new CANNON.Vec3(0, 1, 0),
            fixedRotation: true
        });
        world.addBody(this.body);
        
        // Position camera at player's eye level
        this.camera.position.set(0, 1.6, 0);
    }

    setupControls() {
        // Movement controls
        this.moveSpeed = 5;
        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false,
            space: false
        };

        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() in this.keys) {
                this.keys[e.key.toLowerCase()] = true;
            }
            if (e.code === 'Space') this.keys.space = true;
        });

        document.addEventListener('keyup', (e) => {
            if (e.key.toLowerCase() in this.keys) {
                this.keys[e.key.toLowerCase()] = false;
            }
            if (e.code === 'Space') this.keys.space = false;
        });

        // Mouse look controls
        document.addEventListener('mousemove', (e) => {
            const sensitivity = 0.002;
            this.camera.rotation.y -= e.movementX * sensitivity;
            this.camera.rotation.x -= e.movementY * sensitivity;
            this.camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.camera.rotation.x));
        });

        // Shooting controls
        document.addEventListener('mousedown', () => this.isShooting = true);
        document.addEventListener('mouseup', () => this.isShooting = false);
    }

    setupWeapon() {
        this.weapon = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 0.1, 0.1),
            new THREE.MeshBasicMaterial({ color: 0x333333 })
        );
        this.weapon.position.set(0.3, -0.2, -0.5);
        this.camera.add(this.weapon);
    }

    update() {
        // Handle movement
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        direction.y = 0;
        direction.normalize();

        const sideDirection = new THREE.Vector3();
        sideDirection.crossVectors(new THREE.Vector3(0, 1, 0), direction);

        const velocity = new CANNON.Vec3();
        if (this.keys.w) velocity.z -= this.moveSpeed;
        if (this.keys.s) velocity.z += this.moveSpeed;
        if (this.keys.a) velocity.x -= this.moveSpeed;
        if (this.keys.d) velocity.x += this.moveSpeed;
        if (this.keys.space) velocity.y = 5; // Jump

        this.body.velocity.x = velocity.x;
        this.body.velocity.z = velocity.z;
        this.body.velocity.y = velocity.y;

        // Update camera position to follow physics body
        this.camera.position.copy(this.body.position);
        this.camera.position.y += 1.6; // Eye level

        // Handle shooting
        if (this.isShooting && this.ammo > 0) {
            this.shoot();
        }
    }

    shoot() {
        if (this.ammo <= 0) return;
        
        this.ammo--;
        // TODO: Implement shooting logic
        
        // Recoil effect
        this.camera.rotation.x += 0.01;
    }
}