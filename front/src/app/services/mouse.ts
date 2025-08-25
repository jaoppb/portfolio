import { Inject, Injectable } from '@angular/core';
import { CANVAS_SCENE } from '@app/tokens';
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
    private overlay?: HTMLDivElement;

    constructor(
        @Inject(CANVAS_SCENE)
        private readonly scene: THREE.Scene,
        private readonly camera: THREE.PerspectiveCamera
    ) {
        super();
    }

    private _onPointerMove(e: PointerEvent) {
        if (!this.overlay) return;

        const { left, top } = this.overlay.getBoundingClientRect();
        this.mouse.set(
            ((e.clientX - left) / this.overlay.clientWidth) * 2 - 1,
            (-(e.clientY - top) / this.overlay.clientHeight) * 2 + 1
        );
        this.raycaster.setFromCamera(this.mouse, this.camera);
        this.intersects = this.raycaster.intersectObjects(this.scene.children, true);

        this.emit('move', { objects: this.intersects });
    }

    private _onPointerDown() {
        this.emit('click', { object: this.intersects[0]?.object });
    }

    initialize(overlay: HTMLDivElement) {
        this.overlay = overlay;

        this.overlay.addEventListener('pointermove', this._onPointerMove.bind(this));
        this.overlay.addEventListener('pointerdown', (e) => {
            this._onPointerDown();
            this._onPointerMove(e);
        });
    }
}
