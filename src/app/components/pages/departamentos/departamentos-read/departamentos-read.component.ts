import { MatDialog } from '@angular/material/dialog';
import { User } from '../../../models/user';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/components/services/data.service';
import { HeaderService } from 'src/app/components/services/header.service';
import { DialogConfirmationComponent } from 'src/app/components/template/dialog-confirmation/dialog-confirmation.component';
import { SnackbarService } from 'src/app/components/services/snackbar.service';

@Component({
  selector: 'app-departamentos-read',
  templateUrl: './departamentos-read.component.html',
  styleUrls: ['./departamentos-read.component.css']
})
export class DepartamentosReadComponent implements AfterViewInit, OnInit{

  constructor(
    private data: DataService,
    private snack: SnackbarService,
    private dialog: MatDialog,
    private headerService: HeaderService) {
    headerService.headerData = {
      title: 'Departamentos',
      icon: 'house',
      routerLink: 'departamentos'
    }
  }

  //TABLE CONFIG
  displayedColumns: string[] = ['id', 'first_name', 'actions'];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  dataSource = new MatTableDataSource<User>();

  //USER LIST
  usersList: User[] = [];
  ngOnInit(): void {
    this.getAllUsers()
  }

  getAllUsers()
  {
    //Consulta o serviço correspondente
    this.data.getAllUsers().subscribe(res =>
      {
        //Mapeia o resultado
        this.usersList = res.map((e: any) =>
          {
            const data = e.payload.doc.data();
            data.id = e.payload.doc.id;
            return data;
          })
        const noass = this.usersList.filter(user => user.perfil != 'associado');
        const admins = noass.filter(user => user.perfil == 'admin');
        const gerentes = noass.filter(user => user.perfil == 'gerente');
        const diretores = noass.filter(user => user.perfil == 'diretor');
        const ass = this.usersList.filter(user => user.perfil == 'associado');
        this.usersList = admins.concat(gerentes.concat(diretores.concat(ass)));//Ordernar a lista em Admin/Gerente/Diretor/Associado cima para baixo
        //Passa a lista para o data usado na table
        this.dataSource = new MatTableDataSource<User>(this.usersList);
        setTimeout(() => {this.validarView();}, 10)
      }, err => 
      {
        //Mensagem de erro
        this.snack.openSnackBar(`Erro de busca: ${err}`)
      })
  }

  deleteUser(id: string, name: string = '')
  {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: {title: `Deseja excluir ${name}?`, confirm: true},
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if(result)
      {
        this.data.deleteUser(id);
      }
    });
  }

  view(id: string, name_first: string, name_last: string)
  {
    //Tira os selecionados style
    document.querySelectorAll(".view").forEach(view =>
      {
        view.classList.remove("selected");
      })
    //Muda o id de pesquisa
    localStorage.setItem('usermask_id', id);
    localStorage.setItem('usermask_name', name_first.toLowerCase()+'.'+name_last.toLowerCase());
    //Adiciona o style
    document.querySelector(`#${id}`)?.classList.add("selected");
  }

  validarView()
  {
    //Tira os selecionados style
    document.querySelectorAll(".view").forEach(view =>
      {
        if(String(view.id) == String(localStorage.getItem("usermask_id")))
        {
          view.classList.add("selected");
        }
      })
  }
}