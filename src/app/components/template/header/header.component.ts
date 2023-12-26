import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';
import { PerfilService } from '../../services/perfil.service';
import { BodyService } from '../../services/body.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  constructor(
    private headerService: HeaderService,
    private perfilService: PerfilService,
    private bodyService: BodyService) {}

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

  //Body
  get theme(): boolean 
  {
    return this.bodyService.appTheme.theme != 'dark-theme' ? false : true;
  }

  isTheme(type: string)
  {
    localStorage.setItem("theme", type);
    this.bodyService.appTheme = {
      theme: type
    };
  }

  ngOnInit(): void {
    if(localStorage.getItem("theme") != 'dark-theme')
    {
      this.isTheme('');
    }
    else 
    {
      this.isTheme('dark-theme');
    }
  }
}
