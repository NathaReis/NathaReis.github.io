import { Component } from '@angular/core';
import { FormEscala } from 'src/app/components/models/form-escala';

@Component({
  selector: 'app-escalas-edit',
  templateUrl: './escalas-edit.component.html',
  styleUrls: ['./escalas-edit.component.css']
})

export class EscalasEditComponent {
  formParams: FormEscala = {type: 'edit'}
}