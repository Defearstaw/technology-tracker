import { NavLink, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const location = useLocation();
  
const navItems = [
  { path: '/', label: 'Главная', icon: '🏠' },
  { path: '/technologies', label: 'Мои технологии', icon: '📚' },
  { path: '/api-search', label: 'Поиск на GitHub', icon: '🌐' },
  { path: '/data-management', label: 'Управление данными', icon: '🗃️' }, // НОВОЕ
  { path: '/statistics', label: 'Статистика', icon: '📊' },
  { path: '/settings', label: 'Настройки', icon: '⚙️' },
];

  return (
    <nav className="main-navigation">
      <div className="nav-brand">
        <NavLink to="/" className="brand-link">
          <span className="brand-icon">🚀</span>
          <span className="brand-text">Трекер технологий</span>
        </NavLink>
      </div>

      <div className="nav-menu">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="nav-status">
        <div className="location-indicator">
          <span className="current-page">
            {navItems.find(item => item.path === location.pathname)?.label || 'Главная'}
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;