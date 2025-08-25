import { ComponentRef, Inject, Injectable } from '@angular/core';
import * as THREE from 'three';
import { MouseService, PointerClick } from './mouse';
import { Focusable, Model } from './model-loader';
import { getObjectScreenSize, getPositionFromCamera } from '@app/utils';
import { AnimationService, PlayAnimation } from './animation';
import { LoggerService } from './logger';
import { CanvasRendererService, PageData } from './renderers/canvas';
import { CANVAS_SCENE } from '@app/tokens';
import { Book as PageComponent } from '@app/components/page/book';
import { ComponentService } from './component';
import { OverlayRendererService } from './renderers/overlay';

type SelectedModel = {
    object: THREE.Object3D<THREE.Object3DEventMap>;
    restore: {
        location: THREE.Vector3;
        rotation: THREE.Quaternion;
        scale: THREE.Vector3;
    };
};

@Injectable({ providedIn: 'root' })
export class InteractionService {
    private selected?: SelectedModel;
    private pageElement?: ComponentRef<PageComponent>;
    private renderer?: THREE.WebGLRenderer;

    constructor(
        private readonly loggerService: LoggerService,
        private readonly mouseService: MouseService,
        private readonly camera: THREE.PerspectiveCamera,
        @Inject(CANVAS_SCENE)
        private readonly canvasScene: THREE.Scene,
        private readonly overlayRendererService: OverlayRendererService,
        private readonly componentService: ComponentService,
        private readonly animationService: AnimationService,
        private readonly canvasRendererService: CanvasRendererService
    ) {
        this.canvasRendererService.on('createdRenderer', ({ renderer }) => {
            this.renderer = renderer;
        });
    }

    private _checkObjectAnimationState(object: THREE.Object3D<THREE.Object3DEventMap>): boolean {
        const animation: Model['animation'] | undefined = object.userData['animation'];
        if (!animation) return false;

        const stateName = animation.state;
        return object.userData[stateName];
    }

    private _setObjectAnimationState(
        object: THREE.Object3D<THREE.Object3DEventMap>,
        value: boolean
    ) {
        const animation: Model['animation'] | undefined = object.userData['animation'];
        if (!animation) return;

        const stateName = animation.state;
        object.userData[stateName] = value;
    }

    private _resetSelection() {
        if (!this.selected) return;

        if (this._checkObjectAnimationState(this.selected.object)) {
            this._playAnimation(this.selected.object);
        }

        this._unloadPage();

        const { location, rotation, scale } = this.selected.restore;
        this.selected.object.position.copy(location);
        this.selected.object.quaternion.copy(rotation);
        this.selected.object.scale.copy(scale);
        this.selected = undefined;
    }

    private _selectObject(object: THREE.Object3D<THREE.Object3DEventMap>) {
        const focusable: Focusable | undefined = object.userData['focusable'];
        if (!focusable) return;

        this.selected = {
            object,
            restore: {
                location: object.position.clone(),
                rotation: object.quaternion.clone(),
                scale: object.scale.clone(),
            },
        };

        const position = getPositionFromCamera(this.camera, focusable.distance ?? 1.5);
        if (focusable.offsetPosition) position.add(focusable.offsetPosition);
        object.position.copy(position);

        const upVector = new THREE.Vector3(0, 1, 0);
        const upRotation = new THREE.Quaternion().setFromUnitVectors(
            upVector.clone(),
            upVector.clone().applyQuaternion(this.camera.quaternion)
        );
        if (focusable.rotation) upRotation.multiply(focusable.rotation);
        object.quaternion.copy(upRotation);
    }

    private _getTopMostObject(
        object: THREE.Object3D<THREE.Object3DEventMap>
    ): THREE.Object3D<THREE.Object3DEventMap> {
        while (object.parent && object.parent !== this.canvasScene) object = object.parent;
        return object;
    }

    private _playAnimation(object: THREE.Object3D<THREE.Object3DEventMap>) {
        const animation: Model['animation'] | undefined = object.userData['animation'];
        if (!animation) return;

        this.loggerService.info(
            'InteractionService',
            `Clicked on object: ${object.userData['name']}`
        );

        if (this._checkObjectAnimationState(object) === undefined)
            this._setObjectAnimationState(object, false);
        const current = this._checkObjectAnimationState(object);
        const options: PlayAnimation = {
            modelName: object.userData['name'],
            object: object as THREE.Group,
            clipOptions: {
                ...(animation.options ?? {}),
                inReverse: current,
            },
        };
        if (current) options.onEnd = this._unloadPage.bind(this);
        else this._loadPage(object);
        this.animationService.playAnimation(options);
        this._setObjectAnimationState(object, !current);
    }

    private _unloadPage() {
        if (this.pageElement) {
            this.overlayRendererService.removeObject(this.pageElement);
            this.componentService.destroyComponent(this.pageElement);
            this.pageElement = undefined;
        }
    }

    private _loadPage(object: THREE.Object3D<THREE.Object3DEventMap>) {
        if (!this.renderer) return;

        const page: PageData | undefined = object.userData['page'];
        if (!page) return;

        this._unloadPage();

        this.loggerService.info('InteractionService', 'Loading page', page);
        let found = object.children[0]?.children[0]?.children[24];
        if (!found) return;

        this.loggerService.info('InteractionService', 'Loading page at', found);
        this.pageElement = this.componentService.createComponent(PageComponent);
        if (!this.pageElement) return;

        this.pageElement.instance.path = page.path;

        const size = getObjectScreenSize(found, this.camera, this.renderer);
        const { style } = this.pageElement.location.nativeElement;
        style.width = `${size.x * 2}px`;
        style.height = `${size.y}px`;

        this.overlayRendererService.addObject(this.pageElement, found);
    }

    private _onClick({ object }: PointerClick) {
        if (object) {
            object = this._getTopMostObject(object);
            if (this.selected?.object === object) {
                this._playAnimation(object);
                return;
            }
        }

        this._resetSelection();

        if (!object) return;
        this._selectObject(object);
    }

    initialize() {
        this.mouseService.on('click', this._onClick.bind(this));
    }
}
