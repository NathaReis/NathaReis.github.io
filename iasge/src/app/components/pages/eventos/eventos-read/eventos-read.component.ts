import { AfterContentInit, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from 'src/app/components/services/auth.service';
import { HeaderService } from 'src/app/components/services/header.service';
import { DataService } from 'src/app/components/services/data.service';
import { SnackbarService } from 'src/app/components/services/snackbar.service';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import { Event } from 'src/app/components/models/event';

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

  eventsList: Event[] = [];
  getAllEvents()
  {
    //Consulta o serviço correspondente
    this.data.getAllEvents().subscribe(res =>
      {
        //Mapeia o resultado
        this.eventsList = res.map((e: any) =>
          {
            const data = e.payload.doc.data();
            data.id = e.payload.doc.id;
            return data;
          })
        this.popularEvents(this.eventsList);
      }, err => 
      {
        //Mensagem de erro
        this.snack.openSnackBar(`Erro de busca: ${err}`)
      })
  }
  
  formatDate(date: string)
  {
    let res = `${date.split('/')[2]}-${date.split('/')[1]}-${date.split('/')[0]}`;
    return res;
  }
  
  popularEvents(events: Event[])
  {
    events.forEach(event =>
      {
        if(eval(event.isOneDay))
        {
          this.events.push({
            id: event.id,
            title: event.event_name,
            date: this.formatDate(event.start_date)
          })
        }
      })
      console.log(this.events);
    }
    
  events: any = []
  options = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: this.events,
    eventClick: this.handleDateClick.bind(this),
  };  
  title: string = '';
    
  handleDateClick(arg: any) {
    alert('date click! ' + arg.event._def.title);
    this.title = arg.event._def.title; 
  }

  
  calendarOptions: CalendarOptions = this.options;

}