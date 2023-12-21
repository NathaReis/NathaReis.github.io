import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Perfil } from '../models/perfil';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  _perfilData = new BehaviorSubject<Perfil>({
    type: '',
    eventos: false,
    departamentos: false,
    associados: false,
    all_view: false,
    escalas: false,
    config: false,
    home: false
  });

  constructor() { }

  // métodos

  get perfilData(): Perfil 
  {
    return this._perfilData.value;
  }//Busca

  set perfilData(perfilData: Perfil)
  {
    this._perfilData.next(perfilData)
  }//Edita
}