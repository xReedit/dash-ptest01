import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as c3 from 'c3';
import * as cf from 'crossfilter2';
import { CrudHttpService } from 'src/app/shared/crud-http.service';
import { UtilesService } from 'src/app/shared/services/utiles.service';
import { TimeLocaleDefinition } from 'd3';

@Component({
  selector: 'app-indicadores',
  templateUrl: './indicadores.component.html',
  styleUrls: ['./indicadores.component.css']
})
export class IndicadoresComponent implements OnInit {

  chart_meta_dia: any;
  chart_meta_mes: any;
  chart_meta_yy: any;
  chart_last_sem: any;
  chart_last_meses: any;
  chart_hora_punta: any;

  total_venta_last_week_now = 0; // total de ventas de semana actual
  total_venta_last_week_previus = 0; // total de ventas de semana pasada
  count_pedidos_last_week_now = 0; // cantidad de pedidos
  por_signo_week_now = 0; // signo del porcentaje 0 = + 1 = -;
  por_venta_now_vs_previus_week = 0; // porcentaje ventas esta semana VS semana pasada
  dif_venta_now_vs_previus_week = 0; // diferencia ventas esta semana VS semana pasada
  dias_paso_meta_week = ''; // dias que se paso la meta
  dia_week_mas_venta = ''; // dia de la semana que mas se vendio

  total_venta_last_mes_now = 0; // total de ventas de semana actual
  total_venta_last_mes_previus = 0; // total de ventas de semana pasada
  count_pedidos_last_mes_now = 0; // cantidad de pedidos
  por_signo_mes_now = 0; // signo del porcentaje 0 = + 1 = -;
  por_venta_now_vs_previus_mes = 0; // porcentaje ventas esta semana VS semana pasada
  dif_venta_now_vs_previus_mes = 0; // diferencia ventas esta semana VS semana pasada
  mes_paso_meta_mes = ''; // meses que se paso la meta
  mes_mas_venta = ''; // mes que mas se vendio

  horas_punta = ''; // horas punta
  horas_libres = '';

  format_money: any;

  datos_ventas = [];
  constructor(public crudService: CrudHttpService, public utilesService: UtilesService) { }

  getNomDia(d) {
    return this.utilesService.getNomDia(d);
  }

