import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './data.service';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router : Router,
    private snack: SnackbarService,
    private data : DataService
    ) { }
  
  // login metodo
  login(user_name : string, password: string)
  {
    this.data.getUserOfNamePass(user_name,password).subscribe(res =>
      {
        if(res.length > 0)
        {
          this.logar(res[0]);
        }
        else 
        {
          this.snack.openSnackBar('Usuário não existe!', 2000);
        }
      })
  }

  // Logout
  logout() 
  {
    localStorage.removeItem("all_view");
    localStorage.removeItem('usermask_id');
    localStorage.removeItem('usermask_name');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_id');
    localStorage.removeItem('logado');
    this.router.navigate(['login']);
  }
  // Login
  logar(user: any) 
  {
    localStorage.setItem('usermask_id', user.id)
    localStorage.setItem('usermask_name', user.user_name);
    localStorage.setItem('user_name', user.user_name)
    localStorage.setItem('user_id', user.id)
    localStorage.setItem('logado', user.perfil);
    this.router.navigate(['home']);
  }

  // Segurança
  auth_guard()
  {
    if(!localStorage.getItem('logado'))
    {
      this.router.navigate(['login']);
    }
  }
  // Login
  isLogin()
  {
    if(localStorage.getItem('logado'))
    {
      this.router.navigate(['home'])
    }
  }
}
