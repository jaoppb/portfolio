import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-progress-bar',
    imports: [],
    templateUrl: './progress-bar.html',
    styleUrl: './progress-bar.scss',
})
export class ProgressBar {
    @Input() value: number = 0;
    innerColor: string = 'hsla(126, 100%, 50%, 1.00)';
    borderColor: string = 'hsla(0, 0%, 0%, 1.00)';
}
