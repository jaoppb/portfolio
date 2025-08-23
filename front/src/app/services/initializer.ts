import { Injectable } from '@angular/core';
import { RenderService } from './render';
import { MouseService } from './mouse';
import { InteractionService } from './interaction';
import { ResizeService } from './resize';

@Injectable({ providedIn: 'root' })
export class InitializerService {
    constructor(
        private readonly renderService: RenderService,
        private readonly mouseService: MouseService,
        private readonly interactionService: InteractionService,
        private readonly resizeService: ResizeService
    ) {}

    initialize(canvas: HTMLCanvasElement) {
        this.resizeService.initialize();
        this.renderService.initialize(canvas);
        this.mouseService.initialize(canvas);
        this.interactionService.initialize();
    }
}
