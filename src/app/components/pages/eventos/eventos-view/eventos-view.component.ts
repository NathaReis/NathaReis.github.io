import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-eventos-view',
  templateUrl: './eventos-view.component.html',
  styleUrls: ['./eventos-view.component.css']
})
export class EventosViewComponent implements OnInit{
  typeForm = {type:'Visualizar', id: ''};

  constructor (private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));
    this.typeForm.id = id;
  }
}
