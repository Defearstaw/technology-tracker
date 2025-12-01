import { useState } from 'react';
import { Link } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import './Settings.css';

function Settings() {
  const [theme, setTheme] = useLocalStorage('tech_tracker_theme', 'light');
  const [notifications, setNotifications] = useLocalStorage('notifications', true);
  const [autoSave, setAutoSave] = useLocalStorage('auto_save', true);
  const [saveInterval, setSaveInterval] = useLocalStorage('save_interval', 5);
  const [language, setLanguage] = useLocalStorage('language', 'ru');
  const [confirmDelete, setConfirmDelete] = useLocalStorage('confirm_delete', true);
  
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.body.className = `theme-${newTheme}`;
  };

  const handleResetSettings = () => {
    localStorage.removeItem('tech_tracker_theme');
    localStorage.removeItem('notifications');
    localStorage.removeItem('auto_save');
    localStorage.removeItem('save_interval');
    localStorage.removeItem('language');
    localStorage.removeItem('confirm_delete');
    window.location.reload();
  };

  const handleExportSettings = () => {
    const settings = {
      theme,
      notifications,
      autoSave,
      saveInterval,
      language,
      confirmDelete,
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tech-tracker-settings-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  const languages = [
    { code: 'ru', name: 'Русский' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' }
  ];

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>⚙️ Настройки</h1>
        <p>Настройте приложение под свои потребности</p>
      </div>

      <div className="settings-grid">
        {/* Внешний вид */}
        <div className="settings-section">
          <h2>🎨 Внешний вид</h2>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Тема оформления</h3>
              <p>Выберите светлую или тёмную тему</p>
            </div>
            <div className="setting-control">
              <div className="theme-buttons">
                <button
                  className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('light')}
                >
                  ☀️ Светлая
                </button>
                <button
                  className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('dark')}
                >
                  🌙 Тёмная
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Уведомления */}
        <div className="settings-section">
          <h2>🔔 Уведомления</h2>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Включить уведомления</h3>
              <p>Получать уведомления о важных событиях</p>
            </div>
            <div className="setting-control">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Подтверждение удаления</h3>
              <p>Запрашивать подтверждение перед удалением</p>
            </div>
            <div className="setting-control">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={confirmDelete}
                  onChange={(e) => setConfirmDelete(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Автосохранение */}
        <div className="settings-section">
          <h2>💾 Автосохранение</h2>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Включить автосохранение</h3>
              <p>Автоматически сохранять изменения</p>
            </div>
            <div className="setting-control">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <h3>Интервал сохранения (минут)</h3>
              <p>Как часто сохранять изменения</p>
            </div>
            <div className="setting-control">
              <div className="range-control">
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={saveInterval}
                  onChange={(e) => setSaveInterval(parseInt(e.target.value))}
                  disabled={!autoSave}
                />
                <span className="range-value">{saveInterval} мин</span>
              </div>
            </div>
          </div>
        </div>

        {/* Язык */}
        <div className="settings-section">
          <h2>🌐 Язык и регион</h2>
          
          <div className="setting-item">
            <div className="setting-info">
              <h3>Язык интерфейса</h3>
              <p>Выберите язык приложения</p>
            </div>
            <div className="setting-control">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="language-select"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Управление данными */}
      <div className="data-management-section">
        <h2>🗃️ Управление данными</h2>
        
        <div className="data-actions">
          <button 
            className="btn-primary"
            onClick={handleExportSettings}
          >
            📤 Экспорт настроек
          </button>
          
          <button 
            className="btn-secondary"
            onClick={() => setShowResetConfirm(true)}
          >
            🔄 Сбросить настройки
          </button>
          
          <Link 
            to="/technologies" 
            className="btn-secondary"
          >
            📊 Управление технологиями
          </Link>
        </div>
        
        {showExportSuccess && (
          <div className="success-message">
            ✅ Настройки успешно экспортированы!
          </div>
        )}
      </div>

      {/* О приложении */}
      <div className="about-section">
        <h2>ℹ️ О приложении</h2>
        <div className="about-content">
          <div className="about-info">
            <h3>Трекер изучения технологий</h3>
            <p>Версия 1.0.0</p>
            <p>Создано для эффективного отслеживания прогресса в изучении веб-технологий</p>
          </div>
          
          <div className="about-links">
            <a href="https://github.com/yourusername/technology-tracker" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Документация в разработке'); }}>
              Документация
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Обратная связь: example@email.com'); }}>
              Обратная связь
            </a>
          </div>
        </div>
      </div>

      {/* Подтверждение сброса */}
      {showResetConfirm && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>⚠️ Сброс настроек</h3>
            <p>Вы уверены, что хотите сбросить все настройки к значениям по умолчанию?</p>
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowResetConfirm(false)}
              >
                Отмена
              </button>
              <button 
                className="btn-danger"
                onClick={handleResetSettings}
              >
                Сбросить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;