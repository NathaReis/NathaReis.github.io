import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/components/services/auth.service';
import { HeaderService } from 'src/app/components/services/header.service';
import { DataService } from 'src/app/components/services/data.service';
import { SnackbarService } from 'src/app/components/services/snackbar.service';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin  from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/pt-br';
import { Event } from 'src/app/components/models/event';
import { DialogConfirmationComponent } from 'src/app/components/template/dialog-confirmation/dialog-confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { PerfilService } from 'src/app/components/services/perfil.service';

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
    private perfilService: PerfilService,
    private headerService: HeaderService) {
      headerService.headerData = {
        title: 'Eventos',
        icon: 'event',
        routerLink: 'eventos'
      }
  }
  
  //Events example
  events: any = []
  //Opções of init
  options = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    locale: esLocale,
    headerToolbar: {
      left: 'prev',
      center: 'title',
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
  eventsListAnual: Event[] = [];
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
        this.eventsListAnual = this.eventsList.filter(ev => ev.isOneDay == 'anual')
        this.eventsList = this.eventsList.filter(ev => ev.isOneDay != 'anual')
        if(!this.perfilService.perfilData.all_view)
        {
          this.eventsList = this.eventsList.filter(ev => ev.user == String(localStorage.getItem('usermask_id')));
        }
        else 
        {
          this.eventsList = this.eventsList.filter(ev => ev.user == String(localStorage.getItem('usermask_id')) || ev.user != String(localStorage.getItem('usermask_id')) && ev.event_type == 'public')
        }
        this.popularEvents(this.eventsList); //Atualiza a lista
        this.popularEventsAnuais(this.eventsListAnual); //Atualiza a lista
        this.updateCalendarOptions(); //Atualiza o calendário
      }, err => 
      {
        //Mensagem de erro
        this.snack.openSnackBar(`Erro de busca: ${err}`);
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
      const anoAtual = new Date().getFullYear();
      const newDate = `${anoAtual}-${event.start_date.split('/')[1]}-${event.start_date.split('/')[0]}`
      this.events.push({
        id: event.id,
        title: event.event_name,
        start: newDate,
        //daysOfWeek: [ '1' ],
        color: '#e35e6b',
        user: event.user,
        dia: this.dateForNumber(event.start_date),
        recurring: 'annual', // Configuração para evento anual
      })
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
    let user = arg.event._def.extendedProps.user; 
    let dia = arg.event._def.extendedProps.dia; 
    let dialogRef;

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = +date.getDate();
    const agora = +`${year}${month}${day}`;

    if(user == String(localStorage.getItem("usermask_id")))
    {
      if(dia > agora)
      {
        dialogRef = this.dialog.open(DialogConfirmationComponent, {
          data: 
          {
            id: id,
            eventBox: true,
            eventEdit: true,
          },
        });
      }
      else 
      {
        dialogRef = this.dialog.open(DialogConfirmationComponent, {
          data:
          {
            id: id,
            eventBox: true,
          }
        });
        dialogRef = this.dialog.open(DialogConfirmationComponent, {
          data:
          {
            title: 'Edição',
            message: 'Edite com um dia de antecedência',
            alert: true,
          }
        });
      }
    }
    else 
    {
      dialogRef = this.dialog.open(DialogConfirmationComponent, {
        data: 
        {
          id: id,
          eventBox: true,
        },
      });
    }

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