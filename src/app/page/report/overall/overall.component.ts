import { Component, OnInit } from '@angular/core';
import { ServiceService } from '../../../service.service';

@Component({
  selector: 'app-overall',
  templateUrl: './overall.component.html',
  styleUrls: ['./overall.component.css']
})
export class OverallComponent implements OnInit {
  data_list: any;
  constructor(public service : ServiceService) {
    
    this.service.overall_report().then((res: any) => {this.data_list = res})

   }

  ngOnInit(): void {
  }

}
