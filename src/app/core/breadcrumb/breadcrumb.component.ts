import { Component, OnInit } from '@angular/core';
import { ActivationEnd, NavigationEnd, Router } from '@angular/router';
import { filter, map, buffer, pluck } from 'rxjs/operators';

const isNavigationEnd = (ev: Event) => ev instanceof NavigationEnd;
const isActivationEnd = (ev: Event) => ev instanceof ActivationEnd;

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  bcLoadedData: any;
  bcForDisplay: any;
  bcTitulo: any;

  constructor(private router: Router) { }

  ngOnInit() {
    const navigationEnd$ = this.router.events.pipe(filter(isNavigationEnd));

    this.router.events
      .pipe(
        filter(isActivationEnd),
        pluck('snapshot'),
        pluck('data'),
        buffer(navigationEnd$),
        map((bcData: any[]) => bcData.reverse())
      )
      .subscribe((x: any) => {
        this.bcLoadedData = x[x.length - 1];
        this.bcTitulo = this.bcLoadedData.titulo;

        // this.bcForDisplay = this.bcLoadedData.reduce((rootAcc, rootElement) => {
        //   let breakIn = [];
        //   if (rootElement.breakIn) {
        //     breakIn = rootElement.breakIn.reduce(
        //       (acc, e) => [...acc, `break in ${e}'s home`],
        //       []
        //     );
        //   }
        //   return [...rootAcc, rootElement.bc, ...breakIn];
        // }, []);
      });
  }

}
