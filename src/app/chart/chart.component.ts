import { Input } from '@angular/core';
import {OnInit, Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {

  constructor(public modalController: ModalController) { }

  @Input() countryData: any;

  dismiss(){
    this.modalController.dismiss({
      dismissed: true
    });
  }


  ngOnInit() {}

  }