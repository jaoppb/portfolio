import { Injectable } from '@angular/core';
import { Model, ModelLoaderService } from './model-loader';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/Addons.js';
import { LoggerService } from './logger';
import { EventEmitter } from '@app/utils/event-emitter';

interface IAnimationServiceEvents {
    mixer: { mixer: THREE.AnimationMixer };
}

export type PlayAnimation = {
    modelName: string;
    object: THREE.Group;
    clipOptions: {
        holdOnLastFrame?: boolean;
        inReverse?: boolean;
    };
    onEnd?: () => void;
};

export type PlayAnimationOptions = PlayAnimation['clipOptions'];

@Injectable({ providedIn: 'root' })
export class AnimationService extends EventEmitter<IAnimationServiceEvents> {
    private readonly animations: Record<string, THREE.AnimationClip[]> = {};
    private readonly mixers: Record<string, THREE.AnimationMixer> = {};
    private readonly mixerCallbacks: [THREE.AnimationMixer, (() => void)[]][] = [];

    constructor(
        private readonly loggerService: LoggerService,
        private readonly modelLoaderService: ModelLoaderService
    ) {
        super();
        this.modelLoaderService.on('loaded', this._onModelLoaded.bind(this));
    }

    private _onModelLoaded({ model, gltf }: { model: Model; gltf: GLTF }) {
        this.loggerService.info('AnimationService', `Model loaded: ${model.name}`);
        if (gltf.animations.length === 0) return;
        this.animations[model.name] = gltf.animations;
    }

    playAnimation(options: PlayAnimation) {
        this.loggerService.info(
            'AnimationService',
            `Playing animation for model: ${options.modelName}`,
            options.clipOptions
        );
        const clips = this.animations[options.modelName];
        if (!clips) return;

        let mixer: THREE.AnimationMixer;
        if (this.mixers[options.object.uuid]) {
            mixer = this.mixers[options.object.uuid];
        } else {
            mixer = new THREE.AnimationMixer(options.object);
            this.mixers[options.object.uuid] = mixer;
            this.emit('mixer', { mixer });
        }

        for (const clip of clips) {
            const action = mixer.clipAction(clip);
            action.reset();
            if (options.clipOptions?.holdOnLastFrame) {
                action.clampWhenFinished = true;
                action.loop = THREE.LoopOnce;
            }
            if (options.clipOptions?.inReverse) {
                action.timeScale = -1;
                action.time = action.getClip().duration;
            } else {
                action.timeScale = 1;
            }
            action.play();
        }

        const found = this.mixerCallbacks.find(([m]) => m === mixer);
        if (found) found[1].forEach((callback) => mixer.removeEventListener('finished', callback));

        if (options.onEnd) {
            const callback = () => {
                options.onEnd?.();
                mixer.removeEventListener('finished', callback);
            };
            mixer.addEventListener('finished', callback);
            const found = this.mixerCallbacks.find(([mixer]) => mixer === mixer);
            if (found) found[1].push(callback);
            else this.mixerCallbacks.push([mixer, [callback]]);
        }
    }
}
