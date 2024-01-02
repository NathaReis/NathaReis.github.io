import { HeaderService } from 'src/app/components/services/header.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/components/services/auth.service';
import { DataService } from 'src/app/components/services/data.service';
import { SnackbarService } from 'src/app/components/services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { PerfilService } from 'src/app/components/services/perfil.service';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/pt-br';
import { Escala } from 'src/app/components/models/escala';
import { Router } from '@angular/router';

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
      private router: Router,
      private perfilService: PerfilService,
      private headerService: HeaderService) {
        headerService.headerData = {
          title: 'Escalas',
          icon: 'dashboard',
          routerLink: 'escalas'
        }
    }
    
    //Events example
    escalas: any = [];
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
  
  ngOnInit(): void {
    this.auth.auth_guard(); //auth_guard
    this.getAllEscalas();
  }

  escalasList: Escala[] = [];
  getAllEscalas()
  {
    //Consulta o serviço Events
    this.data.getAllEscalas().subscribe(res =>
      {
        //Mapeia o resultado
        this.escalasList = res.map((e: any) =>
          {
            const data = e.payload.doc.data();
            data.id = e.payload.doc.id;
            return data;
          })

        if(!this.perfilService.perfilData.all_view)
        {
          this.escalasList = this.escalasList
          .filter(this.myEscalas)          
        }

        this.popularEscalas(this.escalasList);
        this.updateCalendarOptions();
      }, err => 
      {
        //Mensagem de erro
        this.snack.openSnackBar(`Erro de busca: ${err}`);
      })
  }

  myEscalas(ev: any)
  {
    return ev.user == String(localStorage.getItem('usermask_id'));
  }

  popularEscalas(escalas: Escala[])
  {
    escalas.forEach(escala =>
      {
        this.escalas.push({
          id: escala.id,
          title: escala.escala_name,
          date: this.formatDate(escala.start_date),
          color: '#333',
          user: escala.user,
          dia: this.dateForNumber(escala.start_date),
        })
      })
  }

  //Atualuzar o calendário
  updateCalendarOptions() {
    this.calendarOptions = {
      events: this.escalas,
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
      this.router.navigate(['escalas/edit/'+id]);
   }
}