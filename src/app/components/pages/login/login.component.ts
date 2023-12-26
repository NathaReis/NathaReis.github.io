import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HeaderService } from '../../services/header.service';
import { SnackbarService } from '../../services/snackbar.service';
import { PerfilService } from '../../services/perfil.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user_name : string = '';
  password : string = '';
  hide = true;

  constructor(
    private auth: AuthService, 
    private snack: SnackbarService,
    private perfil: PerfilService,
    private headerService: HeaderService) 
    {
      headerService.headerData = {
        title: 'Login',
        icon: 'login',
        routerLink: 'login'
      },
      perfil.perfilData = {
        type: '',
        eventos: false,
        departamentos: false,
        associados: false,
        all_view: false,
        escalas: false,
        config: false,
        home: false
      }
    }

  ngOnInit(): void {
    this.auth.isLogin();
  }

  login()
  {
    if(this.user_name == '')
    {
      this.snack.openSnackBar('Por favor, digite o usuário');
      return '';
    }

    if(this.password == '')
    {
      this.snack.openSnackBar('Por favor digite a senha');
      return '';
    }

    this.auth.login(this.user_name,this.password);
    this.user_name = '';
    this.password = '';
    return '';
  }
}
