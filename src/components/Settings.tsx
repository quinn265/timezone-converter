import React from 'react';
import { useTranslation } from 'react-i18next';

interface SettingsProps {
  format24h: boolean;
  onFormat24hChange: (format24h: boolean) => void;
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  format24h,
  onFormat24hChange,
  onClose
}) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>⚙️</span>
            {t('settings')}
          </h2>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: '0.5rem', borderRadius: '0.5rem' }}
          >
            <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* 时间格式设置 */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.75rem' }}>
              {t('timeFormat')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label className="setting-option">
                <input
                  type="radio"
                  name="timeFormat"
                  checked={!format24h}
                  onChange={() => onFormat24hChange(false)}
                  style={{ marginRight: '0.5rem' }}
                />
                <span>
                  {t('12hour')} (2:30 PM)
                </span>
              </label>
              <label className="setting-option">
                <input
                  type="radio"
                  name="timeFormat"
                  checked={format24h}
                  onChange={() => onFormat24hChange(true)}
                  style={{ marginRight: '0.5rem' }}
                />
                <span>
                  {t('24hour')} (14:30)
                </span>
              </label>
            </div>
          </div>

          {/* 语言设置 */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.75rem' }}>
              {t('language')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                onClick={() => changeLanguage('en')}
                className={`language-option ${
                  i18n.language === 'en' ? 'active' : ''
                }`}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '500' }}>English</div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.75 }}>English</div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => changeLanguage('zh')}
                className={`language-option ${
                  i18n.language === 'zh' ? 'active' : ''
                }`}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '500' }}>简体中文</div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.75 }}>Simplified Chinese</div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => changeLanguage('zh-TW')}
                className={`language-option ${
                  i18n.language === 'zh-TW' ? 'active' : ''
                }`}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '500' }}>繁體中文</div>
                    <div style={{ fontSize: '0.875rem', opacity: 0.75 }}>Traditional Chinese</div>
                  </div>
                </div>
              </button>
            </div>
          </div>


        </div>


      </div>
    </div>
  );
};