import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Escala } from 'src/app/components/models/escala';
import { Event } from 'src/app/components/models/event';
import { AuthService } from 'src/app/components/services/auth.service';
import { DataService } from 'src/app/components/services/data.service';
import { HeaderService } from 'src/app/components/services/header.service';
import { PerfilService } from 'src/app/components/services/perfil.service';
import { SnackbarService } from 'src/app/components/services/snackbar.service';
import { DialogConfirmationComponent } from 'src/app/components/template/dialog-confirmation/dialog-confirmation.component';
import { FormEscala } from '../../models/form-escala';
import { EscalaCampo } from '../../models/escala-campo';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-escala',
  templateUrl: './form-escala.component.html',
  styleUrls: ['./form-escala.component.css']
})
export class FormEscalaComponent implements OnInit{

  @Input() formParams: FormEscala = {};
  
  events: Array<{id: string, name: string, start_date: string, end_date: string}> = [];
  escala_name: string = '';
  escala_id: string = '';
  start_date: Date = new Date();//'MM/DD/YYY'
  id: string = '';//Edição

  hour: string = '';
  pessoa: string = '';
  descricao: string = '';
  categorias: string = '';

  campos: Array<EscalaCampo> = [];

  maxDate: Date = new Date();
  minDate: Date = new Date();
  agora: Date = new Date();
  isEditor: boolean = true;//Edição

  constructor(
    private auth: AuthService,
    private data: DataService,
    private snack: SnackbarService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private perfilService: PerfilService,
    private headerService: HeaderService) {
      headerService.headerData = {
        title: 'Escalas',
        icon: 'dashboard',
        routerLink: 'escalas'
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
    this.start_date = this.agora;

    this.auth.auth_guard();
    this.getAllEvents();

    if(this.formParams.type == 'edit')
    {
      if(localStorage.getItem("logado") == 'associado')
      {
        this.isEditor = eval(String(localStorage.getItem('isEditor')));
      }

      //Para preencher os eventos
      const id = String(this.route.snapshot.paramMap.get('id'));
      this.data.getEscala(String(id)).subscribe(escala =>
        {
          this.preencherEscala(escala.data(), id)
        })    
    }
  }

  preencherEscala(escala: any, id: string)
  {
    const data = new Date(this.dateBrForEUA(escala.start_date));
    //Validação para saber se pode editar ou não
    if(data < this.agora)
    {
      this.isEditor = false;
      this.snack.openSnackBar('Edite com um dia de antecedência!', 2500)
    }
    else if(escala.user != String(localStorage.getItem('usermask_id')))
    {
      this.isEditor = false;
      this.snack.openSnackBar('Edite apenas suas escalas!', 2500)
    }
    console.log(escala)
    if(escala.escala_name == 'Culto')
    {
      this.escala_id = 'culto';
      this.escala_name = 'Culto';
    }
    else
    {
      this.escala_id = escala.escala_id;
      this.escala_name = escala.escala_name;
    }
    this.start_date = data;
    this.campos = escala.escala;
    this.id = id;
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
        this.eventsList = this.eventsList
        .filter(this.yearEvents)
        .filter(this.minDateEvents)
        .filter(this.publicEvents);
        if(!this.perfilService.perfilData.all_view)
        {
          this.eventsList = this.eventsList.filter(this.myEvents);
        }
        this.popularEvents(this.eventsList); //Atualiza a lista
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

  publicEvents(ev: any)
  {
    return ev.event_type == 'public';
  }

  yearEvents(ev: any)
  {
    const date = new Date();
    const year = +date.getFullYear() -1;
    const oldDate = new Date(year, 11, 31);
    const dataStr = `${ev.start_date.split('/')[1]}/${ev.start_date.split('/')[0]}/${ev.start_date.split('/')[2]}`
    const dataEv = new Date(dataStr);
    return dataEv > oldDate;
  }

  minDateEvents(ev: any)
  {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = +date.getDate() + 1;
    const agora = new Date(year, month, day);
    const dataStr = `${ev.start_date.split('/')[1]}/${ev.start_date.split('/')[0]}/${ev.start_date.split('/')[2]}`
    const dataEv = new Date(dataStr);
    return dataEv >= agora;
  }

  popularEvents(events: Event[])
  {
    this.events.push({
      id: '',
      name: 'Escolha um',
      start_date: '',
      end_date: '',
    })
    events.forEach(ev =>
      {
        this.events.push({
          id: String(ev.id),
          name: ev.event_name,
          start_date: this.dateBrForEUA(ev.start_date),
          end_date: ev.end_date != 'null' ? this.dateBrForEUA(ev.end_date) : 'null',
        })
      })
    this.events.push({
      id: 'culto',
      name: 'Culto',
      start_date: '',
      end_date: '',
    })
  }

  selectDate()
  {
    let event: any = this.events.filter(ev => ev.id == this.escala_id);
    event = event[0];
    if(event.id && event.name != 'Culto')
    {
      if(event.end_date != 'null')
      {
        this.minDate = new Date(event.start_date);
        this.maxDate = new Date(event.end_date);  
        this.start_date = this.minDate;  
        this.escala_name = event.name;      
      }//Mais de um dia
      else 
      {
        this.minDate = new Date(event.start_date);
        this.maxDate = new Date(event.start_date);
        this.start_date = this.minDate;
        this.escala_name = event.name;
      }//Apenas um dia
    }
    else 
    {
      event.name != 'Culto' ? this.escala_name = '' : this.escala_name = event.name;
      const date = new Date();
      const year = date.getFullYear();
      this.maxDate = new Date(year, 11, 31);
      this.minDate = this.agora;
      this.start_date = this.agora;
    }//Para a primeira opção e a de Culto
  }

  criarCampo()
  {
    if(this.hour == '' || this.pessoa == '' || this.categorias == '' || this.descricao == '')
    {
      this.snack.openSnackBar('Preencha todos os dados!');
    }
    else 
    {
      const existHour = this.campos.filter(campo => campo.hour == this.hour);
      if(existHour.length > 0)
      {
        this.snack.openSnackBar('Horário já registrado!')
      }
      else
      {
        this.campos.push({
          id: this.campos.length < 0 ? 0 : +this.campos.length,
          hour: this.hour,
          pessoa: this.pessoa,
          descricao: this.descricao,
          categoria: this.categorias,
        })  
        this.resetCampo();      
      }
    }
  }

  resetCampo() 
  {
    this.categorias = '';
    this.pessoa = '';
    this.descricao = '';
    this.hour = '';
  }

  reset() 
  {
    this.resetCampo();
    this.escala_name = '';
    this.escala_id = '';
    this.start_date = this.agora;
    this.campos = [];
  }

  ordernarEscala(campos: Array<EscalaCampo>)
  {
    let hours: Array<string> = [];
    let newList: Array<EscalaCampo> = [];

    campos.forEach(campo =>
      {
        hours.push(campo.hour);
      })
    hours.sort();
    
    hours.forEach(hour =>
      {
        campos.forEach(campo => {
          if(campo.hour == hour)
          {
            newList.push(campo);
          }
        })
      })
    return newList;
  }

  viewEscala()
  {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: 
      {
        escalaBox: true,
        escalaView: this.ordernarEscala(this.campos),
        alert: true,
      },
    });

    dialogRef.afterClosed().subscribe((result: Array<{id: number, hour: string, categoria: string, pessoa: string, descricao: string}>) => {
      if(result)
      {
        this.campos = result;
        if(this.campos.length > 0)
        {
          this.viewEscala();
        }
      }
    });
  }

