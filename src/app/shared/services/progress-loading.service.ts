import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class ProgressLoadingService {
  private isSeeProgressBarSource = new BehaviorSubject<boolean>(false);
  public isSeeProgress$ = this.isSeeProgressBarSource.asObservable();

  constructor() { }

  setLoading(val: boolean) {
    this.isSeeProgressBarSource.next(val);
  }

  getLoading() {
    return this.isSeeProgressBarSource.getValue();
  }
}
