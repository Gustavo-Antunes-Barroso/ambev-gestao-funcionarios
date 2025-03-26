import { HttpInterceptorFn } from '@angular/common/http';
import { BASE_URL } from '../shared/constants';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const environment = 'development';
  const baseUrl = BASE_URL[environment];

  if (!req.url.startsWith('http')) {
    const modifiedReq = req.clone({
      url: `${baseUrl}${req.url}`
    });
    return next(modifiedReq);
  }
  return next(req);
};

