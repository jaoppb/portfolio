import { Injectable } from '@angular/core';
import { IRenderService, LoadingState } from './render';
import { LoggerService } from './logger';

@Injectable()
export class RenderServerService implements IRenderService {
    constructor(private readonly loggerService: LoggerService) {}

    initialize(canvas: HTMLCanvasElement): void {
        this.loggerService.debug('RenderServerService', 'Ignoring canvas initialization on server');
    }

    subscribeModelLoading(callback: (loadingState: LoadingState) => void): void {
        this.loggerService.debug(
            'RenderServerService',
            'Ignoring model loading subscription on server'
        );
    }

    subscribeModelError(callback: (name: string) => void): void {
        this.loggerService.debug(
            'RenderServerService',
            'Ignoring model loading error subscription on server'
        );
    }
}
