import { ApiErrorBody } from '../types/api';
import { ADMIN_API_BASE_URL } from './adminApiConfig';

const API_ENDPOINT = `${ADMIN_API_BASE_URL}/admin/votes`;

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

export const submitAdminVote = async (
  email: string,
  creatorId: string,
): Promise<void> => {
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${email}`,
    },
    body: JSON.stringify({ creatorId }),
  });

  if (!response.ok) {
    let errorBody: ApiErrorBody | any = {};
    try {
      errorBody = (await response.json()) as ApiErrorBody | any;
    } catch {
      // ignore
    }
    const codeFromBody: string | undefined = errorBody.code ?? errorBody.error;
    const messageFromBody: string | undefined = errorBody.message ?? errorBody.errorMessage ?? undefined;
    throw new VoteApiError(
      response.status,
      codeFromBody,
      messageFromBody ?? `投票に失敗しました (status ${response.status})`,
    );
  }
};
