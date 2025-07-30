import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    console.log('Token actuel dans localStorage:', token);
    if (token) {
      console.log('Token ajouté à la requête:', token);
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur interceptée:', error); // Ajout de ce log
        if (error instanceof HttpErrorResponse) {
          console.log('URL de la requête:', error.url); // Log de l'URL
          if (error.status === 401 || error.status === 403) {
            console.warn("Erreur 401/403 - Suppression du token et redirection à l'accueil");

            if (this.router.url === '/') {
            } else {
              localStorage.clear();
              this.router.navigate(['/']);
            }
          }
        }
        // Retourner une nouvelle erreur avec un message d'erreur
        return throwError(() => new Error(error.message || 'Erreur inconnue'));
      })
    );
  }

}
