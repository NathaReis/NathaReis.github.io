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
  datesOneDay: Array<string> = [];
  datesMoreDay: Array<{start: number, end: number}> = [];
  
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

  dateForNumber(date: string)
  {
    const res = Number(date.split('/')[2]+date.split('/')[1]+date.split('/')[0]);
    if(typeof res == 'number')
    {
      return res; 
    }
    else 
    {
      return -1;
    }
  }

  //Busca todos os eventos e chama a função que valida as datas
  getAllEvents(): string[]
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

        this.datesOneDay = 
          this.eventList
          .filter(ev => ev.isOneDay == 'true')
          .map(ev => ev.start_date);
        this.datesMoreDay = 
          this.eventList
          .filter(ev => ev.isOneDay == 'false')
          .map(ev => {

            let start = this.dateForNumber(ev.start_date);
            let end = this.dateForNumber(ev.end_date);
            return {start: start, end: end}
          });

        this.isDateinList();
        this.isDatesinList();
      }, err => 
      {
        //Mensagem de erro
        this.snack.openSnackBar(`Erro de busca: ${err}`)
      })
    return this.datesOneDay;
  }

  //Class especial para datas incluidas na array
  isDateinList()
  {
    setTimeout(() =>
    {
      const datesBtn = document.querySelectorAll(".mat-calendar-body-cell");
      datesBtn.forEach(btn =>
        {
          let pos = +btn.classList.length - 1
          let date = String(btn.classList[pos])
          if(this.datesOneDay.includes(date))
          {
            btn.classList.add('event-day');
          }
          else 
          {
            btn.classList.remove('event-day');
          }
        })
    },100)
  }

  isDatesinList()
  {
    setTimeout(() =>
    {
      const datesBtn = document.querySelectorAll(".mat-calendar-body-cell");
      datesBtn.forEach(btn =>
        {
          let pos = +btn.classList.length - 1;
          let date = String(btn.classList[pos]);
          let dta = this.dateForNumber(date);

          if(dta == -1)
          {
            pos -= 1;
            date = String(btn.classList[pos]);
            dta = this.dateForNumber(date);

            if(dta == -1)
            {
              pos -= 1;
              date = String(btn.classList[pos]);
              dta = this.dateForNumber(date);
            }
          }

          this.datesMoreDay.forEach(dtm =>
            {
              if(dtm.start <= dta && dtm.end >= dta)
              {
                btn.classList.add('events-day');
              }
              else 
              {
                btn.classList.remove('events-day');
              }
            })
        })
    },100)
  }
  
  //Dá uma identificação para cada data, referente a ela mesma
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
      if (view === 'month') {
        const year = cellDate.getFullYear();
        const month = +cellDate.getUTCMonth() + 1;
        const day = cellDate.getDate();
        const date = `${day}/${month}/${year}`;
        
        if(true)
        {
          return `${date}`;
        }
        return '';
      }
      return '';
  };
}