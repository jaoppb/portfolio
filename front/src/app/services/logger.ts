import { Injectable, isDevMode } from '@angular/core';

enum LogLevel {
    TRACE,
    DEBUG,
    INFO,
    WARN,
    ERROR,
}

const ColorMap: Record<LogLevel, string> = {
    [LogLevel.TRACE]: 'color: #888',
    [LogLevel.DEBUG]: 'color: #00f',
    [LogLevel.INFO]: 'color: #0a0',
    [LogLevel.WARN]: 'color: #fa0',
    [LogLevel.ERROR]: 'color: #f00',
};

@Injectable({
    providedIn: 'root',
})
export class LoggerService {
    private _log(level: LogLevel, tag: string, message: string, ...args: any[]) {
        if (!isDevMode() && level !== LogLevel.ERROR) return;

        console.log('%c', `${ColorMap[level]};`, `[${LogLevel[level]}] [${tag}]`, message, ...args);
    }

    trace(tag: string, message: string, ...args: any[]) {
        this._log(LogLevel.TRACE, tag, message, ...args);
    }

    debug(tag: string, message: string, ...args: any[]) {
        this._log(LogLevel.DEBUG, tag, message, ...args);
    }

    info(tag: string, message: string, ...args: any[]) {
        this._log(LogLevel.INFO, tag, message, ...args);
    }

    warn(tag: string, message: string, ...args: any[]) {
        this._log(LogLevel.WARN, tag, message, ...args);
    }

    error(tag: string, message: string, ...args: any[]) {
        this._log(LogLevel.ERROR, tag, message, ...args);
    }
}
