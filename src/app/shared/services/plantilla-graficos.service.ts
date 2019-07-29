import { Injectable } from '@angular/core';
import * as c3 from 'c3';

@Injectable({
  providedIn: 'root'
})
export class PlantillaGraficosService {

  constructor() { }

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
        // xs: {},
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

  // multiples Label X (multiple data)
  plantillaGraficoMultiLineYFalse(div: string, _type: string = 'area-spline', _format: string = '%a', _height: number = 125, _showLegend = false, _showRotuloX = true, _showRotuloY = false) {

    return c3.generate({
      bindto: '#' + div,
      size: {
        height: _height,
      },
      data: {
        xs: {},
        columns: [],
        type: _type
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: _format
          },
          show: _showRotuloX
        },
        y: {
          show: _showRotuloY
        }
      },
      legend: {
        show: _showLegend
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

  plantillaGraficoDonut(div: string, _title: string = '') {
    return c3.generate({
      bindto: '#' + div,
      // size: {
      //   height: 125,
      // },
      data: {
        json: [],
        type: 'donut',
      },
      donut: {
        // title: _title
      }
    });
  }
}
