import { Injectable, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { LoggerService } from './logger';
import { getPositionFromCamera, parseRotation } from '@app/utils';
import { Focusable, LoadedEvent, Model, ModelLoaderService } from './model-loader';
import { DataService } from './data';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { EventEmitter } from '@app/utils/event-emitter';
import { AnimationService } from './animation';

export type Page = {
    path: string;
};

export type ModelLoadedEvent = { model: Model };
export type CreatedRendererEvent = { renderer: THREE.WebGLRenderer };

interface IRenderServiceEvents {
    modelLoaded: ModelLoadedEvent;
    createdRenderer: CreatedRendererEvent;
}

@Injectable({
    providedIn: 'root',
})
export class RenderService extends EventEmitter<IRenderServiceEvents> implements OnDestroy {
    private canvas: HTMLCanvasElement | null = null;
    private renderer?: THREE.WebGLRenderer;
    private clock = new THREE.Clock();
    private mixers: THREE.AnimationMixer[] = [];

    private light: THREE.PointLight;

    private pages?: { [key: string]: Page[] };

    constructor(
        private readonly scene: THREE.Scene,
        private readonly camera: THREE.PerspectiveCamera,
        private readonly loggerService: LoggerService,
        private readonly modelLoaderService: ModelLoaderService,
        private readonly dataService: DataService,
        private readonly animationService: AnimationService
    ) {
        super();

        this.light = new THREE.PointLight(0xffffff, 200);
        this.light.castShadow = true;
        this.scene.add(this.light);

        this.modelLoaderService.on('loaded', this._onModelLoaded.bind(this));
        this.animationService.on('mixer', ({ mixer }) => this.mixers.push(mixer));
    }

    private _onModelLoaded({ model, object }: LoadedEvent) {
        if (model.template) this._handleTemplate(model, object);
        else this._addObject(model, object);
    }

    private _loadPage(
        object: THREE.Object3D<THREE.Object3DEventMap>,
        model: Model,
        index: number,
        page: Page
    ) {
        const clone = object.clone();
        clone.position.add(new THREE.Vector3(...model.template!.offset).multiplyScalar(index));
        clone.userData = {
            ...object.userData,
            template: undefined,
            page,
        };
        this._addObject(model, clone);
    }

    private async _handleTemplate(model: Model, object: THREE.Object3D<THREE.Object3DEventMap>) {
        if (!this.pages) {
            this.pages = await lastValueFrom(this.dataService.pages);
        }

        const pages = this.pages?.[model.name];
        if (!pages) {
            this.loggerService.warn('RenderService', `Model ${model.displayName} is missing pages`);
            return;
        }

        for (let index = 0; index < pages.length; index++) {
            this._loadPage(object, model, index, pages[index]);
        }
    }

    private _addObject(model: Model, object: THREE.Object3D) {
        if (model.focusable) {
            const rotation = parseRotation(model.focusable.rotation);
            const offsetPosition = new THREE.Vector3(...model.focusable.offsetPosition);
            object.userData['focusable'] = { rotation, offsetPosition } as Focusable;
        }

        object.userData['name'] = model.name;
        object.userData['animation'] = model.animation;

        this.scene.add(object);
        this.loggerService.info(
            'RenderService',
            `Object ${model.displayName} added to scene`,
            object
        );
        this.emit('modelLoaded', { model });
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

        this.camera.position.set(-3.5, 5.5, -1);
        this.camera.lookAt(-6, 4.5, -1);

        this.light.position.copy(getPositionFromCamera(this.camera, -5));

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
        });
        this.renderer.setAnimationLoop(this._animate.bind(this));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;

        this.emit('createdRenderer', { renderer: this.renderer });
        this.loggerService.info('RenderService', 'Scene and camera initialized');
    }

    private _animate() {
        if (!this.renderer) return;

        const delta = this.clock.getDelta();

        for (const mixer of this.mixers) {
            mixer.update(delta);
        }

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
