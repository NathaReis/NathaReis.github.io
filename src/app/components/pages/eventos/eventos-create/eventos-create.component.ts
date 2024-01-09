import { Component } from '@angular/core';
import { FormEvent } from 'src/app/components/models/form-event';

@Component({
  selector: 'app-eventos-create',
  templateUrl: './eventos-create.component.html',
  styleUrls: ['./eventos-create.component.css']
})
export class EventosCreateComponent {
  formParams: FormEvent = {type: 'create'}
}
