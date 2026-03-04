import { Creator } from '../types/creator';

const createImageUrl = (seed: string) => `https://picsum.photos/seed/${seed}/600/800`;

export const MOCK_CREATORS: Creator[] = [
  {
    creatorId: 'creator-001',
    displayName: 'Alice',
    imageUrl: createImageUrl('creator-001'),
    totalVoteCount: 1520,
  },
  {
    creatorId: 'creator-002',
    displayName: 'Bob',
    imageUrl: createImageUrl('creator-002'),
    totalVoteCount: 1048,
  },
  {
    creatorId: 'creator-003',
    displayName: 'Cathy',
    imageUrl: createImageUrl('creator-003'),
    totalVoteCount: 987,
  },
  {
    creatorId: 'creator-004',
    displayName: 'David',
    imageUrl: createImageUrl('creator-004'),
    totalVoteCount: 865,
  },
  {
    creatorId: 'creator-005',
    displayName: 'Emma',
    imageUrl: createImageUrl('creator-005'),
    totalVoteCount: 792,
  },
  {
    creatorId: 'creator-006',
    displayName: 'Felix',
    imageUrl: createImageUrl('creator-006'),
    totalVoteCount: 731,
  },
  {
    creatorId: 'creator-007',
    displayName: 'Grace',
    imageUrl: createImageUrl('creator-007'),
    totalVoteCount: 688,
  },
  {
    creatorId: 'creator-008',
    displayName: 'Hiro',
    imageUrl: createImageUrl('creator-008'),
    totalVoteCount: 642,
  },
];

type MockFetchOptions = {
  signal?: AbortSignal;
  latencyMs?: number;
};

export const mockFetchCreators = ({ signal, latencyMs = 500 }: MockFetchOptions = {}): Promise<Creator[]> =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    const timer = setTimeout(() => {
      resolve(MOCK_CREATORS);
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
