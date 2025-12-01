import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useTechnologies from '../hooks/useTechnologies';
import NotesEditor from '../components/NotesEditor';
import './TechnologyDetail.css';

function TechnologyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    technologies,
    updateStatus,
    updateNotes,
    deleteTechnology
  } = useTechnologies();

  const [tech, setTech] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const foundTech = technologies.find(t => t.id === parseInt(id));
    if (foundTech) {
      setTech(foundTech);
    } else {
      // Если технология не найдена, редирект через 3 секунды
      setTimeout(() => navigate('/technologies'), 3000);
    }
    setLoading(false);
  }, [id, technologies, navigate]);

  const handleStatusChange = (newStatus) => {
    if (window.confirm(`Изменить статус на "${newStatus === 'completed' ? 'Завершено' : newStatus === 'in-progress' ? 'В процессе' : 'Не начато'}"?`)) {
      updateStatus(tech.id, newStatus);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Вы уверены, что хотите удалить "${tech.title}"?`)) {
      deleteTechnology(tech.id);
      navigate('/technologies');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in-progress': return '#FF9800';
      default: return '#F44336';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Завершено';
      case 'in-progress': return 'В процессе';
      default: return 'Не начато';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'Начальный';
      case 'intermediate': return 'Средний';
      case 'advanced': return 'Продвинутый';
      default: return difficulty;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#F44336';
      default: return '#666';
    }
  };

  const getCategoryText = (category) => {
    const categories = {
      'frontend': 'Frontend',
      'backend': 'Backend',
      'database': 'База данных',
      'devops': 'DevOps',
      'mobile': 'Мобильная разработка',
      'tools': 'Инструменты'
    };
    return categories[category] || category;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Загрузка данных...</p>
      </div>
    );
  }

  if (!tech) {
    return (
      <div className="not-found">
        <h2>⚠️ Технология не найдена</h2>
        <p>Технология с ID {id} не существует или была удалена.</p>
        <p>Вы будете перенаправлены на страницу со списком технологий...</p>
        <Link to="/technologies" className="btn-primary">
          Вернуться к списку
        </Link>
      </div>
    );
  }

  return (
    <div className="technology-detail-page">
      <div className="detail-header">
        <div className="breadcrumbs">
          <Link to="/">Главная</Link> / 
          <Link to="/technologies">Технологии</Link> / 
          <span>{tech.title}</span>
        </div>
        
        <div className="header-actions">
          <button 
            className="btn-secondary"
            onClick={() => navigate(-1)}
          >
            ← Назад
          </button>
          <button 
            className="btn-edit"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? 'Сохранить' : '✎ Редактировать'}
          </button>
        </div>
      </div>

      <div className="detail-content">
        <div className="tech-main-info">
          <div className="tech-header">
            <h1>{tech.title}</h1>
            <div className="tech-meta">
              <span className="tech-id">ID: {tech.id}</span>
              <span className="created-date">
                Добавлено: {new Date(tech.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="tech-description">
            <h3>📋 Описание</h3>
            <p>{tech.description}</p>
          </div>

          <div className="tech-progress">
            <h3>📊 Прогресс изучения</h3>
            <div className="progress-section">
              <div className="status-display">
                <div 
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(tech.status) }}
                >
                  {getStatusText(tech.status)}
                </div>
                
                <div className="status-actions">
                  <button
                    className={`status-btn ${tech.status === 'not-started' ? 'active' : ''}`}
                    onClick={() => handleStatusChange('not-started')}
                  >
                    Не начато
                  </button>
                  <button
                    className={`status-btn ${tech.status === 'in-progress' ? 'active' : ''}`}
                    onClick={() => handleStatusChange('in-progress')}
                  >
                    В процессе
                  </button>
                  <button
                    className={`status-btn ${tech.status === 'completed' ? 'active' : ''}`}
                    onClick={() => handleStatusChange('completed')}
                  >
                    Завершено
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tech-sidebar">
          <div className="info-card">
            <h3>ℹ️ Информация</h3>
            
            <div className="info-item">
              <span className="info-label">Категория:</span>
              <span className={`info-value category ${tech.category}`}>
                {getCategoryText(tech.category)}
              </span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Сложность:</span>
              <span 
                className="info-value difficulty"
                style={{ color: getDifficultyColor(tech.difficulty) }}
              >
                {getDifficultyText(tech.difficulty)}
              </span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Статус:</span>
              <span 
                className="info-value status"
                style={{ color: getStatusColor(tech.status) }}
              >
                {getStatusText(tech.status)}
              </span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Дата добавления:</span>
              <span className="info-value">
                {new Date(tech.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="actions-card">
            <h3>⚡ Действия</h3>
            
            <div className="quick-actions">
              <button 
                className="action-btn primary"
                onClick={() => handleStatusChange(
                  tech.status === 'completed' ? 'not-started' :
                  tech.status === 'in-progress' ? 'completed' : 'in-progress'
                )}
              >
                Изменить статус
              </button>
              
              <Link 
                to={`/technology/${tech.id}/edit`}
                className="action-btn secondary"
              >
                Редактировать
              </Link>
              
              <button 
                className="action-btn danger"
                onClick={handleDelete}
              >
                Удалить
              </button>
            </div>
          </div>

          <div className="related-card">
            <h3>🔗 Похожие технологии</h3>
            <div className="related-list">
              {technologies
                .filter(t => 
                  t.id !== tech.id && 
                  (t.category === tech.category || t.difficulty === tech.difficulty)
                )
                .slice(0, 3)
                .map(relatedTech => (
                  <Link 
                    key={relatedTech.id}
                    to={`/technology/${relatedTech.id}`}
                    className="related-item"
                  >
                    <span className="related-title">{relatedTech.title}</span>
                    <span 
                      className="related-status"
                      style={{ color: getStatusColor(relatedTech.status) }}
                    >
                      {getStatusText(relatedTech.status)}
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="tech-notes-section">
        <h2>📝 Заметки</h2>
        <NotesEditor
          techId={tech.id}
          currentNotes={tech.notes}
          onSave={updateNotes}
          onCancel={() => setEditMode(false)}
        />
      </div>

      <div className="tech-navigation">
        <Link to="/technologies" className="nav-link back">
          ← К списку технологий
        </Link>
        
        <div className="nav-pagination">
          {(() => {
            const index = technologies.findIndex(t => t.id === tech.id);
            const prevTech = index > 0 ? technologies[index - 1] : null;
            const nextTech = index < technologies.length - 1 ? technologies[index + 1] : null;

            return (
              <>
                {prevTech && (
                  <Link 
                    to={`/technology/${prevTech.id}`}
                    className="nav-link prev"
                  >
                    ← {prevTech.title}
                  </Link>
                )}
                
                {nextTech && (
                  <Link 
                    to={`/technology/${nextTech.id}`}
                    className="nav-link next"
                  >
                    {nextTech.title} →
                  </Link>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

export default TechnologyDetail;