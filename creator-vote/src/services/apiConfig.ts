// .envのREACT_APP_ENVで環境を切り替え
const ENV = process.env.REACT_APP_ENV || 'development';
const API_BASE_URL_DEV = process.env.REACT_APP_API_BASE_URL_DEV;
const API_BASE_URL_PROD = process.env.REACT_APP_API_BASE_URL_PROD;

let apiBase = '';
if (ENV === 'production') {
  apiBase = API_BASE_URL_PROD ?? '';
} else {
  apiBase = API_BASE_URL_DEV ?? '';
}

export const API_BASE_URL = (apiBase || '').replace(/\/$/, '');
