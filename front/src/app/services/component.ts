import { ComponentRef, Injectable, Type, ViewContainerRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ComponentService {
    private viewContainerReference?: ViewContainerRef;

    createComponent<T>(component: Type<T>): ComponentRef<T> | undefined {
        if (!this.viewContainerReference) return;

        return this.viewContainerReference.createComponent(component);
    }

    destroyComponent<T>(component: ComponentRef<T>) {
        component.destroy();
    }

    initialize(viewContainerRef: ViewContainerRef) {
        this.viewContainerReference = viewContainerRef;
    }
}
