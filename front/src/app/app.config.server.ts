import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { RenderService } from './services/render';
import { RenderServerService } from './services/render.server';
import { BASE_URL } from './tokens';

const serverConfig: ApplicationConfig = {
    providers: [
        provideServerRendering(withRoutes(serverRoutes)),
        {
            provide: RenderService,
            useClass: RenderServerService,
        },
        {
            provide: BASE_URL,
            useValue: 'http://localhost:4200',
        },
    ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
