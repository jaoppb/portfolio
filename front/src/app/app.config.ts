import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import * as THREE from 'three';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideClientHydration(withEventReplay()),
        {
            provide: THREE.Scene,
            useFactory: () => {
                const scene = new THREE.Scene();
                scene.background = new THREE.Color(0x000000);
                return scene;
            },
        },
        {
            provide: THREE.PerspectiveCamera,
            useValue: new THREE.PerspectiveCamera(60),
        },
    ],
};
