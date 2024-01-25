import { Component } from '@angular/core';
import { FormEvent } from 'src/app/components/models/form-event';

@Component({
  selector: 'app-eventos-edit',
  templateUrl: './eventos-edit.component.html',
  styleUrls: ['./eventos-edit.component.css']
})
export class EventosEditComponent{
  formParams: FormEvent = {type: 'edit'}
}
