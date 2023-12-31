import { Dialog } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from 'src/app/components/models/event';
import { DataService } from 'src/app/components/services/data.service';
import { SnackbarService } from 'src/app/components/services/snackbar.service';
import { DialogConfirmationComponent } from 'src/app/components/template/dialog-confirmation/dialog-confirmation.component';

@Component({
  selector: 'app-eventos-edit',
  templateUrl: './eventos-edit.component.html',
  styleUrls: ['./eventos-edit.component.css']
})
export class EventosEditComponent implements OnInit{
  
  id: string = '';
  isEventEdit = true;

  event_name: string = '';
  event_desc: string = '';
  isOneDay: string = 'true';
  start_date: Date = new Date();//'MM/DD/YYY'
  end_date: Date = new Date();
  start_time: string = '';
  end_time: string = '';
  maxDate: Date = new Date();
  minDate: Date = new Date();
  event_type: string = 'public';
  agora: Date = new Date();
  dataAntesdeEditar: number = 0;

  constructor(
    private data: DataService,
    private snack: SnackbarService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = +date.getDate() + 1;
    this.maxDate = new Date(year, 11, 31)
    this.minDate = new Date(year, month, day)
    this.agora = new Date(year, month, day);

    this.getAllEvents();

    //Para preencher os eventos
    this.id = String(this.route.snapshot.paramMap.get('id'));
    this.data.getEvent(String(this.id)).subscribe(event =>
      {
        this.preencherEvent(event.data())
      })
  }

