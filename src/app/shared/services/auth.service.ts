import { Injectable } from '@angular/core';
import { UsuarioModel } from 'src/app/model/usuario.model';
import { CrudHttpService } from '../crud-http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedStatus = false;

  constructor(private crudService: CrudHttpService) {

  }

  setLoggedStatus(value: boolean) {
    this.isLoggedStatus = value;
  }

  // verfica la existencia del token
  getLoggedStatus() {
    const token = localStorage.getItem('::token');
    const rpt = !!token ? true : false;
    this.isLoggedStatus = rpt;
    return rpt;
  }

  getUserLogged(usuario: UsuarioModel) {
    return this.crudService.login(usuario);
  }

  setLocalToken(token: string) {
    localStorage.setItem('::token', token);
  }

  getLocalToken() {
    return localStorage.getItem('::token');
  }

  setLocalUsuario(usuario: UsuarioModel) {
    localStorage.setItem('::us', JSON.stringify(usuario));
  }

  verifyToken() {
    return this.crudService.verificarToken();
  }

  loggedOutUser() {
    localStorage.removeItem('::token');
    localStorage.removeItem('::us');
    localStorage.clear();
    this.setLoggedStatus(false);
  }

}
