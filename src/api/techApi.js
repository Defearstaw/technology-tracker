import axios from 'axios';
import { API_CONFIG, FALLBACK_TECHNOLOGIES } from './apiConfig';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS
});

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

// Функция для определения категории
function detectCategory(repo) {
  const name = repo.name.toLowerCase();
  const description = (repo.description || '').toLowerCase();
  const language = (repo.language || '').toLowerCase();

  if (name.includes('react') || name.includes('vue') || name.includes('angular') || 
      description.includes('frontend') || language === 'javascript' || language === 'typescript') {
    return 'frontend';
  }
  
  if (name.includes('node') || name.includes('express') || name.includes('nestjs') ||
      description.includes('backend') || description.includes('server') ||
      language === 'python' || language === 'java' || language === 'go') {
    return 'backend';
  }
  
  if (name.includes('mongo') || name.includes('postgres') || name.includes('mysql') ||
      description.includes('database') || description.includes('db')) {
    return 'database';
  }
  
  if (name.includes('docker') || name.includes('kubernetes') || name.includes('aws')) {
    return 'devops';
  }
  
  return 'tools';
}

export const techApi = {
  // Поиск репозиториев на GitHub
  async searchGitHubRepos(query, limit = 5) {
    console.log('🔍 Отправка запроса к GitHub API:', query);
    
    try {
      const response = await api.get(`/search/repositories?q=${query}+language:javascript&sort=stars&order=desc&per_page=${limit}`);
      
      console.log('✅ Получен ответ от GitHub:', response.data.items.length, 'репозиториев');
      
      return response.data.items.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description || 'Нет описания',
        category: detectCategory(item),
        stars: item.stargazers_count,
        url: item.html_url,
        language: item.language,
        forks: item.forks_count,
        updatedAt: item.updated_at,
        isExternal: true
      }));
    } catch (error) {
      console.error('❌ GitHub API error:', error.message);
      console.error('Полная ошибка:', error);
      
      // Возвращаем моковые данные для демонстрации
      return FALLBACK_TECHNOLOGIES.filter(tech => 
        tech.name.toLowerCase().includes(query.toLowerCase()) ||
        tech.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, limit);
    }
  },

  // Получить популярные технологии (резервный метод)
  getPopularTech() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FALLBACK_TECHNOLOGIES);
      }, 300);
    });
  },

  // Получить информацию о конкретной технологии
  async getTechDetails(name) {
    try {
      // Имитация запроса к API
      return new Promise((resolve) => {
        setTimeout(() => {
          const tech = FALLBACK_TECHNOLOGIES.find(t => 
            t.name.toLowerCase() === name.toLowerCase()
          ) || {
            id: Date.now(),
            name: name,
            description: `Информация о ${name}`,
            category: 'unknown',
            stars: 0,
            url: '#'
          };
          resolve(tech);
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching tech details:', error);
      return null;
    }
  }
};

export default techApi;