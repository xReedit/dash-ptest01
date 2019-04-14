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

  total_venta_last_week_now = 0; // total de ventas de semana actual
  por_venta_now_vs_last_week = 0; // porcentaje ventas esta semana VS semana pasada

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
      'decimal': '.',
      'thousands': ',',
      'grouping': [3],
      'currency': ['S/', ''],
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


    this.xGenararGraficosGouje();

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
      const dateFormat = d3.timeFormat(dateFormatSpecifier);
      const dateFormat2 = d3.timeFormat(dateFormatSpecifier2);
      const dateFormat3 = d3.timeFormat(dateFormatSpecifier3);
      const dateFormatParser = d3.timeParse(dateFormatSpecifier);
      const dateFormatParserMMDD = d3.timeParse('%d/%m');
      const dateFormatParserMMYY = d3.timeParse('%m/%Y');
      const dateFormatParserWeek = d3.timeFormat('%V');
      const dateFormatParserNomDay = d3.timeFormat('%a');
      const numberFormat = d3.format('.2f');

      const _date = new Date();

      this.datos_ventas.map( d => {
        const fecha_hora = d.fecha.split(' ');
        const f_actual = dateFormatParser(d.f_actual);

        d.hora = fecha_hora[1].split(':')[0]; // solo hora
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

      // const meta diaria
      const meta_diaria = 2100;
      const meta_mensual = 50000;
      const meta_anual = 500000;

      // orden meta diaria
      function ordenbDDMeta (p: any) { return p.f; }

      // de los ultimos 7 dias // falta meta que debe ser mensual
      const dd_metadiaria = ddDimension.group().reduce(
        // add
        (p: any, v, nf) => {
          p.count += 1 ;
          p.xtotal += parseFloat(v.total);
          p.f = v.dd;
          p.descripcion = v.nom_dia;
          p.num_week = v.num_week;
          return p;
        },
        // remove
        (p: any, v, nf) => {
          p.count -= 1;
          p.xtotal -= parseFloat(v.total);
          p.f = v.dd;
          p.descripcion = v.nom_dia;
          p.num_week = v.num_week;
          return p;

        },
        // init
        () => {
          return { count: 0, xtotal: 0, f: '', descripcion: '', num_week: 0 };
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

      const data_last_sem = dd_metadiaria.filter((x: any) => x.value.num_week === numLastWeek);
      const _total_venta_last_week_now = data_last_sem.map(a => a.value.xtotal).reduce((a, b) => a + b);
      this.total_venta_last_week_now = this.format_money(Math.round(_total_venta_last_week_now));

      const numLastWeek2 = numLastWeek - 1 < 0 ? 0 : numLastWeek - 1;
      const data_last_sem_last = dd_metadiaria.filter((x: any) => x.value.num_week === numLastWeek);
      const _total_venta_last_now_last = data_last_sem_last.map(a => a.value.xtotal).reduce((a, b) => a + b);

      // calc => 500 / 800  => 0.62 * 100 => 62% - 100% = -37 (falta para llegar a las ventas de la semana pasada)
      this.por_venta_now_vs_last_week = Math.round(((_total_venta_last_week_now / _total_venta_last_now_last) * 100)) - 100;

      // this.prom_venta_last_week = this.format_money(Math.round(total_venta_last_week));
      // console.log(this.prom_venta_last_week);
      // const data_last_sem = dd_metadiaria.slice(0, 4).map((x: any ) => x);

      // grafico ultima semana
      const _columns_x = ('x' + ',' + data_last_sem.map((x: any) => dateFormat3(x.key)).join(',')).split(',');
      const _values_x = ('Semana Actual' + ',' + data_last_sem.map((x: any) => x.value.xtotal).join(',')).split(',');
      this.chart_last_sem.load({
        columns: [
          // ['x', data_last_sem.map((x: any) => x.key).join(',')],
          // ['Semana Actual', data_last_sem.map((x: any) => x.value.xtotal).join(',')]
          // ['x', '2019-04-08', '2019-04-09', '2019-04-10', '2019-04-11', '2019-04-12', '2019-04-13', '2019-04-14'],
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
          return p;
        },
        // remove
        (p: any, v) => {
          --p.count;
          p.xtotal -= parseFloat(v.total);
          p.f = v.mm;
          p.descripcion = v.nom_mes;
          return p;

        },
        // init
        () => {
          return { f: '', count: 0, xtotal: 0, descripcion: '' };
        }
      ).order(ordenMMMeta).top(12);

      console.log(dd_metaMensual);

      // grafico meta mensual
      dd_metaMensual.slice(0, 3).map((x: any) => {
        x.value.porcentaje = Math.round(((x.value.xtotal / meta_mensual) * 100)).toFixed(0);
        const dataAdd = [x.value.descripcion, x.value.porcentaje];
        this.chart_meta_mes.load({
          columns: [dataAdd]
        });
      });

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

      // grafico meta mensual
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

  xGenararGraficosGouje() {
    this.chart_meta_dia = this.plantillaGraficoGauge('chart_m_dia');
    this.chart_meta_mes = this.plantillaGraficoGauge('chart_m_mes');
    this.chart_meta_yy = this.plantillaGraficoGauge('chart_m_yy');
    this.chart_last_sem = this.plantillaGraficoLineYFalse('chart_last_sem', 'area-spline', '%a');
    this.chart_last_meses = this.plantillaGraficoLineYFalse('chart_last_meses', 'bar', '%b');
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
      }
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


}


