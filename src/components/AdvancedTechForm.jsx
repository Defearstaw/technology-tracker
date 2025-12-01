import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdvancedTechForm.css';

function AdvancedTechForm({ initialData = null, onSubmit, onCancel }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'frontend',
    difficulty: 'beginner',
    priority: 'medium',
    deadline: '',
    prerequisites: '',
    resources: '',
    tags: [],
    image: null,
    estimatedHours: 10
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  const [currentTag, setCurrentTag] = useState('');

  // Если переданы начальные данные (для редактирования)
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || 'frontend',
        difficulty: initialData.difficulty || 'beginner',
        priority: initialData.priority || 'medium',
        deadline: initialData.deadline || '',
        prerequisites: initialData.prerequisites || '',
        resources: initialData.resources || '',
        tags: initialData.tags || [],
        image: initialData.image || null,
        estimatedHours: initialData.estimatedHours || 10
      });
    }
  }, [initialData]);

  // Категории
  const categories = [
    { value: 'frontend', label: 'Frontend', icon: '🎨' },
    { value: 'backend', label: 'Backend', icon: '⚙️' },
    { value: 'database', label: 'Базы данных', icon: '🗃️' },
    { value: 'devops', label: 'DevOps', icon: '🚀' },
    { value: 'mobile', label: 'Мобильная', icon: '📱' },
    { value: 'ai', label: 'ИИ/ML', icon: '🤖' },
    { value: 'tools', label: 'Инструменты', icon: '🛠️' }
  ];

  // Уровни сложности
  const difficulties = [
    { value: 'beginner', label: 'Начинающий', color: '#4CAF50' },
    { value: 'intermediate', label: 'Средний', color: '#FF9800' },
    { value: 'advanced', label: 'Продвинутый', color: '#F44336' },
    { value: 'expert', label: 'Эксперт', color: '#9C27B0' }
  ];

  // Приоритеты
  const priorities = [
    { value: 'low', label: 'Низкий', color: '#4CAF50' },
    { value: 'medium', label: 'Средний', color: '#FF9800' },
    { value: 'high', label: 'Высокий', color: '#F44336' },
    { value: 'critical', label: 'Критический', color: '#9C27B0' }
  ];

  // Предустановленные теги
  const presetTags = [
    'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js',
    'Python', 'Java', 'C#', 'Go', 'Rust', 'Docker', 'Kubernetes',
    'AWS', 'Azure', 'GCP', 'SQL', 'NoSQL', 'GraphQL', 'REST'
  ];

  // Валидация формы
  const validateForm = () => {
    const newErrors = {};

    // Обязательные поля
    if (!formData.title.trim()) {
      newErrors.title = 'Название обязательно';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Минимум 3 символа';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Максимум 100 символов';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Описание обязательно';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Минимум 10 символов';
    } else if (formData.description.trim().length > 500) {
      newErrors.description = 'Максимум 500 символов';
    }

    // Валидация даты
    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate < today) {
        newErrors.deadline = 'Дата не может быть в прошлом';
      }
    }

    // Валидация часов
    if (formData.estimatedHours < 1) {
      newErrors.estimatedHours = 'Минимум 1 час';
    } else if (formData.estimatedHours > 1000) {
      newErrors.estimatedHours = 'Максимум 1000 часов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработка изменения полей
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Помечаем поле как "тронутое"
    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
    
    // Очищаем ошибку при изменении
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Добавление тега
  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  // Удаление тега
  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Выбор тега из пресетов
  const handleSelectPresetTag = (tag) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  // Обработка файла
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Проверка типа файла
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: 'Только изображения (JPEG, PNG, GIF, WebP)' }));
        return;
      }

      // Проверка размера файла (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Файл слишком большой (макс. 5MB)' }));
        return;
      }

      // Чтение файла как Data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result
        }));
        if (errors.image) {
          setErrors(prev => ({ ...prev, image: '' }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Удаление изображения
  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Помечаем все поля как "тронутые"
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (!validateForm()) {
      // Фокус на первое ошибочное поле
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        const errorElement = formRef.current.querySelector(`[name="${firstError}"]`);
        if (errorElement) {
          errorElement.focus();
        }
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const techData = {
        ...formData,
        id: initialData?.id || Date.now(),
        status: initialData?.status || 'not-started',
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await onSubmit(techData);
      
      // Редирект или сброс формы
      if (!initialData) {
        navigate('/technologies');
      }
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      setErrors(prev => ({ ...prev, form: 'Ошибка при сохранении' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Сброс формы
  const handleReset = () => {
    if (!initialData) {
      setFormData({
        title: '',
        description: '',
        category: 'frontend',
        difficulty: 'beginner',
        priority: 'medium',
        deadline: '',
        prerequisites: '',
        resources: '',
        tags: [],
        image: null,
        estimatedHours: 10
      });
    }
    setErrors({});
    setTouched({});
    setCurrentTag('');
  };

  // Получить CSS класс для поля
  const getFieldClass = (fieldName) => {
    if (errors[fieldName] && touched[fieldName]) {
      return 'field-error';
    }
    if (!errors[fieldName] && touched[fieldName]) {
      return 'field-success';
    }
    return '';
  };

  // Форматирование даты для input[type="date"]
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="advanced-tech-form">
      <div className="form-header">
        <h2>{initialData ? '✏️ Редактирование технологии' : '➕ Добавить новую технологию'}</h2>
        <p className="form-subtitle">
          Заполните все поля для добавления технологии в трекер изучения
        </p>
      </div>

      <form 
        ref={formRef}
        onSubmit={handleSubmit}
        onReset={handleReset}
        className="tech-form"
        noValidate
        aria-label="Форма добавления технологии"
      >
        {/* Основная информация */}
        <fieldset className="form-section">
          <legend className="section-title">
            📋 Основная информация
          </legend>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title" className="required">
                Название технологии
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                onBlur={() => setTouched(prev => ({ ...prev, title: true }))}
                className={`form-input ${getFieldClass('title')}`}
                placeholder="Например: React Hooks"
                required
                aria-required="true"
                aria-describedby={errors.title ? "title-error" : undefined}
                aria-invalid={!!errors.title}
              />
              {errors.title && touched.title && (
                <div id="title-error" className="error-message" role="alert">
                  {errors.title}
                </div>
              )}
              <div className="char-counter">
                {formData.title.length}/100
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="category">
                Категория
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="required">
              Описание
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={() => setTouched(prev => ({ ...prev, description: true }))}
              className={`form-textarea ${getFieldClass('description')}`}
              rows="4"
              placeholder="Опишите технологию, что нужно изучить, основные концепции..."
              required
              aria-required="true"
              aria-describedby={errors.description ? "description-error" : undefined}
              aria-invalid={!!errors.description}
            />
            {errors.description && touched.description && (
              <div id="description-error" className="error-message" role="alert">
                {errors.description}
              </div>
            )}
            <div className="char-counter">
              {formData.description.length}/500
            </div>
          </div>
        </fieldset>

        {/* Мета-информация */}
        <fieldset className="form-section">
          <legend className="section-title">
            ⚙️ Мета-информация
          </legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="difficulty">
                Уровень сложности
              </label>
              <div className="difficulty-buttons">
                {difficulties.map(diff => (
                  <button
                    key={diff.value}
                    type="button"
                    className={`difficulty-btn ${formData.difficulty === diff.value ? 'active' : ''}`}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, difficulty: diff.value }));
                      setTouched(prev => ({ ...prev, difficulty: true }));
                    }}
                    style={{ '--difficulty-color': diff.color }}
                    aria-pressed={formData.difficulty === diff.value}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="priority">
                Приоритет изучения
              </label>
              <div className="priority-buttons">
                {priorities.map(priority => (
                  <button
                    key={priority.value}
                    type="button"
                    className={`priority-btn ${formData.priority === priority.value ? 'active' : ''}`}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, priority: priority.value }));
                      setTouched(prev => ({ ...prev, priority: true }));
                    }}
                    style={{ '--priority-color': priority.color }}
                    aria-pressed={formData.priority === priority.value}
                  >
                    {priority.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="estimatedHours">
                Оценочное время (часы)
              </label>
              <input
                id="estimatedHours"
                name="estimatedHours"
                type="number"
                min="1"
                max="1000"
                step="1"
                value={formData.estimatedHours}
                onChange={handleChange}
                onBlur={() => setTouched(prev => ({ ...prev, estimatedHours: true }))}
                className={`form-input ${getFieldClass('estimatedHours')}`}
                aria-describedby={errors.estimatedHours ? "hours-error" : undefined}
                aria-invalid={!!errors.estimatedHours}
              />
              {errors.estimatedHours && touched.estimatedHours && (
                <div id="hours-error" className="error-message" role="alert">
                  {errors.estimatedHours}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="deadline">
                Дедлайн
              </label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                value={formatDateForInput(formData.deadline)}
                onChange={handleChange}
                onBlur={() => setTouched(prev => ({ ...prev, deadline: true }))}
                className={`form-input ${getFieldClass('deadline')}`}
                aria-describedby={errors.deadline ? "deadline-error" : undefined}
                aria-invalid={!!errors.deadline}
              />
              {errors.deadline && touched.deadline && (
                <div id="deadline-error" className="error-message" role="alert">
                  {errors.deadline}
                </div>
              )}
            </div>
          </div>
        </fieldset>

        {/* Теги */}
        <fieldset className="form-section">
          <legend className="section-title">
            🏷️ Теги
          </legend>

          <div className="form-group">
            <label htmlFor="tags">
              Ключевые слова и теги
            </label>
            
            <div className="tags-input-container">
              <div className="tags-display">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                    <button
                      type="button"
                      className="tag-remove"
                      onClick={() => handleRemoveTag(tag)}
                      aria-label={`Удалить тег ${tag}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="tag-input-row">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="tag-input"
                  placeholder="Добавить тег..."
                  aria-label="Добавить новый тег"
                />
                <button
                  type="button"
                  className="btn-add-tag"
                  onClick={handleAddTag}
                  disabled={!currentTag.trim()}
                >
                  Добавить
                </button>
              </div>
            </div>

            <div className="preset-tags">
              <p className="preset-label">Популярные теги:</p>
              <div className="preset-tags-list">
                {presetTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    className={`preset-tag ${formData.tags.includes(tag) ? 'selected' : ''}`}
                    onClick={() => handleSelectPresetTag(tag)}
                    disabled={formData.tags.includes(tag)}
                    aria-label={`Добавить тег ${tag}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </fieldset>

        {/* Дополнительная информация */}
        <fieldset className="form-section">
          <legend className="section-title">
            📚 Дополнительная информация
          </legend>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prerequisites">
                Предварительные требования
              </label>
              <textarea
                id="prerequisites"
                name="prerequisites"
                value={formData.prerequisites}
                onChange={handleChange}
                className="form-textarea"
                rows="3"
                placeholder="Что нужно знать перед изучением..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="resources">
                Ресурсы для изучения
              </label>
              <textarea
                id="resources"
                name="resources"
                value={formData.resources}
                onChange={handleChange}
                className="form-textarea"
                rows="3"
                placeholder="Ссылки на документацию, курсы, статьи..."
              />
            </div>
          </div>
        </fieldset>

        {/* Изображение */}
        <fieldset className="form-section">
          <legend className="section-title">
            🖼️ Изображение
          </legend>

          <div className="form-group">
            <div className="image-upload-container">
              {formData.image ? (
                <div className="image-preview">
                  <img src={formData.image} alt="Превью технологии" />
                  <button
                    type="button"
                    className="btn-remove-image"
                    onClick={handleRemoveImage}
                    aria-label="Удалить изображение"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="image-upload-placeholder">
                  <div className="upload-icon">📁</div>
                  <p>Перетащите изображение или нажмите для загрузки</p>
                  <small>Поддерживаемые форматы: JPEG, PNG, GIF, WebP (макс. 5MB)</small>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="file-input"
                aria-label="Загрузить изображение"
              />

              <button
                type="button"
                className="btn-upload"
                onClick={() => fileInputRef.current?.click()}
              >
                {formData.image ? 'Заменить изображение' : 'Выбрать изображение'}
              </button>

              {errors.image && (
                <div className="error-message" role="alert">
                  {errors.image}
                </div>
              )}
            </div>
          </div>
        </fieldset>

        {/* Ошибки формы */}
        {errors.form && (
          <div className="form-error" role="alert">
            ⚠️ {errors.form}
          </div>
        )}

        {/* Действия формы */}
        <div className="form-actions">
          <button
            type="reset"
            className="btn-secondary"
            onClick={onCancel || (() => navigate('/technologies'))}
            disabled={isSubmitting}
          >
            Отмена
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={handleReset}
            disabled={isSubmitting || initialData}
          >
            Сбросить
          </button>

          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                {initialData ? 'Сохранение...' : 'Добавление...'}
              </>
            ) : (
              initialData ? 'Сохранить изменения' : 'Добавить технологию'
            )}
          </button>
        </div>

        {/* Информация о доступности */}
        <div className="accessibility-info" role="note">
          <small>
            💡 Используйте Tab для навигации, Enter для подтверждения, Esc для отмены. 
            Обязательные поля помечены звёздочкой.
          </small>
        </div>
      </form>
    </div>
  );
}

export default AdvancedTechForm;