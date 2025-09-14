import React from 'react';
import { useTranslation } from 'react-i18next';
import { SelectedTimezone } from '../App';
import { POPULAR_CITIES } from '../utils/timezones';

interface PopularCitiesProps {
  onAddTimezone: (timezone: SelectedTimezone) => void;
  onClearAll: () => void;
  hasSelectedTimezones: boolean;
}

export const PopularCities: React.FC<PopularCitiesProps> = ({ onAddTimezone, onClearAll, hasSelectedTimezones }) => {
  const { t } = useTranslation();

  const handleCityClick = (city: typeof POPULAR_CITIES[0]) => {
    onAddTimezone({
      id: city.id,
      timezone: city.timezone,
      name: city.name,
      flag: city.flag
    });
  };

  return (
    <div className="popular-cities">
      <h2 style={{ display: 'flex', alignItems: 'center', fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
        <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>🌟</span>
        {t('popular')}
      </h2>
      
      <div className="popular-cities-grid">
        {POPULAR_CITIES.map((city) => (
          <button
            key={city.id}
            onClick={() => handleCityClick(city)}
            className="city-button"
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                {city.flag}
              </div>
              <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>
                {t(`cities.${city.name}`, city.name)}
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                {city.country}
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <div style={{ marginTop: '1rem', fontSize: '0.75rem', opacity: 0.7, textAlign: 'center' }}>
        {t('selectPopularCities', '请选择你要查询的热门城市')}
      </div>
      
      {hasSelectedTimezones && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <button
            onClick={onClearAll}
            className="clear-all-button"
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(107, 114, 128, 0.2)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#4b5563';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#6b7280';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            🗑️ {t('clearAll', '清除全部')}
          </button>
        </div>
      )}
    </div>
  );
};