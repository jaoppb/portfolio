import * as THREE from 'three';

export function parseRotation(rotation: THREE.Vector3Tuple): THREE.Quaternion {
    const parsed = new THREE.Euler(
        ...(rotation.map((e) => (e * Math.PI) / 180) as THREE.Vector3Tuple),
        'XYZ'
    );
    return new THREE.Quaternion().setFromEuler(parsed);
}