  validateEscala(name: string)
  {
    if(name == '')
    {
      this.snack.openSnackBar('Preencha o nome do evento');
      return false;
    }
    else if(this.campos.length <= 0)
    {
      this.snack.openSnackBar('Preencha a escala');
      return false;
    }
    else if(this.start_date < this.minDate || this.start_date > this.maxDate)
    {
      this.snack.openSnackBar('Data inválida');
      return false;
    }
    else 
    {
      return true;
    }
  }

  criarEscala(): Escala
  {
    return {
      id: '',
      escala_name: this.escala_name,
      escala_id: this.escala_id,
      start_date: this.dateForString(this.start_date),
      escala: this.campos,
      user: String(localStorage.getItem("usermask_id")),
    }
  }

  criar()
  {
    if(this.validateEscala(this.escala_name))
    {
      console.log(this.criarEscala())
      this.data.addEscala(this.criarEscala());
      this.reset();
    }
  } 

  atualizar()
  {
    if(this.validateEscala(this.escala_name))
    {
      this.data.updateEscala(this.criarEscala(), this.id);
      this.reset();
      this.router.navigate(['escalas']);
    }
  } 
  
  deletar()
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
        this.data.deleteEscala(this.id);
        this.snack.openSnackBar('Deletada com sucesso!');
        this.reset();
        this.router.navigate(['escalas']);
      }
    });
  }

  // Funções
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
}
