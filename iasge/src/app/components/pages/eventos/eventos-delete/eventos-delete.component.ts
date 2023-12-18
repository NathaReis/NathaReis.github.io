import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/components/services/auth.service';
import { HeaderService } from 'src/app/components/services/header.service';

@Component({
  selector: 'app-eventos-delete',
  templateUrl: './eventos-delete.component.html',
  styleUrls: ['./eventos-delete.component.css']
})
export class EventosDeleteComponent implements OnInit{

  constructor(
    private auth : AuthService,
    private headerService: HeaderService) {
      headerService.headerData = {
        title: 'Eventos',
        icon: 'event',
        routerLink: 'eventos'
      }
    }

  ngOnInit(): void {
    this.auth.auth_guard();
  }

}