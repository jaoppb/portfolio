import { Injectable, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { LoggerService } from './logger';
import { PlanksModel } from '@app/models/planks';
import { BonsaiModel } from '@app/models/bonsai';
import { LoadableModel } from '@app/models/loadable';
import { BookSupportsModel } from '@app/models/book-supports';
import { DualShockModel } from '@app/models/dualshock';
import { BookModel } from '@app/models/book';

@Injectable({
    providedIn: 'root',
})
export class RenderService implements OnDestroy {
    private canvas: HTMLCanvasElement | null = null;
    private scene!: THREE.Scene;
    private camera!: THREE.PerspectiveCamera;
    private renderer!: THREE.WebGLRenderer;

    constructor(private readonly loggerService: LoggerService) {}

    private _loadModels() {
        const models: LoadableModel[] = [];

        models.push(new PlanksModel(this.loggerService));
        models.push(new BonsaiModel(this.loggerService));
        models.push(new BookSupportsModel(this.loggerService));
        models.push(new DualShockModel(this.loggerService));
        models.push(new BookModel(this.loggerService));

        models.forEach((model) => {
            model
                .getModel()
                .then((data) => {
                    this.loggerService.info('RenderService', `Model loaded: ${model.name}`);
                    this.scene.add(data);
                })
                .catch((error) => {
                    this.loggerService.error(
                        'RenderService',
                        `Failed to load model ${model.name}: ${error}`
                    );
                });
        });
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
