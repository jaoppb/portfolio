import { InjectionToken } from '@angular/core';
import * as THREE from 'three';

export const CANVAS_SCENE = new InjectionToken<THREE.Scene>('Canvas Scene');
export const OVERLAY_SCENE = new InjectionToken<THREE.Scene>('Overlay Scene');
