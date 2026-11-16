// Step 3: wind, land shape and notes
const WINDS = ['North', 'North-East', 'East', 'South-East', 'South', 'South-West', 'West', 'North-West'];

export default function ExtraInfo({ data, onChange }) {
  return (
    <div className="box">
      <b>Step 3.</b> Extra information
      <label>Wind direction that blows most often</label>
      <select value={data.wind} onChange={(e) => onChange({ wind: e.target.value })}>
        <option value="">Not sure</option>
        {WINDS.map((w) => <option key={w}>{w}</option>)}
      </select>
      <label>Slope / land shape</label>
      <input value={data.terrain} onChange={(e) => onChange({ terrain: e.target.value })} placeholder="e.g. Flat, slopes down to the east" />
      <label>Other notes</label>
      <textarea rows="2" value={data.notes} onChange={(e) => onChange({ notes: e.target.value })} />
    </div>
  );
}