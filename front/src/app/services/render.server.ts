import { Injectable } from '@angular/core';
import { IRenderService } from './render';
import { LoggerService } from './logger';

@Injectable()
export class RenderServerService implements IRenderService {
    constructor(private readonly loggerService: LoggerService) {}

    initialize(canvas: HTMLCanvasElement): void {
        this.loggerService.debug('RenderServerService', 'Ignoring canvas initialization on server');
    }
}
