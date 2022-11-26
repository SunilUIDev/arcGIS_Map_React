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
                center: [-74.9851659999999,
                  40.0541710000001],
                zoom: 10,
                container: mapRef.current,
            });
            // add renderer and template
            const template = {
              title: "Located Sites",
              content: "Site Name <strong>{SITE_NAME}</strong> and Site Address <strong>{SITE_ADDRESS}</strong>",
            };
    
            const renderer = {
              type: "simple",
              field: "SITE_ADDRESS",
              symbol: {
                type: "simple-marker",
                color: "red",
                outline: {
                  color: "white"
                }
              },
              visualVariables: [
                {
                  type: "size",
                  field: "SITE_ADDRESS",
                  stops: [
                    {
                      value: 2.5,
                      size: "4px"
                    },
                    {
                      value: 8,
                      size: "40px"
                    }
                  ]
                }
              ]
            };
            // add geo data
            const geoJSONLayer = new GeoJSONLayer({
                url:"https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/LATEST_CORE_SITE_READINGS/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson",
                popupTemplate: template,
                renderer: renderer
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
