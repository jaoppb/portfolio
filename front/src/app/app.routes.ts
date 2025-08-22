import { Routes } from '@angular/router';
import { Scene } from '@pages/scene/scene';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: Scene,
    },
];
