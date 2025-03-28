import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
import { world } from './physics.js';

export class Enemy {
    constructor(scene) {
        this.scene = scene;
        this.health = 100;
        this.speed = 2;
        this.damage = 10;
        this.attackCooldown = 1;
        this.lastAttackTime = 0;
        
        this.initEnemy();
    }

    initEnemy() {
        // Create enemy visual
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 2, 1),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );
        
        // Random position within bounds
        this.mesh.position.set(
            Math.random() * 16 - 8,
            1,
            Math.random() * 16 - 8
        );
        
        this.scene.add(this.mesh);

        // Create physics body
        this.body = new CANNON.Body({
            mass: 1,
            shape: new CANNON.Box(new CANNON.Vec3(0.5, 1, 0.5)),
            position: new CANNON.Vec3(
                this.mesh.position.x,
                this.mesh.position.y,
                this.mesh.position.z
            ),
            fixedRotation: true
        });
        world.addBody(this.body);
    }

    update() {
        // Simple AI: Move toward player (assuming player position is available)
        if (window.player) {
            const direction = new THREE.Vector3();
            direction.subVectors(
                window.player.body.position,
                this.body.position
            ).normalize();
            
            this.body.velocity.x = direction.x * this.speed;
            this.body.velocity.z = direction.z * this.speed;
            
            // Face the player
            this.mesh.lookAt(
                new THREE.Vector3(
                    window.player.body.position.x,
                    this.mesh.position.y,
                    window.player.body.position.z
                )
            );

            // Attack if close enough
            const distance = this.body.position.distanceTo(window.player.body.position);
            if (distance < 2 && Date.now() - this.lastAttackTime > this.attackCooldown * 1000) {
                this.attack();
                this.lastAttackTime = Date.now();
            }
        }

        // Sync visual with physics
        this.mesh.position.copy(this.body.position);
    }

    attack() {
        if (window.player) {
            window.player.health -= this.damage;
            // TODO: Add visual/audio feedback
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        // Remove from scene and physics world
        this.scene.remove(this.mesh);
        world.removeBody(this.body);
        
        // TODO: Add death effects and score increment
    }
}