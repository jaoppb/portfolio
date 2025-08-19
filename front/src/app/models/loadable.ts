import { LoggerService } from '@app/services/logger';
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
THREE.Cache.enabled = true;

type ModelPromise = {
    resolve: (model: THREE.Group) => void;
    reject: (error?: unknown) => void;
};

export abstract class LoadableModel {
    private model: THREE.Group | null = null;
    private promises: ModelPromise[] = [];
    private onProgressCallbacks: ((progress: number) => void)[] = [];
    private isLoading = false;

    public abstract readonly name: string;
    protected abstract readonly path: string;

    constructor(private readonly loggerService: LoggerService) {}

    private _loadModel() {
        if (this.isLoading) return;

        this.isLoading = true;
        loader.load(
            this.path,
            this._onLoad.bind(this),
            this._onProgress.bind(this),
            this._onError.bind(this)
        );
    }

    private _onLoad(gltf: GLTF) {
        this.loggerService.info(`ModelLoader ${this.name}`, 'Model loaded successfully');
        this.model = gltf.scene;
        this.isLoading = false;
        this._clearProgressCallbacks();

        let promise = this.promises.shift();
        while (promise) {
            promise.resolve(this.model.clone());
            promise = this.promises.shift();
        }
    }

    private _onProgress(progressEvent: ProgressEvent<EventTarget>) {
        const progress = (progressEvent.loaded / progressEvent.total) * 100;
        this.loggerService.debug(`ModelLoader ${this.name}`, 'Loading progress:', progress);
        this.onProgressCallbacks.forEach((callback) => callback(progress));
    }

    private _onError(error: unknown) {
        this.loggerService.error(`ModelLoader ${this.name}`, 'Error loading model:', error);
        this.isLoading = false;
        this._clearProgressCallbacks();

        let promise = this.promises.shift();
        while (promise) {
            promise.reject(error);
            promise = this.promises.shift();
        }
    }

    subscribeToProgress(callback: (progress: number) => void) {
        this.onProgressCallbacks.push(callback);
    }

    private _clearProgressCallbacks() {
        this.onProgressCallbacks.length = 0;
    }

    getModel(): Promise<THREE.Group> {
        this.loggerService.info(`ModelLoader ${this.name}`, 'getModel called');
        if (this.model) {
            return Promise.resolve(this.model);
        }

        this._loadModel();

        return new Promise((resolve, reject) => {
            this.promises.push({ resolve, reject });
        });
    }
}
