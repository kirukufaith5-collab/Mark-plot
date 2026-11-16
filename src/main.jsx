import './leaflet-setup.js'; // must stay first
import { createRoot } from 'react-dom/client';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);
