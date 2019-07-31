import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SelectMesModel } from 'src/app/model/select-mes-model';

@Component({
  selector: 'app-comp-select-mes-dia',
  templateUrl: './comp-select-mes-dia.component.html',
  styleUrls: ['./comp-select-mes-dia.component.css']
})
export class CompSelectMesDiaComponent implements OnInit {
  @Input()
  yy: number;
  @Output()
  getObject: EventEmitter<SelectMesModel> = new EventEmitter();

  public list_mes = <SelectMesModel[]>[
    {'id': 0,  'descripcion': 'Enero', 'desde': '', 'hasta': ''},
    { 'id': 1, 'descripcion': 'Febrero' , 'desde': '', 'hasta': ''},
    { 'id': 2, 'descripcion': 'Marzo' , 'desde': '', 'hasta': ''},
    { 'id': 3, 'descripcion': 'Abril' , 'desde': '', 'hasta': ''},
    { 'id': 4, 'descripcion': 'Mayo' , 'desde': '', 'hasta': ''},
    { 'id': 5, 'descripcion': 'Junio' , 'desde': '', 'hasta': ''},
    { 'id': 6, 'descripcion': 'Julio' , 'desde': '', 'hasta': ''},
    { 'id': 7, 'descripcion': 'Agosto' , 'desde': '', 'hasta': ''},
    { 'id': 8, 'descripcion': 'Setiembre' , 'desde': '', 'hasta': ''},
    { 'id': 9, 'descripcion': 'Octubre' , 'desde': '', 'hasta': ''},
    { 'id': 10, 'descripcion': 'Noviembre' , 'desde': '', 'hasta': ''},
    { 'id': 11, 'descripcion': 'Diciembre', 'desde': '', 'hasta': '' }
  ];

  public selected_mes: SelectMesModel;
  constructor() { }

  ngOnInit() {
    console.log(this.list_mes);
    const mesNow = new Date().getMonth();
    this.selected_mes = <SelectMesModel>this.list_mes[mesNow];
    this.setDesde();

    console.log('this.selected_mes', this.selected_mes);
    this.getObject.emit(this.selected_mes);
  }

  setDesde() {
    const numMes = ('00' + (this.selected_mes.id + 1)).slice(-2);
    this.selected_mes.desde = `${this.yy}-${numMes}-01`;
  }

  _onSelectionChange(a: any) {
    this.setDesde();
    this.getObject.emit(a.value);
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1 === o2 && o1.id === o2.id;
  }

}
