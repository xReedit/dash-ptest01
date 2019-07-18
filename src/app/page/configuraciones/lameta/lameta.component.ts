import { Component, OnInit } from '@angular/core';
import { MetaModel } from 'src/app/model/meta.model';
import { CrudHttpService } from 'src/app/shared/crud-http.service';
import { ProgressLoadingService } from 'src/app/shared/services/progress-loading.service';

@Component({
  selector: 'app-lameta',
  templateUrl: './lameta.component.html',
  styleUrls: ['./lameta.component.css']
})
export class LametaComponent implements OnInit {

  meta: MetaModel = new MetaModel();

  constructor(private crudService: CrudHttpService
            , private progressBarLoading: ProgressLoadingService) { }

  ngOnInit() {
    this.meta.diaria = 0;
    this.meta.mensual = 0;
    this.meta.anual = 0;

    this.getData();
  }

  calcMeta() {
    this.meta.mensual = this.meta.diaria * 30;
    this.meta.anual = this.meta.mensual * 12;
  }

  guardar() {
    this.progressBarLoading.setLoading(true);
    this.crudService.postFree(this.meta, 'estadistica', 'setMetaSede').subscribe( res => {
      setTimeout(() => {
        this.progressBarLoading.setLoading(false);
      }, 1000);
    });
  }

  getData() {
    this.crudService.getAll('estadistica', 'getMetaSede', false, false).subscribe((res: any) => {
      console.log(res);
      if ( !res.success ) { console.log(res); return; }
      if ( res.data.length === 0 ) { return; }

      this.meta.diaria = res.data[0].diaria;
      this.meta.mensual = res.data[0].mensual;
      this.meta.anual = res.data[0].anual;
    });
  }

}
