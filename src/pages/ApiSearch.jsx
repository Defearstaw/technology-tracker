import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import TechnologyCard from '../components/TechnologyCard';
import TechSearch from '../components/TechSearch';
import ApiStatus from '../components/ApiStatus';
import './ApiSearch.css';

function ApiSearch() {
  const { loading, error, data, searchTech, clearData } = useApi();
  const [lastSearch, setLastSearch] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);

  const handleSearch = async (query) => {
    setLastSearch(query);
    const results = await searchTech(query);
    
    // Добавляем в историю
    if (results && results.length > 0) {
      setSearchHistory(prev => {
        const newHistory = [{ query, count: results.length, timestamp: new Date() }, ...prev];
        return newHistory.slice(0, 5); // Храним только 5 последних запросов
      });
    }
  };

  const handleAddToMyTech = (tech) => {
    // Здесь должна быть логика добавления технологии в ваш основной список
    alert(`Технология "${tech.name}" добавлена в ваш список!`);
    
    // В реальном приложении здесь будет:
    // 1. Диспатч в Redux/Context
    // 2. Вызов функции из useTechnologies
    // 3. Сохранение в LocalStorage
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="api-search-page">
      <div className="page-header">
        <h1>🌐 Поиск технологий на GitHub</h1>
        <p>
          Найдите популярные проекты на GitHub и добавьте их в свой трекер изучения
        </p>
      </div>

      {/* Поиск */}
      <div className="search-section">
        <TechSearch 
          onSearch={handleSearch}
          placeholder="Введите название технологии (например: React, Node.js, MongoDB)..."
        />
        
        <ApiStatus 
          loading={loading}
          error={error}
          lastUpdated={data ? new Date() : null}
        />
      </div>

      {/* История поиска */}
      {searchHistory.length > 0 && (
        <div className="search-history">
          <h3>📋 История поиска</h3>
          <div className="history-list">
            {searchHistory.map((item, index) => (
              <div key={index} className="history-item">
                <span className="history-query">{item.query}</span>
                <div className="history-meta">
                  <span className="history-count">{item.count} результатов</span>
                  <span className="history-time">{formatDate(item.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
          <button 
            className="clear-history-btn"
            onClick={() => setSearchHistory([])}
          >
            Очистить историю
          </button>
        </div>
      )}

      {/* Результаты */}
      <div className="results-section">
        {lastSearch && (
          <h2>
            {data && data.length > 0 
              ? `Результаты по запросу "${lastSearch}"`
              : `Ничего не найдено по запросу "${lastSearch}"`
            }
          </h2>
        )}

        {data && data.length > 0 ? (
          <>
            <div className="results-grid">
              {data.map((tech) => (
                <div key={tech.id} className="tech-result-card">
                  <TechnologyCard
                    title={tech.name}
                    description={tech.description}
                    status="not-started" // По умолчанию для внешних технологий
                    stars={tech.stars}
                    language={tech.language}
                    isExternal={true}
                    onClick={() => window.open(tech.url, '_blank')}
                  />
                  
                  <div className="tech-actions">
                    <button 
                      className="btn-primary"
                      onClick={() => handleAddToMyTech(tech)}
                    >
                      ➕ Добавить в мой список
                    </button>
                    
                    <button 
                      className="btn-secondary"
                      onClick={() => window.open(tech.url, '_blank')}
                    >
                      🔗 Открыть на GitHub
                    </button>
                  </div>
                  
                  <div className="tech-stats">
                    <div className="stat">
                      <span className="stat-label">⭐ Звёзды:</span>
                      <span className="stat-value">{tech.stars.toLocaleString()}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">🍴 Форков:</span>
                      <span className="stat-value">{tech.forks?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">📁 Категория:</span>
                      <span className={`stat-value category ${tech.category}`}>
                        {tech.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="results-summary">
              <div className="summary-item">
                <span>Найдено проектов:</span>
                <strong>{data.length}</strong>
              </div>
              <div className="summary-item">
                <span>Всего звёзд:</span>
                <strong className="stars">
                  {data.reduce((sum, tech) => sum + tech.stars, 0).toLocaleString()}
                </strong>
              </div>
              <div className="summary-item">
                <span>Популярный язык:</span>
                <strong className="language">
                  {(() => {
                    const languages = data.reduce((acc, tech) => {
                      acc[tech.language] = (acc[tech.language] || 0) + 1;
                      return acc;
                    }, {});
                    const mostCommon = Object.keys(languages).reduce((a, b) => 
                      languages[a] > languages[b] ? a : b
                    );
                    return mostCommon || 'N/A';
                  })()}
                </strong>
              </div>
            </div>
          </>
        ) : lastSearch && !loading ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>Ничего не найдено</h3>
            <p>Попробуйте изменить запрос или используйте предложенные варианты</p>
            <button 
              className="btn-secondary"
              onClick={clearData}
            >
              Очистить результаты
            </button>
          </div>
        ) : null}
      </div>

      {/* Информация о API */}
      <div className="api-info">
        <h3>ℹ️ О поиске</h3>
        <div className="info-content">
          <p>
            • Поиск выполняется через <strong>GitHub API</strong><br/>
            • Отображаются только проекты на JavaScript/TypeScript<br/>
            • Сортировка по количеству звёзд (популярности)<br/>
            • Ограничение: 5 результатов на запрос
          </p>
          <div className="info-links">
            <a 
              href="https://docs.github.com/en/rest" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              📚 GitHub API Docs
            </a>
            <Link to="/technologies">
              📋 Мой список технологий
            </Link>
          </div>
        </div>
      </div>

      <div className="page-actions">
        <Link to="/technologies" className="btn-primary">
          ← Вернуться к моим технологиям
        </Link>
        <button 
          className="btn-secondary"
          onClick={clearData}
          disabled={!data}
        >
          🗑️ Очистить результаты
        </button>
      </div>
    </div>
  );
}

export default ApiSearch;