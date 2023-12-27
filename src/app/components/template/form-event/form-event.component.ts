import { DataService } from 'src/app/components/services/data.service';
import { Component, Input, OnInit } from '@angular/core';
import { DialogConfirmationComponent } from '../dialog-confirmation/dialog-confirmation.component';
import { HeaderService } from '../../services/header.service';
import { Event } from 'src/app/components/models/event';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from '../../services/snackbar.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-event',
  templateUrl: './form-event.component.html',
  styleUrls: ['./form-event.component.css']
})
export class FormEventComponent implements OnInit{
  @Input() typeForm = {type: '', id: ''};

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
  edit = true;

  constructor(
    private auth: AuthService,
    private data: DataService,
    private snack: SnackbarService,
    private dialog: MatDialog,
    private router: Router,
    private headerService: HeaderService) {
      headerService.headerData = {
        title: 'Eventos',
        icon: 'event',
        routerLink: 'eventos'
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
    this.start_date = this.agora;
    this.end_date = this.agora;

    this.auth.auth_guard();
    this.getAllEvents();

    if(this.typeForm.id.length > 0)
    {
      //Para preencher os eventos
      this.data.getEvent(String(this.typeForm.id)).subscribe(event =>
        {
          this.preencherEvento(event.data())
        })      
    }
    if(this.typeForm.type == 'Visualizar')
    {
      this.edit = false;
    }
  }

  eventsList: Event[] = [];
  listDatas: Array<{data: {start: number, end: number}, hora: {start: number, end: number}, name: string}> = [];
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
        if(this.typeForm.type == 'Criar')
        {
          this.eventsList = this.eventsList
          .filter(ev => ev.event_type == 'public');
        }
        else 
        {
          this.eventsList = this.eventsList
          .filter(ev => ev.event_type == 'public' && ev.id != this.typeForm.id);
        }
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
            return {
              data: {
                start: datInt, 
                end: datFim
              }, 
              hora: {
                start: horInt, 
                end: horFim
              }, 
              name: name
            }
          })
      }, err => 
      {
        //Mensagem de erro
        this.snack.openSnackBar(`Erro de busca: ${err}`);
      })
  }

  maskTime()
  {
    if(this.start_time)
    {
      //Remove caracters NaN e max.length 5
      this.start_time = this.start_time.replace(/\D/g, "").substring(0,4);
      //Dividir string em caracters individuais
      let numsArray: Array<string> = this.start_time.split("");
      //Var para num formatado
      let numFormatado: string = "";
      //If maior que zero
      if(numsArray.length > 0)
      {
          //Formatar o DD e conectar o valor
          //slice - extrai parte da array
          //join - uni os elementos do array em uma única string
          numFormatado += `${numsArray.slice(0,2).join("")}`;
      }    
      //If maior que dois
      if(numsArray.length > 2)
      {
        numFormatado += `:${numsArray.slice(2,4).join("")}`;
      }
      //If maior que sete
      if(numsArray.length > 4)
      {
        numFormatado += `${numsArray.slice(0,4).join("")}`;
      }
      //Enviar para o campo o num formatado
      this.start_time = numFormatado;
    }
    if(this.end_time)
    {
      //Remove caracters NaN e max.length 5
      this.end_time = this.end_time.replace(/\D/g, "").substring(0,4);
      //Dividir string em caracters individuais
      let numsArray: Array<string> = this.end_time.split("");
      //Var para num formatado
      let numFormatado: string = "";
      //If maior que zero
      if(numsArray.length > 0)
      {
          //Formatar o DD e conectar o valor
          //slice - extrai parte da array
          //join - uni os elementos do array em uma única string
          numFormatado += `${numsArray.slice(0,2).join("")}`;
      }    
      //If maior que dois
      if(numsArray.length > 2)
      {
        numFormatado += `:${numsArray.slice(2,4).join("")}`;
      }
      //If maior que sete
      if(numsArray.length > 4)
      {
        numFormatado += `${numsArray.slice(0,4).join("")}`;
      }
      //Enviar para o campo o num formatado
      this.end_time = numFormatado;
    }
  }

  horaNumberForHour(hora: number)
  {
    let str = String(hora);
    let res = `${str.slice(0,1)}:${str.slice(2,3)}`;
    return res;
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

  validarObj(): boolean
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
                        message: `A data já está sendo usada no evento ${item.name}!`,
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

  criarObj()
  {

    if(this.validarObj()) 
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

  action()
  {
    if(this.typeForm.type == 'Criar')
    {
      this.criar();
    }
    else if(this.typeForm.type == 'Visualizar')
    {
      this.router.navigate(['/eventos'])
    }
    else 
    {
      this.update();
    }
  }

  criar()
  {
    const event = this.criarObj();
    if(event)
    {
      this.data.addEvent(event);
      this.snack.openSnackBar('Criado com sucesso!');
      this.reset();
      this.getAllEvents();
    }
  }

  update()
  {
    const event = this.criarObj();
    if(event)
    {
      this.data.updateEvent(event, String(this.typeForm.id));
      this.snack.openSnackBar('Atualizado com sucesso!');
      this.reset();
    }
  }

  preencherEvento(event: any)
  { 
    this.event_desc = event.event_desc;
    this.event_name = event.event_name;
    this.isOneDay = eval(event.isOneDay) ? 'true' : '';
    this.start_date = new Date(this.dateBrForEUA(event.start_date));//'MM/DD/YYY'
    this.end_date = new Date(this.dateBrForEUA(event.end_date));
    this.start_time = event.start_time;
    this.end_time = event.end_time;
    this.event_type = event.event_type;
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
        this.data.deleteEvent(String(this.typeForm.id));
        this.snack.openSnackBar('Deletado com sucesso!');
        this.reset();
      }
    });
  }
}
