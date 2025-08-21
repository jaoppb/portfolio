import { Component, computed, ElementRef, signal, ViewChild, WritableSignal } from '@angular/core';
import { LoadingState, RenderService } from '@services/render';
import { Loading } from '../../components/loading/loading';
import _ from 'lodash';
import { Error } from '@app/components/error/error';

@Component({
    selector: 'app-scene',
    imports: [Loading, Error],
    templateUrl: './scene.html',
    styleUrl: './scene.scss',
})
export class Scene {
    @ViewChild('canvas')
    set canvas(ref: ElementRef<HTMLCanvasElement> | undefined) {
        if (!ref) return;

        this.renderService.initialize(ref.nativeElement);
    }

    loadings: WritableSignal<LoadingState[]> = signal([], {
        equal: _.isEqual,
    });
    readonly isLoading = computed(() => this.loadings().some((state) => state.progress < 100));
    errors: WritableSignal<string[]> = signal([], { equal: _.isEqual });

    constructor(private readonly renderService: RenderService) {
        this.renderService.on('modelLoading', this._handleModelLoading.bind(this));
        this.renderService.on('modelError', this._handleModelError.bind(this));
    }

    private _handleModelLoading(state: LoadingState) {
        this.loadings.update((loading) => {
            const clone = _.cloneDeep(loading);
            const index = clone.findIndex((item) => item.name === state.name);
            if (index !== -1) clone[index] = state;
            else clone.push(state);
            return clone;
        });
    }

    private _handleModelError(name: string) {
        this.errors.update((errors) => [...errors, name]);
    }
}
