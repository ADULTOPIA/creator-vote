const ENV = process.env.REACT_APP_ENV || 'development';

const ADMIN_API_BASE_URL_DEV =
  process.env.REACT_APP_ADMIN_API_BASE_URL_DEV ||
  'http://127.0.0.1:5001/adultopia-creator-vote-final/asia-northeast1/api';

const ADMIN_API_BASE_URL_PROD =
  process.env.REACT_APP_ADMIN_API_BASE_URL_PROD ||
  'https://asia-northeast1-adultopia-creator-vote-final.cloudfunctions.net/api';

const adminApiBase = ENV === 'production' ? ADMIN_API_BASE_URL_PROD : ADMIN_API_BASE_URL_DEV;

export const ADMIN_API_BASE_URL = adminApiBase.replace(/\/$/, '');
