import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/components/services/data.service';
import { HeaderService } from 'src/app/components/services/header.service';
import { PerfilService } from 'src/app/components/services/perfil.service';
import { SnackbarService } from 'src/app/components/services/snackbar.service';

@Component({
  selector: 'app-associados-edit',
  templateUrl: './associados-edit.component.html',
  styleUrls: ['./associados-edit.component.css']
})
export class AssociadosEditComponent implements OnInit{
  
  hide = true;

  constructor( 
    private data: DataService,
    private route: ActivatedRoute,
    private snack: SnackbarService,
    private router: Router,
    private perfilService: PerfilService,
    private headerService: HeaderService) {
    headerService.headerData = {
      title: 'Associados',
      icon: 'people',
      routerLink: 'associados'
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
    departamentos: '',
  }
  id: string = '';
  first_name: string = '';
  last_name: string = '';
  editor: string = '';//Usado apenas no frontend
  departamentos: string = '';
  perfil: string = '';
  password: string = '';

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
    this.departamentos = user.departamentos;
    this.perfil = user.perfil;
    this.password = user.password;

    if(user.departamentos)
    {
      let isUltimo = user.departamentos.replace(`${localStorage.getItem('usermask_id')},${localStorage.getItem('usermask_name')},`,'').length <= 5 ? true : false;
      if(isUltimo)
      {
        let perfil = user.departamentos.replace(`${localStorage.getItem('usermask_id')},${localStorage.getItem('usermask_name')},`,'')
        this.editor = perfil;
      }
      else 
      {
        let deps = user.departamentos.split('/')
        deps.forEach((dep: string) =>
          {
            let id = dep.split(',')[0];
            if(id == localStorage.getItem('usermask_id'))
            {
              let perfil = dep.replace(`${localStorage.getItem('usermask_id')},${localStorage.getItem('usermask_name')},`,'')
              this.editor = perfil;
            }
          })
      }
    }
  }

  resetForm()
  {
    this.id = '';
    this.first_name = '';
    this.last_name = '';
  }

  updateUser()
  {
    if(this.departamentos)
    {
      let isUltimo = this.departamentos.replace(`${localStorage.getItem('usermask_id')},${localStorage.getItem('usermask_name')},`,'').length <= 5 ? true : false;
      if(isUltimo)
      {
        let perfil = `${localStorage.getItem('usermask_id')},${localStorage.getItem('usermask_name')},${this.editor}`;
        this.departamentos = perfil;
      }
      else 
      {
        let newList = '';
        let deps = this.departamentos.split('/')
        deps.forEach((dep: string) =>
          {
            let id = dep.split(',')[0];
            if(id == localStorage.getItem('usermask_id'))
            {
              let newDep = `${localStorage.getItem('usermask_id')},${localStorage.getItem('usermask_name')},${this.editor}`;
              newList.length <= 0 ? newList = newDep : newList += `/${newDep}`;
            }
            else 
            {
              newList.length <= 0 ? newList = dep : newList += `/${dep}`;
            }
          })

          this.departamentos = newList;
      }
    }
    if(this.first_name == '' || this.last_name == '')
    {
      this.snack.openSnackBar('Preencha todos os campos', 2000);
    }
    else 
    {
      this.userObj.id = this.id;
      this.userObj.first_name = this.first_name;
      this.userObj.last_name = this.last_name;
      this.userObj.user_name = `${this.first_name.toLowerCase()}.${this.last_name.toLowerCase()}`;
      this.userObj.departamentos = this.departamentos;
      this.userObj.perfil = this.perfil;
      this.userObj.password = this.password;
      this.data.updateUser(this.userObj, this.id)
      this.snack.openSnackBar('Atualizado com sucesso!')
      this.router.navigate(['/associados'])
    }
  }
}