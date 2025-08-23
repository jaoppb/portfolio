import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { MouseService, PointerClick } from './mouse';
import { Focusable } from './model-loader';
import { getPositionFromCamera } from '@app/utils';

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
        private readonly mouseService: MouseService,
        private readonly camera: THREE.PerspectiveCamera,
        private readonly scene: THREE.Scene
    ) {}

    private _resetSelection() {
        if (!this.selected) return;

        const { location, rotation, scale } = this.selected.restore;
        this.selected.object.position.copy(location);
        this.selected.object.quaternion.copy(rotation);
        this.selected.object.scale.copy(scale);
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

    private _onClick({ object }: PointerClick) {
        if (this.selected) this._resetSelection();

        if (!object) return;

        object = this._getTopMostObject(object);
        this._selectObject(object);
    }

    initialize() {
        this.mouseService.on('click', this._onClick.bind(this));
    }
}
