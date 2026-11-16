import { useEffect, useState } from 'react';
import { isLoggedIn, signOut, listPlots, getPlot, savePlot, deletePlot } from './api.js';
import Login from './components/Login.jsx';
import PlotPicker from './components/PlotPicker.jsx';
import AddItemForm from './components/AddItemForm.jsx';
import ExtraInfo from './components/ExtraInfo.jsx';
import Checklist from './components/Checklist.jsx';
import MapView from './components/MapView.jsx';

const emptyData = () => ({ field: null, items: [], wind: '', terrain: '', notes: '' });

// App holds the main information and passes it to the smaller pieces
export default function App() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [plots, setPlots] = useState([]);   // list of my maps
  const [plotId, setPlotId] = useState(null);
  const [name, setName] = useState('');
  const [data, setData] = useState(emptyData());
  const [placing, setPlacing] = useState(null); // the label waiting to be placed
  const [message, setMessage] = useState('');

  // When logged in, load my maps and open the first one
  useEffect(() => {
    if (!loggedIn) return;
    listPlots().then((list) => {
      setPlots(list);
      if (list.length) openPlot(list[0].id);
    });
  }, [loggedIn]);

  const change = (changes) => setData((d) => ({ ...d, ...changes }));

  async function openPlot(id) {
    if (!id) return;
    const plot = await getPlot(id);
    setPlotId(plot.id); setName(plot.name); setData(plot.data);
  }

  function newPlot() { setPlotId(null); setName(''); setData(emptyData()); }

  async function save() {
    const id = await savePlot(plotId, name || 'Untitled plot', data);
    setPlotId(id);
    setPlots(await listPlots());
    setMessage('✅ Saved!');
    setTimeout(() => setMessage(''), 2500);
  }

  async function remove() {
    if (!plotId || !confirm('Delete this map for good?')) return;
    await deletePlot(plotId);
    setPlots(await listPlots());
    newPlot();
  }

  function placeItem(latlng) {
    change({ items: [...data.items, { ...placing, lat: latlng.lat, lng: latlng.lng }] });
    setPlacing(null);
  }

  function removeItem(index) {
    if (confirm('Remove "' + data.items[index].text + '"?'))
      change({ items: data.items.filter((_, i) => i !== index) });
  }

  if (!loggedIn) return <Login onDone={() => setLoggedIn(true)} />;

  return (
    <div id="app">
      <div id="panel">
        <h1>Mark-Plot</h1>
        <button className="grey" onClick={() => { signOut(); setLoggedIn(false); }}>Log out</button>

        <PlotPicker plots={plots} plotId={plotId} name={name}
          onName={setName} onOpen={openPlot} onNew={newPlot} onDelete={remove} />

        <div className="box">
          <b>Step 1.</b> Click the ⬠ shape on the map (top left) and click around the edge of your field. Double-click the last point to finish.
        </div>

        <AddItemForm placing={!!placing} onStart={setPlacing} />
        <ExtraInfo data={data} onChange={change} />
        <Checklist data={data} />

        <div className="row">
          <button onClick={save}>Save</button>
          <button className="grey" onClick={() => window.print()}>Print / PDF</button>
        </div>
        <p style={{ color: '#2e7d32' }}>{message}</p>
      </div>

      <MapView plotKey={plotId || 'new'} field={data.field} items={data.items} placing={!!placing}
        onFieldChange={(field) => change({ field })} onPlace={placeItem} onRemoveItem={removeItem} />
    </div>
  );
}