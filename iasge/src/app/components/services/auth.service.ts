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
    this.data.getAllUsers().subscribe(res =>
      {
        //Mapeia o resultado
        const users = res.map((e: any) =>
          {
            const data = e.payload.doc.data();
            data.id = e.payload.doc.id;
            return data;
          })
        
        //Se user exists or no
        const user = users.filter(user => user.user_name == user_name && user.password == password)
        user.length > 0 
        ? this.logar(user[0])
        : this.snack.openSnackBar('Usuário incorreto!');
      }, err => 
      {
        //Mensagem de erro
        this.snack.openSnackBar(`Erro de login: ${err}`)
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
    localStorage.setItem('usermask_name', user.name);
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
