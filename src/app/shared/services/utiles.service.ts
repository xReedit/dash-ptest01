import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UtilesService {

  constructor() { }

  getDateString(fecha: any): any {
    fecha = fecha === null ? new Date() : fecha;
    const today = fecha;
    const d = today;
    const m = today.getMonth() + 1;
    const mes = (m < 10) ? '0' + m : m;
    const yy = today.getFullYear();
    // const year = (yy < 1000) ? yy + 1900 : yy;

    // const sFecha = today.getDate() + '/' + mes + '/' + year;

    return [today.getDate(), mes, yy].join('/');

  }

  stringToDate(_date, _format, _delimiter) {
    const formatLowerCase = _format.toLowerCase();
    const formatItems = formatLowerCase.split(_delimiter);
    const dateItems = _date.split(_delimiter);
    const monthIndex = formatItems.indexOf('mm');
    const dayIndex = formatItems.indexOf('dd');
    const yearIndex = formatItems.indexOf('yyyy');
    let month = parseInt(dateItems[monthIndex], 2);
    month -= 1;
    const formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
    return formatedDate;
  }

  // cambia el formato de fecha me yyyy-mm-dd a dd/mm/yyyy
  cambiarFormatoFecha(input: string): string {
    const pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
    if (!input || !input.match(pattern)) {
      return null;
    }
    return input.replace(pattern, '$3/$2/$1');
  }

  // dias transcurridos de una fecha anterior a la fecha actual
  diasTrasncurridos(fecha: string): number {
    const fechaInicio = new Date(fecha).getTime();
    const fechaFin = new Date().getTime();

    const diff = fechaFin - fechaInicio;

    const dias = diff / (1000 * 60 * 60 * 24);
    return Math.round(dias - 1);
  }

  getNomMes(num_mes: number, nom_corto: boolean = true): string {
    const long_name = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const short_name = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return nom_corto ? short_name[num_mes] : long_name[num_mes];
  }

  getNomDia(num_dia: number, nom_corto: boolean = true): string {
    const long_name = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
    const short_name = ['Lun', 'Mar', 'Mier', 'Jue', 'Vie', 'Sab', 'Dom'];
    return nom_corto ? short_name[num_dia] : long_name[num_dia];
  }

  setearFormulario (form: FormGroup, data: any): FormGroup {
    Object.keys(data).forEach(name => {
      if (form.controls[name]) {
        form.controls[name].patchValue(data[name]);
      }
    });

    return form;
  }
}
