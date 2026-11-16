// The map drawing tool expects Leaflet to be a global variable, so we set that up here.
import L from 'leaflet';
window.L = L;
window.type = true; // small fix for a known leaflet-draw bug