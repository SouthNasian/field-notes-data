export function VisualPlaceholder({ type = "chart", label }: { type?: string; label?: string }) {
  return (
    <div className={`visual visual-${type}`} aria-label={label || `${type} placeholder`}>
      <div className="topo topo-one" />
      <div className="topo topo-two" />
      {type === "chart" && <div className="bars"><i/><i/><i/><i/><i/></div>}
      {type === "map" && <div className="map-route"><i/><b/><span/></div>}
      {type === "dashboard" && <div className="dashboard-mini"><i/><i/><i/><i/></div>}
      {type === "photo" && <div className="photo-horizon"><i/><b/></div>}
      <span className="visual-label">{label || type}</span>
    </div>
  );
}
