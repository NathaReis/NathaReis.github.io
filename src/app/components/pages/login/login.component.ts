import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HeaderService } from '../../services/header.service';
import { PerfilService } from '../../services/perfil.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  user_name : string = '';
  password : string = '';
  hide = true;

  constructor(
    private auth: AuthService, 
    private messageService: MessageService,
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
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Por favor, digite o usuário'});
    }
    else if(this.password == '')
    {
      this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Por favor digite a senha'});
    }
    else 
    {
      this.auth.login(this.user_name,this.password)
    }
  }
}
