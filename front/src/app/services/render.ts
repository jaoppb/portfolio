import { Injectable, Injector, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { LoggerService } from './logger';
import { LoadableModel } from '@app/models/loadable';
import { getPositionFromCamera, parseRotation } from '@app/utils';

export type LoadingState = {
    name: string;
    progress: number;
};

type Focusable = {
    rotation: THREE.Quaternion;
    offsetPosition?: THREE.Vector3;
};

type Page = {
    path: string;
};

type Model = {
    name: string;
    displayName: string;
    path: string;
    location?: THREE.Vector3Tuple;
    rotation?: THREE.Vector3Tuple;
    scale?: number;
    template?: {
        offset: THREE.Vector3Tuple;
    };
    focusable?: {
        rotation: THREE.Vector3Tuple;
        offsetPosition: THREE.Vector3Tuple;
    };
};

type SelectedModel = {
    object: THREE.Object3D<THREE.Object3DEventMap>;
    location: THREE.Vector3;
    rotation: THREE.Quaternion;
    scale: THREE.Vector3;
};

type ModelLoadingCallback = (loadingState: LoadingState) => void;
type ModelErrorCallback = (err: string) => void;

export interface IRenderService {
    initialize(canvas: HTMLCanvasElement): void;
    subscribeModelLoading(callback: ModelLoadingCallback): void;
    subscribeModelError(callback: ModelErrorCallback): void;
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

    private modelLoadingCallbacks: ModelLoadingCallback[] = [];
    private modelErrorCallbacks: ModelErrorCallback[] = [];

    constructor(
        private readonly injector: Injector,
        private readonly loggerService: LoggerService
    ) {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xe7e7e7ff);

        this.light = new THREE.PointLight(0xffffff, 200);
        this.light.castShadow = true;
        this.scene.add(this.light);

        this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);

        this._loadModels();
    }

    private _loadModel(
        model: Model,
        pages: Page[] = [],
        data: THREE.Group<THREE.Object3DEventMap>
    ) {
        this.loggerService.info('RenderService', `Model loaded: ${model.displayName}`);
        if (model.location) data.position.copy(new THREE.Vector3(...model.location));
        if (model.scale) data.scale.setScalar(model.scale);
        if (model.rotation) data.quaternion.copy(parseRotation(model.rotation));
        if (model.focusable)
            data.userData['focusable'] = {
                ...model.focusable,
                rotation: parseRotation(model.focusable.rotation),
                offsetPosition: model.focusable.offsetPosition
                    ? new THREE.Vector3(...model.focusable.offsetPosition)
                    : undefined,
            } as Focusable;
        if (model.template) {
            for (let index = 0; index < pages.length; index++) {
                const page = pages[index];
                const clone = data.clone();
                clone.position.add(
                    new THREE.Vector3(...model.template.offset).multiplyScalar(index)
                );
                this.scene.add(clone);
                clone.userData = {
                    ...data.userData,
                    page,
                    template: undefined,
                };
                this.loggerService.debug(
                    'RenderService',
                    `Model ${model.displayName} added to scene (template clone)`,
                    clone
                );
            }
        } else this.scene.add(data);
        this.loggerService.debug(
            'RenderService',
            `Model ${model.displayName} added to scene`,
            data
        );
        this.modelLoadingCallbacks.forEach((callback) => {
            callback({ name: model.displayName, progress: 100 });
        });
    }

    private _handleLoadModelError(model: Model, error: any) {
        this.modelErrorCallbacks.forEach((callback) => {
            callback(model.displayName);
        });
        this.loggerService.error(
            'RenderService',
            `Failed to load model ${model.displayName}:`,
            error
        );
    }

    private async _loadModels() {
        const { models }: { models: Model[] } = await fetch('models.json').then((res) =>
            res.json()
        );
        this.loggerService.debug('RenderService', 'Loaded model configuration:', models);

        const { pages }: { pages: { [key: string]: Page[] } } = await fetch(
            'pages/pages.json'
        ).then((res) => res.json());

        models.forEach((model) => {
            const loadable = new LoadableModel(
                this.injector,
                model.name,
                model.displayName,
                model.path
            );
            loadable.subscribeToProgress((progress) => {
                this.modelLoadingCallbacks.forEach((callback) => {
                    callback({
                        name: loadable.displayName,
                        progress: Math.min(99, progress),
                    });
                });
            });

            loadable
                .getModel()
                .then(this._loadModel.bind(this, model, pages[model.name]))
                .catch(this._handleLoadModelError.bind(this, model));
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

    subscribeModelLoading(callback: ModelLoadingCallback): void {
        this.modelLoadingCallbacks.push(callback);
    }

    subscribeModelError(callback: ModelErrorCallback): void {
        this.modelErrorCallbacks.push(callback);
    }

    ngOnDestroy() {
        this._stop();
    }
}
