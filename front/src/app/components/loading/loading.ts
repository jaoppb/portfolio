import { Component, Input, signal } from '@angular/core';
import { LoadingState } from '@app/services/render';
import { ProgressBar } from '@app/components/progress-bar/progress-bar';

@Component({
    selector: 'app-loading',
    imports: [ProgressBar],
    templateUrl: './loading.html',
    styleUrl: './loading.scss',
})
export class Loading {
    @Input() loadings: LoadingState[] = [];
    tick = signal(0);

    ngOnInit() {
        setInterval(() => {
            this.tick.update((tick) => tick + 1);
        }, 500);
    }
}
