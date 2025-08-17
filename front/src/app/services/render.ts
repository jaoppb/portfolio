import { Injectable, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { LoggerService } from './logger';
import { PlanksModel } from '@app/models/planks';
import { BonsaiModel } from '@app/models/bonsai';
import { LoadableModel } from '@app/models/loadable';
import { BookSupportsModel } from '@app/models/book-supports';
import { DualShockModel } from '@app/models/dualshock';
import { BookModel } from '@app/models/book';

export interface IRenderService {
    initialize(canvas: HTMLCanvasElement): void;
}

@Injectable({
    providedIn: 'root',
})
export class RenderService implements IRenderService, OnDestroy {
    private canvas: HTMLCanvasElement | null = null;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer?: THREE.WebGLRenderer;

    private light: THREE.PointLight;

    constructor(private readonly loggerService: LoggerService) {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xe7e7e7ff);

        this.light = new THREE.PointLight(0xffffff, 200);
        this.scene.add(this.light);

        this.camera = new THREE.PerspectiveCamera(60, 16 / 9, 0.1, 1000);

        this._loadModels();
    }

    private async _loadModels() {
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

    private _setUp(canvas: HTMLCanvasElement) {
        if (canvas === this.canvas) {
            this.loggerService.info('RenderService', 'Ignoring redundant canvas initialization');
            return;
        }

        this.loggerService.info('RenderService', 'Starting rendering service');

        if (this.renderer) {
            this.loggerService.warn(
                'RenderService',
                'Renderer already exists, disposing previous instance'
            );
            this.renderer.dispose();
        }

        this.canvas = canvas;
        window.addEventListener('resize', this._onResize.bind(this));

        this.camera.position.set(-3.5, 5.5, -1);
        this.camera.lookAt(-6, 4.5, -1);

        this.light.position.set(
            this.camera.position.x - 2,
            this.camera.position.y + 1,
            this.camera.position.z
        );

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
        });
        this.renderer.setAnimationLoop(this._animate.bind(this));
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.loggerService.info('RenderService', 'Scene and camera initialized');
    }

    private _animate() {
        if (!this.renderer) return;

        this.renderer.render(this.scene, this.camera);
    }

    private _stop() {
        this.loggerService.info('RenderService', 'Stopping rendering service');

        if (this.renderer) {
            this.renderer.dispose();
        }
        this.renderer = undefined;

        this.loggerService.info('RenderService', 'Resources disposed');
    }

    private _onResize() {
        if (!this.renderer || !this.camera || !this.canvas) return;

        this.loggerService.info('RenderService', 'Window resized, updating camera and renderer');
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    initialize(canvas: HTMLCanvasElement) {
        if (this.canvas) {
            this.loggerService.warn('RenderService', 'Canvas already initialized, reinitializing');
            this._stop();
        }

        this._setUp(canvas);
    }

    ngOnDestroy() {
        this._stop();
    }
}
