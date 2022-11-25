import React, { useEffect, useRef } from 'react';
import {loadModules} from 'esri-loader';

export default function Map() {
    const mapRef = useRef(null);
    useEffect(() => {
        let mapView;
        loadModules(['esri/views/MapView','esri/WebMap', 'esri/layers/GeoJSONLayer', "esri/widgets/Search", 
        'esri/widgets/Home'],{
            css: true
        }).then(([MapView, WebMap, GeoJSONLayer, Search, Home])=>{
            const webMap = new WebMap({
                basemap: 'topo-vector'
            });
            // added map
            mapView = new MapView({
                map: webMap,
                center: [-83, 42],
                zoom: 4,
                container: mapRef.current,
            });
            // add geo data
            const geoJSONLayer = new GeoJSONLayer({
                url:"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"
            });
            webMap.add(geoJSONLayer);
            // Added search widget
            const searchWidget = new Search({
                view: mapView
              });
              mapView.ui.add(searchWidget, {
                position: "top-right",
                index: 2,
              });
              // Added home button on map
              const homeWidget = new Home({
                view: mapView
              });
              mapView.ui.add(homeWidget, "top-left");
        })
        // unmounting
        return(()=>{
            if(!!mapView) {
                mapView.destroy();
                mapView = null;
            }
        })
    });
    
  return (
    <div style={{height: '100vh', width: '100vw'}} ref={mapRef}></div>
  )
}
