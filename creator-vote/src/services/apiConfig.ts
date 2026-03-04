const DEFAULT_API_BASE =
  process.env.NODE_ENV === 'production'
    ? 'https://us-central1-adultopia-creator-vote.cloudfunctions.net/api'
    : 'http://127.0.0.1:5001/adultopia-creator-vote/us-central1/api';

export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL?.replace(/\/$/, '') ?? DEFAULT_API_BASE;

export const shouldUseMockApi = (process.env.REACT_APP_USE_MOCK_API ?? 'true') !== 'false';
