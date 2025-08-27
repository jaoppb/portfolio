import { Injectable } from '@angular/core';
import { CreatedRendererEvent, RendererService, SupportedRenderers } from './renderers/base';
import * as THREE from 'three';
import { CSS3DRenderer } from 'three/examples/jsm/Addons.js';

@Injectable({ providedIn: 'root' })
export class ResizeService {
    private renderers: (THREE.WebGLRenderer | CSS3DRenderer)[] = [];

    constructor(private readonly camera: THREE.PerspectiveCamera) {}

    private _onCreatedRenderer<R extends SupportedRenderers>({
        renderer,
    }: CreatedRendererEvent<R>) {
        this.renderers.push(renderer);
        this._onResize();
        window.addEventListener('resize', this._onResize.bind(this));
    }

    private _onResize() {
        if (!this.renderers.length || !this.camera) return;

        const { innerWidth: width, innerHeight: height } = window;
        this.camera.aspect = width / height;

        for (const renderer of this.renderers) {
            renderer.setSize(width, height);
            if (renderer instanceof THREE.WebGLRenderer) {
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            }
        }
        this.camera.updateProjectionMatrix();
    }

    registerRendererService<R extends SupportedRenderers>(
        rendererService: RendererService<any, R>
    ) {
        rendererService.on('createdRenderer', this._onCreatedRenderer.bind(this));
    }
}
