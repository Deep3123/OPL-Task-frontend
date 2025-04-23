import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Injectable()
export class Auth implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Get the token from AuthService
    const token = this.authService.getToken();

    // Exclude requests that don't require the token
    const excludedUrls = [
      '/user/login',
      '/user/register',
      '/user/forgot-password',
      '/user/reset-password',
    ];

    // Get the path part of the URL without query parameters
    const path = request.url.split('?')[0];
    // console.log(path);
    // Check if the current request URL is in the excluded list
    if (excludedUrls.some((url) => path.includes(url))) {
      // If the URL is excluded, don't add the Authorization header
      return next.handle(request);
    }

    // If the token exists, add the Authorization header
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log(request);
    }

    // Continue with the request
    return next.handle(request).pipe(
      // Catch any errors (like 401 unauthorized) after the request is made
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired or invalid

          // If the token is expired, redirect to login
          this.authService.logout(); // Clear the expired token

          // Optionally, show a toast or alert for the user (you could use a service like SweetAlert2)
          // alert("Session expired. Please log in again.");

          Swal.fire({
            icon: 'info',
            title: 'Login again!',
            text: 'Session expired. Please log in again.',
            confirmButtonText: 'OK',
          });

          this.router.navigate(['/login']); // Redirect to login page

          return throwError(error); // Rethrow the error so it doesn't propagate further
        } else if (error.status === 403) {
          // Token is valid but the user doesn't have access (you can handle 403 as well)
          // alert("Access denied. You do not have the necessary permissions.");

          Swal.fire({
            icon: 'info',
            title: 'Permissions denied!',
            text: 'Access denied. You do not have the necessary permissions.',
            confirmButtonText: 'OK',
          });

          return throwError(error);
        }

        // If it's some other error (like network error), just throw it
        return throwError(error);
      })
    );
  }
}
