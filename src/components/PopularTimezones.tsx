import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import { SelectedTimezone } from '../App';

interface PopularTimezonesProps {
  onAddTimezone: (timezone: SelectedTimezone) => void;
  onTimezoneSelect: (fromTz: string, toTz: string) => void;
}

// 热门时区转换对
const POPULAR_TIMEZONE_PAIRS = [
  { from: 'UTC', to: 'CST', fromTz: 'UTC', toTz: 'Asia/Shanghai', label: 'UTC-CST' },
  { from: 'UTC', to: 'EST', fromTz: 'UTC', toTz: 'America/New_York', label: 'UTC-EST' },
  { from: 'UTC', to: 'PST', fromTz: 'UTC', toTz: 'America/Los_Angeles', label: 'UTC-PST' },
  { from: 'UTC', to: 'JST', fromTz: 'UTC', toTz: 'Asia/Tokyo', label: 'UTC-JST' },
  { from: 'UTC', to: 'GMT', fromTz: 'UTC', toTz: 'Europe/London', label: 'UTC-GMT' },
  { from: 'EST', to: 'CST', fromTz: 'America/New_York', toTz: 'Asia/Shanghai', label: 'EST-CST' },
  { from: 'PST', to: 'CST', fromTz: 'America/Los_Angeles', toTz: 'Asia/Shanghai', label: 'PST-CST' },
  { from: 'GMT', to: 'CST', fromTz: 'Europe/London', toTz: 'Asia/Shanghai', label: 'GMT-CST' },
  { from: 'JST', to: 'EST', fromTz: 'Asia/Tokyo', toTz: 'America/New_York', label: 'JST-EST' },
  { from: 'CET', to: 'EST', fromTz: 'Europe/Paris', toTz: 'America/New_York', label: 'CET-EST' },
  { from: 'AEST', to: 'PST', fromTz: 'Australia/Sydney', toTz: 'America/Los_Angeles', label: 'AEST-PST' },
  { from: 'MSK', to: 'EST', fromTz: 'Europe/Moscow', toTz: 'America/New_York', label: 'MSK-EST' }
];

export const PopularTimezones: React.FC<PopularTimezonesProps> = ({ onAddTimezone, onTimezoneSelect }) => {
  const { t } = useTranslation();

  const handleTimezoneClick = (pair: typeof POPULAR_TIMEZONE_PAIRS[0]) => {
    // 触发时区选择回调，更新自由转换区域
    onTimezoneSelect(pair.fromTz, pair.toTz);
    
    // 添加源时区
    const fromTimezone = {
      id: `${pair.fromTz}-from`,
      timezone: pair.fromTz,
      name: `${pair.from} (${pair.fromTz})`,
      flag: getTimezoneFlag(pair.fromTz)
    };
    
    // 添加目标时区
    const toTimezone = {
      id: `${pair.toTz}-to`,
      timezone: pair.toTz,
      name: `${pair.to} (${pair.toTz})`,
      flag: getTimezoneFlag(pair.toTz)
    };
    
    onAddTimezone(fromTimezone);
    setTimeout(() => onAddTimezone(toTimezone), 100); // 稍微延迟添加第二个时区
  };

  const getTimezoneFlag = (timezone: string): string => {
    const flagMap: { [key: string]: string } = {
      'UTC': '🌍',
      'America/New_York': '🇺🇸',
      'America/Los_Angeles': '🇺🇸',
      'America/Chicago': '🇺🇸',
      'Asia/Shanghai': '🇨🇳',
      'Asia/Tokyo': '🇯🇵',
      'Europe/London': '🇬🇧',
      'Europe/Paris': '🇫🇷',
      'Europe/Berlin': '🇩🇪',
      'Europe/Moscow': '🇷🇺',
      'Australia/Sydney': '🇦🇺',
      'Asia/Dubai': '🇦🇪',
      'Asia/Singapore': '🇸🇬'
    };
    return flagMap[timezone] || '🌐';
  };

  return (
    <div className="popular-timezones">
      <div className="section-header">
        <h3>🕐 热门时区转换</h3>
        <p>点击快速添加常用时区转换对</p>
      </div>
      
      <div className="timezone-pairs-grid">
        {POPULAR_TIMEZONE_PAIRS.map((pair, index) => {
          const fromTime = moment().tz(pair.fromTz);
          const toTime = moment().tz(pair.toTz);
          const timeDiff = toTime.utcOffset() - fromTime.utcOffset();
          const hoursDiff = timeDiff / 60;
          
          return (
            <div 
              key={index}
              className="timezone-pair-card"
              onClick={() => handleTimezoneClick(pair)}
            >
              <div className="pair-label">{pair.label}</div>
              <div className="pair-info">
                <div className="timezone-info">
                  <span className="flag">{getTimezoneFlag(pair.fromTz)}</span>
                  <span className="time">{fromTime.format('HH:mm')}</span>
                  <span className="tz-name">{pair.from}</span>
                </div>
                <div className="arrow">→</div>
                <div className="timezone-info">
                  <span className="flag">{getTimezoneFlag(pair.toTz)}</span>
                  <span className="time">{toTime.format('HH:mm')}</span>
                  <span className="tz-name">{pair.to}</span>
                </div>
              </div>
              <div className="time-diff">
                {hoursDiff > 0 ? '+' : ''}{hoursDiff}h
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};