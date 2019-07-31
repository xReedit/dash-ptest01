import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SelectFiltroModel } from 'src/app/model/select-filtro.model';
import { SelectFilterService } from 'src/app/shared/services/select-filter.service';

@Component({
  selector: 'app-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.css']
})
export class SelectFilterComponent implements OnInit {

  @Output('_showDrawerFilter') _showDrawerFilter: EventEmitter<boolean> = new EventEmitter(false);

  filterSelect: SelectFiltroModel = new SelectFiltroModel();
  countDown = 0;

  constructor(private selectFilterService: SelectFilterService) { }

  ngOnInit() {
  }

  showDrawerFilter() {
    this._showDrawerFilter.emit(true);
  }

  _getObjectSede(event: any): void {
    this.filterSelect.sede = event;
    this.countDown ++;
    this.tiggerFilter();
  }

  _getObjectYY(event: any): void {
    this.filterSelect.yy = event;
    this.countDown++;
    this.tiggerFilter();
  }

  _getObjectMesDia(event: any): void {
    this.filterSelect.mes = event;
    this.countDown++;
    this.tiggerFilter();
  }

  tiggerFilter() {
    // if (this.countDown > 2 ) {
      this.setFiltros();
    // }
  }

  setFiltros() {
    this.selectFilterService.setFiltros(this.filterSelect);
  }

}
