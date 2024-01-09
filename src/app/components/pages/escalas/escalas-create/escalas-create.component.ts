import { Component } from '@angular/core';
import { FormEscala } from 'src/app/components/models/form-escala';

@Component({
  selector: 'app-escalas-create',
  templateUrl: './escalas-create.component.html',
  styleUrls: ['./escalas-create.component.css']
})

export class EscalasCreateComponent {
  formParams: FormEscala = {type: 'create'}
} 