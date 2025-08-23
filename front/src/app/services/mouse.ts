import { Injectable } from '@angular/core';
import { EventEmitter } from '@app/utils/event-emitter';

import * as THREE from 'three';

export type PointerClick = {
    object?: THREE.Object3D<THREE.Object3DEventMap>;
};

export type PointerMove = {
    objects?: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[];
};

interface IMouseServiceEvents {
    click: PointerClick;
    move: PointerMove;
}

@Injectable({ providedIn: 'root' })
export class MouseService extends EventEmitter<IMouseServiceEvents> {
    private raycaster: THREE.Raycaster = new THREE.Raycaster();
    private mouse: THREE.Vector2 = new THREE.Vector2();
    private intersects: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[] = [];
    private canvas?: HTMLCanvasElement;

    constructor(
        private readonly scene: THREE.Scene,
        private readonly camera: THREE.PerspectiveCamera
    ) {
        super();
    }

    private _onPointerMove(e: PointerEvent) {
        if (!this.canvas) return;

        const { left, top } = this.canvas.getBoundingClientRect();
        this.mouse.set(
            ((e.clientX - left) / this.canvas.clientWidth) * 2 - 1,
            (-(e.clientY - top) / this.canvas.clientHeight) * 2 + 1
        );
        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.intersects = this.raycaster.intersectObjects(this.scene.children, true);

        this.emit('move', { objects: this.intersects });
    }

    private _onPointerDown() {
        this.emit('click', { object: this.intersects[0]?.object });
    }

    initialize(canvas: HTMLCanvasElement) {
        this.canvas = canvas;

        this.canvas.addEventListener('pointermove', this._onPointerMove.bind(this));
        this.canvas.addEventListener('pointerdown', (e) => {
            this._onPointerDown();
            this._onPointerMove(e);
        });
    }
}
