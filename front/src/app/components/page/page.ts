import {
    Component,
    computed,
    effect,
    HostBinding,
    Input,
    signal,
    Signal,
    WritableSignal,
} from '@angular/core';
import { CanvasRendererService } from '@app/services/renderers/canvas';
import { getPlaneScreenSize } from '@app/utils';
import * as THREE from 'three';

export enum PageOrientation {
    LEFT,
    RIGHT,
}

@Component({
    selector: 'app-page',
    imports: [],
    templateUrl: './page.html',
    styleUrl: './page.scss',
})
export class Page {
    constructor(
        private readonly camera: THREE.PerspectiveCamera,
        private readonly canvasRendererService: CanvasRendererService
    ) {
        effect(() => {
            const overlay = this.overlay();
            if (!overlay) return;

            overlay.position.setX(
                (this.size().x / 2) * (this.orientation() === PageOrientation.LEFT ? -1 : 1)
            );
        });

        this.canvasRendererService.onRetro('createdRenderer', ({ renderer }) => {
            this.renderer.set(renderer);
        });
    }

    private renderer: WritableSignal<THREE.WebGLRenderer | undefined> = signal(undefined);
    @Input()
    plane: WritableSignal<THREE.Mesh | undefined> = signal(undefined);
    @Input()
    overlay: WritableSignal<THREE.Object3D | undefined> = signal(undefined);
    @Input()
    orientation: WritableSignal<PageOrientation> = signal(PageOrientation.LEFT);

    private size: Signal<THREE.Vector2> = computed(() => {
        const plane = this.plane();
        const renderer = this.renderer();
        if (!plane || !renderer) return new THREE.Vector2();

        this.canvasRendererService.frame();

        return getPlaneScreenSize(plane, this.camera, renderer);
    });

    @HostBinding('style.width.px')
    get width(): number {
        const size = this.size();
        if (!size) return 0;
        return size.x;
    }

    @HostBinding('style.height.px')
    get height(): number {
        const size = this.size();
        if (!size) return 0;
        return size.y;
    }
}
