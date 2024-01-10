import {Component, OnInit} from '@angular/core';
import { AuthService } from 'src/app/components/services/auth.service';
import { DataService } from 'src/app/components/services/data.service';
import { HeaderService } from 'src/app/components/services/header.service';
import { PerfilService } from 'src/app/components/services/perfil.service';

@Component({
  selector: 'app-escalas',
  templateUrl: './escalas.component.html',
  styleUrls: ['./escalas.component.css']
})

export class EscalasComponent implements OnInit{

  constructor(
    private auth : AuthService,
    private data: DataService,
    private perfil: PerfilService,
    private headerService: HeaderService) {
      headerService.headerData = {
        title: 'Escalas',
        icon: 'dashboard',
        routerLink: 'escalas'
      }
    }

  isEditor = false;
  isAssociado = false;
  deps = [
    {
      id: '',
      name: 'Escolha um',
      isEditor: false,
    }
  ];
  departamento_id = '';

  ngOnInit(): void {
    this.auth.auth_guard();    
    this.perfilSave();
    if(this.perfil.perfilData.type == 'associado')
    {
      this.isAssociado = true;
      this.data.getUser(String(localStorage.getItem('user_id'))).subscribe((user: any) =>
        {
          console.log(user[0])
          this.preencherDeps(user[0].departamentos);
        })
      this.isEditor = eval(String(localStorage.getItem('isEditor')));
    }
    else 
    {
      this.isEditor = true;
    }
  }

  preencherDeps(departamentos: string)
  {
    const deps = departamentos.split('/');
    deps.forEach(departamento =>
      {
        const dep = departamento.split(',');
        this.deps.push(
          {
            id: dep[0],
            name: dep[1],
            isEditor: eval(dep[2]),
          }
        )
      })
  }

  perfilSave()
  {
    this.perfil.perfilData = {
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

  selectDep()
  {
    if(this.departamento_id)
    {
      const dep = this.deps.filter(dp => dp.id == this.departamento_id);
      localStorage.setItem('usermask_id', dep[0].id);
      localStorage.setItem('usermask_name', dep[0].name);    
      this.isEditor = dep[0].isEditor; 
      localStorage.setItem('isEditor', String(this.isEditor));
    }
    else 
    {
      localStorage.setItem('usermask_id', String(localStorage.getItem('user_id')));
      localStorage.setItem('usermask_name', String(localStorage.getItem('user_name')));
      this.isEditor = false;
      localStorage.removeItem('isEditor');
    }
    location.reload();
  }
}
