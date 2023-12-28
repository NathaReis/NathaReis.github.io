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
    this.data.getAllPerfis().subscribe(res =>
      {
        //Mapeia o resultado
        const perfis = res.map((e: any) =>
          {
            const data = e.payload.doc.data();
            data.id = e.payload.doc.id;
            return data;
          })
        const perfil = perfis.filter(perfil => localStorage.getItem('logado') == perfil.type)
        this.perfilSave(perfil[0])
      }, err => 
      {
        //Mensagem de erro
        alert(`Erro de busca: ${err}`)
      })
  }

  perfilSave(perfil: Perfil)
  {
    let all_view = perfil.all_view ? true : false;
    this.perfil.perfilData = {
      departamentos: perfil.departamentos,
      associados: perfil.associados,
      eventos: perfil.eventos,
      type: perfil.type,
      all_view: all_view,
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
}
