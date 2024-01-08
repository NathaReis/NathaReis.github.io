import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Perfil } from 'src/app/components/models/perfil';
import { AuthService } from 'src/app/components/services/auth.service';
import { DataService } from 'src/app/components/services/data.service';
import { HeaderService } from 'src/app/components/services/header.service';
import { PerfilService } from 'src/app/components/services/perfil.service';
import { SnackbarService } from 'src/app/components/services/snackbar.service';
import { DialogConfirmationComponent } from 'src/app/components/template/dialog-confirmation/dialog-confirmation.component';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit{

  theme: string = 'Claro';

  constructor(
    private auth : AuthService,
    private data : DataService,
    private perfil : PerfilService,
    private dialog: MatDialog,
    private snack: SnackbarService,
    private headerService: HeaderService) {
      headerService.headerData = {
        title: 'Config',
        icon: 'settings',
        routerLink: 'config'
      }
    }

  ngOnInit(): void {
    this.auth.auth_guard();
    this.perfilSave();
  }

  perfilSave()
  {
    this.perfil.perfilData = {
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

  logout()
  {
    this.auth.logout();
  }

  editPassword()
  {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: 
      {
        passwordBox: true,
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if(result)
      {
        this.snack.openSnackBar('Senha alterada!')
      }
    });
  }

  copiarTexto(num: string) 
  {
    navigator.clipboard.writeText(num)
    .then(() =>
    {
      this.snack.openSnackBar(`Número de suporte ${num} - Nathan copiado!`, 3500);
    })
    .catch(erro =>
      {
        this.snack.openSnackBar(`Erro ao copiar o número de suporte!`, 3000);
        console.log(erro);
      })
  }
}
