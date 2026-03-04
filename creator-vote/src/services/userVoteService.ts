import { mockFetchUserVotesToday } from '../mocks/userVotes';
import { UserVotesTodayResponse } from '../types/userVotes';

import { API_BASE_URL, shouldUseMockApi } from './apiConfig';

const API_PATH = '/user/votes/today';
const API_ENDPOINT = `${API_BASE_URL}${API_PATH}`;

type FetchUserVotesTodayOptions = {
  signal?: AbortSignal;
};

export const fetchUserVotesToday = async ({ signal }: FetchUserVotesTodayOptions = {}): Promise<UserVotesTodayResponse> => {
  if (shouldUseMockApi) {
    return mockFetchUserVotesToday({ signal });
  }

  const response = await fetch(API_ENDPOINT, { signal, headers: { 'Content-Type': 'application/json' } });

  if (!response.ok) {
    const previewText = await response.text().catch(() => null);
    const details = previewText ? `: ${previewText.slice(0, 120)}` : '';
    throw new Error(`本日の投票履歴の取得に失敗しました (status ${response.status})${details}`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    const previewText = await response.text().catch(() => null);
    const preview = previewText ? `: ${previewText.slice(0, 120)}` : '';
    throw new Error(`JSON ではないレスポンスを受信しました${preview}`);
  }

  const payload = (await response.json()) as UserVotesTodayResponse;
  return payload;
};
