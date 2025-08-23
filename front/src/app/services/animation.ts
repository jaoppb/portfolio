import { Injectable } from '@angular/core';
import { Model, ModelLoaderService } from './model-loader';
import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/Addons.js';
import { LoggerService } from './logger';
import { EventEmitter } from '@app/utils/event-emitter';

interface IAnimationServiceEvents {
    mixer: { mixer: THREE.AnimationMixer };
}

export type PlayAnimationOptions = {
    holdOnLastFrame?: boolean;
    inReverse?: boolean;
};

@Injectable({ providedIn: 'root' })
export class AnimationService extends EventEmitter<IAnimationServiceEvents> {
    private readonly animations: Record<string, THREE.AnimationClip[]> = {};
    private readonly mixers: Record<string, THREE.AnimationMixer> = {};

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

    playAnimation(modelName: string, object: THREE.Group, options?: PlayAnimationOptions) {
        this.loggerService.info(
            'AnimationService',
            `Playing animation for model: ${modelName}`,
            options
        );
        const clips = this.animations[modelName];
        if (!clips) return;

        let mixer: THREE.AnimationMixer;
        if (this.mixers[object.uuid]) {
            mixer = this.mixers[object.uuid];
        } else {
            mixer = new THREE.AnimationMixer(object);
            this.mixers[object.uuid] = mixer;
            this.emit('mixer', { mixer });
        }

        clips.forEach((clip) => {
            const action = mixer.clipAction(clip);
            action.reset();
            if (options?.holdOnLastFrame) {
                action.clampWhenFinished = true;
                action.loop = THREE.LoopOnce;
            }
            if (options?.inReverse) {
                action.timeScale = -1;
                action.time = action.getClip().duration;
            } else {
                action.timeScale = 1;
            }
            action.play();
        });
    }
}
