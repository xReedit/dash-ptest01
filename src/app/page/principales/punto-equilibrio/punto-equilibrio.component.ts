import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as cf from 'crossfilter2';

import { CrudHttpService } from 'src/app/shared/crud-http.service';
import { PlantillaGraficosService } from 'src/app/shared/services/plantilla-graficos.service';
import { D3FormatLocalService } from 'src/app/shared/services/d3-format-local.service';
import { ProgressLoadingService } from 'src/app/shared/services/progress-loading.service';
import { UtilesService } from 'src/app/shared/services/utiles.service';

@Component({
  selector: 'app-punto-equilibrio',
  templateUrl: './punto-equilibrio.component.html',
  styleUrls: ['./punto-equilibrio.component.css']
})
export class PuntoEquilibrioComponent implements OnInit {
  datos: any = [];
  chart_ingreso_egreso: any;
  format_money: any;
  fecha_actual = '';

  arrFiltroSelect = {
    mm: 7,
    yy: 2019
  };

  constructor(
    private crudService: CrudHttpService,
    public plantillaGraficos: PlantillaGraficosService,
    public d3FormatLocalService: D3FormatLocalService,
    private progressLoadingService: ProgressLoadingService,
    private utilesService: UtilesService
    ) { }

  ngOnInit() {
    this.progressLoadingService.setLoading(true);

    const arrFecha = {
      f1: '2019-07-01',
      f2: '2019-07-31'
    };

    this.crudService.postFree(arrFecha, 'estadistica', 'getIngresosGastos')
        .subscribe((res: any) => {
          if (!res.success) { console.log(res); return; }

          console.log(res);
          this.datos = res.data[0][0];

          this.xAsignarPlantillaGraficos();
          this.xGetFechaActual();
        });
  }

  xGetFechaActual() {
    this.crudService.getTimeNow().subscribe((res: any) => {
      this.fecha_actual = res.data.f_actual;
      this.cocinarData();
    });
  }

