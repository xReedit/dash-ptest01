import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as c3 from 'c3';
import * as cf from 'crossfilter2';
import { CrudHttpService } from 'src/app/shared/crud-http.service';
import { UtilesService } from 'src/app/shared/services/utiles.service';

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
  
  datos_ventas = [];
  constructor(public crudService: CrudHttpService, public utilesService: UtilesService) { }

  getNomDia(d) {
    return this.utilesService.getNomDia(d);
  }

  ngOnInit() {

    this.xGenararGraficosGouje();
    

    // const chart = c3.generate({
    //   bindto: '#chart',
    //   data: {
    //     columns: [
    //       ['data1', 30, 200, 100, 400, 150, 250],
    //       ['data2', 50, 20, 10, 40, 15, 25]
    //     ]
    //   }
    // });

    const es_ES = {
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



    const _chart = c3.generate({
      bindto: '#chart',
      data: {
        x: 'x',
        //        xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
        columns: [
          ['x', '2019-04-08', '2019-04-09', '2019-04-10', '2019-04-11', '2019-04-12', '2019-04-13', '2019-04-14'],
          //            ['x', '20130101', '20130102', '20130103', '20130104', '20130105', '20130106'],
          ['Semana Pasada', 30, 280, 170, 400, 150, 250, 300],
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
      const dateFormat = d3.timeFormat(dateFormatSpecifier);
      const dateFormat2 = d3.timeFormat(dateFormatSpecifier2);
      const dateFormatParser = d3.timeParse(dateFormatSpecifier);
      const dateFormatParserMMDD = d3.timeParse('%d/%m');
      const dateFormatParserMMYY = d3.timeParse('%m/%Y');
      const dateFormatParserWeek = d3.timeFormat('%U');
      const numberFormat = d3.format('.2f');

      const _date = new Date();

      this.datos_ventas.map( d => {
        const fecha_hora = d.fecha.split(' ');
        const f_actual = dateFormatParser(d.f_actual);

        d.hora = fecha_hora[1].split(':')[0]; // solo hora
        d.dd = dateFormatParser(fecha_hora[0]);
        d.nom_dia = this.utilesService.getNomDia(d.dd.getDay());
        d.num_dia = d.dd.getDate();
        d.dd2 = dateFormat2(d.dd);
        d.num_week = dateFormatParserWeek(d.dd);
        d.ddmm = dateFormatParserMMDD((d.dd.getDate()) + '/' + d.dd.getMonth() + 1);
        d.mm = d3.timeMonth(d.dd);
        d.mmyy = dateFormatParserMMYY(d.dd.getMonth() + 1 + '/' + d.dd.getFullYear());
        d.mes_yy = this.utilesService.getNomMes(d.dd.getMonth()) + '-' + d.dd.getFullYear().toString().slice(-2);
        d.nom_mes = this.utilesService.getNomMes(d.dd.getMonth());
        d.yy = d3.timeYear(d.dd).getFullYear();

        // dia actual
        d.dd_actual = d.dd === f_actual ? true : false;
        // semana actual
        // d.week_actual = 
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
      const meta_diaria = 320;

      // orden meta diaria
      function ordenbDDMeta (p: any) { return p.f; }
      // de los ultimos 7 dias // falta meta que debe ser mensual
      const dd_metadiaria = ddDimension.group().reduce(
        // add
        function (p: any, v) {
          ++p.count;
          p.xtotal += parseFloat(v.total);
          p.f = v.dd;
          p.descripcion = v.nom_dia;
          return p;
        },
        // remove
        function (p: any, v) {
          --p.count;
          p.xtotal -= parseFloat(v.total);
          p.f = v.dd;
          p.descripcion = v.nom_dia;
          return p;

        },
        // init
        function () {
          return { f: '', count: 0, xtotal: 0, descripcion: '' };
        }
      ).order(ordenbDDMeta).top(7);

      let numLastWeek = 0;
      // grafico meta diaria
      dd_metadiaria.slice(0, 3).map((x: any, index: number) => {
        if ( index === 0 ) {numLastWeek = x.value.num_week; }
        x.value.porcentaje = Math.round(((x.value.xtotal / 320) * 100)).toFixed(0);
        const dataAdd = [x.value.descripcion, x.value.porcentaje];
        this.chart_meta_dia.load({
          columns: [dataAdd]
        });
      });


      const data_last_sem = dd_metadiaria.filter((x: any) => x.value.num_week === numLastWeek).map( (x: any) => {
        return { 'date': x.key, 'value': x.value.xtotal };
      });

      // grafico ultima semana
      this.chart_last_sem.load({
        json: [data_last_sem],
        keys: {
          x: 'date',
          value: ['value'],
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
      // META diaria
      this.chart_last_sem.ygrids.add({ value: 320, text: 'META DIARIA 320' });

      setTimeout(() => {
        this.chart_last_sem.flow();
      }, 100);

      console.log(dd_metadiaria);

      // meta mensual

      // orden meta mes
      function ordenMMMeta(p: any) { return p.f; }
      // de los ultimos 12 meses // falta meta que debe ser mensual
      const dd_metaMensual = mmDimension.group().reduce(
        // add
        function (p: any, v) {
          ++p.count;
          p.xtotal += parseFloat(v.total);
          p.f = v.mm;
          p.descripcion = v.nom_mes;
          return p;
        },
        // remove
        function (p: any, v) {
          --p.count;
          p.xtotal -= parseFloat(v.total);
          p.f = v.mm;
          p.descripcion = v.nom_mes;
          return p;

        },
        // init
        function () {
          return { f: '', count: 0, xtotal: 0, descripcion: '' };
        }
      ).order(ordenMMMeta).top(12);

      console.log(dd_metaMensual);

      // grafico meta mensual
      dd_metaMensual.slice(0, 3).map((x: any) => {
        x.value.porcentaje = Math.round(((x.value.xtotal / 3000) * 100)).toFixed(0);
        const dataAdd = [x.value.descripcion, x.value.porcentaje];
        this.chart_meta_mes.load({
          columns: [dataAdd]
        });
      });

      // de los ultimos 3 años // falta meta que debe ser mensual
      const dd_metaAnual = yyDimension.group().reduce(
        // add
        function (p: any, v) {
          ++p.count;
          p.xtotal += parseFloat(v.total);
          p.f = v.yy;
          p.descripcion = v.yy;
          return p;
        },
        // remove
        function (p: any, v) {
          --p.count;
          p.xtotal -= parseFloat(v.total);
          p.f = v.yy;
          p.descripcion = v.yy;
          return p;

        },
        // init
        function () {
          return { f: '', count: 0, xtotal: 0, descripcion: '' };
        }
      ).order(ordenMMMeta).top(3);

      console.log(dd_metaAnual);

      // grafico meta mensual
      dd_metaAnual.map((x: any) => {
        x.value.porcentaje = Math.round(((x.value.xtotal / 4000) * 100)).toFixed(0);
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
    this.chart_last_sem = this.plantillaGraficoLine('chart_last_sem');
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

  plantillaGraficoLine(div: string) {
    return c3.generate({
      bindto: '#' + div,
      data: {
        x: 'x',
        // columns: [
        //   ['x', '2019-04-08', '2019-04-09', '2019-04-10', '2019-04-11', '2019-04-12', '2019-04-13', '2019-04-14'],
        //   ['Semana Pasada', 30, 280, 170, 400, 150, 250, 300],
        //   ['Semana Actual', 130, 100, 150, 500]
        // ],
        json: [],
        // keys: {
        //   x: 'date',
        //   value: ['value'],
        // },
        type: 'area-spline'
      },
      grid: {
        y: {
          // lines: [{ value: 0, class: 'grid800', text: 'META 320' }]
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
  }


}


