import {
    Component,
    computed,
    ElementRef,
    OnInit,
    signal,
    ViewChild,
    ViewContainerRef,
    WritableSignal,
} from '@angular/core';
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
import { CanvasRendererService, ModelLoadedEvent } from '@app/services/renderers/canvas';
import { Switch } from '@app/components/switch/switch';
import { BookService } from '@app/services/book';

export type SceneLoadingState = LoadingState & {
    inScene: boolean;
};

@Component({
    selector: 'app-scene',
    imports: [Loading, Error, Switch],
    templateUrl: './scene.html',
    styleUrl: './scene.scss',
})
export class Scene implements OnInit {
    @ViewChild('canvas')
    set canvas(ref: ElementRef<HTMLCanvasElement> | undefined) {
        if (!ref) return;

        this.initializerService.initializeCanvas(ref.nativeElement);
    }

    @ViewChild('overlay')
    set overlay(ref: ElementRef<HTMLDivElement> | undefined) {
        if (!ref) return;

        this.initializerService.initializeOverlay(ref.nativeElement);
    }

    loadings: WritableSignal<SceneLoadingState[]> = signal([], {
        equal: _.isEqual,
    });
    readonly isLoading = computed(() => this.loadings().some((state) => !state.inScene));
    errors: WritableSignal<string[]> = signal([], { equal: _.isEqual });

    constructor(
        private readonly canvasRendererService: CanvasRendererService,
        private readonly modelLoaderService: ModelLoaderService,
        private readonly initializerService: InitializerService,
        private readonly viewContainerRef: ViewContainerRef,
        private readonly bookService: BookService
    ) {
        this.modelLoaderService.on('progress', this._handleModelLoading.bind(this));
        this.modelLoaderService.on('error', this._handleModelError.bind(this));

        this.canvasRendererService.on('modelLoaded', this._handleModelLoaded.bind(this));
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

    changeLanguage(state: boolean) {
        this.bookService.language = state ? 'portuguese' : 'english';
    }

    ngOnInit(): void {
        this.initializerService.initializeContainer(this.viewContainerRef);
    }
}
