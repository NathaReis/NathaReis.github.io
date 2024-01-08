import { Component } from '@angular/core';
import { FormEvent } from 'src/app/components/models/form-event';
import { HeaderService } from 'src/app/components/services/header.service';
import { PerfilService } from 'src/app/components/services/perfil.service';

@Component({
  selector: 'app-eventos-edit',
  templateUrl: './eventos-edit.component.html',
  styleUrls: ['./eventos-edit.component.css']
})
export class EventosEditComponent {
  formParams: FormEvent = {type: 'edit'}

  constructor(
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
}
