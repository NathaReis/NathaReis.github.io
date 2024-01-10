import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/components/services/auth.service';
import { HeaderService } from 'src/app/components/services/header.service';
import { DataService } from 'src/app/components/services/data.service';
import { SnackbarService } from 'src/app/components/services/snackbar.service';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/pt-br';
import { Event } from 'src/app/components/models/event';
import { DialogConfirmationComponent } from 'src/app/components/template/dialog-confirmation/dialog-confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { PerfilService } from 'src/app/components/services/perfil.service';
import { Router } from '@angular/router';

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
    private router: Router,
    private perfilService: PerfilService,
    private headerService: HeaderService) {
      headerService.headerData = {
        title: 'Eventos',
        icon: 'event',
        routerLink: 'eventos'
      }
  }
  
  //Events example
  events: any = [];
  //Opções of init
  options = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    locale: esLocale,
    headerToolbar: {
      left: '',
      center: 'title',
      right: '',
    },
    footerToolbar: {
      left: 'prev',
      center: 'today',
      right: 'next',
    },  
  };  
  //Init calendar 
  calendarOptions: CalendarOptions = this.options;

  //Init page
  ngOnInit(): void {
    this.auth.auth_guard(); //auth_guard
    this.getAllEvents();//events firebase
  }
    
  eventsList: Event[] = [];
  eventsListBack: Event[] = [];
  eventsListAnuais: Event[] = [];
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
        this.eventsListAnuais = this.eventsList.filter(this.isEventAnual);
        this.eventsList = this.eventsList.filter(this.notEventAnual);
        this.eventsListBack = this.eventsList
        .filter(this.otherEvents)
        .filter(this.isEventPublic);
        if(!this.perfilService.perfilData.all_view)
        {
          this.eventsList = this.eventsList.filter(this.myEvents);
        }
        else 
        {
          this.eventsList = this.eventsList.filter(ev => ev.user != String(localStorage.getItem('usermask_id')) && ev.event_type == 'public' ||  ev.user == String(localStorage.getItem('usermask_id')));
        }
        this.popularEvents(this.eventsList); //Atualiza a lista
        this.popularEventsAnuais(this.eventsListAnuais); //Atualiza a lista
        this.popularEventsBack(this.eventsListBack); //Atualiza a lista
        this.updateCalendarOptions(); //Atualiza o calendário
      }, err => 
      {
        //Mensagem de erro
        this.snack.openSnackBar(`Erro de busca: ${err}`);
      })
  }

  myEvents(ev: any)
  {
    return ev.user == String(localStorage.getItem('usermask_id'));
  }

  otherEvents(ev: any)
  {
    return ev.user != String(localStorage.getItem('usermask_id'));
  }

  isEventPublic(ev: any)
  {
    return ev.event_type == 'public';
  }

  isEventAnual(ev: any)
  {
    return ev.isOneDay == 'anual';
  }

  notEventAnual(ev: any)
  {
    return ev.isOneDay != 'anual';
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
          color: '#333',
          user: event.user,
          dia: this.dateForNumber(event.start_date),
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
            color: '#003c5a',
            user: event.user,
            dia: init,
          })
        }
      }
    })
  }
  popularEventsAnuais(events: Event[])
  {
    events.forEach(event =>
    {
      const atual_date = this.formatDate(event.start_date);
      const atual_year = new Date().getFullYear();
      const new_date = `${atual_year}-${atual_date.split('-')[1]}-${atual_date.split('-')[2]}`;
      this.events.push({
        id: event.id,
        title: event.event_name,
        message: event.event_desc,
        type: event.event_type,
        date: new_date,
        color: '#ff9939',
        user: event.user,
        dia: this.dateForNumber(event.start_date),
      })
    })
  }
  popularEventsBack(events: Event[])
  {
    events.forEach(event =>
      {
        if(eval(event.isOneDay))
        {
          this.events.push({
            date: this.formatDate(event.start_date),
            color: '#FFFF00',
            display: 'background',
          })
        }
        else 
        {
          for(let init = this.dateForNumber(event.start_date); init <= this.dateForNumber(event.end_date); init++)
          {
            this.events.push({
              date: this.formatDate(this.numberForDate(init)),
              color: '#B22222',
              display: 'background',
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
    if(arg.event._def.extendedProps.type == 'anual')
    {
      this.dialog.open(DialogConfirmationComponent, {
        data: 
        {
          title: arg.event._def.title,
          message: arg.event._def.extendedProps.message,
          alert: true,
        },
      });
    }
    else 
    {
      this.router.navigate(['eventos/edit/'+id]);
    }
  }
}
