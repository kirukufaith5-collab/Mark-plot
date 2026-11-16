// Shows which things the inspector asked for are already on the map
export default function Checklist({ data }) {
  const has = (kind) => data.items.some((i) => i.kind === kind);
  const rows = [
    ['Field outline drawn', !!data.field],
    ['Scale bar and north arrow (automatic)', true],
    ['Neighbouring crops added (organic / not organic)', has('organic') || has('conventional')],
    ['Other activities / roads added', has('activity') || has('road')],
    ['Separation measures added (distance + barrier)', data.items.some((i) => i.kind === 'buffer' || (i.dist && i.barrier))],
    ['Wind and land shape filled in', !!(data.wind && data.terrain)]
  ];
  return (
    <div className="box">
      <b>Is my map complete?</b>
      <div id="checks">
        {rows.map(([text, done]) => <div key={text}>{done ? '✅' : '⬜'} {text}</div>)}
      </div>
    </div>
  );
}