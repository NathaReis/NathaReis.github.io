import { Component, OnInit } from '@angular/core';
import { Perfil } from 'src/app/components/models/perfil';
import { AuthService } from 'src/app/components/services/auth.service';
import { DataService } from 'src/app/components/services/data.service';
import { HeaderService } from 'src/app/components/services/header.service';
import { PerfilService } from 'src/app/components/services/perfil.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit{

  constructor(
    private auth : AuthService,
    private perfilService: PerfilService,
    private data: DataService,
    private headerService: HeaderService) {
      headerService.headerData = {
        title: 'Eventos',
        icon: 'event',
        routerLink: 'eventos'
      }
    }

  ngOnInit(): void {
    this.auth.auth_guard();
    this.data.getAllPerfis().subscribe(res =>
      {
        //Mapeia o resultado
        const perfis = res.map((e: any) =>
          {
            const data = e.payload.doc.data();
            data.id = e.payload.doc.id;
            return data;
          })
        const perfil = perfis.filter(perfil => localStorage.getItem('logado') == perfil.type)
        this.perfilSave(perfil[0])
      }, err => 
      {
        //Mensagem de erro
        alert(`Erro de busca: ${err}`)
      })
  }

  perfilSave(perfil: Perfil)
  {
    let all_view = perfil.all_view ? true : false;
    this.perfilService.perfilData = {
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