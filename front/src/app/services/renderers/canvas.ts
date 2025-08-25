import { Inject, Injectable } from '@angular/core';
import { AnimationService } from '../animation';
import { DataService } from '../data';
import { LoggerService } from '../logger';
import { Focusable, LoadedEvent, Model, ModelLoaderService } from '../model-loader';
import { IRenderServiceEvents, RendererService } from './base';
import * as THREE from 'three';
import { lastValueFrom } from 'rxjs';
import { getPositionFromCamera, parseRotation } from '@app/utils';
import { CANVAS_SCENE } from '@app/tokens';
import { OverlayRendererService } from './overlay';

export type Page = {
    path: string;
};

interface ICanvasRendererService extends IRenderServiceEvents<THREE.WebGLRenderer> {
    modelLoaded: { model: Model };
}

export type ModelLoadedEvent = ICanvasRendererService['modelLoaded'];

@Injectable({ providedIn: 'root' })
export class CanvasRendererService extends RendererService<
    HTMLCanvasElement,
    THREE.WebGLRenderer,
    ICanvasRendererService
> {
    private clock = new THREE.Clock();
    private mixers: THREE.AnimationMixer[] = [];

    private readonly light: THREE.PointLight;

    private pages?: { [key: string]: Page[] };

    constructor(
        @Inject(CANVAS_SCENE)
        scene: THREE.Scene,
        camera: THREE.PerspectiveCamera,
        loggerService: LoggerService,
        private readonly overlayRendererService: OverlayRendererService,
        private readonly modelLoaderService: ModelLoaderService,
        private readonly dataService: DataService,
        private readonly animationService: AnimationService
    ) {
        super(scene, camera, loggerService);
        this.light = new THREE.PointLight(0xffffff, 80, 0, 1.5);
        this.light.castShadow = true;
        this.scene.add(this.light);

        this.modelLoaderService.on('loaded', this._onModelLoaded.bind(this));
        this.animationService.on('mixer', ({ mixer }) => this.mixers.push(mixer));
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

    private _onModelLoaded({ model, object }: LoadedEvent) {
        if (model.template) this._handleTemplate(model, object);
        else this._addObject(model, object);
    }

    protected override _setUp(canvas: HTMLCanvasElement) {
        this.camera.position.set(-3.5, 5.5, -1);
        this.camera.lookAt(-6, 4.5, -1);

        this.light.position.copy(
            getPositionFromCamera(this.camera, -3, new THREE.Vector3(0, 3, 0))
        );

        const renderer = new THREE.WebGLRenderer({
            canvas,
        });
        renderer.setAnimationLoop(this._animate.bind(this));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;

        return renderer;
    }

    protected override _animate(): void {
        const delta = this.clock.getDelta();

        for (const mixer of this.mixers) {
            mixer.update(delta);
        }

        this.overlayRendererService.animate();
        super._animate();
    }
}
