import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {MatCalendarCellClassFunction, MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import { AuthService } from 'src/app/components/services/auth.service';
import { HeaderService } from 'src/app/components/services/header.service';
import { DataService } from 'src/app/components/services/data.service';
import { Event } from 'src/app/components/models/event';
import { SnackbarService } from 'src/app/components/services/snackbar.service';

@Component({
  selector: 'app-eventos-read',
  templateUrl: './eventos-read.component.html',
  styleUrls: ['./eventos-read.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatNativeDateModule, MatDatepickerModule],
})
export class EventosReadComponent implements OnInit {
  
  selected: any;
  eventList: Event[] = [];
  dates: Array<number> = [];

  constructor(
    private auth : AuthService,
    private data: DataService,
    private snack: SnackbarService,
    private headerService: HeaderService) {
      headerService.headerData = {
        title: 'Eventos',
        icon: 'event',
        routerLink: 'eventos'
      }
    }
  
  ngOnInit(): void {
    this.auth.auth_guard();
    this.getAllEvents();
  }

  getAllEvents()
  {
    //Consulta o serviço correspondente
    this.data.getAllEvents().subscribe(res =>
      {
        //Mapeia o resultado
        this.eventList = res.map((e: any) =>
          {
            const data = e.payload.doc.data();
            data.id = e.payload.doc.id;
            return data;
          })
        this.dates = this.eventList.map(ev => +ev.start_date.replace(/\D/g, ""));
        console.log(this.dates)
      }, err => 
      {
        //Mensagem de erro
        this.snack.openSnackBar(`Erro de busca: ${err}`)
      })
  }
  
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
      if (view === 'month') {
        const year = cellDate.getFullYear();
        const month = cellDate.getUTCMonth();
        const day = cellDate.getDate();
        const date = `${day}/${month}/${year}`;
        console.log(date + ' ' + this.dates)
        if(this.dates.indexOf(23122023) != -1)
        {
          return 'event-day';
        }
        return '';
      }
      return '';
  };
}