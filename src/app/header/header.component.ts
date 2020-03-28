import { Component, OnInit } from '@angular/core';
import { Home, Testimonial, Contact, Project } from '../../constants/app-routing-path';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  onNavTo(nav: string) {
    let path: string = ''
    switch (nav) {
      case Home:
        path = '/';
        break;
      case Project:
        path = 'comingsoon';
        break;
      case Testimonial:
        path = 'comingsoon';
        break;
      case Contact:
        path = 'comingsoon';
        break;
    }
    this.router.navigate([path])

  }

}
