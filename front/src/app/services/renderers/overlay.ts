import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/Addons.js';
import { RendererService } from './base';
import { ComponentRef, Inject, Injectable } from '@angular/core';
import { LoggerService } from '../logger';
import * as THREE from 'three';
import { OVERLAY_SCENE } from '@app/tokens';

interface Overlay<C> {
    overlay: THREE.Object3D;
    component: ComponentRef<C>;
    object: THREE.Object3D;
    transformation?: Transformation;
}

export type Transformation = {
    rotation?: {
        offset?: THREE.Quaternion;
    };
};

@Injectable({ providedIn: 'root' })
export class OverlayRendererService extends RendererService<HTMLElement, CSS3DRenderer> {
    private objects: Overlay<unknown>[] = [];

    constructor(
        @Inject(OVERLAY_SCENE)
        scene: THREE.Scene,
        camera: THREE.PerspectiveCamera,
        loggerService: LoggerService
    ) {
        super(scene, camera, loggerService);
    }

    protected override _setUp(element: HTMLElement): CSS3DRenderer {
        const renderer = new CSS3DRenderer({ element });
        renderer.setSize(window.innerWidth, window.innerHeight);
        return renderer;
    }

    addObject(
        component: ComponentRef<unknown>,
        object: THREE.Object3D,
        transformation?: Transformation
    ): CSS3DObject {
        this.loggerService.debug('OverlayRendererService', 'Adding overlay object:', component);
        const cssObject = new CSS3DObject(component.location.nativeElement);
        const overlayObject: THREE.Object3D = new THREE.Group();
        overlayObject.add(cssObject);
        this.objects.push({
            overlay: overlayObject,
            component,
            object,
            transformation,
        });
        this.scene.add(overlayObject);
        return cssObject;
    }

    removeObject(component: ComponentRef<unknown>) {
        const index = this.objects.findIndex(({ component: c }) => c === component);
        if (index === -1) return;

        const { overlay } = this.objects[index];
        this.objects.splice(index, 1);
        this.scene.remove(overlay);
    }

    animate(): void {
        this.objects.forEach(({ overlay, object, transformation }) => {
            object.getWorldPosition(overlay.position);
            object.getWorldQuaternion(overlay.quaternion);
            if (transformation) {
                const { rotation } = transformation;
                if (rotation) {
                    const { offset } = rotation;
                    if (offset) {
                        const realOffset = object.quaternion.clone().multiply(offset);
                        object.parent!.getWorldQuaternion(overlay.quaternion);
                        overlay.quaternion.multiply(realOffset);
                    }
                }
            }
            const distance = this.camera.position.distanceTo(overlay.position);
            overlay.scale.setScalar(this._getScaleAtDistance(distance));
        });

        this._animate();
    }

    private _getScaleAtDistance(distance: number): number {
        if (!this.renderer) return 0;

        const fovInRadians = THREE.MathUtils.degToRad(this.camera.fov);
        const visibleHeight = 2 * Math.tan(fovInRadians / 2) * distance;

        const pixelHeight = this.renderer.domElement.clientHeight;
        return visibleHeight / pixelHeight;
    }
}
