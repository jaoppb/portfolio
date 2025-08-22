import { Injectable, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { LoggerService } from './logger';
import { getPositionFromCamera, parseRotation } from '@app/utils';
import { Focusable, LoadedEvent, Model, ModelLoaderService } from './model-loader';

type Page = {
    path: string;
};

type SelectedModel = {
    object: THREE.Object3D<THREE.Object3DEventMap>;
    location: THREE.Vector3;
    rotation: THREE.Quaternion;
    scale: THREE.Vector3;
};

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
    private raycaster: THREE.Raycaster = new THREE.Raycaster();
    private mouse: THREE.Vector2 = new THREE.Vector2();
    private intersects: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>[] = [];
    private selected?: SelectedModel;

    private light: THREE.PointLight;

    private pages?: { [key: string]: Page[] };

    constructor(
        private readonly loggerService: LoggerService,
        private readonly modelLoaderService: ModelLoaderService
    ) {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xe7e7e7ff);

        this.light = new THREE.PointLight(0xffffff, 200);
        this.light.castShadow = true;
        this.scene.add(this.light);

        this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);

        this.modelLoaderService.on('loaded', this._onModelLoaded.bind(this));
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
            const response = await (await fetch('pages/pages.json')).json();
            this.pages = response.pages;
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
        this.canvas.addEventListener('pointermove', this._onPointerMove.bind(this));
        this.canvas.addEventListener('pointerdown', (e) => {
            this._onClick();
            this._onPointerMove(e);
        });
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

    private _onPointerMove(e: PointerEvent) {
        if (!this.canvas) return;

        const { left, top } = this.canvas.getBoundingClientRect();
        this.mouse.set(
            ((e.clientX - left) / this.canvas.clientWidth) * 2 - 1,
            (-(e.clientY - top) / this.canvas.clientHeight) * 2 + 1
        );
        this.raycaster.setFromCamera(this.mouse, this.camera);

        this.intersects = this.raycaster.intersectObjects(this.scene.children, true);
    }

    private _onClick() {
        if (this.selected) {
            this.selected.object.position.copy(this.selected.location);
            this.selected.object.quaternion.copy(this.selected.rotation);
            this.selected.object.scale.copy(this.selected.scale);
        }

        let object = this.intersects[0]?.object;
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