  eventsList: Event[] = [];
  listDatas: Array<{data: {start: number, end: number}, hora: {start: number, end: number}, name: string, horario: string}> = [];
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
        this.eventsList = this.eventsList
        .filter(ev => ev.event_type == 'public' && ev.id != this.id);
        this.listDatas = this.eventsList
        .map(ev =>
          {
            const datInt = +`${ev.start_date.split("/")[2]}${ev.start_date.split("/")[1]}${ev.start_date.split("/")[0]}`;
            const horInt = +`${ev.start_time.replace(/\D/g, "")}`;
            const datFim = !eval(ev.isOneDay) 
              ? +`${ev.end_date.split("/")[2]}${ev.end_date.split("/")[1]}${ev.end_date.split("/")[0]}`
              :  datInt;
            const horFim = +`${ev.end_time.replace(/\D/g, "")}`;
            const name = ev.event_name;
            const horario = `${ev.start_time}-${ev.end_time}`;
            return {
              data: {
                start: datInt, 
                end: datFim
              }, 
              hora: {
                start: horInt, 
                end: horFim
              }, 
              name: name,
              horario: horario,
            }
          })
      }, err => 
      {
        //Mensagem de erro
        this.snack.openSnackBar(`Erro de busca: ${err}`);
      })
  }

  preencherEvent(event: any)
  {
    let DataStartEvent = new Date(this.dateBrForEUA(event.start_date));
    //Validação para saber se pode editar ou não
    if(DataStartEvent < this.agora)
    {
      this.isEventEdit = false;
      this.snack.openSnackBar('Edite com um dia de antecedência!', 2500)
    }
    else if(event.user != String(localStorage.getItem('usermask_id')))
    {
      this.isEventEdit = false;
      this.snack.openSnackBar('Edite apenas seus eventos!', 2500)
    }
    let dataInicio: number | string = this.dateForString(new Date(this.dateBrForEUA(String(event.start_date))));
    dataInicio = +`${dataInicio.split("/")[2]}${dataInicio.split("/")[1]}${dataInicio.split("/")[0]}${event.start_time.replace(/\D/g, "")}`;

    let dataFim: number | string = this.agora != this.end_date ? this.dateForString(new Date(this.dateBrForEUA(String(event.end_date)))) : this.dateForString(new Date(this.dateBrForEUA(String(event.start_date))));
    dataFim = +`${dataFim.split("/")[2]}${dataFim.split("/")[1]}${dataFim.split("/")[0]}${event.end_time.replace(/\D/g, "")}`;

    const somaDatas = dataInicio + dataFim;
    
    this.event_desc = event.event_desc;
    this.event_name = event.event_name;
    this.isOneDay = eval(event.isOneDay) ? 'true' : '';
    this.start_date = new Date(this.dateBrForEUA(event.start_date));//'MM/DD/YYY'
    this.end_date = new Date(this.dateBrForEUA(event.end_date));
    this.start_time = event.start_time;
    this.end_time = event.end_time;
    this.event_type = event.event_type;
    this.dataAntesdeEditar = somaDatas;
  }

  dateBrForEUA(date: string)
  {
    let res = `${date.split('/')[1]}/${date.split('/')[0]}/${date.split('/')[2]}`;
    return res;
  }
  dateForString(data: Date)
  {
    let date = String(data);
    const year = date.slice(11,15);
    const day = date.slice(8,10);
    let month = date.slice(4,7)
    switch(month)
    {
      case 'Jan':
        month = '01'
        break
      case 'Feb':
        month = '02'
        break
      case 'Mar':
        month = '03'
        break
      case 'Apr':
        month = '04'
        break
      case 'May':
        month = '05'
        break
      case 'Jun':
        month = '06'
        break
      case 'Jul':
        month = '07'
        break
      case 'Aug':
        month = '08'
        break
      case 'Sep':
        month = '09'
        break
      case 'Oct':
        month = '10'
        break
      case 'Nov':
        month = '11'
        break
      case 'Dec':
        month = '12'
        break
    }

    date = `${day}/${month}/${year}`
    return date;
  }

  horaNumberForHour(hora: number)
  {
    let str = String(hora);
    let res = `${str.slice(0,1)}:${str.slice(2,3)}`;
    return res;
  }

  validarEvent(): boolean
  {
    if(this.event_name == '' || this.event_desc == '' || String(this.start_date) == '' || String(this.end_date) == '' || this.start_time == '' || this.end_time == '')
    {
      this.snack.openSnackBar('Preencha todos os dados!', 2000)
      return false
    }//Se preenchidos
    else if(this.start_time.length < 5 || this.end_time.length < 5)
    {
      this.snack.openSnackBar('Preencha o horário completo!', 2000)
      return false
    }// Se horário preenchido
    else if(+(this.start_time.replace(/\D/g, "")) > +(this.end_time.replace(/\D/g, "")) && this.isOneDay)
    {
      this.snack.openSnackBar('Horário de início maior que o de fim!', 2000)
      return false
    }//Se isOneDay e hor final maior que hor inicial
    else if(+this.start_time.split(':')[0] > 23 || +this.start_time.split(':')[1] > 59 || +this.start_time.split(':')[0] < 0 || +this.start_time.split(':')[1] < 0 || +this.end_time.split(':')[0] > 23 || +this.end_time.split(':')[1] > 59 || +this.end_time.split(':')[0] < 0 || +this.end_time.split(':')[1] < 0)
    {
      this.snack.openSnackBar('Horário incorreto!', 2000)
      return false
    }
    else 
    {
      //Se já exites um evento iniciado no mesmo intervalo entre o início e o fim do evento atual
      let dataInicio: number | string = this.dateForString(this.start_date);
      dataInicio = +`${dataInicio.split("/")[2]}${dataInicio.split("/")[1]}${dataInicio.split("/")[0]}`;
      let horaInicio = +`${this.start_time.replace(/\D/g, "")}`;
  
      let dataFim: number | string = !eval(this.isOneDay) ? this.dateForString(this.end_date) : this.dateForString(this.start_date);
      dataFim = +`${dataFim.split("/")[2]}${dataFim.split("/")[1]}${dataFim.split("/")[0]}`;
      let horaFim = +`${this.end_time.replace(/\D/g, "")}`;

      //Passa por todos os dias entre os dias atuais
      for(let i = dataInicio; i <= dataFim; i++)
      {
        //Passa para todos os itens da lista
        for(let item of this.listDatas)
        {
          //Passa por todos os períodos de cada item da lista
          for(let ii = item.data.start; ii <= item.data.end; ii++)
          {
            //Se o príodo Dia da lista for igual ao período Dia atual
            if(ii == i)
            {
              //Passa por todas as horas entre o início e o fim atual
              for(let h = horaInicio; h <= horaFim; h++)
              {
                //Passa por todas as horas do item da lista
                for(let hh = item.hora.start; hh < item.hora.end; hh++)
                {
                  //Se a hora se encaixar
                  if(hh == h)
                  {
                    this.dialog.open(DialogConfirmationComponent, {
                      data: 
                      {
                        title: 'ERRO',
                        message: `A data já está sendo usada no evento ${item.name}!\nNo horário ${item.horario}`,
                        alert: true
                      },
                    });
                    return false;
                  }
                }
              }
            }
          }
        }
      }

      //Se tudo estiver ok
      return true;
    }
  }

  criarEvent()
  {
    if(this.validarEvent()) 
    {
      return {
        event_name: this.event_name,
        event_desc: this.event_desc,
        isOneDay: this.isOneDay ? 'true' : 'false',
        start_date: this.dateForString(this.start_date),
        end_date: this.isOneDay ? 'null' : this.dateForString(this.end_date),
        start_time: this.start_time,
        end_time: this.end_time,
        event_type: this.event_type,
        user: String(localStorage.getItem("usermask_id"))
      }        
    }
    else 
    {
      return false;
    }
  }

  resetEvent()
  {
    this.event_desc = '';
    this.event_name = '';
    this.isOneDay = 'true';
    this.start_date = new Date();//'MM/DD/YYY'
    this.end_date = new Date();
    this.start_time = '';
    this.end_time = '';
    this.event_type = 'public';
  }

  updateEvent()
  {
    const event = this.criarEvent();
    if(event)
    {
      this.data.updateEvent(event, this.id);
      this.snack.openSnackBar('Atualizado com sucesso!');
      this.resetEvent();
      this.router.navigate(['eventos']);
    }
  }

  deleteEvent()
  {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: 
      {
        title: `Deseja excluir?`,
        confirm: true
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if(result)
      {
        this.data.deleteEvent(this.id);
        this.snack.openSnackBar('Deletado com sucesso!');
        this.resetEvent();
        this.router.navigate(['eventos']);
      }
    });
  }
}
