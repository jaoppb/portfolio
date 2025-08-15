import { Injectable, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { LoggerService } from './logger';
import { BookshelfModel } from '@app/models/bookshelf';

@Injectable({
    providedIn: 'root',
})
export class RenderService implements OnDestroy {
    private canvas: HTMLCanvasElement | null = null;
    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private renderer!: THREE.WebGLRenderer;

    constructor(private readonly loggerService: LoggerService) {}

    private async _loadModels() {
        this.loggerService.info('RenderService', 'Book Shelf model loaded');
        const bookshelf = new BookshelfModel(this.loggerService);
        this.scene.add(await bookshelf.getModel());
    }

    private _start() {
        if (!this.canvas) {
            throw new Error('Canvas not initialized');
        }

        if (this.renderer) {
            this._stop();
        }

        this.loggerService.info('RenderService', 'Starting rendering service');
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xe7e7e7ff);
        const light = new THREE.PointLight(0xffffff, 1, 100, 0.1);
        this.scene.add(light);

        this._loadModels();

        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(-3.5, 5, -1);
        this.camera.lookAt(-6, 4, -1);
        light.position.set(
            this.camera.position.x,
            this.camera.position.y + 1,
            this.camera.position.z + 1
        );

        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setAnimationLoop(this._animate.bind(this));

        this.loggerService.info('RenderService', 'Scene and camera initialized');
    }

    private _animate() {
        this.renderer.render(this.scene, this.camera);
    }

    private _stop() {
        this.loggerService.info('RenderService', 'Stopping rendering service');

        if (this.renderer) {
            this.renderer.dispose();
        }
        this.canvas = undefined as any;
        this.scene = undefined as any;
        this.camera = undefined as any;
        this.renderer = undefined as any;

        this.loggerService.info('RenderService', 'Resources disposed');
    }

    initialize(canvas: HTMLCanvasElement) {
        if (this.canvas) {
            this.loggerService.warn('RenderService', 'Canvas already initialized, reinitializing');
            this._stop();
        }

        this.canvas = canvas;
        this._start();
    }

    ngOnDestroy() {
        this._stop();
    }
}
