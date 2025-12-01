import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useTechnologies from '../hooks/useTechnologies';
import './Statistics.css';

function Statistics() {
  const { technologies, stats } = useTechnologies();
  const [timeRange, setTimeRange] = useState('all'); // 'week', 'month', 'year', 'all'
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Генерация данных для графиков
    const categories = {};
    const statuses = { completed: 0, 'in-progress': 0, 'not-started': 0 };
    const difficulties = { beginner: 0, intermediate: 0, advanced: 0 };
    const monthlyProgress = {};

    technologies.forEach(tech => {
      // Категории
      categories[tech.category] = (categories[tech.category] || 0) + 1;
      
      // Статусы
      statuses[tech.status] = (statuses[tech.status] || 0) + 1;
      
      // Сложность
      difficulties[tech.difficulty] = (difficulties[tech.difficulty] || 0) + 1;
      
      // Месячный прогресс
      const month = new Date(tech.createdAt).toLocaleDateString('ru-RU', { month: 'short' });
      if (!monthlyProgress[month]) {
        monthlyProgress[month] = { total: 0, completed: 0 };
      }
      monthlyProgress[month].total += 1;
      if (tech.status === 'completed') {
        monthlyProgress[month].completed += 1;
      }
    });

    setChartData({
      categories,
      statuses,
      difficulties,
      monthlyProgress
    });
  }, [technologies]);

  const getCategoryColor = (category) => {
    const colors = {
      'frontend': '#667eea',
      'backend': '#4CAF50',
      'database': '#FF9800',
      'devops': '#9C27B0',
      'mobile': '#2196F3',
      'tools': '#795548'
    };
    return colors[category] || '#9E9E9E';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in-progress': return '#FF9800';
      default: return '#F44336';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '#4CAF50';
      case 'intermediate': return '#FF9800';
      case 'advanced': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  if (!chartData) {
    return (
      <div className="loading-stats">
        <div className="spinner"></div>
        <p>Загрузка статистики...</p>
      </div>
    );
  }

  const totalTech = technologies.length;
  const completionRate = totalTech > 0 ? (stats.completed / totalTech * 100).toFixed(1) : 0;
  const avgDifficulty = totalTech > 0 
    ? ((chartData.difficulties.beginner * 1 + 
        chartData.difficulties.intermediate * 2 + 
        chartData.difficulties.advanced * 3) / totalTech).toFixed(1)
    : 0;

  return (
    <div className="statistics-page">
      <div className="stats-header">
        <h1>📊 Статистика обучения</h1>
        <p>Анализ вашего прогресса в изучении технологий</p>
        
        <div className="time-filter">
          <button 
            className={`time-btn ${timeRange === 'week' ? 'active' : ''}`}
            onClick={() => setTimeRange('week')}
          >
            Неделя
          </button>
          <button 
            className={`time-btn ${timeRange === 'month' ? 'active' : ''}`}
            onClick={() => setTimeRange('month')}
          >
            Месяц
          </button>
          <button 
            className={`time-btn ${timeRange === 'year' ? 'active' : ''}`}
            onClick={() => setTimeRange('year')}
          >
            Год
          </button>
          <button 
            className={`time-btn ${timeRange === 'all' ? 'active' : ''}`}
            onClick={() => setTimeRange('all')}
          >
            Все время
          </button>
        </div>
      </div>

      {/* Общая статистика */}
      <div className="overall-stats">
        <h2>📈 Общая статистика</h2>
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">📚</div>
            <div className="stat-value">{totalTech}</div>
            <div className="stat-label">Всего технологий</div>
          </div>
          
          <div className="stat-card completed">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Изучено</div>
          </div>
          
          <div className="stat-card progress">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{completionRate}%</div>
            <div className="stat-label">Процент завершения</div>
          </div>
          
          <div className="stat-card difficulty">
            <div className="stat-icon">🎯</div>
            <div className="stat-value">{avgDifficulty}/3</div>
            <div className="stat-label">Средняя сложность</div>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-row">
          {/* Распределение по категориям */}
          <div className="chart-card">
            <h3>📂 Распределение по категориям</h3>
            <div className="chart-container">
              {Object.entries(chartData.categories).map(([category, count]) => (
                <div key={category} className="category-bar">
                  <div className="bar-info">
                    <span className="bar-label">{category}</span>
                    <span className="bar-value">{count}</span>
                  </div>
                  <div className="bar-track">
                    <div 
                      className="bar-fill"
                      style={{
                        width: `${(count / totalTech) * 100}%`,
                        backgroundColor: getCategoryColor(category)
                      }}
                    />
                  </div>
                  <div className="bar-percent">
                    {((count / totalTech) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Распределение по статусам */}
          <div className="chart-card">
            <h3>📊 Статусы изучения</h3>
            <div className="status-chart">
              {Object.entries(chartData.statuses).map(([status, count]) => (
                <div key={status} className="status-item">
                  <div className="status-info">
                    <span 
                      className="status-dot"
                      style={{ backgroundColor: getStatusColor(status) }}
                    />
                    <span className="status-label">
                      {status === 'completed' && 'Завершено'}
                      {status === 'in-progress' && 'В процессе'}
                      {status === 'not-started' && 'Не начато'}
                    </span>
                  </div>
                  <div className="status-numbers">
                    <span className="status-count">{count}</span>
                    <span className="status-percent">
                      {((count / totalTech) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-row">
          {/* Уровни сложности */}
          <div className="chart-card">
            <h3>🎯 Уровни сложности</h3>
            <div className="difficulty-chart">
              {Object.entries(chartData.difficulties).map(([difficulty, count]) => (
                <div key={difficulty} className="difficulty-item">
                  <div className="difficulty-header">
                    <span 
                      className="difficulty-icon"
                      style={{ color: getDifficultyColor(difficulty) }}
                    >
                      {difficulty === 'beginner' && '🟢'}
                      {difficulty === 'intermediate' && '🟡'}
                      {difficulty === 'advanced' && '🔴'}
                    </span>
                    <span className="difficulty-label">
                      {difficulty === 'beginner' && 'Начальный'}
                      {difficulty === 'intermediate' && 'Средний'}
                      {difficulty === 'advanced' && 'Продвинутый'}
                    </span>
                  </div>
                  <div className="difficulty-progress">
                    <div 
                      className="progress-bar"
                      style={{
                        width: `${(count / totalTech) * 100}%`,
                        backgroundColor: getDifficultyColor(difficulty)
                      }}
                    />
                  </div>
                  <div className="difficulty-stats">
                    <span className="difficulty-count">{count}</span>
                    <span className="difficulty-percent">
                      {((count / totalTech) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Прогресс по месяцам */}
          <div className="chart-card">
            <h3>📅 Прогресс по времени</h3>
            <div className="timeline-chart">
              {Object.entries(chartData.monthlyProgress).map(([month, data]) => {
                const completionPercent = data.total > 0 
                  ? (data.completed / data.total * 100).toFixed(0) 
                  : 0;
                
                return (
                  <div key={month} className="timeline-item">
                    <div className="timeline-month">{month}</div>
                    <div className="timeline-bars">
                      <div className="timeline-bar total">
                        <div className="bar-label">Всего: {data.total}</div>
                        <div className="bar-fill" style={{ width: '100%' }} />
                      </div>
                      <div className="timeline-bar completed">
                        <div className="bar-label">Изучено: {data.completed}</div>
                        <div 
                          className="bar-fill" 
                          style={{ width: `${completionPercent}%` }}
                        />
                      </div>
                    </div>
                    <div className="timeline-percent">{completionPercent}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Инсайты и рекомендации */}
      <div className="insights-section">
        <h2>💡 Инсайты и рекомендации</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">🎯</div>
            <h3>Самые изучаемые категории</h3>
            <p>
              {(() => {
                const maxCategory = Object.entries(chartData.categories)
                  .reduce((a, b) => a[1] > b[1] ? a : b);
                return `Вы больше всего изучаете ${maxCategory[0]} - ${maxCategory[1]} технологий`;
              })()}
            </p>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">⚡</div>
            <h3>Темп изучения</h3>
            <p>
              Ваш темп изучения: {stats.completed} завершённых технологий.
              {stats.completed > 5 ? ' Отличные результаты!' : ' Продолжайте в том же духе!'}
            </p>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">📈</div>
            <h3>Рекомендации</h3>
            <p>
              {completionRate < 30 
                ? 'Сосредоточьтесь на завершении начатых технологий' 
                : completionRate < 70 
                  ? 'Отличный прогресс! Продолжайте изучать новые технологии'
                  : 'Впечатляющие результаты! Помогайте другим разработчикам'}
            </p>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">🏆</div>
            <h3>Достижения</h3>
            <ul>
              {stats.completed >= 1 && <li>✅ Первая изученная технология</li>}
              {stats.completed >= 5 && <li>🏅 Изучено 5 технологий</li>}
              {completionRate >= 50 && <li>⭐ 50% прогресс</li>}
              {Object.keys(chartData.categories).length >= 3 && <li>🌈 3+ категории</li>}
            </ul>
          </div>
        </div>
      </div>

      <div className="stats-actions">
        <Link to="/technologies" className="btn-primary">
          📚 Вернуться к технологиям
        </Link>
        <button 
          className="btn-secondary"
          onClick={() => window.print()}
        >
          🖨️ Печать отчёта
        </button>
      </div>
    </div>
  );
}

export default Statistics;