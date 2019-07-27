import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/model/usuario.model';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModel;
  loading = false;
  msjErr = false;
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();
  }

  logear(): void {
    this.loading = true;
    this.msjErr = false;

    this.authService.setLocalToken('');
    this.authService.getUserLogged(this.usuario).subscribe(res => {
      setTimeout(() => {
        if (res.success) {
          this.authService.setLocalToken(res.token);
          this.authService.setLoggedStatus(true);
          this.authService.setLocalUsuario(this.usuario);
          this.router.navigate(['/principales']);
          // this.loading = false;
        } else {
          this.loading = false;
          this.msjErr = true;
        }
      }, 2000);
    });
  }

}
