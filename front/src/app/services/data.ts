import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BASE_URL } from '@app/tokens';
import { Model } from './model-loader';
import { map } from 'rxjs/internal/operators/map';
import { Page } from './render';

@Injectable({ providedIn: 'root' })
export class DataService {
    constructor(
        @Inject(BASE_URL)
        private readonly baseURL: string,
        private readonly http: HttpClient
    ) {}

    get models() {
        return this.http.get<{ models: Model[] }>(`${this.baseURL}/models/models.json`).pipe(
            map((response) =>
                response.models.map((model) => ({
                    ...model,
                    path: `${this.baseURL}/${model.path}`,
                }))
            )
        );
    }

    get pages() {
        return this.http
            .get<{ pages: { [key: string]: Page[] } }>(`${this.baseURL}/pages/pages.json`)
            .pipe(map((response) => response.pages));
    }
}
