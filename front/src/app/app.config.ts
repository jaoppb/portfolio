import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import * as THREE from 'three';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { BASE_URL, CANVAS_SCENE, OVERLAY_SCENE } from './tokens';
import { provideHttpClient } from '@angular/common/http';
import { CSS3DRenderer } from 'three/examples/jsm/Addons.js';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideClientHydration(withEventReplay()),
        provideHttpClient(),
        {
            provide: CANVAS_SCENE,
            useFactory: () => {
                const scene = new THREE.Scene();
                scene.background = new THREE.Color(0xe7e7e7);
                return scene;
            },
        },
        {
            provide: OVERLAY_SCENE,
            useValue: new THREE.Scene(),
        },
        {
            provide: THREE.PerspectiveCamera,
            useValue: new THREE.PerspectiveCamera(60),
        },
        {
            provide: BASE_URL,
            useFactory: () => {
                if (typeof document === 'undefined') return;
                return document.location.origin;
            },
        },
    ],
};
