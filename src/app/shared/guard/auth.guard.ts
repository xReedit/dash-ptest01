import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) { }
  canActivate() {
    // next: ActivatedRouteSnapshot,
    // state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // return true;
    if (this.authService.getLoggedStatus()) {
      return true;
    }


    this.authService.loggedOutUser();
    this.router.navigate(['/session/login']);
    return false;
  }
}
