import { Component, OnInit } from '@angular/core';
import { BodyService } from '../../services/body.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit{

  constructor(private body: BodyService) {}

  get theme(): string
  {
    return this.body.appTheme.theme;
  }

  ngOnInit(): void {
  }

}
