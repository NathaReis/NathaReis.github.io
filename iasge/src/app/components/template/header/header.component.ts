import { Component } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { PerfilService } from '../../services/perfil.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(
    private headerService: HeaderService,
    private perfilService: PerfilService) {}

  get title(): string
  {
    return this.headerService.headerData.title;
  }
  get icon(): string
  {
    return this.headerService.headerData.icon;
  }
  get routerLink(): string
  {
    return this.headerService.headerData.routerLink;
  }

  //Perfil
  get eventos(): boolean
  {
    return this.perfilService.perfilData.eventos;
  }
  get associados(): boolean
  {
    return this.perfilService.perfilData.associados;
  }
  get departamentos(): boolean
  {
    return this.perfilService.perfilData.departamentos;
  }
  get config(): boolean
  {
    return this.perfilService.perfilData.config;
  }
  get escalas(): boolean
  {
    return this.perfilService.perfilData.escalas;
  }
  get home(): boolean
  {
    return this.perfilService.perfilData.home;
  }
}