  cocinarData() {
    d3.timeFormatDefaultLocale(this.d3FormatLocalService.formatoLocal());
    this.format_money = d3.format('(,.2f');

    const dt_ventas_g_v = this.d3FormatLocalService.setearDataTimeDimension(this.datos.ventas_gastos_v, 'fecha_r', this.fecha_actual);
    console.log(dt_ventas_g_v);

    // formatos d3
    const dateFormatParserNumDia = d3.timeFormat('%d');
    const dateFormat3 = d3.timeFormat('%Y-%m-%d'); // para label x graficos

    // // convertir a crossfilter
    const cf_ventas = cf(dt_ventas_g_v);
    // dimension yy
    const yyDimension = cf_ventas.dimension((x: any) => x.yy);

    // dimension mm
    const mmDimension = cf_ventas.dimension((x: any) => x.mmyy);

    // dimension dd
    const ddDimension = cf_ventas.dimension((x: any) => x.dd);

    // dimension tipo [ingreso, gasto]
    const ddTipo = cf_ventas.dimension((x: any) => x.num_dia_yy + ' - ' + x.tipo);

    function ordenbDDMeta(p: any) { return p.key; }
    let impSumIngreso = 0;
    let impSumEgreso = 0;
    const dd_metadiaria = ddTipo.group().reduce(
      // add
      (p: any, v: any, nf) => {
        p.count += 1;
        p.isIngreso = v.tipo === '1' ? true : false;
        p.xtotal += parseFloat(v.importe);
        impSumIngreso += p.isIngreso ? p.xtotal : 0;
        impSumEgreso += !p.isIngreso ? p.xtotal : 0;
        p.impSumIngreso = impSumIngreso;
        p.impSumEgreso = impSumEgreso;
        p.f = v.dd;
        p.numdiaYY = parseInt(v.num_dia_yy, 0);
        return p;
      },
      // remove
      (p: any, v: any, nf) => {
        p.count -= 1;
        p.isIngreso = v.tipo === '1' ? true : false;
        p.xtotal -= parseFloat(v.importe);
        impSumIngreso -= p.isIngreso ? p.xtotal : 0;
        impSumEgreso -= !p.isIngreso ? p.xtotal : 0;
        p.impSumIngreso = impSumIngreso;
        p.impSumEgreso = impSumEgreso;
        p.f = v.dd;
        p.numdiaYY = parseInt(v.num_dia_yy, 0);
        return p;

      },
      // init
      () => {
        return { count: 0, f: '', numdiaYY: 0, isIngreso: false, xtotal: 0, impSumIngreso: 0, impSumEgreso: 0 };
      }
    ).all();

    console.log('dimension', dd_metadiaria);
    const mes_seleccionado = dd_metadiaria;

    // const mes_seleccionado = dd_metadiaria.filter((x: any) => x.value.nummes === this.arrFiltroSelect.mm).sort((x: any) => x.value.num_dia_compare);

    console.log('mes_seleccionado', mes_seleccionado);
    // grafico de ingresos y egresos
    // const numDaysMonth = this.utilesService.getDaysInMonth(this.arrFiltroSelect.mm, this.arrFiltroSelect.yy);
    // const arrNumDaysMonth = <any>this.utilesService.getArrDaysMonth(numDaysMonth);
    // const _columns_x = ('x' + ',' + arrNumDaysMonth.map((x: any) => dateFormatParserNumDia(x)).join(',')).split(',');

    /*const _columns_x = ('x' + ',' + arrDataMesSeleccionado.map((x: any) => dateFormat3(x.f)).join(',')).split(',');
    const _values_ingresos = ('Ingresos' + ',' + arrDataMesSeleccionado.map((x: any) => x.importeIngreso).join(',')).split(',');
    const _values_egresos = ('Egresos' + ',' + arrDataMesSeleccionado.map((x: any) => x.importeEgreso).join(',')).split(',');
*/

    const xs_ingresos = ('x_ingresos' + ',' + mes_seleccionado.filter((x: any) => x.value.isIngreso).map((x: any) => dateFormat3(x.value.f)).join(',')).split(',');
    const xs_egresos = ('x_egresos' + ',' + mes_seleccionado.filter((x: any) => !x.value.isIngreso).map((x: any) => dateFormat3(x.value.f)).join(',')).split(',');
    const _values_ingresos = ('Ingresos' + ',' + mes_seleccionado.filter((x: any) => x.value.isIngreso).map((x: any) => x.value.impSumIngreso).join(',')).split(',');
    const _values_egresos = ('Gastos Variables' + ',' + mes_seleccionado.filter((x: any) => !x.value.isIngreso).map((x: any) => x.value.impSumEgreso).join(',')).split(',');

    console.log('xs_ingresos', xs_ingresos);
    console.log('xs_egresos', xs_egresos);
    console.log('Ingresos', _values_ingresos);
    console.log('Gastos Variables', _values_egresos);

    this.chart_ingreso_egreso.load({
      xs: {
        'Ingresos': 'x_ingresos',
        'Gastos Variables': 'x_egresos'
      },
      columns: [
        xs_ingresos,
        xs_egresos,
        _values_ingresos,
        _values_egresos
        // _columns_x,
        // _values_ingresos,
        // _values_egresos
      ]
    });

    // cacular gastos totales = gf + gv
    const impGastoTotal = impSumEgreso + this.datos.gastos_fijos[0].importe + this.datos.rrhh[0].importe;
    this.chart_ingreso_egreso.ygrids.add({ value: impGastoTotal, text: 'Total de Gastos ' + this.format_money(impGastoTotal) });
    this.chart_ingreso_egreso.xgrids.add({ value: '2019-07-05', text: 'Punto de equilibrio ' });


    this.progressLoadingService.setLoading(false);
  }

  xAsignarPlantillaGraficos() {
    this.chart_ingreso_egreso = this.plantillaGraficos.plantillaGraficoMultiLineYFalse('chart_ingreso_egreso', 'area-spline', '%e', 200, true);
  }

}
