import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
// import * as d3Tip from 'd3-tip';
// import { tip } from 'd3-tip';
// import d3Tip from 'd3-tip';
import * as c3 from 'c3';
import * as cf from 'crossfilter2';
import * as dc from 'dc';

import { CrudHttpService } from 'src/app/shared/crud-http.service';
import { PlantillaGraficosService } from 'src/app/shared/services/plantilla-graficos.service';
import { UtilesService } from 'src/app/shared/services/utiles.service';
import { D3FormatLocalService } from 'src/app/shared/services/d3-format-local.service';
import { MetaModel } from 'src/app/model/meta.model';

@Component({
  selector: 'app-consumo',
  templateUrl: './consumo.component.html',
  styleUrls: ['./consumo.component.css']
})
export class ConsumoComponent implements OnInit {
  meta: MetaModel = new MetaModel();
  datos_consumo: any;
  fecha_actual = '';

  chart_consumo_mm: any;
  chart_consumo_dd: any;
  // chart_composite: any;

  constructor(
    public crudService: CrudHttpService,
    public plantillaGraficos: PlantillaGraficosService,
    public utilesService: UtilesService,
    public d3FormatLocalService: D3FormatLocalService) { }

  ngOnInit() {
    // d3.tip();
    // console.log(tip);

    d3.timeFormatDefaultLocale(this.d3FormatLocalService.formatoLocal());
    this.getDataMeta();
    window.addEventListener('resize', this.resize.bind(this));
    // this.xDc();
  }

