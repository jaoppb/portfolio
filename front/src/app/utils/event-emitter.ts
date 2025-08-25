export class EventEmitter<T> {
    private listeners: Partial<Record<keyof T, Array<(event: T[keyof T]) => void>>> = {};

    on<K extends keyof T>(key: K, listener: (event: T[K]) => void): void {
        if (!this.listeners[key]) this.listeners[key] = [];
        this.listeners[key].push(listener as (event: T[keyof T]) => void);
    }

    off<K extends keyof T>(key: K, listener: (event: T[K]) => void): void {
        if (!this.listeners[key]) return;
        this.listeners[key] = this.listeners[key].filter((l) => l !== listener);
    }

    protected emit<K extends keyof T>(key: K, event: T[K]): void {
        if (!this.listeners[key]) return;
        for (const listener of this.listeners[key]) listener(event);
    }
}
