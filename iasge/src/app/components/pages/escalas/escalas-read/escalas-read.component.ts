import { HeaderService } from 'src/app/components/services/header.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/components/services/auth.service';
import { DataService } from 'src/app/components/services/data.service';
import { SnackbarService } from 'src/app/components/services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { PerfilService } from 'src/app/components/services/perfil.service';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/pt-br';

@Component({
    selector: 'app-escalas-read',
    templateUrl: './escalas-read.component.html',
    styleUrls: ['./escalas-read.component.css'],
})
export class EscalasReadComponent implements OnInit {

    constructor(
        private auth : AuthService,
        private data: DataService,
        private snack: SnackbarService,
        private dialog: MatDialog,
        private perfilService: PerfilService,
        private headerService: HeaderService) {
          headerService.headerData = {
            title: 'Escalas',
            icon: 'dashboard',
            routerLink: 'escalas'
          }
      }
    ngOnInit(): void {
        this.auth.auth_guard(); //auth_guard
    }

      //Events example
  events: any = [
    {title: 'evenAnual', date: '2023-12-03', color: '#e35e6b'},
  ]
  //Opções of init
  options = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    locale: esLocale,
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next',
    },
  };  
  //Init calendar 
  calendarOptions: CalendarOptions = this.options;
    
}