  ngOnInit() {




    // const chart = c3.generate({
    //   bindto: '#chart',
    //   data: {
    //     columns: [
    //       ['data1', 30, 200, 100, 400, 150, 250],
    //       ['data2', 50, 20, 10, 40, 15, 25]
    //     ]
    //   }
    // });

    const es_ES: TimeLocaleDefinition = {
      'dateTime': '%A, %e de %B de %Y, %X',
      'date': '%d/%m/%Y',
      'time': '%H:%M:%S',
      'periods': ['AM', 'PM'],
      'days': ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
      'shortDays': ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
      'months': ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
      'shortMonths': ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
    };

    d3.timeFormatDefaultLocale(es_ES);
    this.format_money = d3.format('(,.2f');


    this.xGenararGraficos();

    const _chart = c3.generate({
      bindto: '#chart',
      data: {
        x: 'x',
        //        xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
        columns: [
          ['x', '2019-04-08', '2019-04-09', '2019-04-10', '2019-04-11', '2019-04-12', '2019-04-13', '2019-04-14'],
          //            ['x', '20130101', '20130102', '20130103', '20130104', '20130105', '20130106'],
          ['Semana Pasada', 600, 224, 170, 400, 150, 250, 300],
          ['Semana Actual', 130, 100, 150, 500]
        ],
        type: 'area-spline'
      },
      grid: {
        y: {
          // show: true,
          // lines: [{ value: 320, class: 'grid800', text: 'META 320' }]
        }
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: '%a'
          }
        }
      }
    });

    // chart.ygrid.add({ value: 0, class: 'grid800', text: 'META 320' });
    _chart.ygrids.add({ value: 320, text: 'META DIARIA 320' });

    this.crudService.getAll('estadistica', 'getVentas', false, false).subscribe((res: any) => {
      this.datos_ventas = res.data;
      console.log(this.datos_ventas);

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
      const numberFormat = d3.format('.2f');

      const _date = new Date();

      this.datos_ventas.map( d => {
        const fecha_hora = d.fecha.split(' ');
        const f_actual = dateFormatParser(d.f_actual);
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
        d.num_mes = parseFloat(d.dd.getMonth()) + 1;
        d.yy = d3.timeYear(d.dd).getFullYear();

        // dia actual
        d.dd_actual = d.dd === f_actual ? true : false;
        // semana actual
        // mes actual
        d.mm_actual = d.mm === f_actual.getMonth() ? true : false;
        // año actual
        d.yy_actual = d.yy === f_actual.getFullYear() ? true : false;
      });


      // // convertir a crossfilter
      const cf_ventas = cf(this.datos_ventas);
      const all = cf_ventas.groupAll();

      // dimension yy
      const yyDimension = cf_ventas.dimension(x => x.yy);

      // dimension mm
      const mmDimension = cf_ventas.dimension(x => x.mmyy);

      // dimension dd
      const ddDimension = cf_ventas.dimension(x => x.dd);

      // dimension hora
      const hhDimension = cf_ventas.dimension(x => x.hora24);

      // const meta diaria
      const meta_diaria = 2100;
      const meta_mensual = 50000;
      const meta_anual = 500000;

      // hora
      function ordenHoraPunta(p: any) { return p.hora24; }
      const hh_hora_punta = hhDimension.group().reduce(
        // add
        (p: any, v, nf) => {
          p.count += 1 ;
          p.xtotal += parseFloat(v.total);
          p.descripcion = v.hora12;
          p.hora24 = v.hora24;
          return p;
        },
        // remove
        (p: any, v, nf) => {
          p.count -= 1;
          p.xtotal -= parseFloat(v.total);
          p.descripcion = v.hora12;
          p.hora24 = v.hora24;
          return p;

        },
        // init
        () => {
          return { count: 0, xtotal: 0, descripcion: '', hora24: 0};
        }
      ).order(ordenHoraPunta).all();

      console.log('dimension hora', hh_hora_punta);

      // grafico hora punta
      const data_hh_punta = hh_hora_punta.filter((x: any) => x.value.count > 10);
      this.horas_punta = data_hh_punta.map(x => x).sort((a: any, b: any) => b.value.count - a.value.count).slice(0, 2).reverse().map((x: any) => x.value.descripcion).join(' - ');
      this.horas_libres = data_hh_punta.map(x => x).sort((a: any, b: any) => a.value.count - b.value.count).slice(0, 4).sort((a: any, b: any) => a.value.hora24 - b.value.hora24).map((x: any) => x.value.descripcion).join(' - ');

      const _columns_h = ('x' + ',' + data_hh_punta.map((x: any) => x.key).join(',')).split(',');
      const _values_h = ('Hora punta' + ',' + data_hh_punta.map((x: any) => x.value.count).join(',')).split(',');
      this.chart_hora_punta.load({
        columns: [
          _columns_h,
          _values_h
        ]
      });

      // orden meta diaria
      function ordenbDDMeta (p: any) { return p.f; }

      // de los ultimos 7 dias // falta meta que debe ser mensual
      const dd_metadiaria = ddDimension.group().reduce(
        // add
        (p: any, v, nf) => {
          p.count += 1 ;
          p.xtotal += parseFloat(v.total);
          p.paso_meta = p.xtotal > p.meta ? true : false;
          p.f = v.dd;
          p.descripcion = v.nom_dia;
          p.num_week = v.num_week;
          return p;
        },
        // remove
        (p: any, v, nf) => {
          p.count -= 1;
          p.xtotal -= parseFloat(v.total);
          p.paso_meta = p.xtotal > p.meta ? true : false;
          p.f = v.dd;
          p.descripcion = v.nom_dia;
          p.num_week = v.num_week;
          return p;

        },
        // init
        () => {
          return { count: 0, xtotal: 0, f: '', descripcion: '', num_week: 0, meta: meta_diaria, paso_meta: false, hora: '' };
        }
      ).order(ordenbDDMeta).top(20);

      let numLastWeek = 0;
      // grafico meta diaria
      dd_metadiaria.slice(0, 3).map((x: any, index: number) => {
        if ( index === 0 ) {numLastWeek = x.value.num_week; }
        x.value.porcentaje = Math.round(((x.value.xtotal / meta_diaria) * 100)).toFixed(0);
        const dataAdd = [x.value.descripcion, x.value.porcentaje];
        this.chart_meta_dia.load({
          columns: [dataAdd]
        });
      });

      console.log(dd_metadiaria);
      console.log('ultima semana: ', numLastWeek);

      // semana actual
      // numLastWeek = numLastWeek - 1;
      const data_last_sem = dd_metadiaria.filter((x: any) => x.value.num_week == numLastWeek);

      // dia que mas se vendio
      const _dd_mas_venta = data_last_sem.map((x: any) => x).sort((a: any, b: any) => b.value.xtotal - a.value.xtotal)[0];
      this.dia_week_mas_venta = 'El ' + dateFormatParserNomDayLarge(_dd_mas_venta.value.f) + ' es el día que más se vendio.';


      // dias que paso la meta
      const _dias_paso_meta_week = data_last_sem.filter((x: any) => x.value.paso_meta).map((x: any) => dateFormatParserNomDayLarge(x.value.f)).reverse().join(', ');
      this.dias_paso_meta_week = _dias_paso_meta_week.length > 0 ? 'Los dias ' + _dias_paso_meta_week + ' se paso la meta diaria.' : '';

      // totales
      const _data_venta_last_week_now = data_last_sem.reduce((a: any, b: any) => {
        a['total'] = a['total'] ? a['total'] : a.value.xtotal;
        a['total'] += b.value.xtotal;

        a['count'] = a['count'] ? a['count'] : a.value.count;
        a['count'] += b.value.count;
        return a;
      });

      const _total_venta_last_week_now = _data_venta_last_week_now['total'];
      this.count_pedidos_last_week_now = _data_venta_last_week_now['count'];

      // semana previa (pasada)
      const numLastWeek2 = numLastWeek - 1 < 0 ? 0 : numLastWeek - 1;
      const data_last_sem_last = dd_metadiaria.filter((x: any) => x.value.num_week == numLastWeek2);
      const _data_venta_last_now_previus = data_last_sem_last.reduce((a: any, b: any) => {
        a['total'] = a['total'] ? a['total'] : a.value.xtotal;
        a['total'] += b.value.xtotal ;

        a['count'] = a['count'] ? a['count'] : a.value.count;
        a['count'] += b.value.count;
        return a;
      });

      const _total_venta_last_week_previus = _data_venta_last_now_previus['total'];

      // calc => 500 / 800  => 0.62 * 100 => 62% - 100% = -37 (falta para llegar a las ventas de la semana pasada)
      this.total_venta_last_week_now = this.format_money(Math.round(_total_venta_last_week_now));
      this.total_venta_last_week_previus = this.format_money(Math.round(_total_venta_last_week_previus));
      this.por_venta_now_vs_previus_week = Math.round(((_total_venta_last_week_now / _total_venta_last_week_previus) * 100)) - 100;
      this.dif_venta_now_vs_previus_week = this.format_money(_total_venta_last_week_now - _total_venta_last_week_previus);
      this.por_signo_week_now = this.por_venta_now_vs_previus_week > 0 ? 0 : 1;

      // grafico ultima semana
      const _columns_x = ('x' + ',' + data_last_sem.map((x: any) => dateFormat3(x.key)).join(',')).split(',');
      const _values_x = ('Semana Actual' + ',' + data_last_sem.map((x: any) => x.value.xtotal).join(',')).split(',');
      this.chart_last_sem.load({
        columns: [
          _columns_x,
          _values_x
        ]
      });

      this.chart_last_sem.ygrids.add({ value: meta_diaria, text: 'META ' + meta_diaria });

      // meta mensual

      // orden meta mes
      function ordenMMMeta(p: any) { return p.f; }
      // de los ultimos 12 meses // falta meta que debe ser mensual
      const dd_metaMensual = mmDimension.group().reduce(
        // add
        (p: any, v) => {
          ++p.count;
          p.xtotal += parseFloat(v.total);
          p.f = v.mm;
          p.descripcion = v.nom_mes;
          p.num_mes = v.num_mes;
          p.paso_meta = p.xtotal > p.meta ? true : false;
          return p;
        },
        // remove
        (p: any, v) => {
          --p.count;
          p.xtotal -= parseFloat(v.total);
          p.f = v.mm;
          p.descripcion = v.nom_mes;
          p.num_mes = v.num_mes;
          p.paso_meta = p.xtotal > p.meta ? true : false;
          return p;

        },
        // init
        () => {
          return { f: '', count: 0, xtotal: 0, descripcion: '', num_mes: 0, meta: meta_mensual, paso_meta: false };
        }
      ).order(ordenMMMeta).top(12);

      console.log(dd_metaMensual);

      let NumLastMes = 0;
      // grafico meta mensual
      dd_metaMensual.slice(0, 3).map((x: any, index: number) => {
        if (index === 0) { NumLastMes = x.value.num_mes; }
        x.value.porcentaje = Math.round(((x.value.xtotal / meta_mensual) * 100)).toFixed(0);
        const dataAdd = [x.value.descripcion, x.value.porcentaje];
        this.chart_meta_mes.load({
          columns: [dataAdd]
        });
      });

      // mes actual
      const data_last_mes: any = dd_metaMensual.filter((x: any) => x.value.num_mes == NumLastMes);

      // mes que mas se vendio
      const _mes_mas_venta = data_last_mes.map((x: any) => x).sort((a: any, b: any) => b.value.xtotal - a.value.xtotal)[0];
      this.mes_mas_venta = 'En ' + dateFormatParserNomMesLarge(_mes_mas_venta.value.f) + ' es el mes que más se vendio.';

      // meses que paso la meta
      const _meses_paso_meta_week = data_last_mes.filter((x: any) => x.value.paso_meta).map((x: any) => dateFormatParserNomMesLarge(x.value.f)).reverse().join(', ');
      this.mes_paso_meta_mes = _meses_paso_meta_week.length > 0 ? 'Los meses: ' + _meses_paso_meta_week + ' se paso la meta mensual.' : 'No hay mes que haya pasado la meta.';

      // totales meses
      const _total_venta_last_mes_now = data_last_mes[0].value.xtotal;
      this.count_pedidos_last_mes_now = data_last_mes[0].value.count;

      // mes previa (pasada)
      const NumLastMes2 = NumLastMes - 1 < 0 ? 0 : NumLastMes - 1;
      const data_last_mes_last: any = dd_metaMensual.filter((x: any) => x.value.num_mes == NumLastMes2);

      const _total_venta_last_mes_previus = data_last_mes_last[0].value.xtotal;

      // calc => 500 / 800  => 0.62 * 100 => 62% - 100% = -37 (falta para llegar a las ventas de la semana pasada)
      this.total_venta_last_mes_now = this.format_money(Math.round(_total_venta_last_mes_now));
      this.total_venta_last_mes_previus = this.format_money(Math.round(_total_venta_last_mes_previus));
      this.por_venta_now_vs_previus_mes = Math.round(((_total_venta_last_mes_now / _total_venta_last_mes_previus) * 100)) - 100;
      this.dif_venta_now_vs_previus_mes = this.format_money(_total_venta_last_mes_now - _total_venta_last_mes_previus);
      this.por_signo_mes_now = this.por_venta_now_vs_previus_mes > 0 ? 0 : 1;


      // graficos ultimos meses
      const _columns_mm_x = ('x' + ',' + dd_metaMensual.map((x: any) => dateFormat3(x.key)).join(',')).split(',');
      const _values_mm_x = ('Meses' + ',' + dd_metaMensual.map((x: any) => x.value.xtotal).join(',')).split(',');
      this.chart_last_meses.load({
        columns: [
          // ['x', data_last_sem.map((x: any) => x.key).join(',')],
          // ['Semana Actual', data_last_sem.map((x: any) => x.value.xtotal).join(',')]
          // ['x', '2019-04-08', '2019-04-09', '2019-04-10', '2019-04-11', '2019-04-12', '2019-04-13', '2019-04-14'],
          _columns_mm_x,
          _values_mm_x
        ],
      });
      this.chart_last_meses.ygrids.add({ value: meta_mensual, text: 'META ' + meta_mensual });


      // de los ultimos 3 años // falta meta que debe ser mensual
      const dd_metaAnual = yyDimension.group().reduce(
        // add
        (p: any, v) => {
          ++p.count;
          p.xtotal += parseFloat(v.total);
          p.f = v.yy;
          p.descripcion = v.yy;
          return p;
        },
        // remove
        (p: any, v) => {
          --p.count;
          p.xtotal -= parseFloat(v.total);
          p.f = v.yy;
          p.descripcion = v.yy;
          return p;

        },
        // init
        () => {
          return { f: '', count: 0, xtotal: 0, descripcion: '' };
        }
      ).order(ordenMMMeta).top(3);

      console.log(dd_metaAnual);

      // grafico meta anual
      dd_metaAnual.map((x: any) => {
        x.value.porcentaje = Math.round(((x.value.xtotal / meta_anual) * 100)).toFixed(0);
        const dataAdd = [x.value.descripcion, x.value.porcentaje];
        this.chart_meta_yy.load({
          columns: [dataAdd]
        });
      });

      setTimeout(() => {
        this.chart_meta_yy.resize();
      }, 5);

    });

  }

  xGenararGraficos() {
    this.chart_meta_dia = this.plantillaGraficoGauge('chart_m_dia');
    this.chart_meta_mes = this.plantillaGraficoGauge('chart_m_mes');
    this.chart_meta_yy = this.plantillaGraficoGauge('chart_m_yy');
    this.chart_last_sem = this.plantillaGraficoLineYFalse('chart_last_sem', 'area-spline', '%a');
    this.chart_last_meses = this.plantillaGraficoLineYFalse('chart_last_meses', 'bar', '%b');
    this.chart_hora_punta = this.plantillaGraficoLineYFalsexFormat('chart_hora_punta', 'area-spline', '%I %p', '%H');
  }

  plantillaGraficoGauge(div: string) {
    return c3.generate({
      bindto: '#' + div,
      data: {
        columns: [],
        type: 'gauge'
      },
      transition: {
        duration: 700
      },
      gauge: {
        label: {
          format: function (value, ratio) {
            return value + '%';
          },
          show: true // to turn off the min/max labels.
        },
        min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
        max: 100, // 100 is default
        //  units: ' %',
        width: 39 // for adjusting arc thickness
      },
      color: {
        pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044', '#2196f3'], // the three color levels for the percentage values.
        threshold: {
          //            unit: 'value', // percentage is default
          //            max: 200, // 100 is default
          values: [30, 60, 90, 100, 101]
        }
      }
    });
  }

  plantillaGraficoLineYFalse(div: string, _type: string = 'area-spline', _format: string = '%a') {

    return c3.generate({
      bindto: '#' + div,
      size: {
        height: 125,
      },
      data: {
        x: 'x',
        // columns: [
        //   ['x', '2019-04-08', '2019-04-09', '2019-04-10', '2019-04-11', '2019-04-12', '2019-04-13', '2019-04-14'],
        //   ['Semana Pasada', 30, 280, 170, 400, 150, 250, 300],
        //   ['Semana Actual', 130, 100, 150, 500]
        // ],
        columns: [],
        type: _type
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: _format
          }
        },
        y: {
            show: false
        }
      },
      legend: {
        show: false
      }
    });

  }

  plantillaGraficoLineYFalsexFormat(div: string, _type: string = 'area-spline', _format: string = '%a', _xformat: string = '') {

    return c3.generate({
      bindto: '#' + div,
      size: {
        height: 125,
      },
      data: {
        x: 'x',
        xFormat: _xformat,
        columns: [],
        type: _type
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: _format
          }
        },
        y: {
            show: false
        }
      },
      legend: {
        show: false
      }
    });
  }

}


