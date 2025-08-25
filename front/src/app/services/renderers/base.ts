import * as THREE from 'three';
import { LoggerService } from '../logger';
import { ModelLoaderService } from '../model-loader';
import { DataService } from '../data';
import { EventEmitter } from '@app/utils/event-emitter';
import { AnimationService } from '../animation';
import { CSS3DRenderer } from 'three/examples/jsm/Addons.js';

export type SupportedRenderers = THREE.WebGLRenderer | CSS3DRenderer;

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

    protected _animate() {
        if (!this.renderer) return;
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
