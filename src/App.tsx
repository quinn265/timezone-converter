import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import './App.css';
// 导入默认导出的TimezoneCard组件
import { TimezoneCard } from './components/TimezoneCard';
import { PopularCities } from './components/PopularCities';
import { Settings } from './components/Settings';
import { Header } from './components/Header';
import TimeInput from './components/TimeInput';
import { POPULAR_CITIES, getUserTimezone } from './utils/timezones';

// 动态更新HTML页面title和meta description的钩子
const useDocumentTitle = () => {
  const { t, i18n } = useTranslation();
  
  useEffect(() => {
    // 更新页面标题
    document.title = t('title');
    
    // 更新meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('subtitle'));
    } else {
      // 如果meta description不存在，创建一个
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = t('subtitle');
      document.head.appendChild(meta);
    }
  }, [t, i18n.language]);
};

export interface SelectedTimezone {
  id: string;
  timezone: string;
  name: string;
  flag: string;
}

function App() {
  const { t } = useTranslation();
  
  // 使用动态更新页面标题和描述的钩子
  useDocumentTitle();
  const [selectedTimezones, setSelectedTimezones] = useState<SelectedTimezone[]>([]);
  const [currentTime, setCurrentTime] = useState(moment());
  const [format24h, setFormat24h] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [userTimezone] = useState(getUserTimezone());


  // 更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 初始化用户时区
  useEffect(() => {
    const userCity = POPULAR_CITIES.find(city => city.timezone === userTimezone);
    if (userCity) {
      setSelectedTimezones([{
        id: userCity.id,
        timezone: userCity.timezone,
        name: userCity.name,
        flag: userCity.flag
      }]);
    }
  }, [userTimezone]);

  const addTimezone = (timezone: SelectedTimezone) => {
    if (!selectedTimezones.find(tz => tz.timezone === timezone.timezone)) {
      setSelectedTimezones([...selectedTimezones, timezone]);
    }
  };

  const removeTimezone = (timezoneId: string) => {
    setSelectedTimezones(selectedTimezones.filter(tz => tz.id !== timezoneId));
  };

  const clearAllTimezones = () => {
    setSelectedTimezones([]);
  };



  return (
    <div className="container">
      <Header 
        onSettingsClick={() => setShowSettings(true)}
        format24h={format24h}
        currentTime={currentTime}
      />
      


      <TimeInput 
        selectedTimezones={[]} 
        format24h={format24h}
      />



      <div className="popular-cities">
        <PopularCities 
          onAddTimezone={addTimezone} 
          onClearAll={clearAllTimezones}
          hasSelectedTimezones={selectedTimezones.length > 0}
        />
      </div>

      <div className="timezone-grid">
        {selectedTimezones.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'white' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🌍</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '10px' }}>
              {t('selectTimezone')}
            </h3>
            <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>
              {t('searchTimezone')}
            </p>
          </div>
        ) : (
          selectedTimezones.map((tz) => (
            <TimezoneCard
              key={tz.id}
              timezone={tz}
              currentTime={currentTime}
              format24h={format24h}
              onRemove={removeTimezone}
            />
          ))
        )}
      </div>

      {/* 设置面板 */}
      {showSettings && (
        <Settings
          format24h={format24h}
          onFormat24hChange={setFormat24h}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
