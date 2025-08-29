import {
    ComponentRef,
    effect,
    Injectable,
    SecurityContext,
    signal,
    WritableSignal,
} from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { DataService } from './data';
import { DomSanitizer } from '@angular/platform-browser';
import { marked } from 'marked';
import { CanvasRendererService, PageData } from './renderers/canvas';
import { ComponentService } from './component';
import { Page, PageOrientation } from '@app/components/page/page';
import { OverlayRendererService } from './renderers/overlay';
import * as THREE from 'three';
import { getPlaneScreenSize, parseRotation } from '@app/utils';
import { LoggerService } from './logger';

@Injectable({ providedIn: 'root' })
export class BookService {
    private _page: WritableSignal<PageData | undefined> = signal(undefined);
    private _pagesObject: WritableSignal<THREE.Object3D<THREE.Object3DEventMap> | undefined> =
        signal(undefined);
    private renderer: WritableSignal<THREE.WebGLRenderer | undefined> = signal(undefined);

    private markdownContent: string = '';
    private markdownParsed: string = '';
    private rootElement: HTMLElement;
    private components: ComponentRef<Page>[] = [];
    private _language: WritableSignal<'english' | 'portuguese'> = signal('english');

    constructor(
        private readonly dataService: DataService,
        private readonly componentService: ComponentService,
        private readonly sanitizer: DomSanitizer,
        private readonly overlayRendererService: OverlayRendererService,
        private readonly canvasRendererService: CanvasRendererService,
        private readonly camera: THREE.PerspectiveCamera,
        private readonly loggerService: LoggerService
    ) {
        this.rootElement = document.createElement('div');

        this.canvasRendererService.on('createdRenderer', ({ renderer }) => {
            this.renderer.set(renderer);
        });

        effect(async () => {
            const pagesObject = this._pagesObject();
            this._clearPages(this._page() !== undefined && pagesObject !== undefined);
            if (pagesObject === undefined) return;
            await this._loadMarkdown();
            this._addPagesToScene();
        });
    }

    set language(language: 'english' | 'portuguese') {
        this._language.set(language);
    }

    set pagesObject(object: THREE.Object3D<THREE.Object3DEventMap> | undefined) {
        this.loggerService.debug('BookService', 'Setting pagesObject:', object);
        this._pagesObject.set(object);
    }

    set page(data: PageData) {
        this.loggerService.debug('BookService', 'Setting page:', data);
        this._page.set(data);
    }

    private _clearPages(restoreElements: boolean = false) {
        this.loggerService.debug('BookService', 'Removing pages from scene');
        for (const page of this.components) {
            if (restoreElements)
                while (page.location.nativeElement.firstChild)
                    this.rootElement.appendChild(page.location.nativeElement.firstChild);
            this.overlayRendererService.removeObject(page);
            this.componentService.destroyComponent(page);
        }
        this.components.length = 0;
    }

    private _addPagesToScene() {
        if (this.rootElement.children.length === 0) return;
        const pagesObject = this._pagesObject();
        if (!pagesObject) return;

        this.loggerService.debug('BookService', 'Adding pages to scene');

        let wrapper: ComponentRef<Page> | undefined;
        let plane: THREE.Mesh | undefined;
        let size: THREE.Vector2 | undefined;
        let orientation: PageOrientation = PageOrientation.LEFT;
        let currentHeight = 0;
        let startIndex = 24;

        const children = Array.from(this.rootElement.children);
        while (children.length > 0) {
            const child = children.shift()!;
            if (!wrapper || !plane || !size) {
                const result = this._setupComponent(
                    pagesObject.children[startIndex++] as THREE.Mesh,
                    orientation
                );
                if (result) {
                    wrapper = result.wrapper;
                    plane = result.plane;
                    size = result.size;
                } else {
                    this.loggerService.error('BookService', 'Failed to setup component');
                    return;
                }
            }

            wrapper.instance.innerHTML += child.outerHTML;
            currentHeight += wrapper.location.nativeElement.getBoundingClientRect().height * 2;
            this.loggerService.debug('BookService', 'Current height:', currentHeight, size.y);
            if (currentHeight > size.y) {
                wrapper.instance.innerHTML = (wrapper.instance.innerHTML as string).slice(
                    0,
                    -child.outerHTML.length
                );
                children.unshift(child);
                plane = undefined;
                wrapper = undefined;
                size = undefined;
                currentHeight = 0;
                orientation =
                    orientation === PageOrientation.LEFT
                        ? PageOrientation.RIGHT
                        : PageOrientation.LEFT;
            } else {
                this.rootElement.lastChild?.remove();
            }
        }
    }

    private _setupComponent(plane: THREE.Mesh, orientation: PageOrientation) {
        const renderer = this.renderer();
        if (!renderer) return;

        const wrapper = this.componentService.createComponent(Page)!;
        this.components.push(wrapper);
        this.loggerService.debug('BookService', 'Current plane:', plane);
        const size = getPlaneScreenSize(plane, this.camera, renderer);

        const overlayObject = this.overlayRendererService.addObject(wrapper, plane, {
            rotation: {
                offset: parseRotation([180, orientation === PageOrientation.LEFT ? 180 : 0, 0]),
            },
        });

        wrapper.instance.plane.set(plane);
        wrapper.instance.overlay.set(overlayObject);
        wrapper.instance.orientation.set(orientation);

        this.loggerService.debug('BookService', 'Page component:', {
            wrapper,
            plane,
            size,
        });
        return { wrapper, plane, size };
    }

    private _addPreventInteraction(element: HTMLElement) {
        Array.from(element.children).forEach((child) => {
            child.classList.add('prevent-interaction');
            this._addPreventInteraction(child as HTMLElement);
        });
    }

    private async _loadMarkdown() {
        this.loggerService.debug('BookService', 'Loading markdown');
        const page = this._page();
        if (!page || page.path.length === 0) {
            this.markdownContent = '';
            this.markdownParsed = '';
            return;
        }

        this.markdownContent = await lastValueFrom(
            this.dataService.getPage(this._language(), page.path)
        );
        this.markdownParsed =
            this.sanitizer.sanitize(
                SecurityContext.HTML,
                await marked.parse(this.markdownContent)
            ) ?? '';
        this.rootElement.innerHTML = this.markdownParsed;
        this._addPreventInteraction(this.rootElement);
        this.loggerService.debug('BookService', 'Markdown loaded and parsed', this.markdownParsed);
    }
}
