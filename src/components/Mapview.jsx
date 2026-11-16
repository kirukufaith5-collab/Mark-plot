import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet-draw';

const COLORS = { organic: '#2e7d32', conventional: '#c62828', activity: '#6d4c41', road: '#546e7a', buffer: '#f9a825' };
const safe = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// The satellite map. It draws the field and all the labels it is given.
export default function MapView({ plotKey, field, items, placing, onFieldChange, onPlace, onRemoveItem }) {
  const boxRef = useRef();
  const mapRef = useRef();
  const fieldGroup = useRef(L.featureGroup());
  const itemsGroup = useRef(L.layerGroup());
  const lastFit = useRef(null);

  // Keeps the newest functions available to the map's click events
  const latest = useRef({});
  latest.current = { placing, onFieldChange, onPlace, onRemoveItem };

  // 1) Build the map once
  useEffect(() => {
    const map = L.map(boxRef.current).setView([-1.03, 37.07], 17); // change to your area
    mapRef.current = map;
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 19, attribution: 'Imagery © Esri' }).addTo(map);

    L.control.scale({ metric: true, imperial: false }).addTo(map); // scale bar

    const north = L.control({ position: 'topright' });             // north arrow
    north.onAdd = () => { const d = L.DomUtil.create('div', 'north'); d.innerHTML = '⬆<br>N'; return d; };
    north.addTo(map);

    fieldGroup.current.addTo(map);
    itemsGroup.current.addTo(map);

    map.addControl(new L.Control.Draw({
      draw: { polygon: { shapeOptions: { color: '#1565c0' } }, polyline: false, rectangle: false, circle: false, marker: false, circlemarker: false },
      edit: { featureGroup: fieldGroup.current }
    }));
    map.on(L.Draw.Event.CREATED, (e) => latest.current.onFieldChange(e.layer.toGeoJSON()));
    map.on(L.Draw.Event.EDITED, () => latest.current.onFieldChange(fieldGroup.current.getLayers()[0].toGeoJSON()));
    map.on(L.Draw.Event.DELETED, () => latest.current.onFieldChange(null));
    map.on('click', (e) => { if (latest.current.placing) latest.current.onPlace(e.latlng); });

    return () => map.remove();
  }, []);

  // 2) Draw the field whenever it changes
  useEffect(() => {
    fieldGroup.current.clearLayers();
    if (!field) return;
    L.geoJSON(field).eachLayer((layer) => { layer.setStyle({ color: '#1565c0' }); fieldGroup.current.addLayer(layer); });
    if (lastFit.current !== plotKey) { // zoom to the field only when a different map is opened
      mapRef.current.fitBounds(fieldGroup.current.getBounds().pad(0.8));
      lastFit.current = plotKey;
    }
  }, [field, plotKey]);

  // 3) Draw the labels whenever they change
  useEffect(() => {
    itemsGroup.current.clearLayers();
    items.forEach((item, index) => {
      let label = safe(item.text);
      if (item.dist) label += ' – ' + safe(item.dist) + ' m';
      if (item.barrier) label += ' (' + safe(item.barrier) + ')';
      const color = COLORS[item.kind];
      const icon = L.divIcon({ className: '', iconSize: null,
        html: `<span class="tag" style="color:${color};border-color:${color}">${label}</span>` });
      L.marker([item.lat, item.lng], { icon }).addTo(itemsGroup.current)
        .on('click', () => latest.current.onRemoveItem(index));
    });
  }, [items]);

  // 4) Crosshair cursor while placing a label
  useEffect(() => {
    boxRef.current.style.cursor = placing ? 'crosshair' : '';
  }, [placing]);

  return <div id="map" ref={boxRef} />;
}