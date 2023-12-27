import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-eventos-edit',
  templateUrl: './eventos-edit.component.html',
  styleUrls: ['./eventos-edit.component.css']
})
export class EventosEditComponent implements OnInit{
  typeForm = {type:'Atualizar', id: ''};

  constructor (private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.typeForm.id = id;
  }
}
