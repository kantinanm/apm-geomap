import { Component, OnInit,AfterViewInit } from '@angular/core';
import { BackendApiService } from './services/backend-api.service';
import * as L from 'Leaflet';
import 'leaflet.markercluster';
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit,AfterViewInit {
  province_list: any;

  private map: any;
  basemap:any;
  basemap2:any;

  layer:any;
  layer2:any;

  googleStreets:any;
  googleHybrid:any;
  googleSat:any;
  googleTerrain:any;

  icon1: any;
  markersGroup: any;

 
  layerGroup: any;
  lay_province: any;

  constructor(public service : BackendApiService) { 
    this.service.list_province().then((res: any) => {
      this.province_list = res
    })
  }

  ngOnInit(): void {
    $.noConflict();
  }

  ngAfterViewInit(): void {
    this.Showmap();
  }

  Showmap(){

    this.map = L.map('map',{attributionControl:false,center:[16.741808, 100.197029],zoom:6,maxZoom:21,zoomControl:false})

    this.googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
      maxZoom: 22,
      subdomains:['mt0','mt1','mt2','mt3']
    });

    this.googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
        maxZoom: 22,
        subdomains:['mt0','mt1','mt2','mt3']
    });

    this.googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
        maxZoom: 22,
        subdomains:['mt0','mt1','mt2','mt3']
    });

    this.googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
        maxZoom: 22,
        subdomains:['mt0','mt1','mt2','mt3']
    }).addTo(this.map);
   
    //L.marker([16.741808, 100.197029]).addTo(this.map);
    this.layerGroup = L.layerGroup().addTo(this.map);
    //this.markersGroup = L.markerClusterGroup().addTo(this.map);
    this.markersGroup = L.markerClusterGroup();

    this.icon1 = new L.Icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/1476/1476753.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 35],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    this.service.osm_data().then((res: any) => {
      console.log(res);
      res.forEach(e => {
        L.marker([e.latitude, e.longitude], {icon: this.icon1}).addTo(this.markersGroup)
        .bindPopup("<h4>รายละเอียด</h4><b>ชื่อ - สกุล : </b>" + e.pname + e.fname + "  " + e.lname + "<br><b>วันที่สำรวจ : </b>" + e.date_ + "<br><b>เวลาที่สำรวจ : </b>" + e.time_ + " น.<br><br>");
      });
      
    })


    function getColor(d:any) {
      return d > 1000 ? '#39004d' :
          d > 500 ? '#730099' :
              d > 200 ? '#9900cc' :
                  d > 100 ? '#cc33ff' :
                      d > 50 ? '#d966ff' :
                          d > 10 ? '#e699ff' :
                              d > 0 ? '#f2ccff' : //#ff0040
                                  '#FFFFFF00';
    }

  
  function onEachFeature(feature:any, layer:any) {

    var popupContent = "<p>จังหวัด <b>" +
        feature.properties.pv_tn + "</b></br> มีการสำรวจทั้งหมด " +
        feature.properties.val + " จุด</br>";

    if (feature.properties && feature.properties.popupContent) {
        popupContent += feature.properties.popupContent;
    }
    layer.bindPopup(popupContent);
  };

  function style(feature:any) {
      return {
          weight: 2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.7,
          fillColor: getColor(feature.properties.val)
      };
  }

  this.service.osm_count().then((res: any) => {
    console.log(res);
     L.geoJSON(res,{
       style:style,
       onEachFeature:onEachFeature,
      }).addTo(this.layerGroup);
    // }).addTo(this.map);
  });


    this.layer=L.marker([16.741808, 100.197029], {icon: this.icon1})
    .bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup().addTo(this.map);

    var baseMaps = {
      "Hybrid": this.googleHybrid,
      "Streets": this.googleStreets,
      "Sat": this.googleSat,
      "Terrain": this.googleTerrain,
    };
  
    var overlayMaps = {
        "ตำแหน่งจุดสำรวจ": this.markersGroup,
        "ผลรวมจุดสำรวจรายพื้นที่": this.layerGroup
    };

    L.control.layers(baseMaps, overlayMaps).addTo(this.map);

  }

  list_prov(item:any){
    console.log(item);
    this.layerGroup.clearLayers();
    this.markersGroup.clearLayers();
    
    this.service.count_prov_q({prov_name: item}).then((res: any) => {
      console.log(res);
      function getColor(d:any) {
        return d > 1000 ? '#39004d' :
            d > 500 ? '#730099' :
                d > 200 ? '#9900cc' :
                    d > 100 ? '#cc33ff' :
                        d > 50 ? '#d966ff' :
                            d > 10 ? '#e699ff' :
                                d > 0 ? '#f2ccff' :
                                    '#FFFFFF00';
    }

    function style(feature:any) {
        return {
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7,
            fillColor: getColor(feature.properties.val)
        };
    }

    function onEachFeature(feature:any, layer:any) {

        var popupContent = "<p>จังหวัด <b>" +
            feature.properties.pv_tn + "</b></br> มีการสำรวจทั้งหมด " +
            feature.properties.val + " จุด</br>";

        if (feature.properties && feature.properties.popupContent) {
            popupContent += feature.properties.popupContent;
        }
        layer.bindPopup(popupContent);
    };
    })
  }

}
