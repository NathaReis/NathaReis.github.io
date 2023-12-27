import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Event } from 'src/app/components/models/event';
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

  hour: string = '';
  pessoa: string = '';
  event_name: string = '';
  escala: string = '';
  categorias: string = '';
  start_date: Date = new Date();//'MM/DD/YYY'
  end_date: Date = new Date();
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
    this.end_date = this.agora;

    this.auth.auth_guard();
  }

  criar()
  {

  }

}
