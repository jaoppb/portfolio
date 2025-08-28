import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-progress-bar',
    imports: [],
    templateUrl: './progress-bar.html',
    styleUrl: './progress-bar.scss',
})
export class ProgressBar {
    @Input()
    set value(val: number) {
        this._value = val;
    }

    get value(): number {
        return Math.min(100, this._value);
    }

    private _value: number = 0;
    innerColor: string = 'hsla(199, 80%, 50%, 1.00)';
    borderColor: string = 'hsla(0, 0%, 0%, 1.00)';
}
