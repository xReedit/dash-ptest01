import { Component, OnInit, ViewChild, HostListener, ElementRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ProgressLoadingService } from 'src/app/shared/services/progress-loading.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { delay } from 'rxjs/internal/operators/delay';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit, OnDestroy {

  showFiller = false;
  isScreenAll = true; // si screen > 990
  isLoading = false;
  mode = 'side';

  private isProgreesBar: Subscription = null;

  @ViewChild('drawer') drawer: MatDrawer;

  @ViewChild('container') container: HTMLElement;

  constructor(public progressLoadingService: ProgressLoadingService) { }

  ngOnInit() {
    this.drawer.toggle();
    if (window.innerWidth < 990) {
      this.meSizeScreen();
    } else {
      this.maSizeScreen();
    }

    this.isProgreesBar = this.progressLoadingService.isSeeProgress$
    .subscribe((res) => {
      this.isLoading = res;
    });
  }

  ngOnDestroy() {
    this.isProgreesBar.unsubscribe();
  }

  showDrawer(): void {
    this.mode = this.isScreenAll ? 'side' : 'over';
    this.drawer.toggle();
  }

  private meSizeScreen(): void {
    this.isScreenAll = false;
    this.mode = 'over';
    this.drawer.close();
  }

  private maSizeScreen(): void {
    this.isScreenAll = true;
    this.mode = 'side';
    this.drawer.open();
  }

  @HostListener('window:resize', ['$event'])
    onResize(event) {
        if (event.target.innerWidth < 990) {
          this.meSizeScreen();
        } else {
          this.maSizeScreen();
        }
    }

}
