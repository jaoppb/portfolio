import { Component, computed, Input, signal, Signal } from '@angular/core';

@Component({
    selector: 'app-error',
    imports: [],
    templateUrl: './error.html',
    styleUrl: './error.scss',
})
export class Error {
    @Input() errors: string[] = [];
    hasError: Signal<boolean> = computed(() => this.errors.length > 0);
}
