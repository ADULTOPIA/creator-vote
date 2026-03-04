import { UserVotesTodayResponse } from '../types/userVotes';

const MOCK_USER_VOTES_TODAY: UserVotesTodayResponse = {
  creatorIds: ['creator-001', 'creator-004'],
};

type MockFetchOptions = {
  signal?: AbortSignal;
  latencyMs?: number;
};

export const mockFetchUserVotesToday = ({ signal, latencyMs = 350 }: MockFetchOptions = {}): Promise<UserVotesTodayResponse> =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    const timer = setTimeout(() => {
      resolve(MOCK_USER_VOTES_TODAY);
    }, latencyMs);

    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      },
      { once: true },
    );
  });
