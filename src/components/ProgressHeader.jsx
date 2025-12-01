import './ProgressHeader.css';

function ProgressHeader({ technologies }) {
  const total = technologies.length;
  const completed = technologies.filter(t => t.status === 'completed').length;
  const inProgress = technologies.filter(t => t.status === 'in-progress').length;
  const notStarted = technologies.filter(t => t.status === 'not-started').length;
  
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="progress-header">
      <h2>📊 Прогресс изучения</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value total">{total}</div>
          <div className="stat-label">Всего технологий</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value completed">{completed}</div>
          <div className="stat-label">Изучено</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value in-progress">{inProgress}</div>
          <div className="stat-label">В процессе</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value not-started">{notStarted}</div>
          <div className="stat-label">Не начато</div>
        </div>
      </div>
      
      <div className="progress-section">
        <div className="progress-info">
          <span>Общий прогресс:</span>
          <span className="progress-percent">{progress}%</span>
        </div>
        
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progress}%` }}
            data-progress={progress}
          >
            <div className="progress-bar-glow"></div>
          </div>
        </div>
        
        <div className="progress-labels">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}

export default ProgressHeader;