import useLocalStorage from './useLocalStorage';

// Начальные данные
const initialTechnologies = [
  { 
    id: 1, 
    title: 'React Components', 
    description: 'Изучение базовых компонентов и их жизненного цикла', 
    status: 'completed',
    category: 'frontend',
    difficulty: 'beginner',
    createdAt: '2024-01-15',
    notes: 'Освоил создание функциональных компонентов',
    priority: 'high',
    estimatedHours: 20,
    tags: ['JavaScript', 'React', 'Components']
  },
  { 
    id: 2, 
    title: 'JSX Syntax', 
    description: 'Освоение синтаксиса JSX и его отличий от HTML', 
    status: 'in-progress',
    category: 'frontend',
    difficulty: 'beginner',
    createdAt: '2024-01-20',
    notes: 'Изучаю встроенные выражения JavaScript в JSX',
    priority: 'medium',
    estimatedHours: 15,
    tags: ['JSX', 'React', 'Syntax']
  },
  { 
    id: 3, 
    title: 'State Management', 
    description: 'Работа с состоянием компонентов через useState', 
    status: 'not-started',
    category: 'frontend',
    difficulty: 'intermediate',
    createdAt: '2024-01-25',
    notes: '',
    priority: 'high',
    estimatedHours: 25,
    tags: ['React', 'State', 'Hooks']
  },
  { 
    id: 4, 
    title: 'Node.js Basics', 
    description: 'Основы серверного JavaScript и среды выполнения', 
    status: 'not-started',
    category: 'backend',
    difficulty: 'beginner',
    createdAt: '2024-02-01',
    notes: '',
    priority: 'medium',
    estimatedHours: 30,
    tags: ['Node.js', 'Backend', 'JavaScript']
  },
  { 
    id: 5, 
    title: 'REST API', 
    description: 'Создание и потребление RESTful API', 
    status: 'in-progress',
    category: 'backend',
    difficulty: 'intermediate',
    createdAt: '2024-02-05',
    notes: 'Изучаю маршрутизацию в Express.js',
    priority: 'high',
    estimatedHours: 40,
    tags: ['API', 'REST', 'Express']
  },
  { 
    id: 6, 
    title: 'Database Design', 
    description: 'Проектирование баз данных и SQL запросы', 
    status: 'completed',
    category: 'database',
    difficulty: 'advanced',
    createdAt: '2024-02-10',
    notes: 'Спроектировал нормализованную базу данных для блога',
    priority: 'medium',
    estimatedHours: 50,
    tags: ['Database', 'SQL', 'Design']
  }
];

