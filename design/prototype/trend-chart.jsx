// Trend chart — 90 day body composition lines.
// Renders weight (kg, left axis) + muscle% and fat% (right axis) overlaid.

function TrendChart({ data, focus }) {
  const ref = React.useRef(null);
  const tipRef = React.useRef(null);
  const [hover, setHover] = React.useState(null);

  // Filter window
  const days = focus === '7d' ? 7 : focus === '30d' ? 30 : 90;
  const slice = data.slice(-days);

  const W = 800, H = 240;
  const padL = 36, padR = 36, padT = 16, padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const weights = slice.map(d => d.weight);
  const wMin = Math.floor(Math.min(...weights) - 0.5);
  const wMax = Math.ceil(Math.max(...weights) + 0.5);

  const pcts = slice.flatMap(d => [d.musclePct, d.fatPct]);
  const pMin = Math.floor(Math.min(...pcts) - 1);
  const pMax = Math.ceil(Math.max(...pcts) + 1);

  const xAt = (i) => padL + (slice.length === 1 ? 0 : (i / (slice.length - 1)) * innerW);
  const yWeight = (v) => padT + innerH - ((v - wMin) / (wMax - wMin)) * innerH;
  const yPct    = (v) => padT + innerH - ((v - pMin) / (pMax - pMin)) * innerH;

  const path = (vals, scale) =>
    vals.map((v, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(1)} ${scale(v).toFixed(1)}`).join(' ');

  const area = (vals, scale) =>
    `M ${xAt(0)} ${(padT + innerH).toFixed(1)} ` +
    vals.map((v, i) => `L ${xAt(i).toFixed(1)} ${scale(v).toFixed(1)}`).join(' ') +
    ` L ${xAt(vals.length - 1)} ${padT + innerH} Z`;

  // X tick labels: first, mid, last
  const ticks = [0, Math.floor(slice.length / 2), slice.length - 1];

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const t = (px - padL) / innerW;
    const i = Math.max(0, Math.min(slice.length - 1, Math.round(t * (slice.length - 1))));
    setHover({ i, d: slice[i] });
  };
  const onLeave = () => setHover(null);

  return (
    <div className="chart-wrap">
      <svg ref={ref} className="chart-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
           onMouseMove={onMove} onMouseLeave={onLeave}>
        {/* horizontal gridlines */}
        <g className="chart-grid">
          {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
            <line key={i} x1={padL} x2={W - padR}
                  y1={padT + f * innerH} y2={padT + f * innerH} />
          ))}
        </g>

        {/* areas under percent lines */}
        <path d={area(slice.map(d => d.musclePct), yPct)} className="chart-area muscle" />

        {/* lines */}
        <path d={path(slice.map(d => d.musclePct), yPct)} className="chart-line muscle" />
        <path d={path(slice.map(d => d.fatPct), yPct)} className="chart-line fat" />
        <path d={path(slice.map(d => d.weight), yWeight)} className="chart-line weight" />

        {/* axis labels */}
        <g className="chart-axis">
          <text x={padL - 6} y={padT + 4} textAnchor="end">{wMax}kg</text>
          <text x={padL - 6} y={padT + innerH} textAnchor="end">{wMin}kg</text>
          <text x={W - padR + 6} y={padT + 4}>{pMax}%</text>
          <text x={W - padR + 6} y={padT + innerH}>{pMin}%</text>
          {ticks.map((t, i) => (
            <text key={i} x={xAt(t)} y={H - 8}
                  textAnchor={i === 0 ? 'start' : i === ticks.length - 1 ? 'end' : 'middle'}>
              {fmtTick(slice[t].date)}
            </text>
          ))}
        </g>

        {/* hover cursor + dots */}
        {hover && (
          <g>
            <line className="chart-cursor" style={{ opacity: 1 }}
                  x1={xAt(hover.i)} x2={xAt(hover.i)}
                  y1={padT} y2={padT + innerH} />
            <circle className="chart-dot weight" r="3"
                    cx={xAt(hover.i)} cy={yWeight(hover.d.weight)} />
            <circle className="chart-dot muscle" r="3"
                    cx={xAt(hover.i)} cy={yPct(hover.d.musclePct)} />
            <circle className="chart-dot fat" r="3"
                    cx={xAt(hover.i)} cy={yPct(hover.d.fatPct)} />
          </g>
        )}
      </svg>

      <div ref={tipRef} className={`chart-tip${hover ? ' show' : ''}`}
           style={hover ? tipPos(hover.i, slice.length) : {}}>
        {hover && (
          <>
            <div className="tip-d">{fmtFull(hover.d.date)}</div>
            <div className="tip-row"><span>Gewicht</span><b>{hover.d.weight} kg</b></div>
            <div className="tip-row"><span>Spier</span><b>{hover.d.musclePct}%</b></div>
            <div className="tip-row"><span>Vet</span><b>{hover.d.fatPct}%</b></div>
          </>
        )}
      </div>

      <div className="chart-legend">
        <span className="lg"><span className="dot weight" />Gewicht</span>
        <span className="lg"><span className="dot muscle" />Spier %</span>
        <span className="lg"><span className="dot fat" />Vet %</span>
      </div>
    </div>
  );
}

function tipPos(i, n) {
  const right = i / (n - 1) > 0.6;
  return right ? { right: 8, left: 'auto' } : { left: 8, right: 'auto' };
}

function fmtTick(iso) {
  const d = new Date(iso);
  const m = ['Jan','Feb','Mrt','Apr','Mei','Jun','Jul','Aug','Sep','Okt','Nov','Dec'];
  return `${d.getDate()} ${m[d.getMonth()]}`;
}

function fmtFull(iso) {
  const d = new Date(iso);
  const wd = ['Zondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag'];
  return `${wd[d.getDay()]} ${fmtTick(iso)}`;
}

window.TrendChart = TrendChart;
