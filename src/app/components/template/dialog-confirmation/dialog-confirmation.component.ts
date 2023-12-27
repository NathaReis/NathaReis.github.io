import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Dialog } from '../../models/dialog';
import { DataService } from '../../services/data.service';
import { SnackbarService } from '../../services/snackbar.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-dialog-confirmation',
  templateUrl: './dialog-confirmation.component.html',
  styleUrls: ['./dialog-confirmation.component.css']
})
export class DialogConfirmationComponent implements OnInit{

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmationComponent>,
    private dataS: DataService,
    private snack: SnackbarService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Dialog,
  ) {}

  typeForm = {type:'Atualizar', id: String(this.data.id)}
  ngOnInit(): void {
    if(this.data.passwordBox)
    {
      this.getUser();
    }
  }

  //Resultado dos confirms
  onConfirm(result: boolean): void {
    this.dialogRef.close(result);
  }

  deleteCampo(campos: Array<{id: number, hour: string, categoria: string, pessoa: string}>, id: number) {
    // Verificar se a posição fornecida é válida
    this.dialogRef.close(campos.filter(campo => campo.id != id));
  }

  //Password
  user: User = {
    id: '',
    user_name: '',
    first_name: '',
    last_name: '',
    password: '',
    perfil: '',
    departamentos: '',  
  };
  user_name: string = String(localStorage.getItem("user_name"));
  passwordAtual: string = '';
  password: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  hide = true;

  getUser()
  {
    this.dataS.getUser(String(localStorage.getItem("user_id"))).subscribe((res: any) =>
      {
        if(res)
        {
          this.passwordAtual = res[0].password;
          this.user = res[0];
        }
        else 
        {
          this.onConfirm(false);
        }
      })
  }

  salvePassword()
  {
    if(this.password == this.passwordAtual)
    {
      if(this.newPassword == this.confirmPassword)
      {
        if(this.newPassword == '' || this.confirmPassword == '')
        {
          this.snack.openSnackBar('Senhas vazias')
        }
        else 
        {
          this.user.password = this.newPassword;
          this.dataS.updateUser(this.user, String(this.user.id));
          //this.onConfirm(true);          
        }
      }
      else 
      {
        this.snack.openSnackBar('Senhas diferentes!')
      }
    }
    else 
    {
      this.snack.openSnackBar('Senha atual incorreta!');
    }
  }
}
