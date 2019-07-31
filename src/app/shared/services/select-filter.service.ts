import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { SelectFiltroModel } from 'src/app/model/select-filtro.model';

@Injectable({
  providedIn: 'root'
})
export class SelectFilterService {

  private arrFilterSelectSource = new BehaviorSubject<SelectFiltroModel>(new SelectFiltroModel());
  public arrFilterSelect$ = this.arrFilterSelectSource.asObservable();

  constructor() { }

  setFiltros(obj: SelectFiltroModel) {
    this.arrFilterSelectSource.next(obj);
  }

  getFiltros() {
    return this.arrFilterSelectSource.getValue();
  }
}
