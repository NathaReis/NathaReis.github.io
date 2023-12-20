import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/components/services/auth.service';
import { HeaderService } from 'src/app/components/services/header.service';
import { DataService } from 'src/app/components/services/data.service';
import { SnackbarService } from 'src/app/components/services/snackbar.service';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import { Event } from 'src/app/components/models/event';
import { DialogConfirmationComponent } from 'src/app/components/template/dialog-confirmation/dialog-confirmation.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-eventos-read',
  templateUrl: './eventos-read.component.html',
  styleUrls: ['./eventos-read.component.css'],
})
export class EventosReadComponent implements OnInit {
  constructor(
    private auth : AuthService,
    private data: DataService,
    private snack: SnackbarService,
    private dialog: MatDialog,
    private headerService: HeaderService) {
      headerService.headerData = {
        title: 'Eventos',
        icon: 'event',
        routerLink: 'eventos'
      }
  }
  
  //Events example
  events: any = [
    {title: 'evenAnual', date: '2023-12-03', color: '#e35e6b'},
  ]
  //Opções of init
  options = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
  };  
  //Init calendar 
  calendarOptions: CalendarOptions = this.options;
  
  //Init page
  ngOnInit(): void {
    this.auth.auth_guard(); //auth_guard
    this.getAllEvents();//events firebase
  }
    
  eventsList: Event[] = [];
  getAllEvents()
  {
    //Consulta o serviço Events
    this.data.getAllEvents().subscribe(res =>
      {
        //Mapeia o resultado
        this.eventsList = res.map((e: any) =>
          {
            const data = e.payload.doc.data();
            data.id = e.payload.doc.id;
            return data;
          })
        this.popularEvents(this.eventsList); //Atualiza a lista
        this.updateCalendarOptions(); //Atualiza o calendário
      }, err => 
      {
        //Mensagem de erro
        this.snack.openSnackBar(`Erro de busca: ${err}`)
      })
  }
  
  //Atualizar lista
  popularEvents(events: Event[])
  {
    events.forEach(event =>
    {
      if(eval(event.isOneDay))
      {
        this.events.push({
          id: event.id,
          title: event.event_name,
          date: this.formatDate(event.start_date),
          color: '#333'
        })
      }
      else 
      {
        for(let init = this.dateForNumber(event.start_date); init <= this.dateForNumber(event.end_date); init++)
        {
          this.events.push({
            id: event.id,
            title: event.event_name,
            date: this.formatDate(this.numberForDate(init)),
            color: '#003c5a'
          })
        }
      }
    })
  }

  //Atualuzar o calendário
  updateCalendarOptions() {
    this.calendarOptions = {
      events: this.events,
      eventClick: this.handleDateClick.bind(this),
    };
  }
  
  //Funções
  formatDate(date: string)
  {
    let res = `${date.split('/')[2]}-${date.split('/')[1]}-${date.split('/')[0]}`;
    return res;
  }

  dateForNumber(date: string)
  {
    let res = +`${date.split('/')[2]}${date.split('/')[1]}${date.split('/')[0]}`;
    return res;
  }

  numberForDate(num: number)
  {
    let str = String(num);
    let res = str.slice(6,8)+'/'+str.slice(4,6)+'/'+str.slice(0,4);
    return res;
  }
  
  handleDateClick(arg: any) {
    let id = arg.event._def.publicId; 
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: 
      {
        id: id,
        eventEdit: true,
        edit: true,
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if(result)
      {
        setTimeout(() => {
          location.reload();
        }, 1000)
      }
    });
  }
}