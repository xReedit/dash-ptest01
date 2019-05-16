import { Injectable } from '@angular/core';
import { TimeLocaleDefinition } from 'd3-time-format';
import * as d3 from 'd3';
import { UtilesService } from './utiles.service';

@Injectable({
  providedIn: 'root'
})
export class D3FormatLocalService {

  format_money: any = d3.format('(,.2f');

  constructor(public utilesService: UtilesService) { }

  formatoLocal(): TimeLocaleDefinition {
    return {
      'dateTime': '%A, %e de %B de %Y, %X',
      'date': '%d/%m/%Y',
      'time': '%H:%M:%S',
      'periods': ['AM', 'PM'],
      'days': ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      'shortDays': ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      'months': ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      'shortMonths': ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
    };
  }

  formatMoney(value: number): any {
    return this.format_money(value);
  }

  setearDataTimeDimension(data: any, nom_campo: string, fecha_actual: string): any {
    // preparamos fechas para las dimensiones
    const dateFormatSpecifier = '%d/%m/%Y';
    const dateFormatSpecifier2 = '%m-%d-%Y';
    const dateFormatSpecifier3 = '%Y-%m-%d'; // para graficos
    const dateFormatSpecifierHora = '%d/%m/%Y %H:%M:%S'; // hora
    // const dateFormatSpecifierHora24 = '%H:%M:%S'; // hora
    const dateFormat = d3.timeFormat(dateFormatSpecifier);
    const dateFormat2 = d3.timeFormat(dateFormatSpecifier2);
    const dateFormat3 = d3.timeFormat(dateFormatSpecifier3);
    const dateFormatParser = d3.timeParse(dateFormatSpecifier);
    const dateFormatParserHora = d3.timeParse(dateFormatSpecifierHora);
    const dateFormatParserMMDD = d3.timeParse('%d/%m');
    const dateFormatParserMMYY = d3.timeParse('%m/%Y');
    const dateFormatParserWeek = d3.timeFormat('%V');
    const dateFormatParserNomDay = d3.timeFormat('%a');
    const dateFormatParserNomDayLarge = d3.timeFormat('%A');
    const dateFormatParserNomMesLarge = d3.timeFormat('%B');
    const dateFormatParserHora24 = d3.timeFormat('%H');
    const dateFormatParserHora12 = d3.timeFormat('%I %p');
    const dateFormatParserNumMes = d3.timeFormat('%m');

    return data.map((d: any) => {
      const fecha_hora = d[nom_campo].split(' ');
      const f_actual = dateFormatParser(fecha_actual);

      const fecha_hora_12 = fecha_hora[0] + ' ' + fecha_hora[1].split(':')[0] + ':00:00';
      const solo_hora_24 = '01/01/2019' + ' ' + fecha_hora[1].split(':')[0] + ':00:00';

      d.ddd = dateFormatParserHora(fecha_hora_12); // fecha con hora
      d.hora_solo = dateFormatParserHora(solo_hora_24); // solo hora
      d.hora = fecha_hora[1]; // solo hora
      d.hora24 = dateFormatParserHora24(d.ddd);
      d.hora12 = dateFormatParserHora12(d.ddd);
      d.dd = dateFormatParser(fecha_hora[0]);
      d.nom_dia = dateFormatParserNomDay(d.dd);
      d.num_dia = d.dd.getDate();
      d.dd2 = dateFormat2(d.dd);
      d.num_week = dateFormatParserWeek(d.dd);
      d.dd3 = dateFormat3(d.dd);
      d.mm = d3.timeMonth(d.dd);
      d.ddmm = d.num_dia + '/' + (parseFloat(d.dd.getMonth()) + 1);
      d.ddmm = dateFormatParserMMDD(d.ddmm);
      d.mmyy = dateFormatParserMMYY(d.dd.getMonth() + 1 + '/' + d.dd.getFullYear());
      d.mes_yy = this.utilesService.getNomMes(d.dd.getMonth()) + '-' + d.dd.getFullYear().toString().slice(-2);
      d.nom_mes = this.utilesService.getNomMes(d.dd.getMonth());
      // d.num_mes = parseFloat(d.dd.getMonth()) + 1;
      d.num_mes = dateFormatParserNumMes(d.dd);
      d.num_mes_int = d.dd.getMonth() + 1;
      d.yy = d3.timeYear(d.dd).getFullYear();

      d.f_actual = f_actual; // fecha actaul
      // dia actual
      d.dd_actual = d.dd === f_actual ? true : false;
      // semana actual
      // mes actual
      d.mm_actual = d.mm === f_actual.getMonth() ? true : false;
      // año actual
      d.yy_actual = d.yy === f_actual.getFullYear() ? true : false;

      return d;
    });
  }
}
