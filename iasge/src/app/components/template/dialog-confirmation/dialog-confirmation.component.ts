import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Dialog } from '../../models/dialog';
import { DataService } from '../../services/data.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-dialog-confirmation',
  templateUrl: './dialog-confirmation.component.html',
  styleUrls: ['./dialog-confirmation.component.css']
})
export class DialogConfirmationComponent implements OnInit{

  //Calendar edit
  event_name: string = '';
  event_desc: string = '';
  isOneDay: string = 'true';
  start_date: Date = new Date();//'MM/DD/YYY'
  end_date: Date = new Date();
  start_time: string = '';
  end_time: string = '';
  maxDate: Date = new Date();
  minDate: Date = new Date();

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
        console.log(numsArray.slice(0,4).join(""))
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
        console.log(numsArray.slice(0,4).join(""))
        numFormatado += `${numsArray.slice(0,4).join("")}`;
      }
      //Enviar para o campo o num formatado
      this.end_time = numFormatado;
    }
  }

  formatDate(data: Date)
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
    }
    else if(this.start_time.length < 5 || this.end_time.length < 5)
    {
      this.snack.openSnackBar('Preencha o horário completo!', 2000)
      return false
    }
    else if(+(this.start_time.replace(/\D/g, "")) > +(this.end_time.replace(/\D/g, "")) && this.isOneDay)
    {
      this.snack.openSnackBar('Horário de início maior que o de fim!', 2000)
      return false
    }
    else 
    {
      return true;
    }
  }

  criarEvento()
  {

    if(this.validarObj()) 
    {
      return {
        event_name: this.event_name,
        event_desc: this.event_desc,
        isOneDay: this.isOneDay ? 'true' : 'false',
        start_date: this.formatDate(this.start_date),
        end_date: this.isOneDay ? 'null' : this.formatDate(this.end_date),
        start_time: this.start_time,
        end_time: this.end_time,
      }        
    }
    else 
    {
      return false;
    }
  }

  dateBrForEUA(date: string)
  {
    let res = `${date.split('/')[1]}/${date.split('/')[0]}/${date.split('/')[2]}`;
    return res;
  }

  preencherEvento(event: any)
  {
    console.log(event)
    this.event_desc = event.event_desc;
    this.event_name = event.event_name;
    this.isOneDay = eval(event.isOneDay) ? 'true' : '';
    this.start_date = new Date(this.dateBrForEUA(event.start_date));//'MM/DD/YYY'
    this.end_date = new Date(this.dateBrForEUA(event.end_date));
    this.start_time = event.start_time;
    this.end_time = event.end_time;
    console.log(this.start_date)
  }

  reset()
  {
    this.event_desc = '';
    this.event_name = '';
    this.isOneDay = 'true';
    this.start_date = new Date();//'MM/DD/YYY'
    this.end_date = new Date();
    this.start_time = '';
    this.end_time = '';
  }

  update()
  {
    const event = this.criarEvento();
    if(event)
    {
      this.dataS.updateEvent(event, String(this.data.id));
      this.snack.openSnackBar('Atualizado com sucesso!');
      this.reset();
      this.onConfirm(true);
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
        this.dataS.deleteEvent(String(this.data.id));
        this.snack.openSnackBar('Deletado com sucesso!');
        this.reset();
        this.onConfirm(true);        
      }
    });

  }

  constructor(
    public dialogRef: MatDialogRef<DialogConfirmationComponent>,
    private dataS: DataService,
    private snack: SnackbarService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Dialog,
  ) {}

  ngOnInit(): void {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = +date.getDate() + 1;
    this.maxDate = new Date(year, 11, 31)
    this.minDate = new Date(year, month, day)

    this.dataS.getEvent(String(this.data.id)).subscribe(event =>
      {
        this.preencherEvento(event.data())
      })
  }

  onConfirm(result: boolean): void {
    this.dialogRef.close(result);
  }
}
