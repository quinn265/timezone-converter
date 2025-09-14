import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectedTimezone } from '../App';
import { searchTimezones, POPULAR_CITIES } from '../utils/timezones';

interface TimezoneSearchProps {
  onAddTimezone: (timezone: SelectedTimezone) => void;
}

export const TimezoneSearch: React.FC<TimezoneSearchProps> = ({ onAddTimezone }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 1) {
      const timezoneResults = searchTimezones(query);
      const cityResults = POPULAR_CITIES.filter(city => 
        city.name.toLowerCase().includes(query.toLowerCase()) ||
        city.country.toLowerCase().includes(query.toLowerCase())
      );
      
      const combinedResults = [
        ...cityResults.map(city => ({ ...city, type: 'city' })),
        ...timezoneResults.slice(0, 10).map(tz => ({ ...tz, type: 'timezone' }))
      ];
      
      setResults(combinedResults);
      setShowResults(true);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelectResult(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelectResult = (result: any) => {
    if (result.type === 'city') {
      onAddTimezone({
        id: result.id,
        timezone: result.timezone,
        name: result.name,
        flag: result.flag
      });
    } else {
      // 时区结果
      const cityName = result.city;
      const flag = '🌍'; // 默认标志
      onAddTimezone({
        id: result.id,
        timezone: result.id,
        name: cityName,
        flag
      });
    }
    
    setQuery('');
    setShowResults(false);
    setSelectedIndex(-1);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (resultsRef.current && !resultsRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)) {
      setShowResults(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <div className="search-input-container">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('searchTimezone')}
          className="search-input"
        />
        <div className="search-icon">
          <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {showResults && results.length > 0 && (
        <div 
          ref={resultsRef}
          className="search-results"
        >
          {results.map((result, index) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => handleSelectResult(result)}
              className={`search-result-item ${
                index === selectedIndex ? 'selected' : ''
              }`}
              style={{
                borderRadius: index === 0 ? '0.75rem 0.75rem 0 0' : index === results.length - 1 ? '0 0 0.75rem 0.75rem' : '0',
                borderBottom: index === results.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>
                  {result.type === 'city' ? result.flag : '🌍'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                    {result.type === 'city' ? result.name : result.city}
                  </div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                    {result.type === 'city' 
                      ? `${result.country} • ${result.timezone}`
                      : `${result.country} • ${result.offset}`
                    }
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                  {result.type === 'city' ? t('popular') : 'Timezone'}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && results.length === 0 && query.length > 1 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg p-4">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="text-2xl mb-2">🔍</div>
            <div>No results found for "{query}"</div>
          </div>
        </div>
      )}
    </div>
  );
};