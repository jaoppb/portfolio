import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/Addons.js';
import { RendererService } from './base';
import { ComponentRef, Inject, Injectable, Type } from '@angular/core';
import { LoggerService } from '../logger';
import * as THREE from 'three';
import { OVERLAY_SCENE } from '@app/tokens';
import { ComponentService } from '../component';

interface Overlay<C> {
    overlay: CSS3DObject;
    component: ComponentRef<C>;
    object: THREE.Object3D;
}

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

    addObject(component: ComponentRef<unknown>, object: THREE.Object3D) {
        const overlayObject = new CSS3DObject(component.location.nativeElement);
        this.objects.push({
            overlay: overlayObject,
            component,
            object,
        });
        this.scene.add(overlayObject);
    }

    removeObject(component: ComponentRef<unknown>) {
        const index = this.objects.findIndex(({ component: c }) => c === component);
        if (index === -1) return;

        const { overlay } = this.objects[index];
        this.objects.splice(index, 1);
        this.scene.remove(overlay);
    }

    animate(): void {
        this.objects.forEach(({ overlay, object }) => {
            object.getWorldPosition(overlay.position);
            overlay.quaternion.copy(object.getWorldQuaternion(new THREE.Quaternion()));
            overlay.scale.setScalar(0.0015);
        });

        this._animate();
    }
}
