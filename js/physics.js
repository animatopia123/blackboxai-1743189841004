import * as CANNON from 'https://cdnjs.cloudflare.com/ajax/libs/cannon.js/0.6.2/cannon.min.js';

export const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // Earth gravity
world.broadphase = new CANNON.NaiveBroadphase();
world.solver.iterations = 10;

export function setupPhysics() {
    // Create ground
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(1, 0, 0),
        -Math.PI / 2
    );
    world.addBody(groundBody);

    // Create walls
    const wallShape = new CANNON.Box(new CANNON.Vec3(10, 5, 0.5));
    const wallMaterial = new CANNON.Material('wallMaterial');
    
    // North wall
    const northWall = new CANNON.Body({ mass: 0, material: wallMaterial });
    northWall.addShape(wallShape);
    northWall.position.set(0, 2.5, -10);
    world.addBody(northWall);

    // South wall
    const southWall = new CANNON.Body({ mass: 0, material: wallMaterial });
    southWall.addShape(wallShape);
    southWall.position.set(0, 2.5, 10);
    world.addBody(southWall);

    // East wall
    const eastWall = new CANNON.Body({ mass: 0, material: wallMaterial });
    eastWall.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 5, 10)));
    eastWall.position.set(10, 2.5, 0);
    world.addBody(eastWall);

    // West wall
    const westWall = new CANNON.Body({ mass: 0, material: wallMaterial });
    westWall.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 5, 10)));
    westWall.position.set(-10, 2.5, 0);
    world.addBody(westWall);

    // Create some obstacles
    const boxShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
    const boxMaterial = new CANNON.Material('boxMaterial');
    
    for (let i = 0; i < 5; i++) {
        const box = new CANNON.Body({
            mass: 0,
            material: boxMaterial,
            shape: boxShape,
            position: new CANNON.Vec3(
                Math.random() * 8 - 4,
                1,
                Math.random() * 8 - 4
            )
        });
        world.addBody(box);
    }

    // Set up contact materials
    const playerMaterial = new CANNON.Material('playerMaterial');
    const contactMaterial = new CANNON.ContactMaterial(
        playerMaterial,
        wallMaterial,
        {
            friction: 0.1,
            restitution: 0.3
        }
    );
    world.addContactMaterial(contactMaterial);
}

// Physics update loop
export function updatePhysics() {
    world.step(1/60);
}