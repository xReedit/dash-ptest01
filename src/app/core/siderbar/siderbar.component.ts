import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-siderbar',
  templateUrl: './siderbar.component.html',
  styleUrls: ['./siderbar.component.css']
})
export class SiderbarComponent implements OnInit {

  constructor(public router: Router, route: ActivatedRoute) { }

  ngOnInit() {
  }

  toggle(el: ElementRef) {
    el.nativeElement.toggle();
  }

  irVentasClientes() {
    this.router.navigate(['/clientes-consumo']);
  }

}
