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
