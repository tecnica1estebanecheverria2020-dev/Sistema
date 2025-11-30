export default function Stats({ publishedCount, draftCount, totalCount }) {
  return (
    <div className="comunicados-stats">
      <div className="comunicados-stat-card">
        <div className="comunicados-stat-number">{publishedCount}</div>
        <div className="comunicados-stat-label">Publicados</div>
      </div>
      <div className="comunicados-stat-card">
        <div className="comunicados-stat-number">{draftCount}</div>
        <div className="comunicados-stat-label">Borradores</div>
      </div>
      <div className="comunicados-stat-card">
        <div className="comunicados-stat-number">{totalCount}</div>
        <div className="comunicados-stat-label">Total</div>
      </div>
    </div>
  );
}