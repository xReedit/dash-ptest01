import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CrudHttpService } from 'src/app/shared/crud-http.service';

@Component({
  selector: 'app-comp-list-yy',
  templateUrl: './comp-list-yy.component.html',
  styleUrls: ['./comp-list-yy.component.css']
})
export class CompListYyComponent implements OnInit {

  @Output()
  getObject: EventEmitter<any> = new EventEmitter();

  public list: any[] = [];
  public selected: any;

  constructor(private crudService: CrudHttpService) { }

  ngOnInit() {
    this.loadYY();
  }

  loadYY(): void {
    // this.crudService.getAll('estadistica', 'getYYInicio', false, false, true).subscribe((res: any) => {
    //   this.list = <any[]>res.data;
    //   this.selected = this.list[0];
    //   this.getObject.emit(this.selected);
    // });
    this.list.push([2019]);
    this.selected = this.list[0];
    this.getObject.emit(this.selected);
  }

  _onSelectionChange(a) {
    this.getObject.emit(a.value);
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1 === o2;
  }

}
