import { Component, OnInit, ElementRef, HostListener, ViewChild, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDrawer } from '@angular/material';

@Component({
  selector: 'app-siderbar',
  templateUrl: './siderbar.component.html',
  styleUrls: ['./siderbar.component.css']
})
export class SiderbarComponent implements OnInit {

  @Output('clickItemMenu') clickItemMenu: EventEmitter<boolean> = new EventEmitter(false);

  constructor(public router: Router, route: ActivatedRoute) { }

  ngOnInit() {
  }

  toggle(el: ElementRef) {
    el.nativeElement.toggle();
  }

  irVentasClientes() {
    this.router.navigate(['/clientes-consumo']);
  }

  showClick() {
    this.clickItemMenu.emit(true);
  }


}
