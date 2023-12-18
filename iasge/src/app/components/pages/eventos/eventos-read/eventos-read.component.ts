import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {MatCalendarCellClassFunction, MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import { AuthService } from 'src/app/components/services/auth.service';
import { HeaderService } from 'src/app/components/services/header.service';

@Component({
  selector: 'app-eventos-read',
  templateUrl: './eventos-read.component.html',
  styleUrls: ['./eventos-read.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatNativeDateModule, MatDatepickerModule],
})
export class EventosReadComponent implements OnInit {

  maxDate: Date = new Date;
  selected: any;

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
    const date = new Date();
    const year = date.getFullYear();
    this.maxDate = new Date(year, 11, 31)
    
    this.auth.auth_guard();
  }
  
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
      if (view === 'month') {
      const year = cellDate.getFullYear();
      const month = cellDate.getUTCMonth();
      const day = cellDate.getDate();
  
        if(year === 2023)
        {
          if(month === 11)
          {
            if(day === 3)
            {
              return 'evento-day';
            }
          }
        }
        return '';
      }
      return '';
  };
}