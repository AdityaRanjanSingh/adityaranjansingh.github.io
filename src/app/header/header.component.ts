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
        path = 'projects';
        break;
      case Testimonial:
        path = 'testimonials';
        break;
      case Contact:
        path = 'contact';
        break;
    }
    this.router.navigate([path])

  }

}
