import { Component, computed, Input, Signal, signal } from '@angular/core';
import { ProgressBar } from '@app/components/progress-bar/progress-bar';
import { SceneLoadingState } from '@app/pages/scene/scene';

@Component({
    selector: 'app-loading',
    imports: [ProgressBar],
    templateUrl: './loading.html',
    styleUrl: './loading.scss',
})
export class Loading {
    @Input() loadings: Signal<SceneLoadingState[]> = signal([]);
    isDownloading: Signal<boolean> = computed(() =>
        this.loadings().some((state) => state.progress < 100)
    );
    tick = signal(0);

    ngOnInit() {
        setInterval(() => {
            this.tick.update((tick) => tick + 1);
        }, 500);
    }
}
