import { Component, computed, ElementRef, signal, ViewChild, WritableSignal } from '@angular/core';
import { Loading } from '../../components/loading/loading';
import _ from 'lodash';
import { Error } from '@app/components/error/error';
import {
    ErrorEvent,
    LoadingState,
    ModelLoaderService,
    ProgressEvent,
} from '@app/services/model-loader';
import { InitializerService } from '@app/services/initializer';
import { ModelLoadedEvent, RenderService } from '@app/services/render';

export type SceneLoadingState = LoadingState & {
    inScene: boolean;
};

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

        this.initializerService.initialize(ref.nativeElement);
    }

    loadings: WritableSignal<SceneLoadingState[]> = signal([], {
        equal: _.isEqual,
    });
    readonly isLoading = computed(() => this.loadings().some((state) => !state.inScene));
    errors: WritableSignal<string[]> = signal([], { equal: _.isEqual });

    constructor(
        private readonly renderService: RenderService,
        private readonly modelLoaderService: ModelLoaderService,
        private readonly initializerService: InitializerService
    ) {
        this.modelLoaderService.on('progress', this._handleModelLoading.bind(this));
        this.modelLoaderService.on('error', this._handleModelError.bind(this));

        this.renderService.on('modelLoaded', this._handleModelLoaded.bind(this));
    }

    private _handleModelLoading(event: ProgressEvent) {
        this.loadings.update((loading) => {
            const clone = _.cloneDeep(loading);
            const index = clone.findIndex((item) => item.name === event.name);
            if (index !== -1) clone[index] = { ...event, inScene: false };
            else clone.push({ ...event, inScene: false });
            return clone;
        });
    }

    private _handleModelLoaded(event: ModelLoadedEvent) {
        this.loadings.update((loading) => {
            const clone = _.cloneDeep(loading);
            const index = clone.findIndex((item) => item.name === event.model.displayName);
            if (index !== -1) clone[index] = { ...clone[index], inScene: true };
            return clone;
        });
    }

    private _handleModelError(event: ErrorEvent) {
        this.errors.update((errors) => [...errors, event.model.displayName]);
    }
}
