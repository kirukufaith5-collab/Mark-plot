// Choose, create or delete one of your maps, and name the current map
export default function PlotPicker({ plots, plotId, name, onName, onOpen, onNew, onDelete }) {
  return (
    <>
      <div className="box">
        <label>My maps</label>
        <select value={plotId || ''} onChange={(e) => onOpen(Number(e.target.value))}>
          <option value="">– choose a map –</option>
          {plots.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <button onClick={onNew}>+ New map</button>{' '}
        <button className="grey" onClick={onDelete}>Delete</button>
      </div>
      <label>Map name</label>
      <input value={name} onChange={(e) => onName(e.target.value)} placeholder="e.g. Field A1" />
    </>
  );
}