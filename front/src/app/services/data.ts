import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Model } from './model-loader';
import { map } from 'rxjs/internal/operators/map';
import { PageData } from './renderers/canvas';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DataService {
    constructor(private readonly http: HttpClient) {}

    get models() {
        return this.http.get<{ models: Model[] }>(`${environment.baseURL}/models.json`).pipe(
            map((response) =>
                response.models.map((model) => ({
                    ...model,
                    path: `${environment.r2BaseURL}/${model.path}`,
                }))
            )
        );
    }

    get pages() {
        return this.http
            .get<{ pages: { [key: string]: PageData[] } }>(
                `${environment.baseURL}/pages/pages.json`
            )
            .pipe(map((response) => response.pages));
    }

    getPage(language: string, path: string) {
        return this.http.get<string>(`${environment.baseURL}/pages/${language}/${path}`, {
            responseType: 'text' as 'json',
        });
    }
}
