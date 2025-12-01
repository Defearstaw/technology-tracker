import './QuickActions.css';

function QuickActions({ 
  onMarkAllCompleted, 
  onResetAll, 
  onExportData,
  technologies 
}) {
  const completedCount = technologies.filter(t => t.status === 'completed').length;
  const inProgressCount = technologies.filter(t => t.status === 'in-progress').length;
  
  const canMarkAll = technologies.length > 0 && completedCount < technologies.length;
  const canResetAll = technologies.length > 0 && completedCount + inProgressCount > 0;

  const handleMarkAllCompleted = () => {
    if (window.confirm('Отметить все технологии как завершённые?')) {
      onMarkAllCompleted();
    }
  };

  const handleResetAll = () => {
    if (window.confirm('Сбросить статусы всех технологий?')) {
      onResetAll();
    }
  };

  const handleExport = () => {
    onExportData();
    alert(`Данные ${technologies.length} технологий готовы для экспорта!`);
  };

  return (
    <div className="quick-actions">
      <h3>⚡ Быстрые действия</h3>
      
      <div className="actions-grid">
        <button
          onClick={handleMarkAllCompleted}
          className="action-btn success"
          disabled={!canMarkAll}
          title="Отметить все технологии как изученные"
        >
          <span className="action-icon">✓</span>
          <span className="action-text">Завершить всё</span>
          <span className="action-badge">
            {technologies.length - completedCount}
          </span>
        </button>

        <button
          onClick={handleResetAll}
          className="action-btn warning"
          disabled={!canResetAll}
          title="Сбросить статусы всех технологий"
        >
          <span className="action-icon">↺</span>
          <span className="action-text">Сбросить всё</span>
          <span className="action-badge">
            {completedCount + inProgressCount}
          </span>
        </button>

        <button
          onClick={handleExport}
          className="action-btn info"
          disabled={technologies.length === 0}
          title="Экспортировать данные в JSON"
        >
          <span className="action-icon">📥</span>
          <span className="action-text">Экспорт данных</span>
          <span className="action-badge">{technologies.length}</span>
        </button>
      </div>

      <div className="action-hint">
        💡 Используйте быстрые действия для массового управления технологиями
      </div>
    </div>
  );
}

export default QuickActions;