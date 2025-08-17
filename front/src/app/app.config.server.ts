import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { RenderService } from './services/render';
import { RenderServerService } from './services/render.server';

const serverConfig: ApplicationConfig = {
    providers: [
        provideServerRendering(withRoutes(serverRoutes)),
        {
            provide: RenderService,
            useClass: RenderServerService,
        },
    ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
