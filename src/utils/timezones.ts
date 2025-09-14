import moment from 'moment-timezone';

export interface TimezoneInfo {
  id: string;
  name: string;
  city: string;
  country: string;
  offset: string;
  abbreviation: string;
}

export interface PopularCity {
  id: string;
  name: string;
  timezone: string;
  country: string;
  flag: string;
}

// 热门城市列表
export const POPULAR_CITIES: PopularCity[] = [
  { id: 'nyc', name: 'New York', timezone: 'America/New_York', country: 'United States', flag: '🇺🇸' },
  { id: 'london', name: 'London', timezone: 'Europe/London', country: 'United Kingdom', flag: '🇬🇧' },
  { id: 'tokyo', name: 'Tokyo', timezone: 'Asia/Tokyo', country: 'Japan', flag: '🇯🇵' },
  { id: 'sydney', name: 'Sydney', timezone: 'Australia/Sydney', country: 'Australia', flag: '🇦🇺' },
  { id: 'paris', name: 'Paris', timezone: 'Europe/Paris', country: 'France', flag: '🇫🇷' },
  { id: 'berlin', name: 'Berlin', timezone: 'Europe/Berlin', country: 'Germany', flag: '🇩🇪' },
  { id: 'moscow', name: 'Moscow', timezone: 'Europe/Moscow', country: 'Russia', flag: '🇷🇺' },
  { id: 'dubai', name: 'Dubai', timezone: 'Asia/Dubai', country: 'UAE', flag: '🇦🇪' },
  { id: 'singapore', name: 'Singapore', timezone: 'Asia/Singapore', country: 'Singapore', flag: '🇸🇬' },
  { id: 'hongkong', name: 'Hong Kong', timezone: 'Asia/Hong_Kong', country: 'Hong Kong', flag: '🇭🇰' },
  { id: 'shanghai', name: 'Shanghai', timezone: 'Asia/Shanghai', country: 'China', flag: '🇨🇳' },
  { id: 'beijing', name: 'Beijing', timezone: 'Asia/Shanghai', country: 'China', flag: '🇨🇳' },
  { id: 'la', name: 'Los Angeles', timezone: 'America/Los_Angeles', country: 'United States', flag: '🇺🇸' },
  { id: 'chicago', name: 'Chicago', timezone: 'America/Chicago', country: 'United States', flag: '🇺🇸' },
  { id: 'toronto', name: 'Toronto', timezone: 'America/Toronto', country: 'Canada', flag: '🇨🇦' },
];

// 获取所有可用时区
export const getAllTimezones = (): TimezoneInfo[] => {
  const timezones = moment.tz.names();
  return timezones.map(tz => {
    const now = moment.tz(tz);
    const parts = tz.split('/');
    const city = parts[parts.length - 1].replace(/_/g, ' ');
    const country = parts[0];
    
    return {
      id: tz,
      name: tz,
      city,
      country,
      offset: now.format('Z'),
      abbreviation: now.format('z')
    };
  });
};

// 搜索时区
export const searchTimezones = (query: string): TimezoneInfo[] => {
  const allTimezones = getAllTimezones();
  const lowerQuery = query.toLowerCase();
  
  return allTimezones.filter(tz => 
    tz.name.toLowerCase().includes(lowerQuery) ||
    tz.city.toLowerCase().includes(lowerQuery) ||
    tz.country.toLowerCase().includes(lowerQuery)
  ).slice(0, 20); // 限制结果数量
};

// 获取时区当前时间
export const getCurrentTime = (timezone: string): moment.Moment => {
  return moment.tz(timezone);
};

// 转换时间到指定时区
export const convertTime = (time: moment.Moment, targetTimezone: string): moment.Moment => {
  return time.clone().tz(targetTimezone);
};

// 检查是否为工作时间 (9 AM - 6 PM)
export const isWorkingHours = (time: moment.Moment): boolean => {
  const hour = time.hour();
  return hour >= 9 && hour < 18;
};

// 获取时区偏移信息
export const getTimezoneOffset = (timezone: string): string => {
  const now = moment().tz(timezone);
  const offset = now.utcOffset();
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const sign = offset >= 0 ? '+' : '-';
  return `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const getTimezoneAbbreviation = (timezone: string): string => {
  const now = moment().tz(timezone);
  return now.format('z');
};

// 计算两个时区之间的时差
export const getTimeDifference = (timezone1: string, timezone2: string): number => {
  const time1 = moment.tz(timezone1);
  const time2 = moment.tz(timezone2);
  return time1.utcOffset() - time2.utcOffset();
};

// 格式化时间显示
export const formatTime = (time: moment.Moment, format24h: boolean = false): string => {
  return format24h ? time.format('HH:mm:ss') : time.format('h:mm:ss A');
};

// 格式化日期时间显示
export const formatDateTime = (time: moment.Moment, format24h: boolean = false): string => {
  const timeFormat = format24h ? 'HH:mm' : 'h:mm A';
  return time.format(`MMM DD, YYYY ${timeFormat}`);
};

// 获取用户当前时区
export const getUserTimezone = (): string => {
  return moment.tz.guess();
};