import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/components/models/user';
import { DataService } from 'src/app/components/services/data.service';
import { HeaderService } from 'src/app/components/services/header.service';
import { PerfilService } from 'src/app/components/services/perfil.service';
import { SnackbarService } from 'src/app/components/services/snackbar.service';

@Component({
  selector: 'app-departamentos-edit',
  templateUrl: './departamentos-edit.component.html',
  styleUrls: ['./departamentos-edit.component.css']
})
export class DepartamentosEditComponent implements OnInit{

  hide = true;
  
  constructor( 
    private data: DataService,
    private route: ActivatedRoute,
    private snack: SnackbarService,
    private router: Router,
    private perfilService: PerfilService,
    private headerService: HeaderService) {
    headerService.headerData = {
      title: 'Departamentos',
      icon: 'house',
      routerLink: 'departamentos'
    },
    perfilService.perfilData = {
      departamentos: localStorage.getItem("departamentos") ? true : false,
      associados: localStorage.getItem("associados") ? true : false,
      eventos: localStorage.getItem("eventos") ? true : false,
      type: String(localStorage.getItem("logado")),
      all_view: localStorage.getItem("all_view") ? true : false,
      escalas: true,
      config: true,
      home: true
    }
  }
  
  userObj = {
    id: '',
    first_name: '',
    last_name: '',
    password: '',
    perfil: '',
    user_name: '',
  }
  id: string = '';
  first_name: string = '';
  last_name: string = '';
  password: string = '';
  perfil: string = '';
  user_name: string = '';

  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.data.getUser(String(id)).subscribe(user =>
      {
        this.preencher_form(user[0], id)
      })
  }

  preencher_form(user: any, id: string)
  {
    this.id = id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.password = user.password;
    this.perfil = user.perfil;
  }

  resetForm()
  {
    this.id = '';
    this.first_name = '';
    this.last_name = '';
    this.password = '';
    this.perfil = '';
    this.user_name = '';
  }

  updateUser()
  {
    if(this.first_name == '' || this.last_name == '' || this.password == '' || this.perfil == '')
    {
      this.snack.openSnackBar('Preencha todos os campos', 2000);
    }
    else 
    {
      this.userObj.id = this.id;
      this.userObj.first_name = this.first_name;
      this.userObj.last_name = this.last_name;
      this.userObj.password = this.password;
      this.userObj.perfil = this.perfil;
      this.userObj.user_name = `${this.first_name.toLowerCase()}.${this.last_name.toLowerCase()}`;
      this.data.updateUser(this.userObj, this.id)
      this.snack.openSnackBar('Atualizado com sucesso!')
      this.router.navigate(['/departamentos'])
    }
  }
}
