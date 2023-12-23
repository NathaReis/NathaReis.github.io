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

  ngOnInit(): void {
    this.auth.auth_guard();    
    this.data.getPerfil(String(localStorage.getItem('logado'))).subscribe(res =>
      {
        const perfil = res[0];
        this.perfilSave(perfil)
      }, err => 
      {
        //Mensagem de erro
        alert(`Erro de busca: ${err}`)
      })
  }

  perfilSave(perfil: any)
  {
    let all_view = perfil.all_view ? true : false;
    this.perfil.perfilData = {
      departamentos: perfil.departamentos,
      associados: perfil.associados,
      eventos: perfil.eventos,
      type: perfil.type,
      all_view: all_view,
      escalas: true,
      config: true,
      home: true
    }
  }
}
