import { mockFetchCreators } from '../mocks/creators';
import { Creator } from '../types/creator';

const API_PATH = '/creators';
const DEFAULT_API_BASE =
  process.env.NODE_ENV === 'production'
    ? 'https://us-central1-adultopia-creator-vote.cloudfunctions.net/api'
    : 'http://127.0.0.1:5001/adultopia-creator-vote/us-central1/api';
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL?.replace(/\/$/, '') ?? DEFAULT_API_BASE;
const API_ENDPOINT = `${API_BASE_URL}${API_PATH}`;

const useMockApi = (process.env.REACT_APP_USE_MOCK_API ?? 'true') !== 'false';

type FetchCreatorsOptions = {
  signal?: AbortSignal;
};

export const fetchCreators = async ({ signal }: FetchCreatorsOptions = {}): Promise<Creator[]> => {
  if (useMockApi) {
    return mockFetchCreators({ signal });
  }

  const response = await fetch(API_ENDPOINT, { signal });

  if (!response.ok) {
    const previewText = await response.text().catch(() => null);
    const details = previewText ? `: ${previewText.slice(0, 120)}` : '';
    throw new Error(`クリエイターの取得に失敗しました (status ${response.status})${details}`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    const previewText = await response.text().catch(() => null);
    const preview = previewText ? `: ${previewText.slice(0, 120)}` : '';
    throw new Error(`JSON ではないレスポンスを受信しました${preview}`);
  }

  const payload = (await response.json()) as Creator[];
  return payload;
};
