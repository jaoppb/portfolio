import { ComponentRef, Injectable, SecurityContext } from '@angular/core';
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
    private _page?: PageData;
    private markdownContent: string = '';
    private markdownParsed: string = '';
    private rootElement: HTMLElement;
    private components: ComponentRef<Page>[] = [];
    private _pagesObject?: THREE.Object3D<THREE.Object3DEventMap>;
    private renderer?: THREE.WebGLRenderer;

    set pagesObject(object: THREE.Object3D<THREE.Object3DEventMap> | undefined) {
        if (object !== undefined && this._pagesObject === object) return;

        if (this._pagesObject !== undefined || object === undefined)
            this._removePagesFromScene(true);

        this._pagesObject = object;
        this.loggerService.debug('BookService', 'Setting pagesObject:', object);
        if (this._pagesObject) this._addPagesToScene();
    }

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
            this.renderer = renderer;
        });
    }

    set page(data: PageData) {
        this.loggerService.debug('BookService', 'Setting page:', data);
        if (data === this._page || data.path === this._page?.path) return;
        if (this._pagesObject) this._removePagesFromScene(false);
        this._page = data;
        this._loadMarkdown();
    }

    private _clearPages() {
        this.loggerService.debug('BookService', 'Clearing pages');
        for (const page of this.components) {
            this.componentService.destroyComponent(page);
        }
        this.components.length = 0;
    }

    private _addPagesToScene() {
        if (this.rootElement.children.length === 0) return;
        if (!this._pagesObject || !this.renderer) return;

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
                    this._pagesObject.children[startIndex++] as THREE.Mesh,
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

            wrapper.location.nativeElement.appendChild(child);
            currentHeight += child.getBoundingClientRect().height / 2;
            this.loggerService.debug('BookService', 'Current height:', currentHeight, size.y);
            if (currentHeight > size.y) {
                wrapper.location.nativeElement.removeChild(child);
                children.unshift(child);
                plane = undefined;
                wrapper = undefined;
                size = undefined;
                currentHeight = 0;
                orientation =
                    orientation === PageOrientation.LEFT
                        ? PageOrientation.RIGHT
                        : PageOrientation.LEFT;
            }
        }
    }

    private _setupComponent(plane: THREE.Mesh, orientation: PageOrientation) {
        if (!this.renderer) return;

        const wrapper = this.componentService.createComponent(Page)!;
        this.components.push(wrapper);
        this.loggerService.debug('BookService', 'Current plane:', plane);
        const size = getPlaneScreenSize(plane, this.camera, this.renderer);

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

    private _removePagesFromScene(restoreElements: boolean) {
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

    private _loadPages() {
        this.loggerService.debug('BookService', 'Loading pages');
        this._clearPages();
        this._addPagesToScene();
    }

    private async _loadMarkdown() {
        this.loggerService.debug('BookService', 'Loading markdown');
        if (!this._page || this._page?.path.length === 0) {
            this.markdownContent = '';
            this.markdownParsed = '';
            return;
        }

        this.markdownContent = await lastValueFrom(
            this.dataService.getPage('english', this._page.path)
        );
        this.markdownParsed =
            this.sanitizer.sanitize(
                SecurityContext.HTML,
                await marked.parse(this.markdownContent)
            ) ?? '';
        this.rootElement.innerHTML = this.markdownParsed;
        this.loggerService.debug('BookService', 'Markdown loaded and parsed', this.markdownParsed);
        this._loadPages();
    }
}
