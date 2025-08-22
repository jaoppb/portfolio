import { Injectable } from '@angular/core';
import { RenderService } from './render';
import { MouseService } from './mouse';

@Injectable({ providedIn: 'root' })
export class InitializerService {
    constructor(
        private readonly renderService: RenderService,
        private readonly mouseService: MouseService
    ) {}

    initialize(canvas: HTMLCanvasElement) {
        this.renderService.initialize(canvas);
        this.mouseService.initialize(canvas);
    }
}
