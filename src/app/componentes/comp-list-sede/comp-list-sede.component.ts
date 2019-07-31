import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { CrudHttpService } from 'src/app/shared/crud-http.service';
import { SedeModel } from 'src/app/model/sede.model';

@Component({
  selector: 'app-comp-list-sede',
  templateUrl: './comp-list-sede.component.html',
  styleUrls: ['./comp-list-sede.component.css']
})
export class CompListSedeComponent implements OnInit {
  @Output()
  getObject: EventEmitter<SedeModel> = new EventEmitter();

  public listSede: SedeModel[] = [];
  public selected: SedeModel;

  constructor(private crudService: CrudHttpService) { }

  ngOnInit() {
    this.loadSedes();
  }

  loadSedes(): void {
    this.crudService.getAll('estadistica', 'getSedes', false, false, true).subscribe((res: any) => {
      this.listSede = <SedeModel[]>res.data;
      this.selected = this.listSede[0];
      this.getObject.emit(this.selected);
    });
  }

  _onSelectionChange(a) {
    this.getObject.emit(a.value);
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1 === o2 && o1.idsede === o2.idsede;
  }

}
