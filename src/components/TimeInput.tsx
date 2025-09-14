import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import { SelectedTimezone } from '../App';
import { getTimezoneAbbreviation } from '../utils/timezones';

interface TimeInputProps {
  selectedTimezones: SelectedTimezone[];
  onTimeChange?: (time: moment.Moment) => void;
  format24h?: boolean;
}

const TimeInput: React.FC<TimeInputProps> = ({ selectedTimezones, onTimeChange, format24h = true }) => {
  const { t } = useTranslation();
  const [inputDateTime, setInputDateTime] = useState('');
  const [sourceTimezone, setSourceTimezone] = useState('Asia/Shanghai');
  const [targetTimezone, setTargetTimezone] = useState('America/New_York');
  const [convertedTime, setConvertedTime] = useState<{ timezone: string; time: moment.Moment; abbreviation: string } | null>(null);

  useEffect(() => {
    // 设置默认时间为当前时间
    const now = moment();
    setInputDateTime(now.format('YYYY-MM-DDTHH:mm'));
  }, []);



  const convertTime = useCallback(() => {
    if (!inputDateTime) return;

    try {
      // 将输入的时间解析为源时区的时间
      const inputTime = moment.tz(inputDateTime, sourceTimezone);
      
      // 转换到目标时区
      const converted = {
        timezone: targetTimezone,
        time: inputTime.clone().tz(targetTimezone),
        abbreviation: getTimezoneAbbreviation(targetTimezone)
      };
      
      setConvertedTime(converted);
      
      if (onTimeChange) {
        onTimeChange(inputTime);
      }
    } catch (error) {
      console.error('Time conversion error:', error);
    }
  }, [inputDateTime, sourceTimezone, targetTimezone, onTimeChange]);

  useEffect(() => {
    if (inputDateTime) {
      convertTime();
    }
  }, [inputDateTime, convertTime]);

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputDateTime(e.target.value);
  };

  const handleSourceTimezoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSourceTimezone(e.target.value);
  };

  const handleTargetTimezoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTargetTimezone(e.target.value);
  };



  // 获取时区显示名称
  const getTimezoneDisplayName = (timezone: string) => {
    return t(`timezones.${timezone}`) || timezone;
  };

  // 获取时区图标
  const getTimezoneIcon = (timezone: string) => {
    const icons: { [key: string]: string } = {
      'Asia/Shanghai': '🌏',
      'America/New_York': '🗽',
      'Europe/London': '🇬🇧',
      'Asia/Tokyo': '🗾',
      'Australia/Sydney': '🇦🇺',
      'America/Los_Angeles': '🌴',
      'Europe/Paris': '🗼',
      'Asia/Dubai': '🏜️',
      'UTC': '🌍'
    };
    return icons[timezone] || '🌐';
  };

  return (
    <div className="step-by-step-converter">
      {/* 步骤1: 选择来源时区 */}
      <div className="converter-step">
        <div className="step-header">
          <div className="step-number">1</div>
          <h3 className="step-title">{t('stepByStep.step1')}</h3>
        </div>
        <div className="timezone-selector">
          <div className="timezone-icon">{getTimezoneIcon(sourceTimezone)}</div>
          <select
            value={sourceTimezone}
            onChange={handleSourceTimezoneChange}
            className="timezone-dropdown"
          >
            <option value="Asia/Shanghai">{t('timezones.Asia/Shanghai')}</option>
            <option value="America/New_York">{t('timezones.America/New_York')}</option>
            <option value="Europe/London">{t('timezones.Europe/London')}</option>
            <option value="Asia/Tokyo">{t('timezones.Asia/Tokyo')}</option>
            <option value="Australia/Sydney">{t('timezones.Australia/Sydney')}</option>
            <option value="America/Los_Angeles">{t('timezones.America/Los_Angeles')}</option>
            <option value="Europe/Paris">{t('timezones.Europe/Paris')}</option>
            <option value="Asia/Dubai">{t('timezones.Asia/Dubai')}</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
      </div>

      {/* 步骤2: 设置时间 */}
      <div className="converter-step">
        <div className="step-header">
          <div className="step-number">2</div>
          <h3 className="step-title">{t('stepByStep.step2')}</h3>
        </div>
        <div className="time-input-wrapper">
          <div className="time-icon">🕐</div>
          <input
            type="datetime-local"
            value={inputDateTime}
            onChange={handleDateTimeChange}
            className="time-input"
          />
        </div>
      </div>

      {/* 步骤3: 选择目标时区 */}
      <div className="converter-step">
        <div className="step-header">
          <div className="step-number">3</div>
          <h3 className="step-title">{t('stepByStep.step3')}</h3>
        </div>
        <div className="timezone-selector">
          <div className="timezone-icon">{getTimezoneIcon(targetTimezone)}</div>
          <select
            value={targetTimezone}
            onChange={handleTargetTimezoneChange}
            className="timezone-dropdown"
          >
            <option value="Asia/Shanghai">{t('timezones.Asia/Shanghai')}</option>
            <option value="America/New_York">{t('timezones.America/New_York')}</option>
            <option value="Europe/London">{t('timezones.Europe/London')}</option>
            <option value="Asia/Tokyo">{t('timezones.Asia/Tokyo')}</option>
            <option value="Australia/Sydney">{t('timezones.Australia/Sydney')}</option>
            <option value="America/Los_Angeles">{t('timezones.America/Los_Angeles')}</option>
            <option value="Europe/Paris">{t('timezones.Europe/Paris')}</option>
            <option value="Asia/Dubai">{t('timezones.Asia/Dubai')}</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
      </div>

      {/* 步骤4: 查看结果 */}
      <div className="converter-step">
        <div className="step-header">
          <div className="step-number">4</div>
          <h3 className="step-title">{t('stepByStep.step4')}</h3>
        </div>
        {convertedTime && (
           <div className="result-display">
             <div className="result-time">
               {convertedTime.time.format(format24h ? 'YYYY/M/D HH:mm' : 'YYYY/M/D h:mm A')}
             </div>
             <div className="result-info">
               {(() => {
                 const sourceTime = moment.tz(inputDateTime, sourceTimezone);
                 const targetTime = convertedTime.time;
                 const diffHours = (targetTime.utcOffset() - sourceTime.utcOffset()) / 60;
                 const isLater = diffHours > 0;
                 const absHours = Math.abs(diffHours);
                 return `${isLater ? t('stepByStep.laterThan') : t('stepByStep.earlierThan')}${getTimezoneDisplayName(sourceTimezone).split('（')[0]} ${absHours} ${t('stepByStep.hours')}`;
               })()}
             </div>
           </div>
         )}
      </div>

      {/* 热门时区快速选择 */}
      <div className="popular-timezones-quick">
        <h4 className="popular-title">{t('stepByStep.popularTimezones')}</h4>
        <div className="popular-grid">
          {[
            { code: 'UTC', timezone: 'UTC', name: 'UTC' },
            { code: 'EST', timezone: 'America/New_York', name: 'EST' },
            { code: 'PST', timezone: 'America/Los_Angeles', name: 'PST' },
            { code: 'JST', timezone: 'Asia/Tokyo', name: 'JST' },
            { code: 'GMT', timezone: 'Europe/London', name: 'GMT' },
            { code: 'CST', timezone: 'Asia/Shanghai', name: 'CST' }
          ].map((tz, index) => {
            // 基于来源时区的时间计算目标时区时间
            const sourceTime = sourceTimezone && inputDateTime ? 
              moment.tz(inputDateTime, sourceTimezone) : moment();
            const targetTime = sourceTime.clone().tz(tz.timezone);
            const displayTime = targetTime.format(format24h ? 'HH:mm' : 'h:mm A');
            
            return (
              <div 
                key={index} 
                className="popular-timezone-item"
                onClick={() => {
                  setTargetTimezone(tz.timezone);
                  // 触发时间转换计算
                  if (sourceTimezone && inputDateTime) {
                     const sourceTime = moment.tz(inputDateTime, sourceTimezone);
                     const targetTime = sourceTime.clone().tz(tz.timezone);
                     setConvertedTime({
                       time: targetTime,
                       timezone: tz.timezone,
                       abbreviation: getTimezoneAbbreviation(tz.timezone)
                     });
                   }
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="popular-code">{tz.code}</div>
                <div className="popular-time">{displayTime}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimeInput;