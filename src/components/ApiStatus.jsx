import './ApiStatus.css';

function ApiStatus({ loading, error, lastUpdated }) {
  if (loading) {
    return (
      <div className="api-status loading">
        <div className="spinner"></div>
        <span>Загрузка данных...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="api-status error">
        <span className="icon">⚠️</span>
        <div className="message">
          <strong>Ошибка:</strong> {error}
        </div>
      </div>
    );
  }

  if (lastUpdated) {
    return (
      <div className="api-status success">
        <span className="icon">✅</span>
        <span className="message">
          Данные обновлены: {new Date(lastUpdated).toLocaleTimeString()}
        </span>
      </div>
    );
  }

  return null;
}

export default ApiStatus;