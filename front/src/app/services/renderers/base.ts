import * as THREE from 'three';
import { LoggerService } from '../logger';
import { EventEmitter } from '@app/utils/event-emitter';
import { CSS3DRenderer } from 'three/examples/jsm/Addons.js';

export type SupportedRenderers = THREE.WebGLRenderer | CSS3DRenderer;

export type MoveTo = {
    position: THREE.Vector3;
    velocity?: number;
};

export type RotateTo = {
    rotation: THREE.Quaternion;
    velocity?: number;
};

export interface IRenderServiceEvents<Renderer extends SupportedRenderers> {
    createdRenderer: { renderer: Renderer };
}

export type CreatedRendererEvent<R extends SupportedRenderers> =
    IRenderServiceEvents<R>['createdRenderer'];

export abstract class RendererService<
    Element extends HTMLElement,
    Renderer extends SupportedRenderers = SupportedRenderers,
    Events extends IRenderServiceEvents<Renderer> = IRenderServiceEvents<Renderer>
> extends EventEmitter<Events> {
    protected element: Element | null = null;
    protected renderer?: Renderer;

    constructor(
        protected readonly scene: THREE.Scene,
        protected readonly camera: THREE.PerspectiveCamera,
        protected readonly loggerService: LoggerService
    ) {
        super();
    }

    protected abstract _setUp(element: Element): Renderer;

    private _moveTo() {
        for (const child of this.scene.children) {
            const moveTo = child.userData['moveTo'] as MoveTo;
            if (!moveTo) continue;
            const velocity = moveTo.velocity ?? 0.1;

            if (child.position.distanceTo(moveTo.position) <= velocity / 10) {
                child.position.copy(moveTo.position);
                delete child.userData['moveTo'];
            } else child.position.lerp(moveTo.position, velocity);
        }
    }

    private _rotateTo() {
        for (const child of this.scene.children) {
            const rotateTo = child.userData['rotateTo'] as RotateTo;
            if (!rotateTo) continue;
            const velocity = rotateTo.velocity ?? 0.1;

            if (child.quaternion.angleTo(rotateTo.rotation) <= velocity / 10) {
                child.quaternion.copy(rotateTo.rotation);
                delete child.userData['rotateTo'];
            } else child.quaternion.slerp(rotateTo.rotation, velocity);
        }
    }

    protected _animate() {
        if (!this.renderer) return;

        this._moveTo();
        this._rotateTo();

        this.renderer.render(this.scene, this.camera);
    }

    initialize(element: Element) {
        if (element === this.element) {
            this.loggerService.info('RenderService', 'Ignoring redundant element initialization');
            return;
        }

        if (this.renderer) {
            this.loggerService.warn(
                'RenderService',
                'Renderer already exists, disposing previous instance'
            );
            if (this.renderer instanceof THREE.WebGLRenderer) this.renderer.dispose();
        }

        this.renderer = this._setUp(element);
        this.element = element;

        this.emit('createdRenderer', { renderer: this.renderer });
        this.loggerService.info('RenderService', 'Scene and camera initialized');
    }
}
