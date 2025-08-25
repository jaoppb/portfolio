import { Injectable, ViewContainerRef } from '@angular/core';
import { MouseService } from './mouse';
import { InteractionService } from './interaction';
import { ResizeService } from './resize';
import { CanvasRendererService } from './renderers/canvas';
import { OverlayRendererService } from './renderers/overlay';
import { ComponentService } from './component';

@Injectable({ providedIn: 'root' })
export class InitializerService {
    constructor(
        private readonly canvasRendererService: CanvasRendererService,
        private readonly overlayRendererService: OverlayRendererService,
        private readonly mouseService: MouseService,
        private readonly interactionService: InteractionService,
        private readonly resizeService: ResizeService,
        private readonly componentService: ComponentService
    ) {
        this.resizeService.registerRendererService(this.canvasRendererService);
        this.resizeService.registerRendererService(this.overlayRendererService);
        this.interactionService.initialize();
    }

    initializeCanvas(canvas: HTMLCanvasElement) {
        this.canvasRendererService.initialize(canvas);
    }

    initializeOverlay(overlay: HTMLDivElement) {
        this.overlayRendererService.initialize(overlay);
        this.mouseService.initialize(overlay);
    }

    initializeContainer(viewContainerRef: ViewContainerRef) {
        this.componentService.initialize(viewContainerRef);
    }
}