  getDataMeta() {
    this.crudService.getAll('estadistica', 'getMetaSede', false, false).subscribe((res: any) => {
      if ( !res.success ) { console.log(res); return; }
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

  private resize() {
    dc.renderAll();
  }

  xDc() {

    const yearRingChart = dc.pieChart('#chart-consumo'),
      spenderRowChart = dc.rowChart('#chart-row-spenders');


    // const tooltip = d3.select('body').append('div')
    //   .attr('class', 'tooltip')
    //   .style('opacity', 0);

    const data1 = [
      { Name: 'Mr A', Spent: 40, Year: 2011 },
      { Name: 'Mr B', Spent: 10, Year: 2011 },
      { Name: 'Mr C', Spent: 40, Year: 2011 },
      { Name: 'Mr A', Spent: 70, Year: 2012 },
      { Name: 'Mr B', Spent: 20, Year: 2012 },
      { Name: 'Mr B', Spent: 50, Year: 2013 },
      { Name: 'Mr C', Spent: 30, Year: 2013 }
    ];
    const data2 = [
      { Name: 'Mr A', Spent: 10, Year: 2011 },
      { Name: 'Mr B', Spent: 20, Year: 2011 },
      { Name: 'Mr C', Spent: 50, Year: 2011 },
      { Name: 'Mr A', Spent: 20, Year: 2012 },
      { Name: 'Mr B', Spent: 40, Year: 2012 },
      { Name: 'Mr B', Spent: 50, Year: 2013 },
      { Name: 'Mr C', Spent: 50, Year: 2013 }
    ];

    // set crossfilter with first dataset
    const ndx = cf(data1),
      yearDim = ndx.dimension(function (d) { return +d.Year; }),
      spendDim = ndx.dimension(function (d) { return Math.floor(d.Spent / 10); }),
      nameDim = ndx.dimension(function (d) { return d.Name; }),
      spendPerYear = yearDim.group().reduceSum(function (d) { return +d.Spent; }),
      spendPerName = nameDim.group().reduceSum(function (d) { return +d.Spent; }),
      spendHist = spendDim.group().reduceCount();


    yearRingChart
      .width(200).height(200)
      .slicesCap(4)
      .externalLabels(50)
      .dimension(yearDim)
      .group(spendPerYear)
      .legend(dc.legend())
      .minAngleForLabel(0)
      .drawPaths(true)
      .externalRadiusPadding(50)
      .externalLabels(40)
      .on('pretransition', function(chart) {
          chart.selectAll('.dc-legend-item text')
              .text('')
            .append('tspan')
              .text(function(d) { return d.name; })
            .append('tspan')
              .attr('x', 100)
              .attr('text-anchor', 'end')
              .text(function(d) { return d.data; });
      });


    spenderRowChart
      .width(250).height(200)
      .dimension(nameDim)
      .group(spendPerName)
      .elasticX(true)
      .renderLabel(true);
    dc.renderAll();
  }

  xGetFechaActual() {
    this.crudService.getTimeNow().subscribe((res: any) => {
      this.fecha_actual = res.data.f_actual;
      // this.xAsignarPlantillaGraficos();
      this.xGenerarGraficos();
    });
  }

  xGenerarGraficos() {
    this.crudService.getAll('estadistica', 'getConsumo', false, false).subscribe((res: any) => {
      this.datos_consumo = this.d3FormatLocalService.setearDataTimeDimension(res.data, 'fecha_hora_a', this.fecha_actual);

      console.log('datos consumo', this.datos_consumo);

      const dateFormatSpecifier = '%d/%m/%Y';
      const dateFormatSpecifier3 = '%Y-%m-%d'; // para graficos

      const dateFormat3 = d3.timeFormat(dateFormatSpecifier3);
      const dateFormatParser = d3.timeParse(dateFormatSpecifier);
      const dateFormatParserNomDayLarge = d3.timeFormat('%A');
      const dateFormatParserNomMesLarge = d3.timeFormat('%B');
      // const dateFormatParserHora24 = d3.timeFormat('%H');
      // const dateFormatParserHora12 = d3.timeFormat('%I %p');
      const dateFormatParserNumMes = d3.timeFormat('%m');

      // // convertir a crossfilter
      const cf_ventas = cf(this.datos_consumo);
      const all = cf_ventas.groupAll();

      // dimension yy
      const yyDimension = cf_ventas.dimension((x: any) => x.yy);

      // dimension mm
      const mmDimension: any = cf_ventas.dimension((x: any) => x.mm);

      // dimension dd
      const ddDimension = cf_ventas.dimension((x: any) => x.dd);

      // dimension dd semana
      const ddWeekDimension = cf_ventas.dimension((x: any) => x.num_dia_semana);

      // dimension hora
      const hhDimension = cf_ventas.dimension((x: any) => x.hora24);


      // function ordenDia(p: any) { return p.f; }
      // // consumo por dia
      // let dd_consumoDias = ddWeekDimension.group().reduce(
      //   // add
      //   (p: any, v: any) => {
      //     ++p.count;
      //     p.xtotal += parseFloat(v.total_a);
      //     p.f = v.dd;
      //     p.descripcion = v.nom_dia;
      //     p.num_dia_semana = v.num_dia_semana;
      //     return p;
      //   },
      //   // remove
      //   (p: any, v: any) => {
      //     --p.count;
      //     p.xtotal -= parseFloat(v.total_a);
      //     p.f = v.dd;
      //     p.descripcion = v.nom_dia;
      //     p.num_dia_semana = v.num_dia_semana;
      //     return p;

      //   },
      //   // init
      //   () => {
      //     return { f: '', count: 0, xtotal: 0, descripcion: '' };
      //   }
      // ).order(ordenDia).top(7);

      // dd_consumoDias = dd_consumoDias.sort();
      // console.log('consumno por dia ', dd_consumoDias);

      // const _columns_dd_x = ('x' + ',' + dd_consumoDias.map((x: any) => dateFormat3(x.value.f)).join(',')).split(',');
      // const _values_dd_x = ('Dias' + ',' + dd_consumoDias.map((x: any) => x.value.xtotal).join(',')).split(',');
      // this.chart_consumo_dd.load({
      //   columns: [
      //     _columns_dd_x,
      //     _values_dd_x
      //   ],
      // });


      // de los ultimos 12 meses // falta meta que debe ser mensual
      // function ordenMMMeta(p: any) { return p.f; }
      // const dd_metaMensual = mmDimension.group().reduce(
      //   // add
      //   (p: any, v: any) => {
      //     ++p.count;
      //     p.xtotal += parseFloat(v.total_a);
      //     p.f = v.mm;
      //     p.descripcion = v.nom_mes;
      //     p.num_mes = v.num_mes;
      //     p.num_mes_int = v.num_mes_int;
      //     return p;
      //   },
      //   // remove
      //   (p: any, v: any) => {
      //     --p.count;
      //     p.xtotal -= parseFloat(v.total_a);
      //     p.f = v.mm;
      //     p.descripcion = v.nom_mes;
      //     p.num_mes = v.num_mes;
      //     p.num_mes_int = v.num_mes_int;
      //     return p;

      //   },
      //   // init
      //   () => {
      //     return { f: '', count: 0, xtotal: 0, descripcion: '', num_mes_int: 0 };
      //   }
      // );
      // .order(ordenMMMeta).top(12);
      // console.log('consumo meses', dd_metaMensual);




      const xdateFormatParserNomMesLarge = d3.timeFormat('%B');
      const xformat_money: any = d3.format('(,.2f');

      // const mm_values = mmDimension.group().reduceSum((d: any) => +d.total_a);
      // const minDate = new Date(mmDimension.bottom(1)[0].mm);
      // const maxDate = new Date(mmDimension.top(1)[0].mm);

      // const chart = dc.barChart('#chart-row-spenders');
      // chart
      //   .width(500)
      //   .height(200)
      //   // .x(d3.scaleBand())
      //   .x(d3.scaleTime().domain([minDate.setMonth(minDate.getMonth() - 2), maxDate.setMonth(maxDate.getMonth() + 2)]))
      //   .round(d3.timeMonth.round)
      //   .xUnits(d3.timeMonths)
      //   // .xUnits(dc.units.ordinal)
      //   .elasticY(true)
      //   .brushOn(true)
      //   .mouseZoomable(true)
      //   .dimension(mmDimension)
      //   .group(mm_values)
      //   .centerBar(true)
      //   // .renderHorizontalGridLines(true)
      //   // .on('renderlet', function (a) {
      //   //   a.selectAll('rect').on('click', function (d) {
      //   //     console.log('click!', d);
      //   // })
      //   // .renderLabel(true)
      //   // .label(d => xformat_money(d.value))
      //   .controlsUseVisibility(true)
      //   // .addFilterHandler(function (filters, filter) { return [filter]; })
      //   .title(d => xdateFormatParserNomMesLarge(d.key) + ': ' + xformat_money(d.value));
        // .x(d3.scaleBand()).elasticX(true)
        // .xUnits(dc.units.ordinal)
        // .xUnits(d3.timeMonths)
        // .brushOn(true)
        // .yAxisLabel('This is the Y Axis!')
        // .label((d: any) =>  d.value );
        // .centerBar(true)
        // .round(d3.timeMonth.round);
        // .colors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
        // .colorDomain([-1750, 1644]);
        // .ticks(5)
        // .tickFormat(d3.format(',.0f'));
        // .tickFormat(xdateFormatParserNomMesLarge)
        // .ticks(d3.timeMonths, 1);
        // .controlsUseVisibility(true);

      // chart compuesto
      const minDate = new Date(mmDimension.bottom(1)[0].mm);
      const maxDate = new Date(mmDimension.top(1)[0].mm);
      const composite = dc.compositeChart('#chart_consumo_mm_y_rentabilidad');
      const grp1 = mmDimension.group().reduceCount((d: any) => d.idpedido);
      const grp2 = mmDimension.group().reduceSum((d: any) => +d.total_a);

      // const margins = { top: 10, right: 30, bottom: 30, left: 50 };
      composite
        .x(d3.scaleTime().domain([minDate.setMonth(minDate.getMonth() - 2), maxDate.setMonth(maxDate.getMonth() + 2)]))
        .round(d3.timeMonth.round)
        .xUnits(d3.timeMonths)
        .legend(dc.legend().x(80).y(20).itemHeight(13).gap(5))
        .renderHorizontalGridLines(true)
        .title((d: any) => xdateFormatParserNomMesLarge(d.key) + ': ' + xformat_money(d.value))
        .yAxisPadding('10%')
        .compose([
          dc.barChart(composite)
            .dimension(mmDimension)
            // .colors('blue')
            .group(grp2, 'Importe consumidos')
            .renderLabel(true)
            // .addFilterHandler(function (filters, filter) { return [filter]; })
            .centerBar(true),
          dc.lineChart(composite)
            .dimension(mmDimension)
            .colors('red')
            .group(grp1, 'Cantidad productos consumidos')
            .dashStyle([5, 3])
            .renderDataPoints({ radius: 5 })
        ])
        .elasticY(true)
        // .margins(margins)
        .brushOn(false);
        composite.margins().left = 50;
        // .mouseZoomable(true)
        // .controlsUseVisibility(true);
        // render();

      const chart_consumo_dd = dc.barChart('#chart_consumo_mm_y_rentabilidad_dd');
      const chart_dia_consumo_group = ddDimension.group().reduceSum((d: any) => +d.total_a);
      // const minDate_dd = new Date(ddDimension.bottom(1)[0].dd);
      // const maxDate_dd = new Date(ddDimension.top(1)[0].dd);

      chart_consumo_dd
        .height(200)
        .x(d3.scaleTime().domain([minDate.setDate(minDate.getDay() - 2), maxDate.setDate(maxDate.getDay() + 2)]))
        .round(d3.timeDay.round)
        .xUnits(d3.timeDays)
        .title((d: any) => dateFormatParserNomDayLarge(d.key) + ': ' + xformat_money(d.value))
        .yAxisPadding('10%')
        .elasticY(true)
        .brushOn(false)
        .mouseZoomable(true)
        .dimension(ddDimension)
        .group(chart_dia_consumo_group)
        .centerBar(true)
        .controlsUseVisibility(true);


      // tipo de consumo
      const chartConsumo = dc.pieChart('#chart_tipo_consumo');
      const tpcDimension = cf_ventas.dimension((x: any) => x.tpc_descripcion);
      const tpcGroup = tpcDimension.group().reduceSum((d: any) => +d.total_a);

      chartConsumo
        .height(200)
        .slicesCap(4)
        .dimension(tpcDimension)
        .group(tpcGroup)
        .minAngleForLabel(0)
        .drawPaths(true)
        .externalRadiusPadding(50)
        .externalLabels(40);


      // dia de mas ConsumoComponent
      // const chart_dia_consumo = dc.compositeChart('#chart_dia_consumo');
      // const chart_dia_consumo_count = ddDimension.group().reduceCount();
      // const chart_dia_consumo_importe = ddDimension.group().reduceSum((d: any) => +d.total_a);

      // console.log('chart_dia_consumo_count ', ddDimension);

      dc.renderAll();

      });

      // const _columns_mm_x = ('x' + ',' + dd_metaMensual.map((x: any) => dateFormat3(x.key)).join(',')).split(',');
      // const _values_mm_x = ('Meses' + ',' + dd_metaMensual.map((x: any) => x.value.xtotal).join(',')).split(',');
      // this.chart_consumo_mm.load({
      //   columns: [
      //     _columns_mm_x,
      //     _values_mm_x
      //   ],
      // });
    // });

    // tipo de consumo

  }

  xAsignarPlantillaGraficos() {
    this.chart_consumo_mm = this.plantillaGraficos.plantillaGraficoLineYFalse('chart_consumo_mm', 'bar', '%b');
    this.chart_consumo_dd = this.plantillaGraficos.plantillaGraficoLineYFalse('chart_consumo_dd', 'bar', '%a');
  }

}
