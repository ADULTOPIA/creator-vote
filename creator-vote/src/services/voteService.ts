import { VoteResponse, ApiErrorBody } from '../types/api';

import { API_BASE_URL } from './apiConfig';

const API_PATH = '/user/votes';
const API_ENDPOINT = `${API_BASE_URL}${API_PATH}`;

export class VoteApiError extends Error {
  status: number;
  code: string | undefined;

  constructor(status: number, code: string | undefined, message: string) {
    super(message);
    this.name = 'VoteApiError';
    this.status = status;
    this.code = code;
  }
}

/**
 * POST /user/votes — 選択したクリエイターにまとめて投票する。
 * 本番APIとローカルAPIの切り替えのみ残す。
 */
export const submitVotes = async (
  idToken: string,
  creatorIds: string[],
): Promise<VoteResponse> => {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ creatorIds }),
  });

  if (!response.ok) {
    let errorBody: ApiErrorBody | any = {};
    try {
      errorBody = (await response.json()) as ApiErrorBody | any;
    } catch {
      // ignore parse failure
    }

    // Some backend responses use `error` field instead of `code`.
    const codeFromBody: string | undefined = errorBody.code ?? errorBody.error;
    const messageFromBody: string | undefined = errorBody.message ?? errorBody.errorMessage ?? undefined;

    throw new VoteApiError(
      response.status,
      codeFromBody,
      messageFromBody ?? `投票に失敗しました (status ${response.status})`,
    );
  }

  return (await response.json()) as VoteResponse;
};
