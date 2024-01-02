import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/components/services/auth.service';
import { DataService } from 'src/app/components/services/data.service';
import { HeaderService } from 'src/app/components/services/header.service';
import { PerfilService } from 'src/app/components/services/perfil.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private data: DataService,
    private perfil: PerfilService,
    private headerService: HeaderService) {
      headerService.headerData = {
        title: 'Home',
        icon: 'home',
        routerLink: 'home'
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
    if(all_view)
    {
      localStorage.setItem('all_view', 'true');
    }
    if(perfil.departamentos)
    {
      localStorage.setItem('departamentos', 'true');
    }
    if(perfil.associados)
    {
      localStorage.setItem('associados', 'true');
    }
    if(perfil.eventos)
    {
      localStorage.setItem('eventos', 'true');
    }
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

