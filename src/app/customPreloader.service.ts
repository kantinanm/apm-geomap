import { Injectable } from "@angular/core";
import { PreloadingStrategy, Route } from "@angular/router";
import { Observable, timer, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: "root"
})
export class SelectivePreloadingStrategyService implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data['preload']) {
        //console.log('Preload Path: ' + route.path);
        var delay:number=route.data['delay'];
        console.log('preload called on '+route.path+' delay is '+delay);
        return timer(delay).pipe(
          mergeMap( _ => {
          console.log("Loading now "+ route.path);
          return load() ;
        }));

        //console.log('Preload Path: ' + route.path + ', delay:' + route.data['delay']);
        //if (route.data['delay']) {
        //  return timer(5000).pipe(mergeMap(() => load()));
        //}
      //return load();
    } else {
      return of(null);
    }
  }
}
