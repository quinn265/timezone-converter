import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import { SelectedTimezone } from '../App';
import { formatTime, formatDateTime, isWorkingHours, getTimezoneOffset, getTimezoneAbbreviation } from '../utils/timezones';

interface TimezoneCardProps {
  timezone: SelectedTimezone;
  currentTime: moment.Moment;
  format24h: boolean;
  onRemove: (timezoneId: string) => void;
}

export const TimezoneCard: React.FC<TimezoneCardProps> = ({
  timezone,
  currentTime,
  format24h,
  onRemove
}) => {
  const { t } = useTranslation();
  
  const localTime = currentTime.clone().tz(timezone.timezone);
  const isWorking = isWorkingHours(localTime);
  const offset = getTimezoneOffset(timezone.timezone);
  const abbreviation = getTimezoneAbbreviation(timezone.timezone);
  const dayDiff = localTime.date() - currentTime.date();
  
  const getDayIndicator = () => {
    if (dayDiff > 0) return '+1';
    if (dayDiff < 0) return '-1';
    return '';
  };

  return (
    <div className="timezone-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '2rem' }}>{timezone.flag}</div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>
              {t(`cities.${timezone.name}`, timezone.name)}
            </h3>
            <p style={{ fontSize: '0.875rem', opacity: 0.7, margin: '0.25rem 0 0 0' }}>
              {t(`timezones.${timezone.timezone}`, timezone.timezone)} ({abbreviation} {offset})
            </p>
          </div>
        </div>
        
        <button
          onClick={() => onRemove(timezone.id)}
          className="btn btn-danger"
          title={t('removeTimezone')}
          style={{ padding: '0.5rem', borderRadius: '0.5rem' }}
        >
          <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
            {formatTime(localTime, format24h)}
          </span>
          {getDayIndicator() && (
            <span className="day-indicator">
              {getDayIndicator()}
            </span>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>
            {formatDateTime(localTime, format24h)}
          </span>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* 工作时间指示器 */}
            <div className={`work-indicator ${
              isWorking ? 'working' : 'off-hours'
            }`}>
              <div className={`status-dot ${
                isWorking ? 'active' : 'inactive'
              }`} />
              <span>{isWorking ? t('workingHours') : 'Off Hours'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 时差显示 */}
      <div className="timezone-diff">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {(() => {
            const userTime = currentTime;
            const targetTime = localTime;
            const diffHours = targetTime.utcOffset() - userTime.utcOffset();
            const diffMinutes = Math.abs(diffHours % 60);
            const hours = Math.floor(Math.abs(diffHours) / 60);
            
            if (diffHours === 0) {
              return 'Same time zone';
            }
            
            const sign = diffHours > 0 ? '+' : '-';
            const timeStr = diffMinutes > 0 ? `${hours}:${diffMinutes.toString().padStart(2, '0')}` : `${hours}`;
            return `${sign}${timeStr}h from your time`;
          })()} 
        </div>
      </div>
    </div>
  );
};