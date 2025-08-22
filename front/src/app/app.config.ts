import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners,
    provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import * as THREE from 'three';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { BASE_URL } from './tokens';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideClientHydration(withEventReplay()),
        provideHttpClient(),
        {
            provide: THREE.Scene,
            useFactory: () => {
                const scene = new THREE.Scene();
                scene.background = new THREE.Color(0xe7e7e7);
                return scene;
            },
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
