import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const features = [
    { icon: '📊', title: 'Отслеживание прогресса', desc: 'Визуализация вашего обучения' },
    { icon: '📚', title: 'Управление технологиями', desc: 'Добавляйте, редактируйте, удаляйте' },
    { icon: '🎯', title: 'Постановка целей', desc: 'Определите сроки и приоритеты' },
    { icon: '📝', title: 'Заметки и заметки', desc: 'Сохраняйте важную информацию' },
    { icon: '📈', title: 'Статистика', desc: 'Анализируйте ваш прогресс' },
    { icon: '⚙️', title: 'Настройки', desc: 'Персонализируйте приложение' },
  ];

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1 className="hero-title">Добро пожаловать в Трекер Технологий! 🚀</h1>
        <p className="hero-subtitle">
          Эффективно планируйте и отслеживайте свой прогресс в изучении веб-технологий
        </p>
        
        <div className="hero-actions">
          <Link to="/technologies" className="btn-primary btn-large">
            Начать изучение
          </Link>
          <Link to="/add-technology" className="btn-secondary btn-large">
            Добавить технологию
          </Link>
        </div>
      </div>

      <div className="features-section">
        <h2>✨ Возможности приложения</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="quick-start-section">
        <h2>🚀 Быстрый старт</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Добавьте технологии</h3>
              <p>Заполните свой стек технологий, которые хотите изучить</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Отслеживайте прогресс</h3>
              <p>Обновляйте статус изучения каждой технологии</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Анализируйте результаты</h3>
              <p>Смотрите статистику и корректируйте план обучения</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Готовы начать?</h2>
        <p>Присоединяйтесь к тысячам разработчиков, которые уже используют наш трекер!</p>
        <Link to="/add-technology" className="btn-primary btn-cta">
          Создать первую технологию
        </Link>
      </div>
    </div>
  );
}

export default Home;