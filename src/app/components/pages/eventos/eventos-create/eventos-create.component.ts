import { Component } from '@angular/core';
import { FormEvent } from 'src/app/components/models/form-event';
import { HeaderService } from 'src/app/components/services/header.service';
import { PerfilService } from 'src/app/components/services/perfil.service';

@Component({
  selector: 'app-eventos-create',
  templateUrl: './eventos-create.component.html',
  styleUrls: ['./eventos-create.component.css']
})
export class EventosCreateComponent {
  formParams: FormEvent = {type: 'create'}
  constructor(
    private headerService: HeaderService,
    private perfilService: PerfilService) {
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
}
