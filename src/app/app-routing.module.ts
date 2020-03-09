import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../app/home/home.component';
import { ContactmeComponent } from '../app/contactme/contactme.component';
import { TestimonialsComponent } from '../app/testimonials/testimonials.component';
import { ContactModule } from '../app/contactme/contactme.module'
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'contact', component: ContactmeComponent },
  { path: 'testimonials', component: TestimonialsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), ContactModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
