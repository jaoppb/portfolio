import { Injectable, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { LoggerService } from './logger';
import { getPositionFromCamera, parseRotation } from '@app/utils';
import { Focusable, LoadedEvent, Model, ModelLoaderService } from './model-loader';
import { MouseService, PointerClick } from './mouse';
import { DataService } from './data';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { EventEmitter } from '@app/utils/event-emitter';

export type Page = {
    path: string;
};

type SelectedModel = {
    object: THREE.Object3D<THREE.Object3DEventMap>;
    location: THREE.Vector3;
    rotation: THREE.Quaternion;
    scale: THREE.Vector3;
};

export type ModelLoadedEvent = { model: Model };

interface IRenderServiceEvents {
    modelLoaded: ModelLoadedEvent;
}

@Injectable({
    providedIn: 'root',
})
export class RenderService extends EventEmitter<IRenderServiceEvents> implements OnDestroy {
    private canvas: HTMLCanvasElement | null = null;
    private renderer?: THREE.WebGLRenderer;
    private selected?: SelectedModel;

    private light: THREE.PointLight;

    private pages?: { [key: string]: Page[] };

    constructor(
        private readonly scene: THREE.Scene,
        private readonly camera: THREE.PerspectiveCamera,
        private readonly loggerService: LoggerService,
        private readonly modelLoaderService: ModelLoaderService,
        private readonly mouseService: MouseService,
        private readonly dataService: DataService
    ) {
        super();

        this.light = new THREE.PointLight(0xffffff, 200);
        this.light.castShadow = true;
        this.scene.add(this.light);

        this.modelLoaderService.on('loaded', this._onModelLoaded.bind(this));
        this.mouseService.on('click', this._onClick.bind(this));
    }

    private async _handleTemplate(model: Model, object: THREE.Object3D<THREE.Object3DEventMap>) {
        if (!model.template) {
            this.loggerService.warn(
                'RenderService',
                `Model ${model.displayName} is missing a template`
            );
            return;
        }

        if (!this.pages) {
            this.pages = await lastValueFrom(this.dataService.pages);
        }

        const pages = this.pages?.[model.name];
        if (!pages) {
            this.loggerService.warn('RenderService', `Model ${model.displayName} is missing pages`);
            return;
        }

        for (let index = 0; index < pages.length; index++) {
            const page = pages[index];
            const clone = object.clone();
            clone.position.add(new THREE.Vector3(...model.template.offset).multiplyScalar(index));
            clone.userData = {
                ...object.userData,
                template: undefined,
                page,
            };
            this.scene.add(clone);
            this.loggerService.info(
                'RenderService',
                `Model ${model.displayName} added to scene`,
                clone
            );
        }
        this.emit('modelLoaded', { model });
    }

    private _onModelLoaded({ model, object }: LoadedEvent) {
        if (model.template) {
            this._handleTemplate(model, object);
            return;
        }

        if (model.focusable) {
            const rotation = parseRotation(model.focusable.rotation);
            const offsetPosition = new THREE.Vector3(...model.focusable.offsetPosition);
            object.userData['focusable'] = { rotation, offsetPosition } as Focusable;
        }

        this.scene.add(object);
        this.loggerService.info(
            'RenderService',
            `Model ${model.displayName} added to scene`,
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
        window.addEventListener('resize', this._onResize.bind(this));

        this.camera.position.set(-3.5, 5.5, -1);
        this.camera.lookAt(-6, 4.5, -1);

        this.light.position.copy(getPositionFromCamera(this.camera, -5));

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
        });
        this.renderer.setAnimationLoop(this._animate.bind(this));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;

        this._onResize();

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
        const { innerWidth: width, innerHeight: height } = window;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    private _onClick({ object }: PointerClick) {
        if (this.selected) {
            this.selected.object.position.copy(this.selected.location);
            this.selected.object.quaternion.copy(this.selected.rotation);
            this.selected.object.scale.copy(this.selected.scale);
        }

        if (!object) return;

        while (object.parent && object.parent !== this.scene) object = object.parent;

        const focusable: Focusable | undefined = object.userData['focusable'];
        if (!focusable) return;

        this.selected = {
            object,
            location: object.position.clone(),
            rotation: object.quaternion.clone(),
            scale: object.scale.clone(),
        };

        const position = getPositionFromCamera(this.camera, 1.5);
        if (focusable.offsetPosition) position.add(focusable.offsetPosition);
        object.position.copy(position);

        const upVector = new THREE.Vector3(0, 1, 0);
        const upRotation = new THREE.Quaternion().setFromUnitVectors(
            upVector.clone(),
            upVector.clone().applyQuaternion(this.camera.quaternion)
        );
        object.quaternion.copy(upRotation.multiply(focusable.rotation));
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
