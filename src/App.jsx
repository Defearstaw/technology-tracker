import { useState } from 'react';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import AddTechnologyForm from './components/AddTechnologyForm';
import QuickActions from './components/QuickActions';

function App() {
  // Исходные данные
  const initialTechnologies = [
    { 
      id: 1, 
      title: 'React Components', 
      description: 'Изучение базовых компонентов и их жизненного цикла', 
      status: 'completed',
      category: 'frontend',
      difficulty: 'beginner',
      createdAt: '2024-01-15'
    },
    { 
      id: 2, 
      title: 'JSX Syntax', 
      description: 'Освоение синтаксиса JSX и его отличий от HTML', 
      status: 'in-progress',
      category: 'frontend',
      difficulty: 'beginner',
      createdAt: '2024-01-20'
    },
    { 
      id: 3, 
      title: 'State Management', 
      description: 'Работа с состоянием компонентов через useState', 
      status: 'not-started',
      category: 'frontend',
      difficulty: 'intermediate',
      createdAt: '2024-01-25'
    },
    { 
      id: 4, 
      title: 'Node.js Basics', 
      description: 'Основы серверного JavaScript и среды выполнения', 
      status: 'not-started',
      category: 'backend',
      difficulty: 'beginner',
      createdAt: '2024-02-01'
    },
    { 
      id: 5, 
      title: 'REST API', 
      description: 'Создание и потребление RESTful API', 
      status: 'in-progress',
      category: 'backend',
      difficulty: 'intermediate',
      createdAt: '2024-02-05'
    },
    { 
      id: 6, 
      title: 'Database Design', 
      description: 'Проектирование баз данных и SQL запросы', 
      status: 'completed',
      category: 'database',
      difficulty: 'advanced',
      createdAt: '2024-02-10'
    }
  ];

  const [technologies, setTechnologies] = useState(initialTechnologies);
  const [filter, setFilter] = useState('all');

  // Фильтрация технологий
  const filteredTechnologies = technologies.filter(tech => {
    if (filter === 'all') return true;
    return tech.status === filter;
  });

  // Функция для смены статуса
  const cycleStatus = (techId) => {
    setTechnologies(prev => 
      prev.map(tech => {
        if (tech.id === techId) {
          let nextStatus;
          switch(tech.status) {
            case 'not-started': nextStatus = 'in-progress'; break;
            case 'in-progress': nextStatus = 'completed'; break;
            default: nextStatus = 'not-started';
          }
          return { ...tech, status: nextStatus };
        }
        return tech;
      })
    );
  };

  // Функция для добавления новой технологии
  const handleAddTechnology = (newTech) => {
    setTechnologies(prev => [newTech, ...prev]);
  };

  // Быстрые действия
  const handleMarkAllCompleted = () => {
    setTechnologies(prev => 
      prev.map(tech => ({ ...tech, status: 'completed' }))
    );
  };

  const handleResetAll = () => {
    setTechnologies(prev => 
      prev.map(tech => ({ ...tech, status: 'not-started' }))
    );
  };

  const handleExportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      totalTechnologies: technologies.length,
      technologies: technologies
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `technologies-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Функция для удаления технологии
  const handleDeleteTechnology = (techId) => {
    if (window.confirm('Удалить эту технологию?')) {
      setTechnologies(prev => prev.filter(tech => tech.id !== techId));
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Трекер изучения технологий</h1>
        <p>Отслеживайте свой прогресс в освоении веб-разработки</p>
      </header>
      
      <main className="App-main">
        {/* Статистика и прогресс */}
        <ProgressHeader technologies={technologies} />
        
        {/* Быстрые действия */}
        <QuickActions
          technologies={technologies}
          onMarkAllCompleted={handleMarkAllCompleted}
          onResetAll={handleResetAll}
          onExportData={handleExportData}
        />
        
        {/* Форма добавления */}
        <AddTechnologyForm onAddTechnology={handleAddTechnology} />
        
        {/* Фильтры */}
        <div className="filters-section">
          <h3>Фильтр по статусу:</h3>
          <div className="filter-buttons">
            {['all', 'not-started', 'in-progress', 'completed'].map(status => (
              <button
                key={status}
                className={`filter-btn ${filter === status ? 'active' : ''}`}
                onClick={() => setFilter(status)}
              >
                {status === 'all' && 'Все технологии'}
                {status === 'not-started' && 'Не начатые'}
                {status === 'in-progress' && 'В процессе'}
                {status === 'completed' && 'Завершённые'}
                <span className="filter-count">
                  {status === 'all' ? technologies.length :
                   technologies.filter(t => t.status === status).length}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Список технологий */}
        <div className="technologies-section">
          <div className="section-header">
            <h2>📚 Технологии ({filteredTechnologies.length})</h2>
            <div className="section-subtitle">
              Нажмите на карточку для смены статуса • Наведите для удаления
            </div>
          </div>
          
          {filteredTechnologies.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>Технологий не найдено</h3>
              <p>Попробуйте изменить фильтр или добавьте новую технологию</p>
            </div>
          ) : (
            <div className="technologies-grid">
              {filteredTechnologies.map(tech => (
                <div key={tech.id} className="technology-card-wrapper">
                  <TechnologyCard
                    title={tech.title}
                    description={tech.description}
                    status={tech.status}
                    onClick={() => cycleStatus(tech.id)}
                  />
                  <div className="technology-meta">
                    <span className={`category-badge ${tech.category}`}>
                      {tech.category}
                    </span>
                    <span className={`difficulty-badge ${tech.difficulty}`}>
                      {tech.difficulty === 'beginner' && 'Начальный'}
                      {tech.difficulty === 'intermediate' && 'Средний'}
                      {tech.difficulty === 'advanced' && 'Продвинутый'}
                    </span>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteTechnology(tech.id)}
                      title="Удалить технологию"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="technologies-summary">
            <div className="summary-item">
              <span className="summary-label">Всего:</span>
              <span className="summary-value">{technologies.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Завершено:</span>
              <span className="summary-value completed">
                {technologies.filter(t => t.status === 'completed').length}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">В процессе:</span>
              <span className="summary-value in-progress">
                {technologies.filter(t => t.status === 'in-progress').length}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Прогресс:</span>
              <span className="summary-value progress">
                {Math.round(
                  (technologies.filter(t => t.status === 'completed').length / 
                   technologies.length) * 100
                )}%
              </span>
            </div>
          </div>
        </div>
        
        {/* Инструкция */}
        <div className="instructions">
          <h3>🎯 Функциональность занятия 20:</h3>
          <ol>
            <li><strong>Форма добавления</strong> с валидацией и выбором сложности</li>
            <li><strong>Быстрые действия</strong> для массового управления</li>
            <li><strong>Фильтрация</strong> по статусам</li>
            <li><strong>Экспорт данных</strong> в JSON файл</li>
            <li><strong>Удаление технологий</strong> (наведите на карточку)</li>
          </ol>
        </div>
      </main>
      
      <footer className="App-footer">
        <p>Практическое занятие 20: Менеджер состояний и компонентов</p>
        <p className="footer-note">
          💡 Добавляйте новые технологии, используйте фильтры и быстрые действия
        </p>
      </footer>
    </div>
  );
}

export default App;