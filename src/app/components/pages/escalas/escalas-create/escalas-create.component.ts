import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Escala } from 'src/app/components/models/escala';
import { AuthService } from 'src/app/components/services/auth.service';
import { DataService } from 'src/app/components/services/data.service';
import { HeaderService } from 'src/app/components/services/header.service';
import { SnackbarService } from 'src/app/components/services/snackbar.service';
import { DialogConfirmationComponent } from 'src/app/components/template/dialog-confirmation/dialog-confirmation.component';

@Component({
  selector: 'app-escalas-create',
  templateUrl: './escalas-create.component.html',
  styleUrls: ['./escalas-create.component.css']
})

export class EscalasCreateComponent implements OnInit{
  
  escala_name: string = '';
  start_date: Date = new Date();//'MM/DD/YYY'

  hour: string = '';
  pessoa: string = '';
  categorias: string = '';

  campos: Array<{id: number, hour: string, pessoa: string, categoria: string}> = [];

  maxDate: Date = new Date();
  minDate: Date = new Date();
  agora: Date = new Date();

  constructor(
    private auth: AuthService,
    private data: DataService,
    private snack: SnackbarService,
    private dialog: MatDialog,
    private headerService: HeaderService) {
      headerService.headerData = {
        title: 'Escalas',
        icon: 'dashboard',
        routerLink: 'escalas'
      }
    }

  ngOnInit(): void {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = +date.getDate() + 1;
    this.agora = new Date(year, month, day);
    this.maxDate = new Date(year, 11, 31);
    this.minDate = this.agora;
    this.start_date = this.agora;

    this.auth.auth_guard();
  }

  criarCampo()
  {
    if(this.hour == '' || this.pessoa == '' || this.categorias == '')
    {
      this.snack.openSnackBar('Preencha todos os dados!');
    }
    else 
    {
      const existHour = this.campos.filter(campo => campo.hour == this.hour);
      if(existHour.length > 0)
      {
        this.snack.openSnackBar('Horário já registrado!')
      }
      else
      {
        this.campos.push({
          id: this.campos.length < 0 ? 0 : +this.campos.length,
          hour: this.hour,
          pessoa: this.pessoa,
          categoria: this.categorias,
        })  
        this.resetCampo();      
      }
    }
  }

  resetCampo() 
  {
    this.categorias = '';
    this.pessoa = '';
    this.hour = '';
  }

  reset() 
  {
    this.resetCampo();
    this.escala_name = '';
    this.start_date = this.agora;
  }

  ordernarEscala(campos: Array<{id: number, hour: string, categoria: string, pessoa: string}>)
  {
    let hours: Array<string> = [];
    let newList: Array<{id: number, hour: string, categoria: string, pessoa: string}> = [];

    campos.forEach(campo =>
      {
        hours.push(campo.hour);
      })
    hours.sort();
    
    hours.forEach(hour =>
      {
        campos.forEach(campo => {
          if(campo.hour == hour)
          {
            newList.push(campo);
          }
        })
      })
    return newList;
  }

  viewEscala()
  {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: 
      {
        escalaBox: true,
        escalaView: this.ordernarEscala(this.campos),
        alert: true,
      },
    });

    dialogRef.afterClosed().subscribe((result: Array<{id: number, hour: string, categoria: string, pessoa: string}>) => {
      if(result)
      {
        this.campos = result;
        if(this.campos.length > 0)
        {
          this.viewEscala();
        }
      }
    });
  }

  validateEscala()
  {
    if(this.escala_name == '')
    {
      this.snack.openSnackBar('Preencha o nome do evento');
      return false;
    }
    else if(this.campos.length <= 0)
    {
      this.snack.openSnackBar('Preencha a escala');
      return false;
    }
    else 
    {
      return true;
    }
  }

  criarEscala(): Escala
  {
    return {
      id: '',
      escala_name: this.escala_name,
      start_date: this.start_date,
      escala: this.campos,
      user: String(localStorage.getItem("usermask_id")),
    }
  }

  criar()
  {
    if(this.validateEscala())
    {
      this.data.addEscala(this.criarEscala());
      this.reset();
    }
  } 
}
