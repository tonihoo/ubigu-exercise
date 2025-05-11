import { GlobalStyles } from "@mui/material";
import { View, Map as OlMap, Feature } from "ol";
import { GeoJSON } from "ol/format";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import OSM from "ol/source/OSM.js";
import VectorSource from "ol/source/Vector";
import { Circle } from "ol/style";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import { ReactNode, useEffect, useRef, useState } from "react";
import { register } from 'ol/proj/proj4';
import proj4 from 'proj4';

// Define the Finnish coordinate system
proj4.defs("EPSG:3067", "+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs");
register(proj4);

interface Props {
  children?: ReactNode;
  features?: GeoJSON.Feature[];
  onMapClick: (coordinates: number[]) => void;
}

export function Map({ children, onMapClick, features }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);

  /**
   * OpenLayers View: @see https://openlayers.org/en/latest/apidoc/module-ol_View-View.html
   * View's projection is defined based on the target country (area): E.g. EPSG:3067 in Finland
   */
  const [olView] = useState(() => {
    return new View({
      center: [460000, 7125000],
      zoom: 7,
      projection: 'EPSG:3067',
      multiWorld: false,
      enableRotation: false,
    });
  });

  /**
   * OpenLayers Map: @see https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html
   * "For a map to render, a view, one or more layers, and a target container are needed" -docs
   */
  const [olMap] = useState(() => {
    return new OlMap({
      target: "",
      controls: [],
      view: olView,
      keyboardEventTarget: document,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: new VectorSource(),
          style: new Style({
            image: new Circle({
              radius: 7,
              fill: new Fill({ color: "#00B2A0" }),
              stroke: new Stroke({ color: "darkblue", width: 3 }),
            }),
          }),
        }),
      ],
    });
  });

  /** olMap -object's initialization on startup  */
  useEffect(() => {
    olMap.setTarget(mapRef.current as HTMLElement);

    olMap.on("click", (event) => {
      onMapClick(event.coordinate);
    });
  }, [olMap]);

  /** Listen for changes in the 'features' property */
  useEffect(() => {
    const layers = olMap.getLayers().getArray();

    const source = (layers[1] as VectorLayer<VectorSource>).getSource();

    // Clear existing features
    source?.clear();

    // Skip adding new features if none provided
    if (!features || !features.length) return;

    // Add new features
    const olFeatures = features.map(
      (geometry) =>
        new Feature({
          geometry: new GeoJSON().readGeometry(geometry.geometry),
        })
    );
    source?.addFeatures(olFeatures);
  }, [features]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* Styles for the OpenLayers ScaleLine -component */}
      <GlobalStyles
        styles={{
          ".ol-viewport": {
            cursor: "pointer",
          },
        }}
      />
      <div
        style={{ width: "100%", height: "100%", position: "relative" }}
        ref={mapRef}
      >
        {children}
      </div>
    </div>
  );
}
