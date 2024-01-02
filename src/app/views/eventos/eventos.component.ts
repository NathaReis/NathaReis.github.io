import { Component, OnInit } from '@angular/core';
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
    private perfil: PerfilService,
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
    this.perfilSave();
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
}