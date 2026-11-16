import { useState } from 'react';

// Step 2: describe something around the field, then click the map to place it
export default function AddItemForm({ placing, onStart }) {
  const [kind, setKind] = useState('organic');
  const [text, setText] = useState('');
  const [dist, setDist] = useState('');
  const [barrier, setBarrier] = useState('');

  return (
    <div className="box">
      <b>Step 2.</b> Add what is around your field
      <label>What is it?</label>
      <select value={kind} onChange={(e) => setKind(e.target.value)}>
        <option value="organic">Neighbour crop – organic</option>
        <option value="conventional">Neighbour crop – NOT organic</option>
        <option value="activity">Other activity (barn, factory, spraying...)</option>
        <option value="road">Road, path or water</option>
        <option value="buffer">Separation / buffer zone</option>
      </select>
      <label>Name</label>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. Alfalfa, Meadow, Irrigation canal" />
      <label>Distance from my field in metres (optional)</label>
      <input type="number" min="0" value={dist} onChange={(e) => setDist(e.target.value)} />
      <label>Barrier between us (optional)</label>
      <select value={barrier} onChange={(e) => setBarrier(e.target.value)}>
        <option value="">None</option>
        <option>Trees / hedgerow</option>
        <option>Downgraded rows</option>
        <option>Ditch / canal</option>
        <option>Road</option>
        <option>Fence / wall</option>
        <option>Other</option>
      </select>
      <button onClick={() => onStart({ kind, text: text.trim() || 'Unnamed', dist, barrier })}>Place on map</button>
      {placing && <div style={{ color: '#2e7d32', marginTop: 6 }}>👉 Now click the map where it is.</div>}
      <br /><small>Tip: click a label on the map to remove it.</small>
    </div>
  );
}