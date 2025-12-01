import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // Состояние для хранения значения
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // Получаем значение из localStorage по ключу
      const item = window.localStorage.getItem(key);
      // Если значение найдено - парсим его, иначе используем initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // В случае ошибки логируем и возвращаем initialValue
      console.error(`Ошибка чтения из localStorage ключа "${key}":`, error);
      return initialValue;
    }
  });

  // Функция для обновления значения
  const setValue = (value) => {
    try {
      // Разрешаем value быть функцией, как в useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Сохраняем в состояние
      setStoredValue(valueToStore);
      
      // Сохраняем в localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Ошибка записи в localStorage ключа "${key}":`, error);
    }
  };

  // Функция для удаления значения
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Ошибка удаления из localStorage ключа "${key}":`, error);
    }
  };

  // Функция для очистки всего localStorage
  const clearAll = () => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.clear();
      }
    } catch (error) {
      console.error('Ошибка очистки localStorage:', error);
    }
  };

  // Эффект для синхронизации между вкладками
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue;
          setStoredValue(newValue);
        } catch (error) {
          console.error(`Ошибка синхронизации ключа "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue, clearAll];
}

export default useLocalStorage;