import { Component, OnInit } from '@angular/core';
import { CrudHttpService } from 'src/app/shared/crud-http.service';
import { PlantillaGraficosService } from 'src/app/shared/services/plantilla-graficos.service';
import { UtilesService } from 'src/app/shared/services/utiles.service';
import { D3FormatLocalService } from 'src/app/shared/services/d3-format-local.service';
import * as d3 from 'd3';
import * as cf from 'crossfilter2';

@Component({
  selector: 'app-consumo',
  templateUrl: './consumo.component.html',
  styleUrls: ['./consumo.component.css']
})
export class ConsumoComponent implements OnInit {
  datos_consumo: any;
  fecha_actual = '';
  constructor(
    public crudService: CrudHttpService,
    public plantillaGraficos: PlantillaGraficosService,
    public utilesService: UtilesService,
    public d3FormatLocalService: D3FormatLocalService) { }

  ngOnInit() {
    d3.timeFormatDefaultLocale(this.d3FormatLocalService.formatoLocal());
    this.xGetFechaActual();
  }

  xGetFechaActual() {
    this.crudService.getTimeNow().subscribe((res: any) => {
      this.fecha_actual = res.data.f_actual;
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
      const mmDimension = cf_ventas.dimension((x: any) => x.mmyy);

      // dimension dd
      const ddDimension = cf_ventas.dimension((x: any) => x.dd);

      // dimension hora
      const hhDimension = cf_ventas.dimension((x: any) => x.hora24);

      // de los ultimos 12 meses // falta meta que debe ser mensual
      const dd_metaMensual = mmDimension.group().reduce(
        // add
        (p: any, v: any) => {
          ++p.count;
          p.xtotal += parseFloat(v.total_a);
          p.f = v.mm;
          p.idpedido = v.idpedido;
          p.descripcion = v.nom_mes;
          p.num_mes = v.num_mes;
          p.num_mes_int = v.num_mes_int;
          return p;
        },
        // remove
        (p: any, v: any) => {
          --p.count;
          p.xtotal -= parseFloat(v.total_a);
          p.f = v.mm;
          p.idpedido = v.idpedido;
          p.descripcion = v.nom_mes;
          p.num_mes = v.num_mes;
          p.num_mes_int = v.num_mes_int;
          return p;

        },
        // init
        () => {
          return { f: '', count: 0, xtotal: 0, descripcion: '', total: 0, num_mes_int: 0, idpedido: 0 };
        }
      ).top(12);

      console.log('consumo meses', dd_metaMensual);

    });
  }

}
