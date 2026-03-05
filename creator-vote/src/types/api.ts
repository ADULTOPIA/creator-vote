export type LoginResponse = {
  role: string;
  isBlocked: boolean;
  usedVotes: number;
  dayVotes: number;
};

export type VoteRequest = {
  creatorIds: string[];
};

export type VoteResponse = {
  acceptedCreatorIds: string[];
  usedVotes: number;
};

export type ApiErrorBody = {
  code?: string;
  message?: string;
};
