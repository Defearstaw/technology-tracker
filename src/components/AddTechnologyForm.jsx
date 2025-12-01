import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddTechnologyForm.css';

function AddTechnologyForm({ onAddTechnology }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'frontend',
    difficulty: 'beginner'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'database', label: 'Базы данных' },
    { value: 'devops', label: 'DevOps' },
    { value: 'mobile', label: 'Мобильная разработка' },
    { value: 'tools', label: 'Инструменты' }
  ];

  const difficulties = [
    { value: 'beginner', label: 'Начальный' },
    { value: 'intermediate', label: 'Средний' },
    { value: 'advanced', label: 'Продвинутый' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Название обязательно';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Минимум 3 символа';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Описание обязательно';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Минимум 10 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Очищаем ошибку при изменении поля
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Имитация задержки для UX
    setTimeout(() => {
      const newTechnology = {
        id: Date.now(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        difficulty: formData.difficulty,
        status: 'not-started',
        createdAt: new Date().toISOString(),
        notes: ''
      };

      onAddTechnology(newTechnology);
      
      // Сброс формы
      setFormData({
        title: '',
        description: '',
        category: 'frontend',
        difficulty: 'beginner'
      });
      
      setErrors({});
      setIsSubmitting(false);
      
      // Редирект на страницу списка
      navigate('/technologies');
    }, 500);
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      description: '',
      category: 'frontend',
      difficulty: 'beginner'
    });
    setErrors({});
    navigate('/technologies');
  };

  return (
    <div className="add-technology-form">
      <h3>➕ Добавить новую технологию</h3>
      
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">
              Название технологии *
              {errors.title && <span className="error-indicator">⚠</span>}
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Например: React Hooks, Express.js, MongoDB"
              className={errors.title ? 'error' : ''}
              disabled={isSubmitting}
            />
            {errors.title && <div className="error-message">{errors.title}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Категория</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">
            Описание *
            {errors.description && <span className="error-indicator">⚠</span>}
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Опишите, что нужно изучить, какие навыки приобрести..."
            rows="4"
            className={errors.description ? 'error' : ''}
            disabled={isSubmitting}
          />
          {errors.description && <div className="error-message">{errors.description}</div>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="difficulty">Сложность</label>
            <div className="difficulty-buttons">
              {difficulties.map(diff => (
                <button
                  key={diff.value}
                  type="button"
                  className={`difficulty-btn ${
                    formData.difficulty === diff.value ? 'active' : ''
                  } ${diff.value}`}
                  onClick={() => {
                    if (!isSubmitting) {
                      setFormData(prev => ({ ...prev, difficulty: diff.value }));
                    }
                  }}
                  disabled={isSubmitting}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Отмена
          </button>
          
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Добавление...
              </>
            ) : (
              'Добавить технологию'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTechnologyForm;