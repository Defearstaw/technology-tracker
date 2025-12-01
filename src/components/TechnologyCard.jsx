import './TechnologyCard.css';

function TechnologyCard({ 
  title, 
  description, 
  status, 
  onClick,
  stars,
  language,
  isExternal = false,
  showExternalBadge = true 
}) {
  const getStatusColor = () => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in-progress': return '#FF9800';
      default: return '#F44336';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'completed': return 'Завершено';
      case 'in-progress': return 'В процессе';
      default: return 'Не начато';
    }
  };

  return (
    <div 
      className={`technology-card ${isExternal ? 'external-tech' : ''}`}
      style={{ borderLeft: `5px solid ${getStatusColor()}` }}
      onClick={onClick}
    >
      <div className="card-header">
        <h3>{title}</h3>
        {isExternal && showExternalBadge && (
          <span className="external-badge" title="Из внешнего источника">
            🌐
          </span>
        )}
      </div>
      
      <p className="description">{description}</p>
      
      <div className="card-footer">
        <div className="status-badge" style={{ backgroundColor: getStatusColor() }}>
          {getStatusText()}
        </div>
        
        {(stars || language) && (
          <div className="tech-meta">
            {stars !== undefined && (
              <span className="meta-item" title="Звёзды на GitHub">
                ⭐ {stars.toLocaleString()}
              </span>
            )}
            {language && (
              <span className="meta-item" title="Основной язык">
                {getLanguageIcon(language)} {language}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Функция для получения иконки языка
function getLanguageIcon(language) {
  const icons = {
    'JavaScript': '🟨',
    'TypeScript': '🔷',
    'Python': '🐍',
    'Java': '☕',
    'Go': '🐹',
    'Rust': '🦀',
    'C++': '⚙️',
    'C#': '♯',
    'Ruby': '💎',
    'PHP': '🐘',
    'Swift': '🐦',
    'Kotlin': '🅺',
    'HTML': '🌐',
    'CSS': '🎨'
  };
  
  return icons[language] || '💻';
}

export default TechnologyCard;