import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { COMING_SOON_BG } from '../constants/drive-image-urls'
@Component({
  selector: 'app-coming-soon',
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.scss']
})
export class ComingSoonComponent implements OnInit {
  public COMING_SOON_BG: string = COMING_SOON_BG
  private container: HTMLImageElement;
  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.container = this.el.nativeElement.querySelector(`.coming-soon-container`)
    this.renderer.setStyle(this.container, 'background-image', `url('${COMING_SOON_BG}')`)

  }

}
