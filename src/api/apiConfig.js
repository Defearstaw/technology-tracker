export const API_CONFIG = {
  BASE_URL: 'https://api.github.com',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.github.v3+json'
  }
};

// Резервные данные на случай недоступности API
export const FALLBACK_TECHNOLOGIES = [
  { 
    id: 1, 
    name: 'React', 
    description: 'Библиотека JavaScript для создания пользовательских интерфейсов', 
    category: 'frontend',
    stars: 210000,
    url: 'https://reactjs.org'
  },
  { 
    id: 2, 
    name: 'Node.js', 
    description: 'Среда выполнения JavaScript на стороне сервера', 
    category: 'backend',
    stars: 96000,
    url: 'https://nodejs.org'
  },
  { 
    id: 3, 
    name: 'Vue.js', 
    description: 'Прогрессивный фреймворк для создания пользовательских интерфейсов', 
    category: 'frontend',
    stars: 204000,
    url: 'https://vuejs.org'
  },
  { 
    id: 4, 
    name: 'Express', 
    description: 'Минималистичный веб-фреймворк для Node.js', 
    category: 'backend',
    stars: 62000,
    url: 'https://expressjs.com'
  },
  { 
    id: 5, 
    name: 'MongoDB', 
    description: 'Документоориентированная система управления базами данных', 
    category: 'database',
    stars: 24000,
    url: 'https://mongodb.com'
  }
];