function useTechnologies() {
  const [technologies, setTechnologies, removeTechnologies, clearStorage] = 
    useLocalStorage('tech_tracker_technologies', initialTechnologies);

  // Добавить новую технологию
  const addTechnology = (newTech) => {
    const technologyWithId = {
      ...newTech,
      id: Date.now(),
      createdAt: newTech.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: newTech.notes || '',
      tags: newTech.tags || [],
      priority: newTech.priority || 'medium',
      estimatedHours: newTech.estimatedHours || 10
    };
    
    setTechnologies(prev => [technologyWithId, ...prev]);
  };

  // Обновить технологию
  const updateTechnology = (techId, updatedData) => {
    setTechnologies(prev => 
      prev.map(tech => 
        tech.id === techId 
          ? { 
              ...tech, 
              ...updatedData, 
              updatedAt: new Date().toISOString() 
            } 
          : tech
      )
    );
  };

  // Обновить статус технологии
  const updateStatus = (techId, newStatus) => {
    setTechnologies(prev => 
      prev.map(tech => 
        tech.id === techId 
          ? { ...tech, status: newStatus, updatedAt: new Date().toISOString() } 
          : tech
      )
    );
  };

  // Обновить заметки технологии
  const updateNotes = (techId, newNotes) => {
    setTechnologies(prev => 
      prev.map(tech => 
        tech.id === techId 
          ? { ...tech, notes: newNotes, updatedAt: new Date().toISOString() } 
          : tech
      )
    );
  };

  // Удалить технологию
  const deleteTechnology = (techId) => {
    setTechnologies(prev => prev.filter(tech => tech.id !== techId));
  };

  // Удалить все технологии
  const deleteAllTechnologies = () => {
    setTechnologies([]);
  };

  // Импортировать технологии
  const importTechnologies = (importedTechs) => {
    const techsWithIds = importedTechs.map(tech => ({
      ...tech,
      id: tech.id || Date.now() + Math.random(),
      status: tech.status || 'not-started',
      createdAt: tech.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: tech.tags || [],
      notes: tech.notes || '',
      priority: tech.priority || 'medium',
      estimatedHours: tech.estimatedHours || 10
    }));
    
    setTechnologies(techsWithIds);
  };

  // Отметить все как завершённые
  const markAllCompleted = () => {
    setTechnologies(prev => 
      prev.map(tech => ({ 
        ...tech, 
        status: 'completed',
        updatedAt: new Date().toISOString() 
      }))
    );
  };

  // Сбросить все статусы
  const resetAllStatuses = () => {
    setTechnologies(prev => 
      prev.map(tech => ({ 
        ...tech, 
        status: 'not-started',
        updatedAt: new Date().toISOString() 
      }))
    );
  };

  // Получить статистику
  const getStatistics = () => {
    const total = technologies.length;
    const completed = technologies.filter(t => t.status === 'completed').length;
    const inProgress = technologies.filter(t => t.status === 'in-progress').length;
    const notStarted = technologies.filter(t => t.status === 'not-started').length;
    
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Статистика по категориям
    const categories = {};
    technologies.forEach(tech => {
      categories[tech.category] = (categories[tech.category] || 0) + 1;
    });
    
    // Статистика по сложности
    const difficulties = {};
    technologies.forEach(tech => {
      difficulties[tech.difficulty] = (difficulties[tech.difficulty] || 0) + 1;
    });
    
    // Статистика по приоритетам
    const priorities = {};
    technologies.forEach(tech => {
      priorities[tech.priority] = (priorities[tech.priority] || 0) + 1;
    });
    
    // Самая популярная категория
    const mostPopularCategory = Object.keys(categories).reduce((a, b) => 
      categories[a] > categories[b] ? a : b, ''
    );

    // Общее время обучения
    const totalEstimatedHours = technologies.reduce((sum, tech) => 
      sum + (tech.estimatedHours || 0), 0
    );

    return {
      total,
      completed,
      inProgress,
      notStarted,
      progress,
      categories,
      difficulties,
      priorities,
      mostPopularCategory,
      totalEstimatedHours
    };
  };

  // Поиск технологий
  const searchTechnologies = (query) => {
    if (!query.trim()) return technologies;
    
    const lowerQuery = query.toLowerCase();
    return technologies.filter(tech => 
      tech.title.toLowerCase().includes(lowerQuery) ||
      tech.description.toLowerCase().includes(lowerQuery) ||
      tech.category.toLowerCase().includes(lowerQuery) ||
      tech.notes.toLowerCase().includes(lowerQuery) ||
      (tech.tags && tech.tags.some(tag => 
        tag.toLowerCase().includes(lowerQuery)
      ))
    );
  };

  // Фильтрация по статусу
  const filterByStatus = (status) => {
    if (status === 'all') return technologies;
    return technologies.filter(tech => tech.status === status);
  };

  // Фильтрация по категории
  const filterByCategory = (category) => {
    if (category === 'all') return technologies;
    return technologies.filter(tech => tech.category === category);
  };

  // Фильтрация по сложности
  const filterByDifficulty = (difficulty) => {
    if (difficulty === 'all') return technologies;
    return technologies.filter(tech => tech.difficulty === difficulty);
  };

  // Сортировка по разным параметрам
  const sortTechnologies = (sortBy = 'createdAt', order = 'desc') => {
    const sorted = [...technologies];
    
    sorted.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Для строк
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      // Для дат
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      // Для числовых значений
      if (sortBy === 'estimatedHours') {
        aValue = aValue || 0;
        bValue = bValue || 0;
      }
      
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  };

  // Получить технологию по ID
  const getTechnologyById = (id) => {
    return technologies.find(tech => tech.id === id);
  };

  // Получить похожие технологии
  const getSimilarTechnologies = (techId, limit = 3) => {
    const tech = technologies.find(t => t.id === techId);
    if (!tech) return [];
    
    return technologies
      .filter(t => 
        t.id !== techId && 
        (t.category === tech.category || t.difficulty === tech.difficulty)
      )
      .slice(0, limit);
  };

  // Получить технологии по тегу
  const getTechnologiesByTag = (tag) => {
    return technologies.filter(tech => 
      tech.tags && tech.tags.includes(tag)
    );
  };

  // Получить все уникальные теги
  const getAllTags = () => {
    const allTags = technologies.flatMap(tech => tech.tags || []);
    return [...new Set(allTags)].sort();
  };

  // Получить технологии с истекшим дедлайном
  const getOverdueTechnologies = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return technologies.filter(tech => {
      if (!tech.deadline) return false;
      const deadline = new Date(tech.deadline);
      return deadline < today && tech.status !== 'completed';
    });
  };

  const stats = getStatistics();

  return {
    technologies,
    // CRUD операции
    addTechnology,
    updateTechnology,
    updateStatus,
    updateNotes,
    deleteTechnology,
    deleteAllTechnologies,
    importTechnologies,
    // Массовые операции
    markAllCompleted,
    resetAllStatuses,
    // Поиск и фильтрация
    searchTechnologies,
    filterByStatus,
    filterByCategory,
    filterByDifficulty,
    sortTechnologies,
    // Получение данных
    getTechnologyById,
    getSimilarTechnologies,
    getTechnologiesByTag,
    getAllTags,
    getOverdueTechnologies,
    // Управление хранилищем
    removeTechnologies,
    clearStorage,
    // Статистика
    stats
  };
}

export default useTechnologies;