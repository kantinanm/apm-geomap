import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ServiceService } from '../../../service.service';

@Component({
  selector: 'app-overall-province',
  templateUrl: './overall-province.component.html',
  styleUrls: ['./overall-province.component.css']
})
export class OverallProvinceComponent implements OnInit {
  data_list: any;
  @Input() public province_name: string='';
  @Input() public province_id: string;
  @Output() public clicked = new EventEmitter<void>();

  constructor(public service : ServiceService) { 
    this.service.province_overall_report({prov_id: 65 }).then((res: any) => {this.data_list = res})
  }

  ngOnInit(): void {
  }

  handelClick(){
    this.clicked.emit();
  }

}
