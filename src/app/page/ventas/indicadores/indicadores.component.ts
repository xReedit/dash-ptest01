import { Component, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import * as cf from 'crossfilter2';
// import * as c3 from 'c3';
import { CrudHttpService } from 'src/app/shared/crud-http.service';
import { UtilesService } from 'src/app/shared/services/utiles.service';
import { PlantillaGraficosService } from 'src/app/shared/services/plantilla-graficos.service';
// import { TimeLocaleDefinition } from 'd3';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { D3FormatLocalService } from 'src/app/shared/services/d3-format-local.service';
import { ProgressLoadingService } from 'src/app/shared/services/progress-loading.service';
import { MetaModel } from 'src/app/model/meta.model';

@Component({
  selector: 'app-indicadores',
  templateUrl: './indicadores.component.html',
  styleUrls: ['./indicadores.component.css']
})
export class IndicadoresComponent implements OnInit {

  meta: MetaModel = new MetaModel();

  chart_meta_dia: any;
  chart_meta_mes: any;
  chart_meta_yy: any;
  chart_last_sem: any;
  chart_last_meses: any;
  chart_hora_punta: any;
  chart_clie_tpc: any;

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

  tasa_clientes_nuevos = 0;
  tasa_clientes_nuevos_count = 0;
  tasa_clientes_nuevos_signo = 0;
  tasa_clientes_nuevos_mes_anterior = 0;
  tasa_clientes_retencion = 0;
  tasa_clientes_retencion_count = 0;
  tasa_clientes_retencion_signo = 0;
  tasa_clientes_retencion_mes_anterior = 0;
  tasa_clientes_desercion = 0;
  tasa_clientes_desercion_count = 0;
  tasa_clientes_desercion_signo = false;
  tasa_clientes_desercion_mes_anterior = 0;
  tasa_clientes_tiket_promedio = 0;
  tasa_clientes_tiket_promedio_signo = 0;
  tasa_clientes_tiket_promedio_mes_anterior = 0;

  horas_punta = ''; // horas punta
  horas_libres = '';

  data_cliente_consumo: any = new MatTableDataSource(); // tabla consumo del cliente
  displayedColumns: string[] = ['Cliente', 'tp', 'Visitas', 'Frecuencia', 'Ultima Visita', 'Consumo Promedio', 'Consumo Total'];
  format_money: any;

  datos_ventas = [];
  fecha_actual = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;

  constructor(
    public crudService: CrudHttpService,
    public plantillaGraficos: PlantillaGraficosService,
    public utilesService: UtilesService,
    public d3FormatLocalService: D3FormatLocalService,
    private progressLoadingService: ProgressLoadingService
    ) { }

  ngOnInit() {
    this.progressLoadingService.setLoading(true);
    this.data_cliente_consumo.paginator = this.paginator;

    d3.timeFormatDefaultLocale(this.d3FormatLocalService.formatoLocal());
    this.format_money = d3.format('(,.2f');


    // this.xGetFechaActual();
    this.getDataMeta();

    // const _chart = c3.generate({
    //   bindto: '#chart',
    //   data: {
    //     x: 'x',
    //     //        xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
    //     columns: [
    //       ['x', '2019-04-08', '2019-04-09', '2019-04-10', '2019-04-11', '2019-04-12', '2019-04-13', '2019-04-14'],
    //       //            ['x', '20130101', '20130102', '20130103', '20130104', '20130105', '20130106'],
    //       ['Semana Pasada', 600, 224, 170, 400, 150, 250, 300],
    //       ['Semana Actual', 130, 100, 150, 500]
    //     ],
    //     type: 'area-spline'
    //   },
    //   grid: {
    //     y: {
    //       // show: true,
    //       // lines: [{ value: 320, class: 'grid800', text: 'META 320' }]
    //     }
    //   },
    //   axis: {
    //     x: {
    //       type: 'timeseries',
    //       tick: {
    //         format: '%a'
    //       }
    //     }
    //   }
    // });

    // chart.ygrid.add({ value: 0, class: 'grid800', text: 'META 320' });
    // _chart.ygrids.add({ value: 320, text: 'META DIARIA 320' });



  }

  getDataMeta() {
    this.crudService.getAll('estadistica', 'getMetaSede', false, false).subscribe((res: any) => {
      if (!res.success) { console.log(res); return; }
      if (res.data.length === 0) {
        this.meta.diaria = 0;
        this.meta.mensual = 0;
        this.meta.anual = 0;
        return;
      }

      this.meta.diaria = res.data[0].diaria;
      this.meta.mensual = res.data[0].mensual;
      this.meta.anual = res.data[0].anual;

      this.xGetFechaActual();
    });
  }

  /// function tasa de clientes segun perdiodo
  // tasa clientes nuevos, desercion, retencion tiket promedio
  xTasa_clientes(periodo: any, num_mes: number): any {
    const _arr_rpt: any = {};

    _arr_rpt._num_mes = num_mes;

    const _count_clientes = periodo.length;
    _arr_rpt._count_clie_periodo = _count_clientes;

    const _count_clie_new = periodo.filter((x: any) => x.value.num_mes_registro == num_mes).length;
    _arr_rpt._count_clie_new = _count_clie_new;

    // tasa de clientes nuevos
    const _tasa_clie_news = Math.round((_count_clie_new / _count_clientes) * 100);
    _arr_rpt._tasa_clie_news = _tasa_clie_news;


    // tasa de desercion
    const num_mes_anterior = num_mes - 1;
    const _count_desercion = periodo.filter((x: any) => parseFloat(x.value.num_mes_ultima_visita) <= num_mes_anterior).length;
    const _tasa__desercion = Math.round((_count_desercion / _count_clientes) * 100);

    // this.tasa_clientes_desercion = _tasa__desercion;
    _arr_rpt._tasa__desercion_count = _count_desercion;
    _arr_rpt._tasa__desercion = _tasa__desercion;
    // console.log('func_tasa de deserion ', _tasa__desercion);

    // tasa de retension
    const _tasa_retencion_count = periodo.filter((x: any) => x.value.num_mes_ultima_visita == num_mes && x.value.count > 1).length;
    // const _tasa_retencion_count = _count_clientes - _count_desercion;
    const _tasa_retencion = 100 - _tasa__desercion;
    _arr_rpt._tasa_retencion = _tasa_retencion;
    _arr_rpt._tasa_retencion_count = _tasa_retencion_count;
    // this.tasa_clientes_retencion = _tasa_retencion;
    // console.log('func_tasa de retencion', _tasa_retencion);

    // ticket promedio
    const _total_clie_consumo = periodo.filter((x: any) => x.value.num_mes_int == num_mes).map((x: any) => x.value.ticket_promedio).reduce((a: any, b: any) => a + b, 0);
    const _ticket_promedio_clie = Math.round((_total_clie_consumo / _count_clie_new));
    _arr_rpt._ticket_promedio_clie = this.format_money(_ticket_promedio_clie);
    // this.tasa_clientes_tiket_promedio = _ticket_promedio_clie;
    // console.log('func_ticket promedio ', _ticket_promedio_clie);

    return _arr_rpt;
  }

  xGetFechaActual() {
    this.crudService.getTimeNow().subscribe((res: any) => {
      this.fecha_actual = res.data.f_actual;
      this.xAsignarPlantillaGraficos();
      this.xGenerarGraficos();
    });
  }

  xGenerarGraficos() {
    this.crudService.getAll('estadistica', 'getVentas', false, false).subscribe((res: any) => {
      this.datos_ventas = this.d3FormatLocalService.setearDataTimeDimension(res.data, 'fecha', this.fecha_actual);
      console.log(this.datos_ventas);


      // preparamos fechas para las dimensiones
      const dateFormatSpecifier = '%d/%m/%Y';
      const dateFormatSpecifier3 = '%Y-%m-%d'; // para graficos

      const dateFormat3 = d3.timeFormat(dateFormatSpecifier3);
      const dateFormatParser = d3.timeParse(dateFormatSpecifier);
      const dateFormatParserNomDayLarge = d3.timeFormat('%A');
      const dateFormatParserNomMesLarge = d3.timeFormat('%B');
      const dateFormatParserNumMes = d3.timeFormat('%m');
      // const dateFormatParserHora24 = d3.timeFormat('%H');
      // const dateFormatParserHora12 = d3.timeFormat('%I %p');
      // const numberFormat = d3.format('.2f');


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

      // dimension cliente
      const clieDimension = cf_ventas.dimension(x => x.idcliente);

      // const meta diaria
      const meta_diaria = this.meta.diaria;
      const meta_mensual = this.meta.mensual;
      const meta_anual = this.meta.anual;

      // hora
      function ordenHoraPunta(p: any) { return p.hora24; }
      const hh_hora_punta = hhDimension.group().reduce(
        // add
        (p: any, v, nf) => {
          p.count += 1;
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
          return { count: 0, xtotal: 0, descripcion: '', hora24: 0 };
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
      function ordenbDDMeta(p: any) { return p.f; }

      // de los ultimos 7 dias // falta meta que debe ser mensual
      const dd_metadiaria = ddDimension.group().reduce(
        // add
        (p: any, v, nf) => {
          p.count += 1;
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
        if (index === 0) { numLastWeek = x.value.num_week; }
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
      const _data_venta_last_week_now: any = data_last_sem.reduce((a: any, b: any) => {
        a['total'] = a['total'] ? a['total'] : a.value.xtotal;
        a['total'] += b.value.xtotal;

        a['count'] = a['count'] ? a['count'] : a.value.count;
        a['count'] += b.value.count;
        return a;
      });

      _data_venta_last_week_now['total'] = _data_venta_last_week_now['total'] ? _data_venta_last_week_now['total'] : _data_venta_last_week_now.value.xtotal;
      _data_venta_last_week_now['count'] = _data_venta_last_week_now['count'] ? _data_venta_last_week_now['count'] : _data_venta_last_week_now.value.count;

      const _total_venta_last_week_now = _data_venta_last_week_now['total'];
      this.count_pedidos_last_week_now = _data_venta_last_week_now['count'];

      // semana previa (pasada)
      const numLastWeek2 = numLastWeek - 1 < 0 ? 0 : numLastWeek - 1;
      const data_last_sem_last = dd_metadiaria.filter((x: any) => x.value.num_week == numLastWeek2);
      const _data_venta_last_now_previus = data_last_sem_last.reduce((a: any, b: any) => {
        a['total'] = a['total'] ? a['total'] : a.value.xtotal;
        a['total'] += b.value.xtotal;

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
          p.num_mes_int = v.num_mes_int;
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
          p.num_mes_int = v.num_mes_int;
          p.paso_meta = p.xtotal > p.meta ? true : false;
          return p;

        },
        // init
        () => {
          return { f: '', count: 0, xtotal: 0, descripcion: '', num_mes: 0, num_mes_int: 0, meta: meta_mensual, paso_meta: false };
        }
      ).order(ordenMMMeta).top(12);

      console.log(dd_metaMensual);

      let NumLastMes = 0;
      // grafico meta mensual
      dd_metaMensual.slice(0, 3).map((x: any, index: number) => {
        if (index === 0) { NumLastMes = x.value.num_mes_int; }
        x.value.porcentaje = Math.round(((x.value.xtotal / meta_mensual) * 100)).toFixed(0);
        const dataAdd = [x.value.descripcion, x.value.porcentaje];
        this.chart_meta_mes.load({
          columns: [dataAdd]
        });
      });

      // NumLastMes = NumLastMes - 1;
      console.log('num ultimo mes', NumLastMes);

      // mes actual
      const data_last_mes: any = dd_metaMensual.filter((x: any) => x.value.num_mes_int == NumLastMes);

      // mes que mas se vendio
      const _mes_mas_venta = dd_metaMensual.map((x: any) => x).sort((a: any, b: any) => b.value.xtotal - a.value.xtotal)[0];
      this.mes_mas_venta = 'En ' + dateFormatParserNomMesLarge(_mes_mas_venta.value.f) + ' es el mes que más se vendio.';

      // meses que paso la meta
      const _meses_paso_meta_week = dd_metaMensual.filter((x: any) => x.value.paso_meta).map((x: any) => dateFormatParserNomMesLarge(x.value.f)).reverse().join(', ');
      this.mes_paso_meta_mes = _meses_paso_meta_week.length > 0 ? 'Los meses: ' + _meses_paso_meta_week + ' se paso la meta mensual.' : 'No hay mes que haya pasado la meta.';

      // totales meses
      const _total_venta_last_mes_now = data_last_mes[0].value.xtotal;
      this.count_pedidos_last_mes_now = data_last_mes[0].value.count;

      // mes previa (pasada)
      const NumLastMes2 = NumLastMes - 1 < 0 ? 0 : NumLastMes - 1;
      const data_last_mes_last: any = dd_metaMensual.filter((x: any) => x.value.num_mes_int == NumLastMes2);

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

      // dimension clientes
      const _data_cliente_consumo = clieDimension.group().reduce(
        // add
        (p: any, v, nf) => {
          p.count += 1;
          p.xtotal += parseFloat(v.total);
          p.nombres = v.nombres === '' || v.nombres === null ? 'PUBLICO EN GENERAL' : v.nombres;
          if (v.idcliente != 0) {
            p.calc_frecuencia = p.calc_fecha_frecuencia === 0 ? 0 : p.calc_frecuencia + d3.timeDay.count(v.dd, p.calc_fecha_frecuencia);
            p.f_ultima_visita = p.calc_fecha_frecuencia === 0 ? v.dd : p.f_ultima_visita;
            p.dias_ultima_visita = d3.timeDay.count(p.f_ultima_visita, v.f_actual);

            p.calc_fecha_frecuencia = v.dd;
            p.frecuencia_visitas = Math.round(p.calc_frecuencia / p.count);
            p.frecuencia_visitas = p.frecuencia_visitas === 0 ? 1 : p.frecuencia_visitas;
            p.ticket_promedio = Math.round(p.xtotal / p.count);
            p.f_nac = v.f_nac;

            p.num_mes_registro = dateFormatParserNumMes(dateFormatParser(v.f_registro.split(' ')[0]));
            p.num_mes_ultima_visita = dateFormatParserNumMes(p.f_ultima_visita);
            p.num_mes = v.num_mes;
            p.num_mes_int = v.num_mes_int;
          }
          p.tipo_cliente = v.ruc === '' || v.ruc === null ? 0 : v.ruc.length < 11 ? 1 : 2;  // 0 publico general 1 pn 2 pj

          switch (p.tipo_cliente) {
            case 0:
              p.tipo_cliente_des = 'PUBLICO EN GENERAL';
              p.tipo_cliente_abr = 'PG';
              break;
            case 1:
              p.tipo_cliente_des = 'PERSONA NATURAL';
              p.tipo_cliente_abr = 'PN';
              break;
            case 2:
              p.tipo_cliente_des = 'PERSONA JURIDICA';
              p.tipo_cliente_abr = 'PJ';
              break;
          }

          return p;
        },
        // remove
        (p: any, v, nf) => {
          p.count -= 1;
          p.xtotal -= parseFloat(v.total);
          p.nombres = v.nombres === '' || v.nombres === null ? 'PUBLICO EN GENERAL' : v.nombres;
          if (v.idcliente != 0) {
            p.calc_frecuencia = p.calc_fecha_frecuencia === 0 ? 0 : p.calc_frecuencia - d3.timeDay.count(v.dd, p.calc_fecha_frecuencia);
            p.f_ultima_visita = p.calc_fecha_frecuencia === 0 ? v.dd : p.f_ultima_visita;
            p.dias_ultima_visita = d3.timeDay.count(p.f_ultima_visita, v.f_actual);

            p.calc_fecha_frecuencia = v.dd;
            p.frecuencia_visitas = Math.round(p.calc_frecuencia / p.count);
            p.frecuencia_visitas = p.frecuencia_visitas === 0 ? 1 : p.frecuencia_visitas;
            p.ticket_promedio = Math.round(p.xtotal / p.count);
            p.f_nac = v.f_nac;

            p.num_mes_registro = dateFormatParserNumMes(dateFormatParser(v.f_registro));
            p.num_mes_ultima_visita = dateFormatParserNumMes(p.f_ultima_visita);
            p.num_mes = v.num_mes;
            p.num_mes_int = v.num_mes_int;
          }
          p.tipo_cliente = v.ruc === '' || v.ruc === null ? 0 : v.ruc.length < 11 ? 1 : 2;  // 0 publico general 1 pn 2 pj

          switch (p.tipo_cliente) {
            case 0:
              p.tipo_cliente_des = 'PUBLICO EN GENERAL';
              p.tipo_cliente_abr = 'PG';
              break;
            case 1:
              p.tipo_cliente_des = 'PERSONA NATURAL';
              p.tipo_cliente_abr = 'PN';
              break;
            case 2:
              p.tipo_cliente_des = 'PERSONA JURIDICA';
              p.tipo_cliente_abr = 'PJ';
              break;
          }

          return p;

        },
        // init
        () => {
          return {
            count: 0,
            xtotal: 0,
            nombres: '',
            calc_fecha_frecuencia: 0,
            calc_frecuencia: 0,
            frecuencia_visitas: 0,
            ticket_promedio: 0,
            f_ultima_visita: '',
            dias_ultima_visita: 0,
            f_nac: '',
            tipo_cliente: 0,
            tipo_cliente_des: '',
            tipo_cliente_abr: '',
            num_mes_registro: 0,
            num_mes_ultima_visita: 0,
            num_mes: 0,
            num_mes_int: 0
          };
        }
      ).all();

      this.data_cliente_consumo.data = _data_cliente_consumo.sort((a: any, b: any) => b.value.xtotal - a.value.xtotal);
      this.data_cliente_consumo.paginator = this.paginator;
      // this.data_cliente_consumo.sort = this.sort;
      console.log('dimension cliente ', this.data_cliente_consumo);

      // tipo de clientes donut
      const _data_clie_tpc = this.utilesService.ReduceGroupAndSum(_data_cliente_consumo.map(x => x.value), 'tipo_cliente_des'); // .map((x: any) => [x.tipo_cliente_des, x.count]);
      const _data_clie_tpc_val = {};
      const _data_clie_tpc_column = [];

      _data_clie_tpc.map((x: any) => {
        _data_clie_tpc_column.push(x.tipo_cliente_des);
        _data_clie_tpc_val[x.tipo_cliente_des] = x.count;
      });

      this.chart_clie_tpc.load({
        json: [_data_clie_tpc_val],
        keys: {
          value: _data_clie_tpc_column,
        },
      });

      console.log('tipo de cliente', _data_clie_tpc);

      // retencion de clientes

      // con cuantos clientes comienzo el periodo // o con cuantos clientes termine el anterior
      const _data_only_cliente = _data_cliente_consumo.filter((x: any) => x.key != 0);
      console.log('datos solo clientes ', _data_only_cliente);
      const _count_clientes = _data_only_cliente.length;
      const _last_registro: any = _data_only_cliente[_count_clientes - 1].value;
      // const _num_last_mes = _last_registro.num_mes_int;
      const _num_last_mes = NumLastMes;
      console.log('ultimo registro', _last_registro);

      const tasa_clientes_periodo_mes_anterior = _data_only_cliente.filter((x: any) => x.value.num_mes_int <= _num_last_mes - 1);
      const tasa_clientes_periodo_mes_actual = _data_only_cliente.filter((x: any) => x.value.num_mes_int <= _num_last_mes);
      console.log('mes actual: ', tasa_clientes_periodo_mes_actual);
      console.log('mes anterior: ', tasa_clientes_periodo_mes_anterior);

      const _data_tasa_cliente_mes_anterior = this.xTasa_clientes(tasa_clientes_periodo_mes_anterior, _num_last_mes - 1);
      const _data_tasa_cliente_mes_actual = this.xTasa_clientes(tasa_clientes_periodo_mes_actual, _num_last_mes);
      console.log('mes actual: ', _data_tasa_cliente_mes_actual);
      console.log('mes anterior: ', _data_tasa_cliente_mes_anterior);

      // ultimo mes
      // clientes nuevos
      this.tasa_clientes_nuevos = _data_tasa_cliente_mes_actual._tasa_clie_news;
      this.tasa_clientes_nuevos_mes_anterior = (this.tasa_clientes_nuevos - _data_tasa_cliente_mes_anterior._tasa_clie_news);
      this.tasa_clientes_nuevos_signo = this.tasa_clientes_nuevos_mes_anterior < 0 ? 1 : 0;
      this.tasa_clientes_nuevos_count = _data_tasa_cliente_mes_actual._count_clie_new;
      // tasa de desercion
      this.tasa_clientes_desercion = _data_tasa_cliente_mes_actual._tasa__desercion;
      this.tasa_clientes_desercion_mes_anterior = (this.tasa_clientes_desercion - _data_tasa_cliente_mes_anterior._tasa__desercion);
      this.tasa_clientes_desercion_count = _data_tasa_cliente_mes_actual._tasa__desercion_count;
      this.tasa_clientes_desercion_signo = this.tasa_clientes_desercion_mes_anterior < 0 ? true : false; // al reves mientras mas es menos

      console.log('count tasa desercion anterir actual ', this.tasa_clientes_desercion_mes_anterior);
      console.log('signo ', this.tasa_clientes_desercion_signo);

      // tasa de retension
      this.tasa_clientes_retencion = _data_tasa_cliente_mes_actual._tasa_retencion;
      this.tasa_clientes_retencion_mes_anterior = (_data_tasa_cliente_mes_actual._tasa_retencion_count - _data_tasa_cliente_mes_anterior._tasa_retencion_count);
      this.tasa_clientes_retencion_signo = this.tasa_clientes_retencion_mes_anterior < 0 ? 1 : 0;
      this.tasa_clientes_retencion_count = _data_tasa_cliente_mes_actual._tasa_retencion_count;

      // tiket promedio
      this.tasa_clientes_tiket_promedio = _data_tasa_cliente_mes_actual._ticket_promedio_clie;
      this.tasa_clientes_tiket_promedio_mes_anterior = (this.tasa_clientes_tiket_promedio - _data_tasa_cliente_mes_anterior._ticket_promedio_clie);
      this.tasa_clientes_tiket_promedio_signo = this.tasa_clientes_tiket_promedio_mes_anterior < 0 ? 1 : 0;
      this.tasa_clientes_tiket_promedio_mes_anterior = this.format_money(this.tasa_clientes_tiket_promedio_mes_anterior);


      this.progressLoadingService.setLoading(false);
    });
  }

  xAsignarPlantillaGraficos() {
    this.chart_meta_dia = this.plantillaGraficos.plantillaGraficoGauge('chart_m_dia');
    this.chart_meta_mes = this.plantillaGraficos.plantillaGraficoGauge('chart_m_mes');
    this.chart_meta_yy = this.plantillaGraficos.plantillaGraficoGauge('chart_m_yy');
    this.chart_last_sem = this.plantillaGraficos.plantillaGraficoLineYFalse('chart_last_sem', 'area-spline', '%a');
    this.chart_last_meses = this.plantillaGraficos.plantillaGraficoLineYFalse('chart_last_meses', 'bar', '%b');
    this.chart_hora_punta = this.plantillaGraficos.plantillaGraficoLineYFalsexFormat('chart_hora_punta', 'area-spline', '%I %p', '%H');

    this.chart_clie_tpc = this.plantillaGraficos.plantillaGraficoDonut('chart_clie_tpc', 'Tipo de clientes');
  }

}


