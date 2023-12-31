import { Component } from '@angular/core';
import { DataService } from 'src/app/components/services/data.service';
import { HeaderService } from 'src/app/components/services/header.service';
import { SnackbarService } from 'src/app/components/services/snackbar.service';

@Component({
  selector: 'app-associados-create',
  templateUrl: './associados-create.component.html',
  styleUrls: ['./associados-create.component.css']
})
export class AssociadosCreateComponent {

  hide = true;
  
  constructor( 
    private data : DataService,
    private snack: SnackbarService,
    private headerService: HeaderService) {
    headerService.headerData = {
      title: 'Associados',
      icon: 'people',
      routerLink: 'associados'
    }
  }
  userObj = {
    id: '',
    first_name: '',
    last_name: '',
    password: '',
    perfil: 'associado',
    user_name: '',
    departamentos: '',
  }
  id: string = '';
  first_name: string = '';
  last_name: string = '';
  password: string = 'iasge';
  user_name: string = '';

  resetForm()
  {
    this.id = '';
    this.first_name = '';
    this.last_name = '';
    this.password = '';
    this.user_name = '';
  }

  addUser()
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
      this.userObj.departamentos = `${localStorage.getItem('usermask_id')},${localStorage.getItem('usermask_name')},false`,
      this.data.addUser(this.userObj)
      this.resetForm()
      this.snack.openSnackBar('Criado com sucesso!')
    }
  }
}
