import { Injectable } from '@angular/core';
import { IRenderService, IRenderServiceEvents, LoadingState } from './render';
import { LoggerService } from './logger';
import { EventEmitter } from '@app/utils/event-emitter';

@Injectable()
export class RenderServerService
    extends EventEmitter<IRenderServiceEvents>
    implements IRenderService
{
    constructor(private readonly loggerService: LoggerService) {
        super();
    }

    initialize(canvas: HTMLCanvasElement): void {
        this.loggerService.debug('RenderServerService', 'Ignoring canvas initialization on server');
    }

    override emit(key: keyof IRenderServiceEvents, event: string | LoadingState): boolean {
        this.loggerService.debug(
            'RenderServerService',
            `Ignoring event emission for ${key} on server`
        );
        return false;
    }

    override on<K extends keyof IRenderServiceEvents>(
        key: K,
        listener: (event: IRenderServiceEvents[K]) => void
    ): void {
        this.loggerService.debug(
            'RenderServerService',
            `Ignoring event listener for ${key} on server`
        );
    }

    override off<K extends keyof IRenderServiceEvents>(
        key: K,
        listener: (event: IRenderServiceEvents[K]) => void
    ): void {
        this.loggerService.debug(
            'RenderServerService',
            `Ignoring event listener removal for ${key} on server`
        );
    }
}
