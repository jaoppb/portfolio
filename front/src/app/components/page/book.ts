import { Component, ElementRef, Input, SecurityContext, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from '@app/services/data';
import { marked } from 'marked';
import { lastValueFrom } from 'rxjs';

@Component({
    selector: 'app-book',
    imports: [],
    templateUrl: './book.html',
    styleUrl: './book.scss',
})
export class Book {
    @Input({ required: true })
    set path(value: string) {
        if (value === this._path) return;
        this._path = value;
        this._loadMarkdown();
    }

    get path(): string {
        return this._path;
    }

    private _path: string = '';
    markdownContent: string = '';
    markdownParsed: string = '';
    _wrapper: ElementRef<HTMLElement> | undefined;
    @ViewChild('wrapper')
    set wrapper(ref: ElementRef<HTMLElement> | undefined) {
        if (ref) {
            this._wrapper = ref;
            this._loadMarkdown();
        }
    }

    get wrapper(): ElementRef<HTMLElement> | undefined {
        return this._wrapper;
    }

    constructor(
        private readonly dataService: DataService,
        private readonly sanitizer: DomSanitizer
    ) {}

    private async _loadMarkdown() {
        if (!this.wrapper) return;
        if (this.path.length === 0) return;

        this.markdownContent = await lastValueFrom(this.dataService.getPage('english', this.path));
        this.markdownParsed =
            this.sanitizer.sanitize(
                SecurityContext.HTML,
                await marked.parse(this.markdownContent)
            ) ?? '';
        this.wrapper.nativeElement.innerHTML = this.markdownParsed;
    }
}
