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
    notes: 'Освоил создание функциональных компонентов'
  },
  { 
    id: 2, 
    title: 'JSX Syntax', 
    description: 'Освоение синтаксиса JSX и его отличий от HTML', 
    status: 'in-progress',
    category: 'frontend',
    difficulty: 'beginner',
    createdAt: '2024-01-20',
    notes: 'Изучаю встроенные выражения JavaScript в JSX'
  },
  { 
    id: 3, 
    title: 'State Management', 
    description: 'Работа с состоянием компонентов через useState', 
    status: 'not-started',
    category: 'frontend',
    difficulty: 'intermediate',
    createdAt: '2024-01-25',
    notes: ''
  },
  { 
    id: 4, 
    title: 'Node.js Basics', 
    description: 'Основы серверного JavaScript и среды выполнения', 
    status: 'not-started',
    category: 'backend',
    difficulty: 'beginner',
    createdAt: '2024-02-01',
    notes: ''
  },
  { 
    id: 5, 
    title: 'REST API', 
    description: 'Создание и потребление RESTful API', 
    status: 'in-progress',
    category: 'backend',
    difficulty: 'intermediate',
    createdAt: '2024-02-05',
    notes: 'Изучаю маршрутизацию в Express.js'
  },
  { 
    id: 6, 
    title: 'Database Design', 
    description: 'Проектирование баз данных и SQL запросы', 
    status: 'completed',
    category: 'database',
    difficulty: 'advanced',
    createdAt: '2024-02-10',
    notes: 'Спроектировал нормализованную базу данных для блога'
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
      createdAt: new Date().toISOString(),
      notes: ''
    };
    
    setTechnologies(prev => [technologyWithId, ...prev]);
  };

  // Обновить статус технологии
  const updateStatus = (techId, newStatus) => {
    setTechnologies(prev => 
      prev.map(tech => 
        tech.id === techId ? { ...tech, status: newStatus } : tech
      )
    );
  };

  // Обновить заметки технологии
  const updateNotes = (techId, newNotes) => {
    setTechnologies(prev => 
      prev.map(tech => 
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  };

  // Удалить технологию
  const deleteTechnology = (techId) => {
    setTechnologies(prev => prev.filter(tech => tech.id !== techId));
  };

  // Отметить все как завершённые
  const markAllCompleted = () => {
    setTechnologies(prev => 
      prev.map(tech => ({ ...tech, status: 'completed' }))
    );
  };

  // Сбросить все статусы
  const resetAllStatuses = () => {
    setTechnologies(prev => 
      prev.map(tech => ({ ...tech, status: 'not-started' }))
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
    
    // Самая популярная категория
    const mostPopularCategory = Object.keys(categories).reduce((a, b) => 
      categories[a] > categories[b] ? a : b, ''
    );

    return {
      total,
      completed,
      inProgress,
      notStarted,
      progress,
      categories,
      mostPopularCategory
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
      tech.notes.toLowerCase().includes(lowerQuery)
    );
  };

  // Фильтрация по статусу
  const filterByStatus = (status) => {
    if (status === 'all') return technologies;
    return technologies.filter(tech => tech.status === status);
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
      if (sortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  };

  const stats = getStatistics();

  return {
    technologies,
    addTechnology,
    updateStatus,
    updateNotes,
    deleteTechnology,
    markAllCompleted,
    resetAllStatuses,
    searchTechnologies,
    filterByStatus,
    sortTechnologies,
    removeTechnologies,
    clearStorage,
    stats
  };
}

export default useTechnologies;