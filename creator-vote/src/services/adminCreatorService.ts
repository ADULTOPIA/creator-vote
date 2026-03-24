import { Creator } from '../types/creator';
import { ADMIN_API_BASE_URL } from './adminApiConfig';

const API_ENDPOINT = `${ADMIN_API_BASE_URL}/creators`;

type FetchCreatorsOptions = {
  signal?: AbortSignal;
};

export const fetchAdminCreators = async ({ signal }: FetchCreatorsOptions = {}): Promise<Creator[]> => {
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

  return (await response.json()) as Creator[];
};
