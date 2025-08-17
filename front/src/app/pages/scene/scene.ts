import { Component, ElementRef, signal, Signal, ViewChild } from '@angular/core';
import { RenderService } from '@services/render';

@Component({
    selector: 'app-scene',
    imports: [],
    templateUrl: './scene.html',
    styleUrl: './scene.scss',
})
export class Scene {
    @ViewChild('canvas')
    set canvas(ref: ElementRef<HTMLCanvasElement> | undefined) {
        if (!ref) return;

        this.renderService.initialize(ref.nativeElement);
    }

    constructor(private readonly renderService: RenderService) {}
}
