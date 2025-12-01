import { useState, useEffect, useRef } from 'react';
import './TechSearch.css';

function TechSearch({ onSearch, initialQuery = '', placeholder = "Поиск технологий на GitHub..." }) {
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const debounceTimeout = useRef(null);

  const popularTechs = [
    'React', 'Vue', 'Angular', 'Node.js', 'Express', 
    'MongoDB', 'PostgreSQL', 'Docker', 'Kubernetes', 'TypeScript'
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery = query) => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      onSearch(searchQuery).finally(() => setIsSearching(false));
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Дебаунс для предложений
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    if (value.trim()) {
      debounceTimeout.current = setTimeout(() => {
        const filtered = popularTechs.filter(tech =>
          tech.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filtered);
        setShowSuggestions(true);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleQuickSearch = (quickQuery) => {
    setQuery(quickQuery);
    handleSearch(quickQuery);
  };

  return (
    <div className="tech-search" ref={searchRef}>
      <div className="search-input-container">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className="search-input"
          disabled={isSearching}
        />
        
        <button
          onClick={() => handleSearch()}
          className="search-btn"
          disabled={isSearching || !query.trim()}
        >
          {isSearching ? (
            <span className="search-spinner"></span>
          ) : (
            '🔍'
          )}
        </button>

        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="quick-search-tags">
        <span className="quick-search-label">Быстрый поиск:</span>
        <div className="tags-container">
          {popularTechs.map((tech, index) => (
            <button
              key={index}
              className="tag-btn"
              onClick={() => handleQuickSearch(tech)}
              disabled={isSearching}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>

      <div className="search-tips">
        <small>
          💡 Попробуйте: "react hooks", "node framework", "database", "devops tools"
        </small>
      </div>
    </div>
  );
}

export default TechSearch;