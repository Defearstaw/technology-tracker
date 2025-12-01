import { useState, useCallback } from 'react';
import { techApi } from '../api/techApi';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const callApi = useCallback(async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);
    setData(null);
    
    console.log('🔄 Вызов API:', apiFunction.name, 'с аргументами:', args);
    
    try {
      const result = await apiFunction(...args);
      console.log('✅ API результат:', result);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Произошла ошибка при загрузке данных';
      console.error('❌ API ошибка:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchTech = useCallback(async (query) => {
    console.log('🔍 Поиск технологий:', query);
    return await callApi(techApi.searchGitHubRepos, query);
  }, [callApi]);

  const getPopularTech = useCallback(async () => {
    return await callApi(techApi.getPopularTech);
  }, [callApi]);

  const getTechDetails = useCallback(async (name) => {
    return await callApi(techApi.getTechDetails, name);
  }, [callApi]);

  const clearData = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return {
    loading,
    error,
    data,
    searchTech,
    getPopularTech,
    getTechDetails,
    clearData
  };
}