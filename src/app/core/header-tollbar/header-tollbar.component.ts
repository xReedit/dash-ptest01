import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header-tollbar',
  templateUrl: './header-tollbar.component.html',
  styleUrls: ['./header-tollbar.component.css']
})
export class HeaderTollbarComponent implements OnInit {
  @Output('_click_btn_bar') _click_btn_bar: EventEmitter<boolean> = new EventEmitter(false);
  @Output('_showDrawerFilter') _showDrawerFilter: EventEmitter<boolean> = new EventEmitter(false);
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  showDrawer() {
    this._click_btn_bar.emit(true);
  }

  showDrawerFilter() {
    this._showDrawerFilter.emit(true);
  }

  exitProgram() {
    this.authService.loggedOutUser();
    this.router.navigate(['/session/login']);
  }

}
