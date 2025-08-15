import { Component, ElementRef, ViewChild } from '@angular/core';
import { RenderService } from '@services/render';

@Component({
    selector: 'app-scene',
    imports: [],
    templateUrl: './scene.html',
    styleUrl: './scene.scss',
})
export class Scene {
    @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

    constructor(private readonly renderService: RenderService) {}

    ngAfterViewInit() {
        if (typeof window === 'undefined') return;

        this.renderService.initialize(this.canvas.nativeElement);
    }
}
