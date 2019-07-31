import { Injectable } from '@angular/core';
import {
 HttpEvent,
 HttpInterceptor,
 HttpHandler,
 HttpRequest,
 HttpResponse,
 HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ErrorMessageService } from './shared/services/error-message.service';
import { AuthService } from './shared/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
 constructor(
	 private errorMsjService: ErrorMessageService ,
	 private authService: AuthService, private router: Router
	 ) {}

 intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   return next.handle(request)
     .pipe(
       retry(1),
       catchError((error: HttpErrorResponse) => {
         let errorMessage = '';
         if (error.error instanceof ErrorEvent) {
           // client-side error
           errorMessage = `Error: ${error.error.message}`;
         } else {
           // server-side error
		   	errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
			if (error.status === 401) {
				errorMessage = 'Se termino el tiempo de espera, cerraremos por su seguridad.';
				const responseMSJ = this.errorMsjService.openSnackBar(errorMessage, 'Listo');
				responseMSJ.afterDismissed().subscribe(() => {
					// cerrar session
					this.authService.loggedOutUser();
					this.router.navigate(['/session/login']);
				});
				return throwError(errorMessage);
			}
         }
		//  window.alert(errorMessage);
		   this.errorMsjService.openSnackBar(errorMessage, 'Ok');
        return throwError(errorMessage);
       })
     );
 }
}
