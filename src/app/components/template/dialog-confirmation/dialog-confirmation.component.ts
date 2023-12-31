import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Dialog } from '../../models/dialog';
import { DataService } from '../../services/data.service';
import { SnackbarService } from '../../services/snackbar.service';
import { Event } from '../../models/event';
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
  user_name: string = String(localStorage.getItem("usermask_name"));
  passwordAtual: string = '';
  password: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  hide = true;
  hideNew = true;
  hideConfirm = true;

  getUser()
  {
    this.dataS.getUser(String(localStorage.getItem("usermask_id"))).subscribe((res: any) =>
      {
        if(res)
        {
          this.passwordAtual = res.data().password;
          this.user = res.data();
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
        this.user.password = this.newPassword;
        this.dataS.updateUser(this.user, String(localStorage.getItem("usermask_id")))
        this.onConfirm(true);
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
