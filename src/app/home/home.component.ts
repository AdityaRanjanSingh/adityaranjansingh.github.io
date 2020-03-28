import { Component, OnInit } from '@angular/core';
import data from '../../assets/data/home-page.json'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public data: any = data;
  constructor() {

  }


  ngOnInit() {
  }

}
