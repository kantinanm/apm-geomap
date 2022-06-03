import { Component, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ServiceService } from '../../service.service';
import { OverallComponent } from '../report/overall/overall.component';
import { OverallProvinceComponent } from '../report/overall-province/overall-province.component';
import * as L from 'Leaflet';
import 'leaflet.markercluster';


@Component({
  selector: 'app-osm',
  templateUrl: './osm.component.html',
  styleUrls: ['./osm.component.css']
})
export class OsmComponent implements OnInit {
  @ViewChild('placeholder', { read:ViewContainerRef,static: true })
  
  public placeholder!:ViewContainerRef
  public componentRefs: ComponentRef<OverallComponent>[] = []
  
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
  markersPointFocus: any;

  province_list: any;
  cripple_category_list: any;
 
  layerGroup: any;
  lay_province: any;

  selectedValueCate: any;
  selectedValueProvince: any;
  mySelectCategory: any;

  constructor(private resolver:ComponentFactoryResolver ,public service : ServiceService) {  
    this.service.list_province().then((res: any) => {
    this.province_list = res})
 
    this.service.list_category().then((res: any) => {
    this.cripple_category_list = res})
  }

  async ngOnInit() {
    
    this.placeholder.clear();
    const componentFactory =this.resolver.resolveComponentFactory(OverallComponent);
    const component =this.placeholder.createComponent(componentFactory);
    this.Showmap();

    /*$('button').click(function(){
      alert('Wass up!');
     })*/;
  }




  Showmap(){
    this.map = L.map('map',{attributionControl:false,center:[16.741808, 100.197029],zoom:6,maxZoom:21,zoomControl:false})
    
   /* L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
            minZoom: 9,
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(this.map);*/

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
  }).addTo(this.map);

  this.googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
      maxZoom: 22,
      subdomains:['mt0','mt1','mt2','mt3']
  });
   
    //L.marker([16.741808, 100.197029]).addTo(this.map);
    this.layerGroup = L.layerGroup().addTo(this.map);
    //this.markersGroup = L.markerClusterGroup().addTo(this.map);
    this.markersGroup = L.markerClusterGroup();
    this.markersPointFocus= L.markerClusterGroup();

    this.icon1 = new L.Icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/1476/1476753.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 35],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    this.service.cripple_data().then((res: any) => {
      console.log(res);
      res.forEach(e => {
        L.marker([e.lat, e.long], {icon: this.icon1}).addTo(this.markersGroup)
        .bindPopup("<h4>รายละเอียด</h4><b>ชื่อ - สกุล : </b>" + e.prename + e.firstname + "  " + e.lastname + "<br><b>ประเภทความพิการ : </b>" + e.cripple_category_name + "<br><b>จัดอยู่ในกลุ่มอายุ : </b>" + e.age_group + " ปี.<br><br>");
      });
      
    })

