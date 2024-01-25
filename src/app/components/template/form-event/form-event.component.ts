import { Component, Input, OnInit } from '@angular/core';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { Event } from '../../models/event';
import { HeaderService } from '../../services/header.service';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../services/snackbar.service';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { FormEvent } from '../../models/form-event';
import { PerfilService } from '../../services/perfil.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-event',
  templateUrl: './form-event.component.html',
  styleUrls: ['./form-event.component.css'],
})
export class FormEventComponent implements OnInit{

  @Input() formParams: FormEvent = {}

  //Usado na edição
  id: string = '';
  isEventEdit = true;
  dataAntesdeEditar: number = 0;

  event_name: string = '';
  event_desc: string = '';
  isOneDay: string = 'true';
  start_date: Date = new Date();//'MM/DD/YYY'
  end_date: Date = new Date();
  start_time: string = '';
  end_time: string = '';
  event_type: string = 'public';
  maxDate: Date = new Date();
  minDate: Date = new Date();
  agora: Date = new Date();
  isGerente = localStorage.getItem('logado') == 'gerente' ? true : false;

  constructor(
    private auth: AuthService,
    private data: DataService,
    private snack: SnackbarService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private perfilService: PerfilService,
    private headerService: HeaderService) {
      headerService.headerData = {
        title: 'Eventos',
        icon: 'event',
        routerLink: 'eventos'
      },
      perfilService.perfilData = {
        departamentos: localStorage.getItem("departamentos") ? true : false,
        associados: localStorage.getItem("associados") ? true : false,
        eventos: localStorage.getItem("eventos") ? true : false,
        type: String(localStorage.getItem("logado")),
        all_view: localStorage.getItem("all_view") ? true : false,
        escalas: true,
        config: true,
        home: true
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

    this.auth.auth_guard();
    this.getAllEvents();

    if(this.formParams.type == 'create')
    {
      this.start_date = this.agora;
      this.end_date = this.agora;
    }
    else if(this.formParams.type == 'edit')
    {
      //Para preencher os eventos
      this.id = String(this.route.snapshot.paramMap.get('id'));
      this.data.getEvent(String(this.id)).subscribe(event =>
        {
          this.preencherEvent(event.data())
        })
    }
  }

  eventsList: Event[] = [];
  listDatas: Array<{data: {start: number, end: number}, hora: {start: number, end: number}, name: string, horario: string, type: string}> = [];
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
        if(this.formParams.type == 'edit')
        {
          this.eventsList = this.eventsList
          .filter(ev => ev.id != this.id);
        }
        this.listDatas = this.eventsList
        .map(ev =>
          {
            const datInt = +`${ev.start_date.split("/")[2]}${ev.start_date.split("/")[1]}${ev.start_date.split("/")[0]}`;
            const horInt = +`${ev.start_time.replace(/\D/g, "")}`;
            const datFim = this.isOneDay == ''
              ? +`${ev.end_date.split("/")[2]}${ev.end_date.split("/")[1]}${ev.end_date.split("/")[0]}`
              :  datInt;
            const horFim = +`${ev.end_time.replace(/\D/g, "")}`;
            const name = ev.event_name;
            const horario = `${ev.start_time}-${ev.end_time}`;
            const type = ev.event_type;

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
              type: type,
            }
          })
      }, err => 
      {
        //Mensagem de erro
        this.snack.openSnackBar(`Erro de busca: ${err}`);
      })
  }

  //Edição
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

  validateObj(): boolean
  {
    let contPublic = 0;
    let contPrivate = 0;
    let contAnual = 0;
    let publicsItems = [];
    let privatesItems = [];
    let anuaisItems = [];
    if(this.isOneDay != 'anual')
    {
      if(this.isOneDay == 'true')
      {
        this.end_date = this.start_date;
      }

      if(this.event_name == '' || this.event_desc == '' || String(this.start_date) == '' || String(this.end_date) == '' || this.start_time == '' || this.end_time == '')
      {
        this.snack.openSnackBar('Preencha todos os dados!', 2000)
        return false
      }//Se preenchidos
      else if(this.start_date < this.agora || this.end_date < this.agora)
      {
        this.snack.openSnackBar('Datas antigas!', 2000)
        return false
      }// Se a data for igual ou menor a hoje
      else if(this.start_date > this.end_date)
      {
        this.snack.openSnackBar('Data de início maior que a de fim!', 2000)
        return false
      }// Se a data de início for maior que a de fim
      else
      {
        //Se já exites um evento iniciado no mesmo intervalo entre o início e o fim do evento atual
        let dataInicio: number | string = this.dateForString(this.start_date);
        dataInicio = +`${dataInicio.split("/")[2]}${dataInicio.split("/")[1]}${dataInicio.split("/")[0]}`;
        let horaInicio = +`${this.start_time.replace(/\D/g, "")}`;
    
        let dataFim: number | string = this.agora != this.end_date ? this.dateForString(this.end_date) : this.dateForString(this.start_date);
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
                if(item.type == 'anual') 
                {
                  contAnual == 0 ? anuaisItems.push(item) : undefined;
                  contAnual++;
                }//Eventos anuais serão vistos em criação de eventos privados e públicos

                //Passa por todas as horas entre o início e o fim atual
                for(let h = horaInicio; h <= horaFim; h++)
                {
                  //Passa por todas as horas do item da lista
                  for(let hh = item.hora.start; hh < item.hora.end; hh++)
                  {
                    //Se a hora se encaixar
                    if(hh == h)
                    {
                      if(item.type == 'public' && this.event_type == 'public')
                      {
                        contPublic == 0 ? publicsItems.push(item) : undefined;
                        contPublic++;
                      }//Eventos públicos serão vistos apenas na criação de eventos públicos
                      else if(item.type == 'private')
                      {
                        contPrivate == 0 ? privatesItems.push(item) : undefined;
                        contPrivate++;
                      }//Eventos privados serão vistos na criação de eventos privados
                    }
                  }
                }
              }
            }
          }
        }

        if(contPublic > 0)
        {
          this.dialog.open(DialogConfirmationComponent, {
            data: 
            {
              title: `${publicsItems[0].name} (PÚBLICO) ${publicsItems[0].horario}`,
              alert: true
            },
          });
          return false;
        }
        else
        {
          if(contPrivate > 0)
          {
            this.dialog.open(DialogConfirmationComponent, {
              data: 
              {
                title: `${privatesItems[0].name} (PRIVADO) ${privatesItems[0].horario}`,
                alert: true
              },
            });
          }
          if(contAnual > 0)
          {
            this.dialog.open(DialogConfirmationComponent, {
              data: 
              {
                title: `${anuaisItems[0].name} (ANUAL)`,
                alert: true
              },
            });
          }
          return true
        }
      }
    }
    else 
    {
      if(this.event_name == '' || this.event_desc == '')
      {
        this.snack.openSnackBar('Preencha o nome');
        return false;
      }
      return true;
    }
  }

  createObj()
  {
    if(this.validateObj()) 
    {
      if(this.isOneDay != 'anual')
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
        return {
          event_name: this.event_name,
          event_desc: this.event_desc,
          isOneDay: 'anual',
          start_date: this.dateForString(this.start_date),
          end_date: 'null',
          start_time: '',
          end_time: '',
          event_type: 'anual',
          user: String(localStorage.getItem("usermask_id"))
        }
      }       
    }
    else 
    {
      return false;
    }
  }

  reset()
  {
    this.event_desc = '';
    this.event_name = '';
    this.isOneDay = 'true';
    this.start_date = this.agora;//'MM/DD/YYY'
    this.end_date = this.agora;
    this.start_time = '';
    this.end_time = '';
    this.event_type = 'public';
  }

  create()
  {
    const event = this.createObj();
    if(event)
    {
      this.data.addEvent(event)
      .then(res =>
        {
          this.snack.openSnackBar('Criado com sucesso!', 2000);
          this.reset();
          this.getAllEvents();
        })
        .catch(error =>
          {
            this.snack.openSnackBar(`Erro: ${error}`, 2000)
            console.log(error);
          })
    }
  }

  update()
  {
    const event = this.createObj();
    if(event)
    {
      this.data.updateEvent(event, this.id)
      .then(res =>
        {
          this.snack.openSnackBar('Atualizado com sucesso!', 2000);
          this.reset();
          this.back();
        })
        .catch(error =>
          {
            this.snack.openSnackBar(`Erro: ${error}`, 2000)
            console.log(error);
          })
    }
  }

  delete()
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
        this.data.deleteEvent(this.id)
        .then(res =>
          {
            this.snack.openSnackBar('Deletado com sucesso!', 2000);
            this.reset();
            this.back();
          })
          .catch(error =>
            {
              this.snack.openSnackBar(`Erro: ${error}`, 2000);
              console.log(error);
            })
      }
    });
  }

  back()
  {
    setTimeout(() =>
    {
      this.router.navigate(['eventos']);
    },1500)
  }
}
