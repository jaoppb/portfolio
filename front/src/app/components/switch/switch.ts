import { NgClass } from '@angular/common';
import { Component, Input, output, signal, WritableSignal } from '@angular/core';

@Component({
    selector: 'app-switch',
    imports: [NgClass],
    templateUrl: './switch.html',
    styleUrl: './switch.scss',
})
export class Switch {
    @Input() left: string = '';
    @Input() right: string = '';

    _state: WritableSignal<boolean> = signal(false);
    state = output<boolean>();

    toggle() {
        this._state.set(!this._state());
        this.state.emit(this._state());
    }
}
