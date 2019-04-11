import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class InfoTockenService {

  constructor( ) { }

  saveToken(token: any) {
    localStorage.setItem('wt::tk', token);
  }

  getInfoSedeToken(): string {
    // const token = jwt.decode(this.getToken());
    return '1';
  }
  getInfoOrgToken(): string {
    return '1';
  }

  getToken(): any { return localStorage.getItem('wt::tk'); }
}
