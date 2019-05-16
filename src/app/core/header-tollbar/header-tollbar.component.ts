import { Component, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-header-tollbar',
  templateUrl: './header-tollbar.component.html',
  styleUrls: ['./header-tollbar.component.css']
})
export class HeaderTollbarComponent implements OnInit {
  @Output('_click_btn_bar') _click_btn_bar: EventEmitter<boolean> = new EventEmitter(false);
  constructor() { }

  ngOnInit() {
  }

  showDrawer() {
    this._click_btn_bar.emit(true);
  }

}
