import { useState, useRef } from 'react';
import './DataImportExport.css';

function DataImportExport({ technologies, onImport }) {
  const [importStatus, setImportStatus] = useState({ type: null, message: '' });
  const [exportFormat, setExportFormat] = useState('json');
  const fileInputRef = useRef(null);

  // Экспорт данных
  const handleExport = () => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      totalTechnologies: technologies.length,
      technologies: technologies
    };

    let dataStr, fileName, mimeType;

    if (exportFormat === 'json') {
      dataStr = JSON.stringify(data, null, 2);
      fileName = `tech-tracker-export-${new Date().toISOString().slice(0, 10)}.json`;
      mimeType = 'application/json';
    } else if (exportFormat === 'csv') {
      // Конвертация в CSV
      const headers = ['Название', 'Описание', 'Категория', 'Сложность', 'Статус', 'Создано'];
      const rows = technologies.map(tech => [
        `"${tech.title}"`,
        `"${tech.description}"`,
        `"${tech.category}"`,
        `"${tech.difficulty}"`,
        `"${tech.status}"`,
        `"${tech.createdAt}"`
      ]);
      
      dataStr = [headers.join(','), ...rows].join('\n');
      fileName = `tech-tracker-export-${new Date().toISOString().slice(0, 10)}.csv`;
      mimeType = 'text/csv';
    }

    const blob = new Blob([dataStr], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setImportStatus({
      type: 'success',
      message: `Экспортировано ${technologies.length} технологий в формате ${exportFormat.toUpperCase()}`
    });

    setTimeout(() => setImportStatus({ type: null, message: '' }), 3000);
  };

  // Импорт данных
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        let importedData;

        if (file.type === 'application/json') {
          importedData = JSON.parse(content);
        } else if (file.type === 'text/csv') {
          importedData = parseCSV(content);
        } else {
          throw new Error('Неподдерживаемый формат файла');
        }

        // Валидация данных
        if (!importedData.technologies || !Array.isArray(importedData.technologies)) {
          throw new Error('Неверный формат данных');
        }

        // Подтверждение импорта
        if (window.confirm(`Импортировать ${importedData.technologies.length} технологий?`)) {
          onImport(importedData.technologies);
          setImportStatus({
            type: 'success',
            message: `Успешно импортировано ${importedData.technologies.length} технологий`
          });
        }
      } catch (error) {
        console.error('Import error:', error);
        setImportStatus({
          type: 'error',
          message: `Ошибка импорта: ${error.message}`
        });
      }
    };

    reader.onerror = () => {
      setImportStatus({
        type: 'error',
        message: 'Ошибка чтения файла'
      });
    };

    if (file.type === 'application/json') {
      reader.readAsText(file);
    } else if (file.type === 'text/csv') {
      reader.readAsText(file, 'UTF-8');
    } else {
      setImportStatus({
        type: 'error',
        message: 'Поддерживаются только JSON и CSV файлы'
      });
    }

    // Сброс input
    event.target.value = '';
  };

  // Парсинг CSV
  const parseCSV = (csvText) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    const technologies = lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        return {
          id: Date.now() + Math.random(),
          title: values[0] || '',
          description: values[1] || '',
          category: values[2] || 'frontend',
          difficulty: values[3] || 'beginner',
          status: values[4] || 'not-started',
          createdAt: values[5] || new Date().toISOString()
        };
      });

    return {
      version: '1.0',
      importedAt: new Date().toISOString(),
      technologies
    };
  };

  // Быстрый экспорт
  const handleQuickExport = (format) => {
    setExportFormat(format);
    setTimeout(handleExport, 100);
  };

  // Шаблон для импорта
  const handleDownloadTemplate = () => {
    const template = {
      technologies: [
        {
          title: "Пример технологии",
          description: "Описание технологии",
          category: "frontend",
          difficulty: "beginner",
          status: "not-started"
        }
      ]
    };

    const dataStr = JSON.stringify(template, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tech-tracker-template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="data-import-export">
      <h3>📁 Импорт/Экспорт данных</h3>
      
      {/* Статус */}
      {importStatus.type && (
        <div className={`import-status ${importStatus.type}`}>
          {importStatus.type === 'success' ? '✅' : '❌'} {importStatus.message}
        </div>
      )}

      <div className="data-actions-grid">
        {/* Экспорт */}
        <div className="action-card export">
          <div className="action-icon">📤</div>
          <h4>Экспорт данных</h4>
          <p>Экспортируйте ваши технологии в файл</p>
          
          <div className="export-options">
            <div className="format-selector">
              <label>Формат:</label>
              <select 
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="format-select"
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
              </select>
            </div>
            
            <button 
              className="btn-primary"
              onClick={handleExport}
              disabled={technologies.length === 0}
            >
              Экспортировать ({technologies.length})
            </button>
          </div>

          <div className="quick-export">
            <p>Быстрый экспорт:</p>
            <div className="quick-buttons">
              <button 
                className="btn-quick"
                onClick={() => handleQuickExport('json')}
                disabled={technologies.length === 0}
              >
                JSON
              </button>
              <button 
                className="btn-quick"
                onClick={() => handleQuickExport('csv')}
                disabled={technologies.length === 0}
              >
                CSV
              </button>
            </div>
          </div>
        </div>

        {/* Импорт */}
        <div className="action-card import">
          <div className="action-icon">📥</div>
          <h4>Импорт данных</h4>
          <p>Импортируйте технологии из файла</p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,.csv"
            onChange={handleImport}
            className="file-input"
            id="import-file"
          />
          
          <div className="import-actions">
            <label 
              htmlFor="import-file"
              className="btn-secondary"
            >
              Выбрать файл
            </label>
            
            <button 
              className="btn-secondary"
              onClick={handleDownloadTemplate}
            >
              Шаблон
            </button>
          </div>

          <div className="supported-formats">
            <p>Поддерживаемые форматы:</p>
            <ul>
              <li>JSON (.json)</li>
              <li>CSV (.csv)</li>
            </ul>
          </div>
        </div>

        {/* Резервная копия */}
        <div className="action-card backup">
          <div className="action-icon">💾</div>
          <h4>Резервная копия</h4>
          <p>Создайте резервную копию всех данных</p>
          
          <div className="backup-actions">
            <button 
              className="btn-primary"
              onClick={() => {
                localStorage.setItem('tech_tracker_backup', JSON.stringify(technologies));
                setImportStatus({
                  type: 'success',
                  message: 'Резервная копия создана в LocalStorage'
                });
                setTimeout(() => setImportStatus({ type: null, message: '' }), 3000);
              }}
              disabled={technologies.length === 0}
            >
              Создать backup
            </button>
            
            <button 
              className="btn-secondary"
              onClick={() => {
                const backup = localStorage.getItem('tech_tracker_backup');
                if (backup && window.confirm('Восстановить из резервной копии?')) {
                  try {
                    const data = JSON.parse(backup);
                    onImport(data);
                    setImportStatus({
                      type: 'success',
                      message: 'Данные восстановлены из резервной копии'
                    });
                  } catch (error) {
                    setImportStatus({
                      type: 'error',
                      message: 'Ошибка восстановления резервной копии'
                    });
                  }
                } else {
                  setImportStatus({
                    type: 'error',
                    message: 'Резервная копия не найдена'
                  });
                }
                setTimeout(() => setImportStatus({ type: null, message: '' }), 3000);
              }}
            >
              Восстановить
            </button>
          </div>

          <div className="backup-info">
            <small>
              💡 Резервная копия сохраняется в LocalStorage вашего браузера
            </small>
          </div>
        </div>
      </div>

      <div className="data-info">
        <h4>ℹ️ Информация о данных</h4>
        <div className="info-grid">
          <div className="info-item">
            <span>Всего технологий:</span>
            <strong>{technologies.length}</strong>
          </div>
          <div className="info-item">
            <span>Последний экспорт:</span>
            <strong>
              {localStorage.getItem('last_export') 
                ? new Date(localStorage.getItem('last_export')).toLocaleDateString() 
                : 'Никогда'}
            </strong>
          </div>
          <div className="info-item">
            <span>Размер данных:</span>
            <strong>
              {(JSON.stringify(technologies).length / 1024).toFixed(2)} KB
            </strong>
          </div>
          <div className="info-item">
            <span>Backup в LS:</span>
            <strong>
              {localStorage.getItem('tech_tracker_backup') ? '✅' : '❌'}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataImportExport;