import { CSS3DRenderer } from 'three/examples/jsm/Addons.js';
import { RendererService } from './base';
import { Inject, Injectable } from '@angular/core';
import { LoggerService } from '../logger';
import * as THREE from 'three';
import { OVERLAY_SCENE } from '@app/tokens';

@Injectable({ providedIn: 'root' })
export class OverlayRendererService extends RendererService<HTMLElement, CSS3DRenderer> {
    constructor(
        @Inject(OVERLAY_SCENE)
        scene: THREE.Scene,
        camera: THREE.PerspectiveCamera,
        loggerService: LoggerService
    ) {
        super(scene, camera, loggerService);
    }

    protected override _setUp(element: HTMLElement): CSS3DRenderer {
        const renderer = new CSS3DRenderer({ element });
        renderer.setSize(window.innerWidth, window.innerHeight);
        return renderer;
    }

    animate(): void {
        this._animate();
    }
}
