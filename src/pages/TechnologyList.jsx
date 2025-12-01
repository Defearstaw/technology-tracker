import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TechnologyCard from '../components/TechnologyCard';
import useTechnologies from '../hooks/useTechnologies';
import './TechnologyList.css';

function TechnologyList() {
  const {
    technologies,
    updateStatus,
    deleteTechnology,
    searchTechnologies,
    filterByStatus,
    sortTechnologies,
    stats
  } = useTechnologies();

  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid');

  let displayedTech = filterByStatus(filter);
  
  if (searchQuery) {
    displayedTech = searchTechnologies(searchQuery);
  }
  
  displayedTech = sortTechnologies(sortBy, sortOrder);

  useEffect(() => {
    if (filter !== 'all') {
      setSearchQuery('');
    }
  }, [filter]);

  const handleQuickStatusChange = (techId, status) => {
    if (window.confirm(`Изменить статус на "${status === 'completed' ? 'Завершено' : status === 'in-progress' ? 'В процессе' : 'Не начато'}"?`)) {
      updateStatus(techId, status);
    }
  };

  return (
    <div className="technology-list-page">
      <div className="page-header">
        <h1>📚 Все технологии</h1>
        <div className="header-stats">
          <span className="stat total">Всего: {stats.total}</span>
          <span className="stat completed">Изучено: {stats.completed}</span>
          <span className="stat progress">Прогресс: {stats.progress}%</span>
        </div>
      </div>

      <div className="controls-panel">
        <div className="view-controls">
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Сетка"
          >
            ▦
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="Список"
          >
            ≡
          </button>
        </div>

        <div className="search-controls">
          <input
            type="text"
            placeholder="Поиск технологий..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              className="clear-btn"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-controls">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Все статусы</option>
            <option value="not-started">Не начатые</option>
            <option value="in-progress">В процессе</option>
            <option value="completed">Завершённые</option>
          </select>
        </div>

        <div className="sort-controls">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="createdAt">По дате</option>
            <option value="title">По названию</option>
            <option value="category">По категории</option>
            <option value="difficulty">По сложности</option>
          </select>
          
          <button 
            className="order-btn"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {searchQuery && displayedTech.length > 0 && (
        <div className="search-info">
          Найдено {displayedTech.length} технологий по запросу "{searchQuery}"
        </div>
      )}

      {displayedTech.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            {searchQuery ? '🔍' : '📭'}
          </div>
          <h3>
            {searchQuery 
              ? 'По запросу ничего не найдено' 
              : 'Технологий пока нет'}
          </h3>
          <p>
            {searchQuery 
              ? 'Попробуйте изменить поисковый запрос' 
              : 'Добавьте свою первую технологию'}
          </p>
          {!searchQuery && (
            <Link to="/add-technology" className="btn-primary">
              Добавить технологию
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className={`technologies-container ${viewMode}`}>
            {displayedTech.map(tech => (
              <div key={tech.id} className="technology-item">
                <div className="item-header">
                  <span className={`category-tag ${tech.category}`}>
                    {tech.category}
                  </span>
                  <div className="quick-actions">
                    <button
                      className={`status-btn ${tech.status === 'not-started' ? 'active' : ''}`}
                      onClick={() => handleQuickStatusChange(tech.id, 'not-started')}
                      title="Не начато"
                    >
                      ●
                    </button>
                    <button
                      className={`status-btn ${tech.status === 'in-progress' ? 'active' : ''}`}
                      onClick={() => handleQuickStatusChange(tech.id, 'in-progress')}
                      title="В процессе"
                    >
                      ⟳
                    </button>
                    <button
                      className={`status-btn ${tech.status === 'completed' ? 'active' : ''}`}
                      onClick={() => handleQuickStatusChange(tech.id, 'completed')}
                      title="Завершено"
                    >
                      ✓
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => {
                        if (window.confirm(`Удалить "${tech.title}"?`)) {
                          deleteTechnology(tech.id);
                        }
                      }}
                      title="Удалить"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="item-content">
                  <TechnologyCard
                    title={tech.title}
                    description={tech.description}
                    status={tech.status}
                    onClick={() => updateStatus(tech.id, 
                      tech.status === 'not-started' ? 'in-progress' :
                      tech.status === 'in-progress' ? 'completed' : 'not-started'
                    )}
                  />
                  
                  <div className="item-meta">
                    <span className={`difficulty ${tech.difficulty}`}>
                      {tech.difficulty === 'beginner' && 'Начальный уровень'}
                      {tech.difficulty === 'intermediate' && 'Средний уровень'}
                      {tech.difficulty === 'advanced' && 'Продвинутый уровень'}
                    </span>
                    <span className="date">
                      Добавлено: {new Date(tech.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {tech.notes && (
                    <div className="item-notes">
                      <strong>Заметки:</strong> {tech.notes}
                    </div>
                  )}

                  <div className="item-actions">
                    <Link 
                      to={`/technology/${tech.id}`} 
                      className="btn-link"
                    >
                      Подробнее →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="list-summary">
            <div className="summary-item">
              <span>Показано:</span>
              <strong>{displayedTech.length}</strong>
            </div>
            <div className="summary-item">
              <span>Завершено:</span>
              <strong className="completed">{displayedTech.filter(t => t.status === 'completed').length}</strong>
            </div>
            <div className="summary-item">
              <span>В процессе:</span>
              <strong className="in-progress">{displayedTech.filter(t => t.status === 'in-progress').length}</strong>
            </div>
            <div className="summary-item">
              <span>Не начато:</span>
              <strong className="not-started">{displayedTech.filter(t => t.status === 'not-started').length}</strong>
            </div>
          </div>
        </>
      )}

      <div className="page-actions">
        <Link to="/add-technology" className="btn-primary">
          ➕ Добавить новую технологию
        </Link>
        <Link to="/" className="btn-secondary">
          ← На главную
        </Link>
      </div>
    </div>
  );
}

export default TechnologyList;