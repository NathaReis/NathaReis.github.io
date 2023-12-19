import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { SnackbarService } from '../../services/snackbar.service';

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
    private router : Router,
    private headerService: HeaderService) {
    headerService.headerData = {
      title: 'Login',
      icon: 'login',
      routerLink: 'login'
    }}

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
