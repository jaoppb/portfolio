import { Routes } from '@angular/router';
import { RenderMode } from '@angular/ssr';
import { Scene } from '@pages/scene/scene';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: Scene,
        data: {
            ssr: {
                renderMode: RenderMode.Client,
            },
        },
    },
];
