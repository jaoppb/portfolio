import * as THREE from 'three';

export function parseRotation(rotation: THREE.Vector3Tuple): THREE.Euler {
    return new THREE.Euler(
        ...(rotation.map((e) => (e * Math.PI) / 180) as THREE.Vector3Tuple),
        'XYZ'
    );
}
