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

  copy()
  {
    const dados = this.data.escalaView;
    let str = ''
    dados.forEach(dado => 
      {
        str += `*${dado.hour}* - ${dado.categoria}\n\tPessoa: ${dado.pessoa}\n\tobs.: ${dado.descricao}\n`
      })
    navigator.clipboard.writeText(str)
    .then(() => {
      this.snack.openSnackBar('Escala copiada!');
    })
    .catch(err => {
      this.snack.openSnackBar('Erro ao copiar escala!');
    });
  }
}
