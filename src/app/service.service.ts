import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(
    private http: HttpClient
  ) { }
  
  async osm_data() {
    return new Promise((res, rej) => {
      this.http.get('http://localhost:8080/medcare_api/req_data.php?type=get_osm')
        .subscribe((data: any) => {
          res(data)
        }, (err: any) => {
          rej(err)
        });
    });
  }

  async osm_count() {
    return new Promise((res, rej) => {
      this.http.get('http://localhost:8080/medcare_api/req_data.php?type=osm_count_prov')
        .subscribe((data: any) => {
          res(data)
        }, (err: any) => {
          rej(err)
        });
    });
  }

  async list_province() {
    return new Promise((res, rej) => {
      this.http.get('http://localhost:8080/medcare_api/req_data.php?type=list_province')
        .subscribe((data: any) => {
          res(data)
        }, (err: any) => {
          rej(err)
        });
    });
  }


  async count_prov_q(data:any) {
    console.log(data);
    return new Promise((res, rej) => {
      this.http.post('http://localhost:8080/medcare_api/req_data.php?type=count_prov_q', JSON.stringify(data))
        .subscribe((data: any) => {
          res(data)
        }, (err: any) => {
          rej(err)
        });
    });
  }

}
