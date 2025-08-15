import { TestBed } from '@angular/core/testing';

import { RenderService } from './render';

describe('Render', () => {
    let service: RenderService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(RenderService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