//39004d
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
        feature.properties.pv_tn + "</b></br> พบผู้พิการจำนวน " +
        feature.properties.val + " ราย</br>";

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


    this.service.cripple_count().then((res: any) => {
      console.log(res);
       L.geoJSON(res,{
         style:style,
         onEachFeature:onEachFeature,
        }).addTo(this.layerGroup);
      // }).addTo(this.map);
    });

    
    var legend = L.control.attribution({position: 'bottomright'});

    legend.onAdd = function (map:any) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10, 50, 100, 200, 500, 1000],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(this.map);

    /*this.layer=L.marker([16.741808, 100.197029])
    .bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup().addTo(this.map);*/



  /*
    var baseMaps = {
        "Hybrid": this.googleHybrid,
        "Streets": this.googleStreets,
        "Sat": this.googleSat,
        "Terrain": this.googleTerrain,
    };



    var overlayMaps = {
        "point": this.layer,
        "polygon": this.layer2
    };

    L.control.layers(baseMaps, overlayMaps).addTo(this.map);*/

    var baseMaps = {
      "Hybrid": this.googleHybrid,
      "Streets": this.googleStreets,
      "Sat": this.googleSat,
      "Terrain": this.googleTerrain,
  };
  
  var overlayMaps = {
    "จุดที่พบผู้พิการ": this.markersGroup,
    "ผลรวมรายพื้นที่": this.layerGroup
  };

  L.control.layers(baseMaps, overlayMaps).addTo(this.map);

  }

  list_prov(item:any){
    console.log("Province ID");
    console.log(item);
    console.log("cripple_category ID");
    var id=$("select#select_cripple_category option").filter(":selected").val()
    console.log($("select#select_cripple_category option").filter(":selected").val());

    /*this.placeholder.clear();
    const componentFactory =this.resolver.resolveComponentFactory(OverallComponent);
    const component =this.placeholder.createComponent(componentFactory);*/

    this.layerGroup.clearLayers();
    this.markersGroup.clearLayers();
    //  get category id and passing value to cripple_count_prov_q method
    this.service.cripple_count_prov_q({prov_id: item,cat_id: id}).then((res: any) => {
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
            feature.properties.pv_tn + "</b></br> พบผู้พิการ จำนวน " +
            feature.properties.val + " ราย</br>";

        if (feature.properties && feature.properties.popupContent) {
            popupContent += feature.properties.popupContent;
        }
        layer.bindPopup(popupContent);
    };

    this.icon1 = new L.Icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/1476/1476753.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 35],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

/*
    if(item != ''){

        this.lay_province = L.geoJSON(res, {
            style: style,
            onEachFeature: onEachFeature
          }).addTo(this.layerGroup)
        this.map.fitBounds(this.lay_province.getBounds())

    }else{
        this.service.osm_count().then((res: any) => {
            this.lay_province = L.geoJSON(res, {
                style: style,
                onEachFeature: onEachFeature
              }).addTo(this.layerGroup)
            this.map.fitBounds(this.lay_province.getBounds())
        })
    }
*/

    if(item != ''){ //ถ้ามีการเลือก selected

      this.lay_province = L.geoJSON(res, {
          style: style,
          onEachFeature: onEachFeature
        }).addTo(this.layerGroup)
      this.map.fitBounds(this.lay_province.getBounds())


      this.service.cripple_count_prov_q({prov_id: item,cat_id:id }).then((res: any) => {
        res.forEach((e:any) => {
            if(e.province_id == item){
              
                L.marker([e.lat, e.long],{icon: this.icon1}).addTo(this.markersGroup)
                .bindPopup("<h4>รายละเอียด</h4><b>ชื่อ - สกุล : </b>" + e.prename + e.firstname + "  " + e.lastname + "<br><b>ประเภทความพิการ : </b>" + e.cripple_category_name + "<br><b>จัดอยู่ในกลุ่มอายุ : </b>" + e.age_group + " ปี.<br><br>");
            }
        });
        
    })


    }else{ //ไม่มีการเลือก selected
      this.service.cripple_count_prov_q({prov_id: item,cat_id:id }).then((res: any) => {
          this.lay_province = L.geoJSON(res, {
              style: style,
              onEachFeature: onEachFeature
            }).addTo(this.layerGroup)
          this.map.fitBounds(this.lay_province.getBounds())// focus
      })

      this.service.cripple_count_prov_q({prov_id: item,cat_id:id }).then((res: any) => {
        console.log(res);
        res.forEach((e:any) => {
          L.marker([e.lat, e.long],{icon: this.icon1}).addTo(this.markersGroup)
          .bindPopup("<h4>รายละเอียด</h4><b>ชื่อ - สกุล : </b>" + e.prename + e.firstname + "  " + e.lastname + "<br><b>ประเภทความพิการ : </b>" + e.cripple_category_name + "<br><b>จัดอยู่ในกลุ่มอายุ : </b>" + e.age_group + " ปี.<br><br>");
        });
        
    })

    }
  
    })

  }

   list_cat(item:any){
    console.log("cripple_category ID");
    console.log(item);
    console.log("Province ID");
    var id=$("select#select_province option").filter(":selected").val()
    console.log($("select#select_province option").filter(":selected").text());


    /*this.placeholder.clear();
    const componentFactory =this.resolver.resolveComponentFactory(OverallProvinceComponent);
    const component =this.placeholder.createComponent(componentFactory);
    component.instance.province_id= id.toString();
    component.instance.province_name= $("select#select_province option").filter(":selected").text();*/


    this.layerGroup.clearLayers();
    this.markersGroup.clearLayers();
    //  get category id and passing value to cripple_count_prov_q method
    this.service.cripple_count_prov_q({prov_id: id,cat_id:item }).then((res: any) => {
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
            feature.properties.pv_tn + "</b></br> พบผู้พิการ จำนวน " +
            feature.properties.val + " ราย</br>";

        if (feature.properties && feature.properties.popupContent) {
            popupContent += feature.properties.popupContent;
        }
        layer.bindPopup(popupContent);
    };

    this.icon1 = new L.Icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/1476/1476753.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 35],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

/*
    if(item != ''){

        this.lay_province = L.geoJSON(res, {
            style: style,
            onEachFeature: onEachFeature
          }).addTo(this.layerGroup)
        this.map.fitBounds(this.lay_province.getBounds())

    }else{
        this.service.osm_count().then((res: any) => {
            this.lay_province = L.geoJSON(res, {
                style: style,
                onEachFeature: onEachFeature
              }).addTo(this.layerGroup)
            this.map.fitBounds(this.lay_province.getBounds())
        })
    }
*/

    if(item != ''){ //ถ้ามีการเลือก selected

      this.lay_province = L.geoJSON(res, {
          style: style,
          onEachFeature: onEachFeature
        }).addTo(this.layerGroup)
      this.map.fitBounds(this.lay_province.getBounds())

        // filter by cat 
        // must implement by POST DATA filter by categoty
      this.service.cripple_data_by_cat({prov_id: id,cat_id:item }).then((res: any) => {
        res.forEach((e:any) => {
            if(e.cripple_category == item){
              
                L.marker([e.lat, e.long],{icon: this.icon1}).addTo(this.markersGroup)
                .bindPopup("<h4>รายละเอียด</h4><b>ชื่อ - สกุล : </b>" + e.prename + e.firstname + "  " + e.lastname + "<br><b>ประเภทความพิการ : </b>" + e.cripple_category_name + "<br><b>จัดอยู่ในกลุ่มอายุ : </b>" + e.age_group + " ปี.<br><br>");
            }
        });
        
    })


    }else{ //ไม่มีการเลือก selected
      // must implement by POST DATA filter by categoty

      //filter by province only
      this.service.cripple_count_prov_q({prov_id: id,cat_id:item }).then((res: any) => {
          this.lay_province = L.geoJSON(res, {
              style: style,
              onEachFeature: onEachFeature
            }).addTo(this.layerGroup)
          this.map.fitBounds(this.lay_province.getBounds())// focus
      })

      this.service.cripple_count_prov_q({prov_id: id,cat_id:item }).then((res: any) => {
        console.log(res);
        res.forEach((e:any) => {
          L.marker([e.lat, e.long],{icon: this.icon1}).addTo(this.markersGroup)
          .bindPopup("<h4>รายละเอียด</h4><b>ชื่อ - สกุล : </b>" + e.prename + e.firstname + "  " + e.lastname + "<br><b>ประเภทความพิการ : </b>" + e.cripple_category_name + "<br><b>จัดอยู่ในกลุ่มอายุ : </b>" + e.age_group + " ปี.<br><br>");
        });
        
    })

    }

  
    })
    

  }
}
