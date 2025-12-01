import { useState, useEffect } from 'react';
import './NotesEditor.css';

function NotesEditor({ techId, currentNotes, onSave, onCancel }) {
  const [notes, setNotes] = useState(currentNotes || '');
  const [isEditing, setIsEditing] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    setCharacterCount(notes.length);
  }, [notes]);

  const handleSave = () => {
    onSave(techId, notes);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNotes(currentNotes || '');
    setIsEditing(false);
    if (onCancel) onCancel();
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isEditing) {
    return (
      <div className="notes-viewer">
        <div className="notes-header">
          <h4>📝 Мои заметки</h4>
          <button 
            className="edit-notes-btn"
            onClick={() => setIsEditing(true)}
          >
            {notes ? 'Редактировать' : 'Добавить заметки'}
          </button>
        </div>
        
        {notes ? (
          <div className="notes-content">
            <p>{notes}</p>
            <div className="notes-meta">
              <span className="char-count">{characterCount} символов</span>
              <span className="last-edited">Последнее изменение: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        ) : (
          <div className="empty-notes">
            <p>Заметок пока нет. Нажмите "Добавить заметки" чтобы записать важные моменты.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="notes-editor">
      <div className="editor-header">
        <h4>📝 Редактирование заметок</h4>
        <div className="editor-stats">
          <span className={`char-count ${characterCount > 500 ? 'warning' : ''}`}>
            {characterCount}/500
          </span>
        </div>
      </div>
      
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Записывайте сюда важные моменты, ссылки на документацию, примеры кода..."
        maxLength={500}
        autoFocus
        className="notes-textarea"
      />
      
      <div className="editor-hint">
        💡 Используйте Ctrl+Enter для сохранения, Esc для отмены
      </div>
      
      <div className="editor-actions">
        <button 
          className="btn-secondary"
          onClick={handleCancel}
        >
          Отмена
        </button>
        <button 
          className="btn-primary"
          onClick={handleSave}
          disabled={notes === currentNotes}
        >
          Сохранить заметки
        </button>
      </div>
    </div>
  );
}

export default NotesEditor;