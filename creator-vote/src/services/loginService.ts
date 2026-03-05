import { LoginResponse } from '../types/api';

import { API_BASE_URL } from './apiConfig';

const API_PATH = '/login';
const API_ENDPOINT = `${API_BASE_URL}${API_PATH}`;

/**
 * POST /login — Firebase ID トークンを送り、ユーザー情報を取得する。
 */
export const login = async (idToken: string): Promise<LoginResponse> => {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Login failed (status ${response.status}): ${text.slice(0, 200)}`);
  }

  return (await response.json()) as LoginResponse;
};

export type { LoginResponse };
