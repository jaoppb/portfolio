import * as THREE from 'three';

export function parseRotation(rotation: THREE.Vector3Tuple): THREE.Quaternion {
    const parsed = new THREE.Euler(
        ...(rotation.map((e) => (e * Math.PI) / 180) as THREE.Vector3Tuple),
        'XYZ'
    );
    return new THREE.Quaternion().setFromEuler(parsed);
}

export function getPositionFromCamera(
    camera: THREE.PerspectiveCamera,
    distance: number = 1,
    offset: THREE.Vector3 = new THREE.Vector3()
): THREE.Vector3 {
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    return camera.position.clone().add(direction.multiplyScalar(distance)).add(offset);
}

export function getObjectScreenSize(
    object: THREE.Object3D,
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer
): THREE.Vector2 {
    object.updateMatrixWorld(true);

    const box: THREE.Box3 = new THREE.Box3().setFromObject(object);

    const corners: THREE.Vector3[] = [
        new THREE.Vector3(box.min.x, box.min.y, box.min.z),
        new THREE.Vector3(box.max.x, box.min.y, box.min.z),
        new THREE.Vector3(box.min.x, box.max.y, box.min.z),
        new THREE.Vector3(box.min.x, box.min.y, box.max.z),
        new THREE.Vector3(box.max.x, box.max.y, box.min.z),
        new THREE.Vector3(box.min.x, box.max.y, box.max.z),
        new THREE.Vector3(box.max.x, box.min.y, box.max.z),
        new THREE.Vector3(box.max.x, box.max.y, box.max.z),
    ];

    let minX: number = Infinity;
    let maxX: number = -Infinity;
    let minY: number = Infinity;
    let maxY: number = -Infinity;

    const canvas: HTMLCanvasElement = renderer.domElement;
    const canvasWidth: number = canvas.clientWidth;
    const canvasHeight: number = canvas.clientHeight;

    for (const corner of corners) {
        corner.project(camera);

        const screenX: number = ((corner.x + 1) / 2) * canvasWidth;
        const screenY: number = ((-corner.y + 1) / 2) * canvasHeight;

        minX = Math.min(minX, screenX);
        maxX = Math.max(maxX, screenX);
        minY = Math.min(minY, screenY);
        maxY = Math.max(maxY, screenY);
    }

    const width: number = maxX - minX;
    const height: number = maxY - minY;

    return new THREE.Vector2(width, height);
}

export function getPlaneScreenSize(
    plane: THREE.Mesh,
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer
): THREE.Vector2 {
    if (!plane.geometry.attributes['position']) {
        return new THREE.Vector2(0, 0);
    }

    const localVertices: THREE.Vector3[] = [];
    const positions = plane.geometry.attributes['position'];
    for (let i = 0; i < 4; i++) {
        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(positions, i);
        localVertices.push(vertex);
    }

    plane.updateMatrixWorld(true);

    const screenVertices: THREE.Vector2[] = [];
    for (const localVertex of localVertices) {
        const worldVertex = localVertex.clone().applyMatrix4(plane.matrixWorld);

        worldVertex.project(camera);
        screenVertices.push(new THREE.Vector2(worldVertex.x, worldVertex.y));
    }

    const screenBounds = new THREE.Box2().setFromPoints(screenVertices);

    const canvas = renderer.domElement;
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    const pixelWidth = ((screenBounds.max.x - screenBounds.min.x) * canvasWidth) / 2;
    const pixelHeight = ((screenBounds.max.y - screenBounds.min.y) * canvasHeight) / 2;

    return new THREE.Vector2(pixelWidth, pixelHeight);
}
