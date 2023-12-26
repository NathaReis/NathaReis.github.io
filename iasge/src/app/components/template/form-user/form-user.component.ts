import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { SnackbarService } from '../../services/snackbar.service';
import { HeaderService } from '../../services/header.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.css']
})
export class FormUserComponent implements OnInit{
  hide = true;
  isAssociado = false;
  @Input() typeForm: string = '';

  constructor( 
    private data: DataService,
    private snack: SnackbarService,
    private router: Router,
    private route: ActivatedRoute,
    private headerService: HeaderService) {}

  ngOnInit(): void {
    if(this.typeForm == 'Atualizar')
    {
      const id = String(this.route.snapshot.paramMap.get('id'));
      this.data.getUser(String(id)).subscribe(user =>
      {
        this.preencher_form(user.data(), id)
      })
    }
    else if(this.typeForm == 'Adicionar associado')
    {
      this.password = 'iasge';
      this.perfil = 'associado';
      this.isAssociado = true;
    }
    else if(this.typeForm == 'Atualizar associado')
    {
      const id = String(this.route.snapshot.paramMap.get('id'));
      this.data.getUser(String(id)).subscribe(user =>
      {
        this.preencher_form(user.data(), id)
      })
      this.isAssociado = true;
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
  password: string = '';
  perfil: string = '';
  user_name: string = '';
  editor: string = '';
  departamentos: string = '';

  preencher_form(user: any, id: string)
  {
    if(this.isAssociado)
    {
      this.id = id;
      this.first_name = user.first_name;
      this.last_name = user.last_name;
      this.departamentos = user.departamentos;
      this.perfil = user.perfil;
      this.password = user.password;
  
      if(user.departamentos)
      {
        let isUltimo = user.departamentos.replace(`${localStorage.getItem('user_id')},${localStorage.getItem('user_name')},`,'').length <= 5 ? true : false;
        if(isUltimo)
        {
          let perfil = user.departamentos.replace(`${localStorage.getItem('user_id')},${localStorage.getItem('user_name')},`,'')
          this.editor = perfil;
        }
        else 
        {
          let deps = user.departamentos.split('/')
          deps.forEach((dep: string) =>
            {
              let id = dep.split(',')[0];
              if(id == localStorage.getItem('user_id'))
              {
                let perfil = user.departamentos.replace(`${localStorage.getItem('user_id')},${localStorage.getItem('user_name')},`,'')
                this.editor = perfil;
              }
            })
        }
      }
    }
    else 
    {
      this.id = id;
      this.first_name = user.first_name;
      this.last_name = user.last_name;
      this.password = user.password;
      this.perfil = user.perfil;
    }
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

  action()
  {
    if(this.typeForm == 'Adicionar')
    {
      if(this.first_name == '' || this.last_name == '' || this.password == '' || this.perfil == '')
      {
        this.snack.openSnackBar('Preencha todos os campos', 2000);
      }
      else 
      {
        this.userObj.id = '';
        this.userObj.first_name = this.first_name;
        this.userObj.last_name = this.last_name;
        this.userObj.password = this.password;
        this.userObj.perfil = this.perfil;
        this.userObj.user_name = `${this.first_name.toLowerCase()}.${this.last_name.toLowerCase()}`;
        this.data.addUser(this.userObj);
        this.resetForm();
        this.snack.openSnackBar('Criado com sucesso!');
      }
    } 
    else if(this.typeForm == 'Adicionar associado')
    {
      if(this.first_name == '' || this.last_name == '' || this.password == '')
      {
        this.snack.openSnackBar('Preencha todos os campos', 2000);
      }
      else 
      {
        this.userObj.id = '';
        this.userObj.first_name = this.first_name;
        this.userObj.last_name = this.last_name;
        this.userObj.password = this.password;
        this.userObj.user_name = `${this.first_name.toLowerCase()}.${this.last_name.toLowerCase()}`;
        this.userObj.departamentos = `${localStorage.getItem('usermask_id')},${localStorage.getItem('usermask_name')},false`;
        this.userObj.perfil = this.perfil;
        console.log(this.userObj)
        this.data.addUser(this.userObj);
        this.resetForm();
        this.snack.openSnackBar('Associado criado com sucesso!');
      }
    }
    else if(this.typeForm == 'Atualizar associado')
    {
      if(this.departamentos)
      {
        let isUltimo = this.departamentos.replace(`${localStorage.getItem('user_id')},${localStorage.getItem('user_name')},`,'').length <= 5 ? true : false;
        if(isUltimo)
        {
          let perfil = `${localStorage.getItem('user_id')},${localStorage.getItem('user_name')},${this.editor}`;
          this.departamentos = perfil;
        }
        else 
        {
          let newList = '';
          let deps = this.departamentos.split('/')
          deps.forEach((dep: string) =>
            {
              let id = dep.split(',')[0];
              if(id == localStorage.getItem('user_id'))
              {
                let newDep = `${localStorage.getItem('user_id')},${localStorage.getItem('user_name')},${this.editor}`;
                newList.length <= 0 ? newList += newDep : `/${newDep}`;
              }
              else 
              {
                newList.length <= 0 ? newList += dep : `/${dep}`;
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
}
