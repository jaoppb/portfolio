import { Injectable } from '@angular/core';
import { CreatedRendererEvent, RenderService } from './render';
import * as THREE from 'three';
import { LoggerService } from './logger';

@Injectable({ providedIn: 'root' })
export class ResizeService {
    private renderer?: THREE.WebGLRenderer;

    constructor(
        private readonly renderService: RenderService,
        private readonly camera: THREE.PerspectiveCamera
    ) {}

    private _onCreatedRenderer({ renderer }: CreatedRendererEvent) {
        this.renderer = renderer;
        this._onResize();
        window.addEventListener('resize', this._onResize.bind(this));
    }

    private _onResize() {
        if (!this.renderer || !this.camera) return;

        const { innerWidth: width, innerHeight: height } = window;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    initialize() {
        this.renderService.on('createdRenderer', this._onCreatedRenderer.bind(this));
    }
}
