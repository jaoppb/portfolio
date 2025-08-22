import { Injectable, Injector } from '@angular/core';
import { EventEmitter } from '@app/utils/event-emitter';
import * as THREE from 'three';
import { LoggerService } from './logger';
import { LoadableModel } from '@app/models/loadable';
import { parseRotation } from '@app/utils';
import { DataService } from './data';
import { lastValueFrom } from 'rxjs';

export type Model = {
    name: string;
    displayName: string;
    path: string;
    location?: THREE.Vector3Tuple;
    rotation?: THREE.Vector3Tuple;
    scale?: number;
    template?: {
        offset: THREE.Vector3Tuple;
    };
    focusable?: {
        rotation: THREE.Vector3Tuple;
        offsetPosition: THREE.Vector3Tuple;
    };
};

export type Focusable = {
    rotation: THREE.Quaternion;
    offsetPosition?: THREE.Vector3;
};

export type ProgressEvent = { name: string; progress: number };
export type LoadedEvent = { model: Model; object: THREE.Object3D<THREE.Object3DEventMap> };
export type ErrorEvent = { model: Model; error: any };

export interface IModelLoaderEvents {
    progress: ProgressEvent;
    loaded: LoadedEvent;
    error: ErrorEvent;
}

export type LoadingState = ProgressEvent;

@Injectable({ providedIn: 'root' })
export class ModelLoaderService extends EventEmitter<IModelLoaderEvents> {
    private started: boolean = false;
    constructor(
        private readonly injector: Injector,
        private readonly loggerService: LoggerService,
        private readonly dataService: DataService
    ) {
        super();
        this._loadModels();
    }

    private async _loadModels() {
        if (this.started) return;
        this.started = true;

        const models = await lastValueFrom(this.dataService.models);
        this.loggerService.debug('RenderService', 'Loaded model configuration:', models);

        models.forEach((model) => {
            const loadable = new LoadableModel(
                this.injector,
                model.name,
                model.displayName,
                model.path
            );
            loadable.subscribeToProgress((progress) => {
                this.emit('progress', {
                    name: loadable.displayName,
                    progress: progress,
                });
            });

            loadable
                .getModel()
                .then(this._loadModel.bind(this, model))
                .catch((error) => this.emit('error', { model, error }));
        });
    }

    private _loadModel(model: Model, data: THREE.Group<THREE.Object3DEventMap>) {
        this.loggerService.info('ModelLoaderService', `Model loaded: ${model.displayName}`);
        if (model.location) data.position.copy(new THREE.Vector3(...model.location));
        if (model.scale) data.scale.setScalar(model.scale);
        if (model.rotation) data.quaternion.copy(parseRotation(model.rotation));
        if (model.focusable)
            data.userData['focusable'] = {
                ...model.focusable,
                rotation: parseRotation(model.focusable.rotation),
                offsetPosition: model.focusable.offsetPosition
                    ? new THREE.Vector3(...model.focusable.offsetPosition)
                    : undefined,
            } as Focusable;

        this.loggerService.debug(
            'ModelLoaderService',
            `Model ${model.displayName} added to scene`,
            data
        );
        this.emit('loaded', { model: model, object: data });
    }
}
