import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { MouseService, PointerClick } from './mouse';
import { Focusable, Model } from './model-loader';
import { getPositionFromCamera } from '@app/utils';
import { AnimationService } from './animation';
import { LoggerService } from './logger';

type SelectedModel = {
    object: THREE.Object3D<THREE.Object3DEventMap>;
    restore: {
        location: THREE.Vector3;
        rotation: THREE.Quaternion;
        scale: THREE.Vector3;
    };
};

@Injectable({ providedIn: 'root' })
export class InteractionService {
    private selected?: SelectedModel;

    constructor(
        private readonly loggerService: LoggerService,
        private readonly mouseService: MouseService,
        private readonly camera: THREE.PerspectiveCamera,
        private readonly scene: THREE.Scene,
        private readonly animationService: AnimationService
    ) {}

    private _checkObjectAnimationState(object: THREE.Object3D<THREE.Object3DEventMap>): boolean {
        const animation: Model['animation'] | undefined = object.userData['animation'];
        if (!animation) return false;

        const stateName = animation.state;
        return object.userData[stateName];
    }

    private _setObjectAnimationState(
        object: THREE.Object3D<THREE.Object3DEventMap>,
        value: boolean
    ) {
        const animation: Model['animation'] | undefined = object.userData['animation'];
        if (!animation) return;

        const stateName = animation.state;
        object.userData[stateName] = value;
    }

    private _resetSelection() {
        if (!this.selected) return;

        if (this._checkObjectAnimationState(this.selected.object)) {
            this._playAnimation(this.selected.object);
        }

        const { location, rotation, scale } = this.selected.restore;
        this.selected.object.position.copy(location);
        this.selected.object.quaternion.copy(rotation);
        this.selected.object.scale.copy(scale);
        this.selected = undefined;
    }

    private _selectObject(object: THREE.Object3D<THREE.Object3DEventMap>) {
        const focusable: Focusable | undefined = object.userData['focusable'];
        if (!focusable) return;

        this.selected = {
            object,
            restore: {
                location: object.position.clone(),
                rotation: object.quaternion.clone(),
                scale: object.scale.clone(),
            },
        };

        const position = getPositionFromCamera(this.camera, 1.5);
        if (focusable.offsetPosition) position.add(focusable.offsetPosition);
        object.position.copy(position);

        const upVector = new THREE.Vector3(0, 1, 0);
        const upRotation = new THREE.Quaternion().setFromUnitVectors(
            upVector.clone(),
            upVector.clone().applyQuaternion(this.camera.quaternion)
        );
        object.quaternion.copy(upRotation.multiply(focusable.rotation));
    }

    private _getTopMostObject(
        object: THREE.Object3D<THREE.Object3DEventMap>
    ): THREE.Object3D<THREE.Object3DEventMap> {
        while (object.parent && object.parent !== this.scene) object = object.parent;
        return object;
    }

    private _playAnimation(object: THREE.Object3D<THREE.Object3DEventMap>) {
        const animation: Model['animation'] | undefined = object.userData['animation'];
        if (!animation) return;

        this.loggerService.info(
            'InteractionService',
            `Clicked on object: ${object.userData['name']}`
        );

        if (this._checkObjectAnimationState(object) === undefined)
            this._setObjectAnimationState(object, false);
        const current = this._checkObjectAnimationState(object);
        this.animationService.playAnimation(object.userData['name'], object as THREE.Group, {
            ...(animation.options ?? {}),
            inReverse: current,
        });
        this._setObjectAnimationState(object, !current);
    }

    private _onClick({ object }: PointerClick) {
        if (object) {
            object = this._getTopMostObject(object);
            if (this.selected?.object === object) {
                this._playAnimation(object);
                return;
            }
        }

        this._resetSelection();

        if (!object) return;
        this._selectObject(object);
    }

    initialize() {
        this.mouseService.on('click', this._onClick.bind(this));
    }
}
