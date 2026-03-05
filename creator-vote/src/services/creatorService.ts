import { Creator } from '../types/creator';

import { API_BASE_URL } from './apiConfig';

const API_PATH = '/creators';
const API_ENDPOINT = `${API_BASE_URL}${API_PATH}`;

type FetchCreatorsOptions = {
  signal?: AbortSignal;
};

export const fetchCreators = async ({ signal }: FetchCreatorsOptions = {}): Promise<Creator[]> => {

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
