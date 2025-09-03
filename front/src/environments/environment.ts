import { getOriginWithSubdomain } from '@app/utils';

export const environment = {
    baseURL: document.location.origin,
    r2BaseURL: getOriginWithSubdomain('r2'),
};
