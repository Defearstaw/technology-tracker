import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdvancedTechForm from '../components/AdvancedTechForm';
import DataImportExport from '../components/DataImportExport';
import useTechnologies from '../hooks/useTechnologies';
import './DataManagement.css';

function DataManagement() {
  const { technologies, addTechnology, updateTechnology, deleteAllTechnologies, importTechnologies } = useTechnologies();
  const [showAdvancedForm, setShowAdvancedForm] = useState(false);
  const [editingTech, setEditingTech] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Обработка сохранения формы
  const handleFormSubmit = (techData) => {
    if (editingTech) {
      updateTechnology(editingTech.id, techData);
      setEditingTech(null);
    } else {
      addTechnology(techData);
    }
    setShowAdvancedForm(false);
  };

  // Обработка импорта данных
  const handleImport = (importedTechs) => {
    // Добавляем ID для импортированных технологий
    const techsWithIds = importedTechs.map(tech => ({
      ...tech,
      id: tech.id || Date.now() + Math.random(),
      status: tech.status || 'not-started',
      createdAt: tech.createdAt || new Date().toISOString()
    }));
    
    importTechnologies(techsWithIds);
  };

  // Очистка всех данных
  const handleDeleteAll = () => {
    if (window.confirm('ВНИМАНИЕ! Это удалит ВСЕ технологии. Действие необратимо. Продолжить?')) {
      deleteAllTechnologies();
      setShowDeleteConfirm(false);
    }
  };

  // Начать редактирование
  const handleStartEditing = (tech) => {
    setEditingTech(tech);
    setShowAdvancedForm(true);
  };

  // Отмена редактирования
  const handleCancelForm = () => {
    setShowAdvancedForm(false);
    setEditingTech(null);
  };

  return (
    <div className="data-management-page">
      <div className="page-header">
        <h1>🗃️ Управление данными</h1>
        <p>Добавляйте, редактируйте, импортируйте и экспортируйте технологии</p>
      </div>

      <div className="quick-actions">
        <button 
          className="btn-primary btn-large"
          onClick={() => {
            setEditingTech(null);
            setShowAdvancedForm(true);
          }}
        >
          ➕ Добавить технологию (расширенная форма)
        </button>
        
        <Link to="/technologies" className="btn-secondary btn-large">
          📋 Просмотреть все технологии
        </Link>
      </div>

      {/* Продвинутая форма */}
      {showAdvancedForm && (
        <div className="form-section">
          <AdvancedTechForm
            initialData={editingTech}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      {/* Импорт/Экспорт */}
      <div className="import-export-section">
        <DataImportExport
          technologies={technologies}
          onImport={handleImport}
        />
      </div>

      {/* Опасные операции */}
      <div className="danger-zone">
        <h3>⚠️ Опасная зона</h3>
        <div className="danger-actions">
          <button 
            className="btn-danger"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={technologies.length === 0}
          >
            🗑️ Удалить все технологии ({technologies.length})
          </button>
          
          <button 
            className="btn-warning"
            onClick={() => {
              const template = [
                { title: 'React', category: 'frontend', difficulty: 'beginner' },
                { title: 'Node.js', category: 'backend', difficulty: 'intermediate' },
                { title: 'MongoDB', category: 'database', difficulty: 'advanced' }
              ];
              if (window.confirm('Добавить демо данные (3 технологии)?')) {
                template.forEach((tech, index) => {
                  setTimeout(() => {
                    addTechnology({
                      ...tech,
                      id: Date.now() + index,
                      description: `Пример описания для ${tech.title}`,
                      status: 'not-started',
                      createdAt: new Date().toISOString()
                    });
                  }, index * 100);
                });
              }
            }}
          >
            🎯 Добавить демо данные
          </button>
          
          <button 
            className="btn-secondary"
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
          >
            🔄 Очистить LocalStorage
          </button>
        </div>
        
        {showDeleteConfirm && (
          <div className="delete-confirm">
            <p>Вы уверены, что хотите удалить ВСЕ {technologies.length} технологий?</p>
            <div className="confirm-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Отмена
              </button>
              <button 
                className="btn-danger"
                onClick={handleDeleteAll}
              >
                Удалить всё
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Статистика */}
      <div className="data-stats">
        <h3>📊 Статистика данных</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{technologies.length}</div>
            <div className="stat-label">Всего технологий</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {(JSON.stringify(technologies).length / 1024).toFixed(2)} KB
            </div>
            <div className="stat-label">Объём данных</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {new Set(technologies.map(t => t.category)).size}
            </div>
            <div className="stat-label">Категорий</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {new Set(technologies.flatMap(t => t.tags || [])).size}
            </div>
            <div className="stat-label">Уникальных тегов</div>
          </div>
        </div>
      </div>

      {/* Последние технологии */}
      {technologies.length > 0 && (
        <div className="recent-technologies">
          <h3>🕐 Последние добавленные</h3>
          <div className="tech-list">
            {technologies
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 5)
              .map(tech => (
                <div key={tech.id} className="tech-item">
                  <div className="tech-info">
                    <h4>{tech.title}</h4>
                    <div className="tech-meta">
                      <span className={`category ${tech.category}`}>{tech.category}</span>
                      <span className={`difficulty ${tech.difficulty}`}>{tech.difficulty}</span>
                      <span className="date">
                        {new Date(tech.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="tech-actions">
                    <button 
                      className="btn-edit"
                      onClick={() => handleStartEditing(tech)}
                    >
                      ✏️
                    </button>
                    <Link 
                      to={`/technology/${tech.id}`}
                      className="btn-view"
                    >
                      👁️
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="navigation-actions">
        <Link to="/" className="btn-secondary">
          ← На главную
        </Link>
        <Link to="/settings" className="btn-secondary">
          ⚙️ Настройки
        </Link>
      </div>
    </div>
  );
}

export default DataManagement;